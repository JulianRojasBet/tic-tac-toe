import type Game from "$core/game/Game";

import Match from "$core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";
import PlayerEnum from "$lib/enums/PlayerEnum";
import supabase from "$lib/utils/supabase";
import { servers } from "$lib/utils/webRTC";
import { get } from "svelte/store";

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

class NetworkMatch extends Match {
  private peerConnection: RTCPeerConnection

  constructor(game: Game) {
    super(game, GameModeEnum.NETWORK);
    this.peerConnection = new RTCPeerConnection(servers);

    const player = get(this.game.player)
    if (player === PlayerEnum.ONE) this.createOffer()
    else if (player === PlayerEnum.TWO) this.createAnswer()
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

    this.peerConnection.onicecandidate = (evt) => this.handleIceCandidate('offer', evt)

    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);

    const offer: IceData = {
      sdp: offerDescription.sdp,
      type: offerDescription.type
    };

    await supabase
      .from<RTCGame>('game')
      .update({ offer })
      .eq('id', this.game.uuid);

    // TODO: Listen for remote answer
    supabase
      .from(`game:id=eq.${this.game.uuid}`)
      .on('UPDATE', console.log)
      .subscribe()

    // TODO: Listen for ICE candidates
    supabase
      .from(`answer:gameId=eq.${this.game.uuid}`)
      .on('INSERT', console.log)
      .subscribe()
  }

  private async createAnswer(): Promise<void> {
    this.peerConnection.onicecandidate = (evt) => this.handleIceCandidate('answer', evt)

    const { data, error } = await supabase
      .from<RTCGame>('game')
      .select('*')
      .eq('id', this.game.uuid)
      .single();

    if (error) throw error;

    const offerDescription = new RTCSessionDescription(data.offer);
    await this.peerConnection.setRemoteDescription(offerDescription);

    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);

    const answer: IceData = {
      sdp: answerDescription.sdp,
      type: answerDescription.type,
    };

    await supabase
      .from<RTCGame>('game')
      .update({ answer })
      .eq('id', this.game.uuid);

    // TODO: Listen to offer candidates
    supabase
      .from(`offer:gameId=eq.${this.game.uuid}`)
      .on('INSERT', console.log)
      .subscribe()
  }

  private async handleIceCandidate(table: string, { candidate }: RTCPeerConnectionIceEvent) {
    if (candidate) {
      const { error } = await supabase
        .from(table)
        .insert([{ data: candidate.toJSON() }]);

      if (error) throw error;
    }
  }

}

export default NetworkMatch;