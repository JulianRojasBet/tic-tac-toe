import type Match from "$core/match/Match";
import type GameModeEnum from "$lib/enums/GameModeEnum";
import type PlayerEnum from "$lib/enums/PlayerEnum";
import type { Writable } from "svelte/store";

interface GameFactory {
  uuid: UUID;
  player: Writable<PlayerEnum>;

  create(mode: GameModeEnum): Match;
}

export default GameFactory;