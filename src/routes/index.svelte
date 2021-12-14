<script lang="ts">
	import type { TilePosition } from 'src/types';

	import { onMount, setContext } from 'svelte';
	import { page } from '$app/stores';

	import Game from '$core/game/Game';
	import Board from '$core/Board';

	import GameBoard from '$lib/components/GameBoard.svelte';
	import Score from '$lib/components/Score.svelte';
	import GameModes from '$lib/components/GameModes.svelte';
	import GameModeEnum from '$lib/enums/GameModeEnum';
	import PlayerEnum from '$lib/enums/PlayerEnum';

	onMount(() => {
		const gameId = $page.query.get('gameId')
		if (gameId) {
			game = new Game(PlayerEnum.TWO, gameId);
			match = game.start(GameModeEnum.NETWORK);
			board = new Board(match);
		}
	})

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
		board.select(position);
	}

	function startMatch(evt) {
		const mode = evt.detail
		game = new Game();
		match = game.start(mode);
		board = new Board(match);
	}
</script>

<!-- TODO: Create a countdown for each player turn -->
<div class="h-full flex flex-col items-center justify-center">
	<section class="flex flex-col">
		<Score playing={$playing} />
		<GameBoard rows={$rows} on:select={handleSeletTile} disabled={boardDisabled} />
	</section>
	<GameModes gameMode={gamemode} on:select={startMatch} />
</div>

<!-- TODO: Add sounds: On click, on win, on lose, etc -->
<!-- TODO: Prevent users to leave an in progress game -->
