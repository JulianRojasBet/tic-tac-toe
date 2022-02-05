import type Game from '$core/game/Game';
import { get } from 'svelte/store';

import Match from '$core/match/Match';
import GameModeEnum from '$lib/enums/GameModeEnum';
import PlayerEnum from '$lib/enums/PlayerEnum';
import LevelEnum from '$lib/enums/LevelEnum';
import type { BoardRow, BoardRows } from 'src/types';

class ComputerMatch extends Match {
	constructor(game: Game, level: LevelEnum) {
		super(game, GameModeEnum.COMPUTER);
		this.level = level;
	}

	changeTurn(rows: BoardRows): void {
		super.changeTurn(rows);

		let turns_played = 0;
		if (get(this.playing) == PlayerEnum.TWO && this.gamemode == GameModeEnum.COMPUTER) {
			let bestScore = -Infinity;
			let bestMove;
			const available = [];
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (!rows[i][j].selected) {
						turns_played++;
						if (this.level === LevelEnum.HARD) {
							rows[i][j].selected = true;
							rows[i][j].playedBy = PlayerEnum.TWO;
							const score = this.minimax(rows, 0, false);
							rows[i][j].selected = false;
							rows[i][j].playedBy = PlayerEnum.NONE;
							if (score > bestScore) {
								bestScore = score;
								bestMove = { x: i, y: j };
							}
						} else if (this.level === LevelEnum.NORMAL) {
							if (turns_played > 1) {
								rows[i][j].selected = true;
								rows[i][j].playedBy = PlayerEnum.TWO;
								const score = this.minimax(rows, 0, false);
								rows[i][j].selected = false;
								rows[i][j].playedBy = PlayerEnum.NONE;
								if (score > bestScore) {
									bestScore = score;
									bestMove = { x: i, y: j };
								}
							} else {
								available.push({ x: i, y: j });
							}
						} else if (this.level === LevelEnum.EASY) {
							available.push({ x: i, y: j });
						}
					}
				}
			}
			if (this.level === LevelEnum.NORMAL && turns_played < 2 && turns_played > 0) {
				const move = available[Math.floor(Math.random() * available.length)];
				bestMove = { x: move.x, y: move.y };
			}

			if (this.level === LevelEnum.EASY) {
				const move = available[Math.floor(Math.random() * available.length)];
				bestMove = { x: move.x, y: move.y };
			}
			if (turns_played > 0) {
        setTimeout(() => {
          this.game.player.set(get(this.playing));
          this.onselect(bestMove)
        }, 300)
        return
			}
		}
    this.game.player.set(get(this.playing));
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

	getSelected(row: BoardRow, played_by: PlayerEnum): [number, number][] {
		return row
			.filter(({ selected, playedBy }) => selected && playedBy === played_by)
			.map(({ position: { x, y } }) => [x, y]);
	}

	checkWin(rows: BoardRows, played_by: PlayerEnum): boolean {
		const selected = rows
			.map((row) => this.getSelected(row, played_by))
			.filter((row) => row.length)
			.reduce((prev, row) => [...prev, ...row], []);

		return this.WIN_COMBINATIONS.some((combination) =>
			combination.every(([x, y]) => selected.find(([_x, _y]) => x === _x && y === _y))
		);
	}

	checkDraw(rows: BoardRows): boolean {
		return rows.every((row) => row.every((tile) => tile.selected));
	}

	minimax(rows: BoardRows, depth: number, isMaximazing: boolean): number {
		const result_player_one = this.checkWin(rows, PlayerEnum.ONE);
		const result_player_two = this.checkWin(rows, PlayerEnum.TWO);
		const result_draw = this.checkDraw(rows);
		if (result_player_one) {
			return -1;
		} else if (result_player_two) {
			return 1;
		} else if (result_draw) {
			return 0;
		}

		if (isMaximazing) {
			let bestScore = -Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (!rows[i][j].selected) {
						rows[i][j].selected = true;
						rows[i][j].playedBy = PlayerEnum.TWO;
						const score = this.minimax(rows, depth + 1, false);
						rows[i][j].selected = false;
						rows[i][j].playedBy = PlayerEnum.NONE;
						bestScore = Math.max(score, bestScore);
					}
				}
			}
			return bestScore;
		} else {
			let bestScore = Infinity;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (!rows[i][j].selected) {
						rows[i][j].selected = true;
						rows[i][j].playedBy = PlayerEnum.ONE;
						const score = this.minimax(rows, depth + 1, true);
						rows[i][j].selected = false;
						rows[i][j].playedBy = PlayerEnum.NONE;
						bestScore = Math.min(score, bestScore);
					}
				}
			}
			return bestScore;
		}
	}
}

export default ComputerMatch;
