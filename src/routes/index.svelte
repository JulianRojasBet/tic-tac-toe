<script lang="ts">
	import type { TilePosition } from 'src/types';

	import { setContext } from 'svelte';

	import Game from 'src/core/Game';
	import Board from 'src/core/Board';

	import GameBoard from '$lib/components/GameBoard.svelte';
	import Score from '$lib/components/Score.svelte';
	import GameModes from '$lib/components/GameModes.svelte';

	let game = new Game();
	let board = new Board(game);

	$: ({ player, playing } = game);
	$: ({ rows } = board);

	setContext('player', player);

	$: boardDisabled = $playing !== $player;

	function handleSeletTile(evt) {
		const position: TilePosition = evt.detail;
		board.selectTile(position);
	}

	function handleGameModeSelect(evt) {
		game = new Game(evt.detail);
		board = new Board(game);
	}
</script>

<!-- TODO: Create a countdown for each player turn -->
<div class="h-full flex flex-col items-center justify-center">
	<section class="flex flex-col">
		<Score player={$player} />
		<GameBoard rows={$rows} on:select={handleSeletTile} disabled={boardDisabled} />
	</section>
	<GameModes gameMode={game.mode} on:select={handleGameModeSelect} />
</div>

<!-- TODO: Add sounds: On click, on win, on lose, etc -->
<!-- TODO: Prevent users to leave an in progress game -->
