<script lang="ts">
	import type { Score } from 'src/types/index';

	import PlayerEnum from '$lib/enums/PlayerEnum';

	export let playing: PlayerEnum;
	export let winner: PlayerEnum;
	export let score: Score = {
		[PlayerEnum.ONE]: 0,
		[PlayerEnum.TWO]: 0
	};

	let isOne: boolean, isTwo: boolean;

	$: setHighLight(playing, winner);

	function setHighLight(playing, winner) {
		if (winner && winner === PlayerEnum.NONE) {
			isOne = true;
			isTwo = true;
      return
		}
		const highlight = winner || playing;
		isOne = highlight === PlayerEnum.ONE;
		isTwo = highlight === PlayerEnum.TWO;
	}
</script>

<div class="score">
	<!-- TODO: Show animated score-number update -->
	<span class:isOne class="player-score one">
		<p class="score-number">{score[PlayerEnum.ONE]}</p>
		<h2 class="score-label">Player 1</h2>
	</span>
	<span class:isTwo class="player-score two">
		<p class="score-number">{score[PlayerEnum.TWO]}</p>
		<h2 class="score-label">Player 2</h2>
	</span>
</div>

<style lang="postcss">
	.score {
		@apply flex justify-evenly mb-4;
	}
	.player-score {
		@apply transition-all duration-200 ease-in-out;
	}
	.player-score.one::after {
		content: ' ';
		@apply block w-full mt-1 py-1 rounded-b-md bg-primary;
	}
	.player-score.two::after {
		content: ' ';
		@apply block w-full mt-1 py-1 rounded-b-md bg-accent;
	}
	.score-label {
		@apply text-sm font-light text-gray-400;
	}
	.score-number {
		@apply text-5xl font-bold text-center;
	}

	.isOne,
	.isTwo {
		transform: scale(1.5);
		@apply z-10;
	}
</style>
