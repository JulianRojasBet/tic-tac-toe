import type Game from "$core/game/Game";
import type { TilePosition } from "src/types";
import type { ChannelMessage } from "$core/mixins/Networking"

import { get } from "svelte/store";
import { Mixin } from 'ts-mixer';

import Match from "$core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";
import Networking from "$core/mixins/Networking";
import RoundEnum from "$lib/enums/RoundEnum";
import ChannelMessageTypeEnum from "$lib/enums/ChannelMessageTypeEnum";
import { notifications } from '$lib/stores/notifications'

class NetworkMatch extends Mixin(Networking, Match) {
  private wantNext = false;
  private wantFinish = false;

  constructor(game: Game) {
    super(game, GameModeEnum.NETWORK);

    this.onmessage = this.onMessage.bind(this)
    this.onconnected = this.onConnected.bind(this)
    this.waiting.set(true);

    this.init().then(player => this.game.player.set(player))
  }

  changeTurn(position?: TilePosition): void {
    const player = get(this.game.player)
    const playing = get(this.playing)
    if (position && player === playing) {
      this.send({
        type: ChannelMessageTypeEnum.MOVEMENT, 
        payload: position
      });
    }

    super.changeTurn();
  }

  finish(): void {
    this.wantFinish = true
    this.send({
      type: ChannelMessageTypeEnum.ROUND,
      payload: RoundEnum.FINISH
    })
    this.shutdown()
  }
  
  next(): void {
    if (this.wantNext) {
      this.wantNext = false
    } else {
      this.wantNext = true
      this.waiting.set(true)
    }


    this.send({
      type: ChannelMessageTypeEnum.ROUND,
      payload: RoundEnum.NEXT
    })
  }

  private onMessage({ type, payload }: ChannelMessage) {
    if (type === ChannelMessageTypeEnum.MOVEMENT) {
      this.onselect(payload as TilePosition)
      return
    }

    if (payload === RoundEnum.NEXT) {
      if (this.wantNext) {
        this.waiting.set(false)
        this.wantNext = false
      } else {
        this.wantNext = true
      }
      return
    }

    this.wantNext = false
    this.waiting.set(false)
    if (!this.wantFinish) {
      notifications.send('Your opponent finished the match')
    }
    this.onfinish()
    this.wantFinish = false
  }

  private onConnected() {
    this.waiting.set(false)
  }
}

export default NetworkMatch;