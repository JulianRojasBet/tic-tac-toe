<script lang="ts">
	import type PlayerEnum from '$lib/enums/PlayerEnum';
	import type { TilePosition } from 'src/types';
	import type { Writable } from 'svelte/store';

	import { getContext, createEventDispatcher } from 'svelte';

	const player = getContext<Writable<PlayerEnum>>('player');

	export let playedBy: PlayerEnum;
	export let selected: boolean;
	export let position: TilePosition;

	const dispatch = createEventDispatcher();
</script>

<td class:selected class={selected ? playedBy : $player} on:click={() => dispatch('select', position)} />

<style lang="postcss">
	td {
		--size: min(128px, 30vw);
		width: var(--size);
		height: var(--size);
		@apply p-4 bg-base-200 rounded-xl border-b-4 border-r-2 border-base-300;
		@apply cursor-pointer transition-all duration-100 ease-in-out;
	}

	td.one.selected {
		@apply bg-primary border-violet-900;
	}
	td.one:hover:not(.selected) {
		@apply bg-primary border-violet-900;
	}

	td.two.selected {
		@apply bg-accent border-teal-700;
	}
	td.two:hover:not(.selected) {
		@apply bg-accent border-teal-700;
	}

	td.selected {
		@apply cursor-not-allowed;
	}
	td:hover:not(.selected) {
		transform: scale(1.05);
	}
</style>
