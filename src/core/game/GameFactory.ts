import type Match from "$core/match/Match";
import type GameModeEnum from "$lib/enums/GameModeEnum";
import type PlayerEnum from "$lib/enums/PlayerEnum";
import type { Writable } from "svelte/store";

interface GameFactory {
  player: Writable<PlayerEnum>;

  start(mode: GameModeEnum): Match;
}

export default GameFactory;