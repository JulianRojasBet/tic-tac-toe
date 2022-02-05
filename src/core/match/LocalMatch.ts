import type Game from "$core/game/Game";

import { get } from "svelte/store";

import Match from "$core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";

class LocalMatch extends Match {

  constructor(game: Game) {
    super(game, GameModeEnum.LOCAL);
  }

  changeTurn(): void {
    super.changeTurn();
    this.game.player.set(get(this.playing))
  }
}

export default LocalMatch;