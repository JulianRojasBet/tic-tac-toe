import type Game from "src/core/Game";

import Match from "src/core/match/Match";
import GameModeEnum from "$lib/enums/GameModeEnum";

class NetworkMatch extends Match {

  constructor(game: Game) {
    super(game, GameModeEnum.NETWORK);
  }

  changeTurn(): void {
    super.changeTurn();
    // TODO: Send event throught WebRTC datachannel
  }
}

export default NetworkMatch;