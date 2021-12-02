import type { SupabaseRealtimePayload } from "@supabase/supabase-js";

import type Game from "$core/game/Game";
import type { TilePosition } from "src/types";

import supabase from "$lib/utils/supabase";
import { servers } from "$lib/utils/webRTC";

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

abstract class Networking {
  private gameId: UUID;
  protected channel: RTCDataChannel;
  protected connection: RTCPeerConnection;
  protected onmessage: (event: TilePosition) => void

  constructor(game: Game) {
    this.gameId = game.uuid
    this.connection = new RTCPeerConnection(servers);

    this.connection.onconnectionstatechange = () => console.log('Connection state:', this.connection.connectionState)
    this.connection.oniceconnectionstatechange = () => console.log('Ice connection state:', this.connection.iceConnectionState)
    this.connection.onicegatheringstatechange = () => console.log('Ice gathering state:', this.connection.iceGatheringState)
    this.connection.onsignalingstatechange = () => console.log('Signaling state:', this.connection.signalingState)
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

    // TODO: Unsubscribe (destroy/stop/finished method)
    // Listen for an answer
    supabase
      .from(`game:id=eq.${this.gameId}`)
      .on('UPDATE', this.handleAnswer.bind(this))
      .subscribe();
  }

  protected async createAnswer(): Promise<void> {
    this.connection.onicecandidate = (evt) => this.handleIceCandidate('answer', evt)
    this.connection.ondatachannel = this.handleDataChannel.bind(this);

    const { data: { offer }, error } = await supabase
      .from<RTCGame>('game')
      .select('*')
      .eq('id', this.gameId)
      .single();

    if (error) throw error;

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
    const message = JSON.parse(data)
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
}

export default Networking;