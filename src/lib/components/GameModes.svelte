<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import GameModeEnum from '$lib/enums/GameModeEnum';

  export let gameMode: GameModeEnum;

  $: isComputer = gameMode === GameModeEnum.COMPUTER
  $: isLocal = gameMode === GameModeEnum.LOCAL
  $: isNetwork = gameMode === GameModeEnum.NETWORK

	const dispatch = createEventDispatcher();

	function handleSelect(gamemode: GameModeEnum) {
		window.location.hash = gamemode.toLocaleLowerCase();
	}
	function handleSelectComputer(gamemode: GameModeEnum) {
		window.location.hash = gamemode.toLocaleLowerCase();
	}
</script>

<ul>
	<li>
		<button
			class:isComputer
			class="btn btn-circle btn-lg"
			on:click={() => dispatch('select', handleSelectComputer(GameModeEnum.COMPUTER))}
		>
			<img src="/assets/icons/cpu.svg" alt="Computer">
		</button>
		<p>Computer</p>
	</li>
	<li>
		<button
			class:isLocal
			class="btn btn-circle btn-lg"
			on:click={() => dispatch('select', GameModeEnum.LOCAL)}
		>
			<img src="/assets/icons/friends.svg" alt="Local">
		</button>
		<p>Local</p>
	</li>
	<li> 
		<button 
			class:isNetwork
			class="btn btn-circle btn-lg"
			on:click={() => handleSelect(GameModeEnum.NETWORK)}
		>
		<img src="/assets/icons/globe.svg" alt="Network">
		</button>
		<p>Network</p>
	</li>
</ul>

<style lang="postcss">
	ul {
		@apply w-full flex justify-around;
	}
	li {
		@apply flex flex-col items-center
	}
	li > p {
		@apply font-mono font-extrabold mt-1;
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
