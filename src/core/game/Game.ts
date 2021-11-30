import { v4 as uuid } from 'uuid';
import type { Writable } from "svelte/store";
import type Match from "$core/match/Match";
import type GameFactory from "$core/game/GameFactory";

import { writable } from "svelte/store";

import PlayerEnum from "$lib/enums/PlayerEnum";
import GameModeEnum from "$lib/enums/GameModeEnum";
import ComputerMatch from "$core/match/ComputerMatch";
import LocalMatch from "$core/match/LocalMatch";
import NetworkMatch from "$core/match/NetworkMatch";

class Game implements GameFactory {
  public uuid: UUID;
  public player: Writable<PlayerEnum>

  constructor(player = PlayerEnum.ONE, id = uuid()) {
    this.player = writable(player);
    this.uuid = id;
  }

  public start(mode = GameModeEnum.COMPUTER): Match {
    let match = new ComputerMatch(this);
    if (mode === GameModeEnum.NETWORK) match = new NetworkMatch(this);
    else if (mode === GameModeEnum.LOCAL) match = new LocalMatch(this);
    return match;
  }
}

export default Game;