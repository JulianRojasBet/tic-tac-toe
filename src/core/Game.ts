import type { Writable } from "svelte/store";
import type Match from "src/core/match/Match";

import { writable } from "svelte/store";

import PlayerEnum from "$lib/enums/PlayerEnum";
import GameModeEnum from "$lib/enums/GameModeEnum";
import ComputerMatch from "./match/ComputerMatch";
import LocalMatch from "./match/LocalMatch";
import NetworkMatch from "./match/NetworkMatch";

class Game {
  public player: Writable<PlayerEnum>

  constructor(player = PlayerEnum.ONE) {
    this.player = writable(player);
  }

  public start(mode = GameModeEnum.COMPUTER): Match {
    let match = new ComputerMatch(this);
    if (mode === GameModeEnum.NETWORK) match = new NetworkMatch(this);
    else if (mode === GameModeEnum.LOCAL) match = new LocalMatch(this);
    return match;
  }
}

export default Game;