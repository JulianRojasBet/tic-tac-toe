import type Game from "$core/game/Game";
import type { BoardRows, Score, TilePosition } from 'src/types';
import type { Writable } from "svelte/store";
import type LevelEnum from "$lib/enums/LevelEnum";

import { get, writable } from "svelte/store";

import GameModeEnum from "$lib/enums/GameModeEnum";
import PlayerEnum from "$lib/enums/PlayerEnum";

const nextTurn: Record<PlayerEnum, PlayerEnum> = { 
  [PlayerEnum.NONE]: PlayerEnum.ONE,
  [PlayerEnum.ONE]: PlayerEnum.TWO,
  [PlayerEnum.TWO]: PlayerEnum.ONE,
};

abstract class Match { 
  public game: Game
  public gamemode: GameModeEnum
  public score: Writable<Score>
  public waiting: Writable<boolean>;
  public playing: Writable<PlayerEnum>;
  public onselect: (position: TilePosition) => void
  public level: LevelEnum;
  public onfinish: () => void

  constructor(game: Game, gamemode = GameModeEnum.COMPUTER) {
    this.game = game;
    this.gamemode = gamemode;
    this.waiting = writable(false);
    this.playing = writable(PlayerEnum.ONE);
    this.score = writable({
      [PlayerEnum.ONE]: 0,
      [PlayerEnum.TWO]: 0
    })
  }

  changeTurn(rows:BoardRows): void {
		this.playing.set(nextTurn[get(this.playing)]);
  }

  finish(): void {
    // Should be implemented by each child
  }

  next(): void {
    // Should be implemented by each child
  }

}

export default Match