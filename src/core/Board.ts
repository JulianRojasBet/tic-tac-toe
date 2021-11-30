import type Match from "src/core/match/Match";
import type { Writable } from "svelte/store";
import type { BoardRows, TilePosition } from "src/types";

import { get, writable } from "svelte/store";
import PlayerEnum from "$lib/enums/PlayerEnum";

export default class Board {
  public rows: Writable<BoardRows>;
  private match: Match;

  constructor (match: Match) {
    this.match = match;

    const threeElements: [number, number, number] = [0, 1, 2];
    const rows = threeElements.map(
      (x) => threeElements.map(
        (y) => ({ 
          playedBy: PlayerEnum.NONE,
          selected: false, 
          position: {x, y}
        })
      )
    ) as BoardRows
    this.rows = writable(rows) ;
  }

  public selectTile({ x, y }: TilePosition): void {
    const _rows = get(this.rows);
    if (_rows[x][y].selected) return

    const player = get(this.match.playing);

    if (player !== PlayerEnum.NONE) {
      _rows[x][y] = { 
        ..._rows[x][y], 
        selected: true, 
        playedBy: player
      }
      this.rows.set(_rows);
    };

    this.match.changeTurn();
  }
}