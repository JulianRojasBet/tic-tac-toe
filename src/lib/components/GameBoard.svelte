<script lang="ts">
	import type { BoardRows } from 'src/types';

	import { fade } from 'svelte/transition';

	import Tile from '$lib/components/Tile.svelte';

	export let rows: BoardRows;
	export let waiting: boolean;
	export let disabled: boolean;
</script>

<table class:disabled class:relative={waiting}>
	{#if waiting}
		<div class="waiting" transition:fade={{ duration: 300 }}>
			<p>Waiting your opponent</p>
			<img class="spinner" src="/assets/icons/spinner.svg" alt="Waiting" />
		</div>
	{/if}
	<tbody>
		{#each rows as row}
			<tr>
				{#each row as tile}
					<Tile {...tile} on:select />
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	table {
		border-spacing: 5px;
		@apply border-separate my-4;
	}
	.disabled {
		@apply cursor-not-allowed pointer-events-none;
	}
	.waiting {
		@apply w-full h-full absolute inset-0 bg-black opacity-50 rounded-xl;
		@apply flex flex-col justify-center items-center;
		@apply text-white font-black text-xl;
	}
	.spinner {
		@apply w-10 h-10 my-4 animate-spin filter invert;
	}
</style>
