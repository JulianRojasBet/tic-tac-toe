import type Game from "$core/game/Game";
import type { SupabaseRealtimePayload } from "@supabase/supabase-js";

import { get } from "svelte/store";

import Match from "$core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";
import PlayerEnum from "$lib/enums/PlayerEnum";
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

class NetworkMatch extends Match {
  private channel: RTCDataChannel;
  private peerConnection: RTCPeerConnection;

  constructor(game: Game) {
    super(game, GameModeEnum.NETWORK);
    this.peerConnection = new RTCPeerConnection(servers);

    const player = get(this.game.player);
    if (player === PlayerEnum.ONE) this.createOffer();
    else if (player === PlayerEnum.TWO) this.createAnswer();

    this.peerConnection.onconnectionstatechange = () => console.log('Connection state:', this.peerConnection.connectionState)
    this.peerConnection.oniceconnectionstatechange = () => console.log('Ice connection state:', this.peerConnection.iceConnectionState)
    this.peerConnection.onicegatheringstatechange = () => console.log('Ice gathering state:', this.peerConnection.iceGatheringState)
    this.peerConnection.onsignalingstatechange = () => console.log('Signaling state:', this.peerConnection.signalingState)
  }
  changeTurn(): void {
    super.changeTurn();
    // TODO: Send event throught WebRTC datachannel
  }

  private async createOffer(): Promise<void> {
    const { error } = await supabase
      .from('game')
      .insert([{ id: this.game.uuid }]);

    if (error) throw error;

    this.channel = this.peerConnection.createDataChannel(this.game.uuid, { negotiated: false });
    this.channel.onopen = this.handleChannelOpen.bind(this);

    this.peerConnection.onicecandidate = (evt) => this.handleIceCandidate('offer', evt)

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    await supabase
      .from<RTCGame>('game')
      .update({ offer })
      .eq('id', this.game.uuid);

    // TODO: Unsubscribe (destroy/stop/finished method)
    supabase
      .from(`game:id=eq.${this.game.uuid}`)
      .on('UPDATE', this.handleAnswer.bind(this))
      .subscribe();
  }

  private async createAnswer(): Promise<void> {
    this.peerConnection.onicecandidate = (evt) => this.handleIceCandidate('answer', evt)
    this.peerConnection.ondatachannel = this.handleDataChannel.bind(this);

    const { data: { offer }, error } = await supabase
      .from<RTCGame>('game')
      .select('*')
      .eq('id', this.game.uuid)
      .single();

    if (error) throw error;

    await this.peerConnection.setRemoteDescription(offer);
    
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    await supabase
      .from<RTCGame>('game')
      .update({ answer })
      .eq('id', this.game.uuid);

    const { data } = await supabase
      .from<RTCOfferAnswer>('offer')
      .select('*')
      .eq('gameId', this.game.uuid)

    data.forEach(({ data }) => {
      const candidate = new RTCIceCandidate(data);
      this.peerConnection.addIceCandidate(candidate);
    })

    supabase
      .from(`offer:gameId=eq.${this.game.uuid}`)
      .on('INSERT', this.handleRemoteIceCandidate.bind(this))
      .subscribe();
  }

  private async handleIceCandidate(table: string, { candidate }: RTCPeerConnectionIceEvent) {
    if (candidate) {
      const { error } = await supabase
        .from(table)
        .insert([{ gameId: this.game.uuid, data: candidate.toJSON() }]);

      if (error) throw error;
    }
  }

  // TODO: Type this param
  private handleRemoteIceCandidate(payload) {
    const { new: { data } } = payload;
    const candidate = new RTCIceCandidate(data);
    this.peerConnection.addIceCandidate(candidate);
  }

  private handleDataChannel({ channel }: RTCDataChannelEvent) {
    console.log('Channel received');
    this.channel = channel;
    this.channel.onopen = this.handleChannelOpen.bind(this);
  }

  private handleChannelOpen() {
    console.log('Channel opened');
    this.channel.onmessage = this.handleMessage;
    this.channel.send(`Hello player ${get(this.game.player)} here!`);
  }

  private handleMessage({ data }: MessageEvent) {
    console.log(data)
  }

  private async handleAnswer(payload: SupabaseRealtimePayload<RTCGame>) {
    const { new: { answer } } = payload;
    const hasRemoteDescription = this.peerConnection.currentLocalDescription;

    if (!hasRemoteDescription && answer) {
      await this.peerConnection.setRemoteDescription(answer);

      supabase
        .from(`answer:gameId=eq.${this.game.uuid}`)
        .on('INSERT', this.handleRemoteIceCandidate.bind(this))
        .subscribe();
    }
  }
}

export default NetworkMatch;