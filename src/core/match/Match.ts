import type Game from "$core/game/Game";
import type { Score, TilePosition } from 'src/types';
import type { Writable } from "svelte/store";

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
  public playing: Writable<PlayerEnum>;
  public score: Writable<Score>
  public onselect: (position: TilePosition) => void

  constructor(game: Game, gamemode = GameModeEnum.COMPUTER) {
    this.game = game;
    this.gamemode = gamemode;
    this.playing = writable(PlayerEnum.ONE);
    this.score = writable({
      [PlayerEnum.ONE]: 0,
      [PlayerEnum.TWO]: 0
    })
  }

  changeTurn(): void {
		this.playing.set(nextTurn[get(this.playing)]);
    console.log('playing', get(this.playing))
  }

  finish(): void {
    // Should be implemented by each child
  }

}

export default Match