import type Game from "src/core/Game";

import Match from "src/core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";

class ComputerMatch extends Match {

  constructor(game: Game) {
    super(game, GameModeEnum.COMPUTER);
  }

  changeTurn(): void {
    super.changeTurn();
    // TODO: Implement IA logic and select a tile
  }
}

export default ComputerMatch;