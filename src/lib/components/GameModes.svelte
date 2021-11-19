<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import GameModeEnum from '$lib/enums/GameModeEnum';

  export let gameMode: GameModeEnum;

  $: isComputer = gameMode === GameModeEnum.COMPUTER
  $: isLocal = gameMode === GameModeEnum.LOCAL
  $: isNetwork = gameMode === GameModeEnum.NETWORK

	const dispatch = createEventDispatcher();
</script>

<ul>
	<li>
		<button
			class:isComputer
			class="btn btn-circle btn-lg"
			on:click={() => dispatch('select', GameModeEnum.COMPUTER)}
		>
			<img src="/src/assets/cpu.svg" alt="Computer">
		</button>
	</li>
	<li>
		<button
			class:isLocal
			class="btn btn-circle btn-lg"
			on:click={() => dispatch('select', GameModeEnum.LOCAL)}
		>
			<img src="/src/assets/friends.svg" alt="Local">
		</button>
	</li>
	<li>
		<button
			class:isNetwork
			class="btn btn-circle btn-lg"
			on:click={() => dispatch('select', GameModeEnum.NETWORK)}
		>
		<img src="/src/assets/globe.svg" alt="Network">
		</button>
	</li>
</ul>

<style lang="postcss">
	ul {
		@apply w-full flex justify-around;
	}
	button {
		@apply border-b-4 border-r-4 border-neutral-focus bg-gray-500 transition-all;
	}
	img {
		@apply w-7 h-7;
	}
  .isComputer, .isNetwork, .isLocal {
    @apply border-b-0 border-r-0 border-t-4 border-l-4 bg-gray-700 pointer-events-none;
  }
</style>
