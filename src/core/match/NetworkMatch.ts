import type Game from "$core/game/Game";
import type { TilePosition } from "src/types";

import { get } from "svelte/store";
import { Mixin } from 'ts-mixer';

import GameModeEnum from "$lib/enums/GameModeEnum";
import Networking from "$core/mixins/Networking";
import Match from "$core/match/Match";
// import PlayerEnum from "$lib/enums/PlayerEnum";

class NetworkMatch extends Mixin(Networking, Match) {

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
      this.send(position);
    }

    super.changeTurn();
  }

  finish(): void {
    // this.shutdown()
  }

  private onMessage(message: TilePosition) {
    this.onselect(message)
  }

  private onConnected() {
    this.waiting.set(false)
  }
}

export default NetworkMatch;