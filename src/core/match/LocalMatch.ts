import type Game from "src/core/Game";

import Match from "src/core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";

class LocalMatch extends Match {

  constructor(game: Game) {
    super(game, GameModeEnum.LOCAL);
  }

  changeTurn(): void {
    super.changeTurn();
    // TODO: Change game player to enable it to select a tile
  }
}

export default LocalMatch;