<script lang="ts">
	import type { BoardRows } from 'src/types';

	import Tile from '$lib/components/Tile.svelte';

	export let rows: BoardRows;
	export let disabled: boolean;
</script>

<table class:disabled>
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
</style>
