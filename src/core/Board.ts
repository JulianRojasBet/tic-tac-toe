import type { Writable } from "svelte/store";

import type Match from "$core/match/Match";
import type { BoardRows, TilePosition } from "src/types";

import { browser  } from "$app/env";
import { get, writable } from "svelte/store";

// import { tapAudio, winAudio } from "$lib/utils/audio"
import PlayerEnum from "$lib/enums/PlayerEnum";
import NetworkMatch from '$core/match/NetworkMatch';
import ComputerMatch from "./match/ComputerMatch";

let tapAudio: HTMLAudioElement
let winAudio: HTMLAudioElement

if (browser) {
  tapAudio = new Audio('/assets/sounds/tap.wav');
  winAudio = new Audio('/assets/sounds/win.wav');
}

const WIN_COMBINATIONS: [number, number][][] = [
  // In row
  [ [0, 0], [0, 1], [0, 2]],
  [ [1, 0], [1, 1], [1, 2]],
  [ [2, 0], [2, 1], [2, 2]],
  // In column
  [ [0, 0], [1, 0], [2, 0]],
  [ [0, 1], [1, 1], [2, 1]],
  [ [0, 2], [1, 2], [2, 2]],
  // In diagonal
  [ [0, 0], [1, 1], [2, 2]],
  [ [0, 2], [1, 1], [2, 0]],
]

export default class Board {
  public winner: Writable<PlayerEnum | undefined>
  public rows: Writable<BoardRows>;
  private match: Match;

  constructor (match: Match) {
    this.match = match;
    this.winner = writable(undefined);
    this.match.onselect = this.select.bind(this)
    const playing = get(this.match.playing)
    

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

    if (this.match instanceof ComputerMatch && playing === PlayerEnum.TWO){
      const x = Math.floor(Math.random() * 3)
      const y = Math.floor(Math.random() * 3)
      console.log(x, y)
      setTimeout(() => this.select({x, y}), 300)
    } 
    
  }

  private getSelected(row): [number, number][] {
    const playing = get(this.match.playing)
    return row
      .filter(({ selected, playedBy }) => selected && playedBy === playing)
      .map(({ position: {x, y} }) => [ x, y ])
  }

  private checkWin() {
    const rows = get(this.rows)
    const selected = rows
      .map(row => this.getSelected.call(this, row))
      .filter(row => row.length)
      .reduce((prev, row) => [ ...prev, ...row ], [])

    return WIN_COMBINATIONS.some(
      combination => combination.every(
        ([ x, y ]) => selected.find(([ _x, _y ]) => x === _x && y === _y)
      )
    )
  }

  public checkDraw(): boolean {
    const rows = get(this.rows)
    const winner = get(this.winner)
    return !winner && rows.every(row => row.every(tile => tile.selected))
  }

  public select({ x, y }: TilePosition): void {
    const winner = get(this.winner)
    const rows = get(this.rows);
    if (rows[x][y].selected || winner !== undefined) return

    tapAudio.pause();
		tapAudio.currentTime = 0
    tapAudio.play();

    const playing = get(this.match.playing);

    if (playing !== PlayerEnum.NONE) {
      rows[x][y] = { 
        ...rows[x][y], 
        selected: true, 
        playedBy: playing
      }
      this.rows.set(rows);
    };

    const win = this.checkWin();
    if (win) {
		  winAudio.play();

      const score = get(this.match.score)
      const playing = get(this.match.playing)

      this.winner.set(playing);
      this.match.score.set({
        ...score,
        [playing]: score[playing] + 1
      })
    }

    const draw = this.checkDraw()
    if (draw) {
      this.winner.set(PlayerEnum.NONE);
    }

    if (this.match instanceof NetworkMatch) {
      this.match.changeTurn(rows, { x, y });
    } else {
      //console.log(rows)
      this.match.changeTurn(rows);
    }

    // if (playing == PlayerEnum.TWO && this.match.gamemode==GameModeEnum.COMPUTER) {
    //   console.log(this.match)
    // }
  }
}