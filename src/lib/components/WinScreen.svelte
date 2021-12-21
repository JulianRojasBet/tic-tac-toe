<script lang="ts">
	import { blur } from 'svelte/transition';

	import PlayerEnum from '$lib/enums/PlayerEnum';

	export let winner: PlayerEnum = PlayerEnum.NONE;
</script>

{#if winner !== PlayerEnum.NONE}
	<div class="wrapper" transition:blur={{ duration: 200 }}>
		<div class="black-drop" />
		<div class="content">
      <p>Player {winner} won!</p>
      <!-- TODO: Add bottons tu finish match or start a new round -->
		</div>
	</div>
{/if}

<style lang="postcss">
	.wrapper {
		@apply absolute inset-0 flex justify-center items-center w-screen h-screen;
	}
	.black-drop {
		@apply absolute inset-0 bg-black opacity-70 w-full h-full;
	}
	.content {
    z-index: 1;
		@apply p-4 rounded-lg bg-black text-primary-content border border-primary;
	}
</style>
