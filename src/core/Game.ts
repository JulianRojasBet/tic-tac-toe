import type { Writable } from "svelte/store";

import { get, writable } from "svelte/store";
import GameModeEnum from "$lib/enums/GameModeEnum";
import PlayerEnum from "$lib/enums/PlayerEnum";

export default class Game {
  public mode = GameModeEnum.COMPUTER;
  public player: Writable<PlayerEnum>;
  public playing: Writable<PlayerEnum>;

  constructor(mode = GameModeEnum.COMPUTER) {
    this.mode = mode;
    this.player = writable(PlayerEnum.NONE);
    this.playing = writable(PlayerEnum.NONE);
  }

  public changeTurn(): void {
		const nextTurn: Record<PlayerEnum, PlayerEnum> = { 
      [PlayerEnum.NONE]: PlayerEnum.ONE,
      [PlayerEnum.ONE]: PlayerEnum.TWO,
      [PlayerEnum.TWO]: PlayerEnum.ONE,
    };
		this.playing.set(nextTurn[get(this.playing)]);

    this.changePlayer()
	}

  private changePlayer(): void {
    const player = get(this.player);
    const isNone = player === PlayerEnum.NONE;
    const isNetwork = this.mode === GameModeEnum.NETWORK;

    if (isNetwork && !isNone) return

    this.player.set(get(this.playing));
  }
}