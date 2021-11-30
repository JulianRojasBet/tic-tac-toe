<script lang="ts">
	import type { TilePosition } from 'src/types';

	import { setContext } from 'svelte';

	import Game from '$core/game/Game';
	import Board from '$core/Board';

	import GameBoard from '$lib/components/GameBoard.svelte';
	import Score from '$lib/components/Score.svelte';
	import GameModes from '$lib/components/GameModes.svelte';

	let game = new Game();
	let match = game.start()
	let board = new Board(match);

	$: ({ player } = game);
	$: ({ gamemode, playing } = match);
	$: ({ rows } = board);
	$: boardDisabled = $playing !== $player;

	setContext('player', player);

	function handleSeletTile(evt) {
		if (boardDisabled) return;

		const position: TilePosition = evt.detail;
		board.selectTile(position);
	}

	function handleGameModeSelect(evt) {
		game = new Game();
		match = game.start(evt.detail);
		board = new Board(match);
	}
</script>

<!-- TODO: Create a countdown for each player turn -->
<div class="h-full flex flex-col items-center justify-center">
	<section class="flex flex-col">
		<Score playing={$playing} />
		<GameBoard rows={$rows} on:select={handleSeletTile} disabled={boardDisabled} />
	</section>
	<GameModes gameMode={gamemode} on:select={handleGameModeSelect} />
</div>

<!-- TODO: Add sounds: On click, on win, on lose, etc -->
<!-- TODO: Prevent users to leave an in progress game -->
