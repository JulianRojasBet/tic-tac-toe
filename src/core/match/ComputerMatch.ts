import type Game from "$core/game/Game";
import { get } from "svelte/store";

import Match from "$core/match/Match";
import Board from "$core/Board";
import GameModeEnum from "$lib/enums/GameModeEnum";
import PlayerEnum from "$lib/enums/PlayerEnum";
import LevelEnum from "$lib/enums/LevelEnum";
import type { BoardRow, BoardRows } from "src/types";
import { element } from "svelte/internal";

class ComputerMatch extends Match {
  

  constructor(game: Game, level: LevelEnum) {
    super(game, GameModeEnum.COMPUTER);
    this.level = level;
  }

  
  changeTurn(rows:BoardRows): void {
    super.changeTurn(rows);
    // TODO: Implement IA logic and select a tile
    //this.game.player.set(get(this.playing))
    this.game.player.set(get(this.playing))  
    let turns_played = 0;
    if (get(this.playing) == PlayerEnum.TWO && this.gamemode == GameModeEnum.COMPUTER) {
      let bestScore = -Infinity;
      let bestMove;
      let available = [];
      for (let i = 0; i<3; i++) {
        for (let j = 0; j<3; j++) {
          if (!rows[i][j].selected) {
            turns_played++;
            if (this.level === LevelEnum.HARD) {
              rows[i][j].selected = true;
              rows[i][j].playedBy = PlayerEnum.TWO;
              let score = this.minimax(rows, 0, false);
              rows[i][j].selected = false;
              rows[i][j].playedBy = PlayerEnum.NONE;
              if (score > bestScore) {
                bestScore = score;
                bestMove = {x:i, y:j}
              }
            } else if (this.level === LevelEnum.NORMAL){
              if (turns_played>1) {
                rows[i][j].selected = true;
                rows[i][j].playedBy = PlayerEnum.TWO;
                let score = this.minimax(rows, 0, false);
                rows[i][j].selected = false;
                rows[i][j].playedBy = PlayerEnum.NONE;
                if (score > bestScore) {
                  bestScore = score;
                  bestMove = {x:i, y:j}
                }

              } else {
                available.push({x:i,y:j})
              }
            } else if (this.level === LevelEnum.EASY) {
              available.push({x:i,y:j})
            }
            
          }
        }
      }

      if (this.level === LevelEnum.NORMAL && turns_played < 2) {
        let move = available[Math.floor(Math.random()*available.length)];
        bestMove = {x:move.x, y:move.y}
      }

      if (this.level === LevelEnum.EASY) {
        let move = available[Math.floor(Math.random()*available.length)];
        bestMove = {x:move.x, y:move.y}
      }
      
      this.onselect(bestMove)
    }
  }


  WIN_COMBINATIONS: [number, number][][] = [
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

   getSelected(row, played_by): [number, number][] {
    return row
      .filter(({ selected, playedBy }) => selected && playedBy === played_by)
      .map(({ position: {x, y} }) => [ x, y ])
  }

  checkWin(rows, played_by) {
    const selected = rows
      .map(row => this.getSelected(row, played_by))
      .filter(row => row.length)
      .reduce((prev, row) => [ ...prev, ...row ], [])

    return this.WIN_COMBINATIONS.some(
      combination => combination.every(
        ([ x, y ]) => selected.find(([ _x, _y ]) => x === _x && y === _y)
      )
    )
  }

  checkDraw(rows): boolean {
    return rows.every(row => row.every(tile => tile.selected))
  }
  
  minimax(rows, depth, isMaximazing: boolean) {
    let result_player_one = this.checkWin(rows, PlayerEnum.ONE);
    let result_player_two = this.checkWin(rows, PlayerEnum.TWO);
    let result_draw = this.checkDraw(rows)
    if (result_player_one) {
      return -1
    } else if (result_player_two) {
      return 1
    } else if (result_draw) {
      return 0
    }

    if (isMaximazing) {
      let bestScore = -Infinity;
      for (let i = 0; i<3; i++) {
        for (let j = 0; j<3; j++) {
          if (!rows[i][j].selected) {
            rows[i][j].selected = true;
            rows[i][j].playedBy = PlayerEnum.TWO;
            let score = this.minimax(rows, depth+1, false);
            rows[i][j].selected = false;
            rows[i][j].playedBy = PlayerEnum.NONE;
            bestScore = Math.max(score, bestScore)
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i<3; i++) {
        for (let j = 0; j<3; j++) {
          if (!rows[i][j].selected) {
            rows[i][j].selected = true;
            rows[i][j].playedBy = PlayerEnum.ONE;
            let score = this.minimax(rows, depth+1, true);
            rows[i][j].selected = false;
            rows[i][j].playedBy = PlayerEnum.NONE;
            bestScore = Math.min(score, bestScore)
          }
        }
      }
      return bestScore;
    }  
  }
}

export default ComputerMatch;