import type PlayerEnum from '$lib/enums/PlayerEnum';

type TilePosition = {
  x: number,
  y: number
}

type BoardTile = {
  position: TilePosition,
  selected: boolean,
  playedBy: PlayerEnum
}

type BoardRow = [ BoardTile, BoardTile, BoardTile ];

type BoardRows = [ BoardRow, BoardRow, BoardRow ];

export type { TilePosition, BoardTile, BoardRow, BoardRows };