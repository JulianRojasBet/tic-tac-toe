import type Game from "$core/game/Game";

import Match from "$core/match/Match";
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