import type { SupabaseRealtimePayload } from "@supabase/supabase-js";

import type Game from "$core/game/Game";
import type { TilePosition } from "src/types";
import type RoundEnum from "$lib/enums/RoundEnum";
import type ChannelMessageTypeEnum from "$lib/enums/ChannelMessageTypeEnum";

import supabase from "$lib/utils/supabase";
import { servers } from "$lib/utils/webRTC";
import PlayerEnum from "$lib/enums/PlayerEnum";

interface IceData {
  sdp?: string;
  type: RTCSdpType;
}
interface RTCGame {
  id: UUID;
  created_at: string;
  offer: IceData;
  answer: IceData;
}

interface RTCOfferAnswer {
  id: number,
  gameId: UUID,
  data: Record<string, string | number>
  created_at: string;
}

interface ChannelMessage {
  type: ChannelMessageTypeEnum,
  payload: TilePosition | RoundEnum
}

abstract class Networking {
  private gameId: UUID;
  protected channel: RTCDataChannel;
  protected connection: RTCPeerConnection;
  protected onmessage: (msg: ChannelMessage) => void
  protected onconnected: () => void

  constructor(game: Game) {
    this.gameId = game.uuid
    this.connection = new RTCPeerConnection(servers);

    this.connection.onicegatheringstatechange = () => console.log('Ice gathering state:', this.connection.iceGatheringState)
    this.connection.onsignalingstatechange = () => console.log('Signaling state:', this.connection.signalingState)
  }

  protected async init(): Promise<PlayerEnum> {
    this.connection.onconnectionstatechange = this.handleConnectionState.bind(this)
    this.connection.oniceconnectionstatechange = this.handleConnectionState.bind(this)

    const { data: games, error } = await supabase
    .from<RTCGame>('game')
    .select('*')
    .eq('id', this.gameId);

    if (error) throw error;

    if (!games.length) {
      this.createOffer();
      return PlayerEnum.ONE
    } 
    this.createAnswer(games[0])
    return PlayerEnum.TWO
  }

  protected async createOffer(): Promise<void> {
    const { error } = await supabase
      .from<RTCGame>('game')
      .insert([{ id: this.gameId }]);

    if (error) throw error;

    this.channel = this.connection.createDataChannel(this.gameId, { negotiated: false });
    this.channel.onmessage = this.handleMessage.bind(this);

    this.connection.onicecandidate = (evt) => this.handleIceCandidate('offer', evt)

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(offer);

    await supabase
      .from<RTCGame>('game')
      .update({ offer })
      .eq('id', this.gameId);

    // Listen for an answer
    supabase
      .from(`game:id=eq.${this.gameId}`)
      .on('UPDATE', this.handleAnswer.bind(this))
      .subscribe();
  }

  protected async createAnswer({ offer }: RTCGame): Promise<void> {
    this.connection.onicecandidate = (evt) => this.handleIceCandidate('answer', evt)
    this.connection.ondatachannel = this.handleDataChannel.bind(this);

    await this.connection.setRemoteDescription(offer);
    
    const answer = await this.connection.createAnswer();
    await this.connection.setLocalDescription(answer);

    await supabase
      .from<RTCGame>('game')
      .update({ answer })
      .eq('id', this.gameId);

    const { data } = await supabase
      .from<RTCOfferAnswer>('offer')
      .select('*')
      .eq('gameId', this.gameId)

    data.forEach(({ data }) => {
      const candidate = new RTCIceCandidate(data);
      this.connection.addIceCandidate(candidate);
    })

    supabase
      .from(`offer:gameId=eq.${this.gameId}`)
      .on('INSERT', this.handleRemoteIceCandidate.bind(this))
      .subscribe();
  }

  private handleConnectionState() {
    const iceConnectionState = this.connection.iceConnectionState
    const connectionState = this.connection.connectionState

    if (iceConnectionState === 'connected' || connectionState === 'connected') {
      this.onconnected()
    }
  }

  private async handleIceCandidate(table: string, { candidate }: RTCPeerConnectionIceEvent) {
    if (candidate) {
      const { error } = await supabase
        .from(table)
        .insert([{ gameId: this.gameId, data: candidate.toJSON() }]);

      if (error) throw error;
    }
  }

  private handleRemoteIceCandidate(payload: SupabaseRealtimePayload<RTCOfferAnswer>) {
    const { new: { data } } = payload;
    const candidate = new RTCIceCandidate(data);
    this.connection.addIceCandidate(candidate);
  }

  private handleDataChannel({ channel }: RTCDataChannelEvent) {
    this.channel = channel;
    this.channel.onmessage = this.handleMessage.bind(this);
  }

  private handleMessage({ data }: MessageEvent<string>) {
    const message: ChannelMessage = JSON.parse(data)
    this.onmessage(message)
  }

  private async handleAnswer(payload: SupabaseRealtimePayload<RTCGame>) {
    const { new: { answer } } = payload;
    const hasRemoteDescription = this.connection.currentLocalDescription;

    if (!hasRemoteDescription && answer) {
      await this.connection.setRemoteDescription(answer);

      supabase
        .from(`answer:gameId=eq.${this.gameId}`)
        .on('INSERT', this.handleRemoteIceCandidate.bind(this))
        .subscribe();
    }
  }

  public send(data): void {
    this.channel.send(JSON.stringify(data));
  }

  public async shutdown(): Promise<void> {
    this.channel.close()
    this.connection.close()

    const subs = await supabase.getSubscriptions()
    await Promise.all(subs.map(sub => supabase.removeSubscription(sub)))

    await supabase
      .from<RTCGame>('game')
      .delete()
      .eq('id', this.gameId)

    await supabase
      .from<RTCOfferAnswer>('offer')
      .delete()
      .eq('gameId', this.gameId)

    await supabase
      .from<RTCOfferAnswer>('answer')
      .delete()
      .eq('gameId', this.gameId)
  }
}

export default Networking; 
export type { ChannelMessage };
