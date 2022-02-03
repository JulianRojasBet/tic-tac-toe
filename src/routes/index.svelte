<script lang="ts">
	import type { TilePosition } from 'src/types';

	import { setContext } from 'svelte';

	import Game from '$core/game/Game';
	import Board from '$core/Board';

	import GameBoard from '$lib/components/GameBoard.svelte';
	import Score from '$lib/components/Score.svelte';
	import GameModes from '$lib/components/GameModes.svelte';
	import GameModeEnum from '$lib/enums/GameModeEnum';
	import WinScreen from '$lib/components/WinScreen.svelte';
	import NetworkModal from '$lib/components/NetworkModal.svelte';
	import GameIdInput from '$lib/components/GameIdInput.svelte';
	import GameLevelsModal from '$lib/components/GameLevelsModal.svelte';

	let game = new Game();
	let match = game.create();
	let board = new Board(match);

	$: ({ uuid, player } = game);
	$: ({ score, gamemode, playing, waiting } = match);
	$: ({ rows, winner } = board);
	$: boardDisabled = $playing !== $player;

	setContext('player', player);

	function handleSeletTile(evt) {
		if (boardDisabled) return;

		const position: TilePosition = evt.detail;
		board.select(position);
	}

	function handleStart(evt) {
		const mode = evt.detail;

		match.finish();

		game = new Game();
		match = game.create(mode);
		board = new Board(match);
	}

	function handleStartLevel(evt) {
		const level = evt.detail;
		match.finish();

		game = new Game();
		match = game.create(GameModeEnum.COMPUTER, level);
		board = new Board(match);
	}

	function handleNext() {
		board = new Board(match);
	}

	function handleFinish() {
		match.finish();

		game = new Game();
		match = game.create();
		board = new Board(match);
	}

	function handleJoin(evt) {
		const { gameId, player } = evt.detail;

		match.finish();

		game = new Game(player, gameId);
		match = game.create(GameModeEnum.NETWORK);
		board = new Board(match);
	}
</script>

<WinScreen winner={$winner} on:next={handleNext} on:finish={handleFinish} />
<NetworkModal on:join={handleJoin} />

<!-- TODO: Create a countdown for each player turn -->
<div class="h-full flex flex-col items-center justify-center">
	<section class="flex flex-col">
		<Score playing={$playing} winner={$winner} score={$score} />
		<GameBoard
			rows={$rows}
			waiting={$waiting}
			disabled={boardDisabled}
			on:select={handleSeletTile}
		/>
	</section>
	<GameModes gameMode={gamemode} on:select={handleStart} />

	{#if gamemode === GameModeEnum.NETWORK}
		<div class="w-full my-6">
			<GameIdInput gameId={uuid} readonly />
		</div>
	{/if}
	{#if gamemode === GameModeEnum.COMPUTER}
		<div class="w-full my-6">
			<GameLevelsModal on:select={handleStartLevel} level={match.level}/>
		</div>
	{/if}
</div>

<!-- TODO: Add sounds: On click, on win, on lose, etc -->
<!-- TODO: Prevent users to leave an in progress game -->
<!-- TODO: Handle win screen actions on network mode, sync both players -->
