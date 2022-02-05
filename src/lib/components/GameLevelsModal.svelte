<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import LevelEnum from '$lib/enums/LevelEnum';

	export let level: LevelEnum = LevelEnum.NORMAL;

	const dispatch = createEventDispatcher();
</script>

<div class="btn-group flex justify-center">
	<button
		class="btn"
		class:btn-active={level === LevelEnum.EASY}
		on:click={() => dispatch('select', LevelEnum.EASY)}
	>
		Easy
	</button>

	<button
		class="btn"
		class:btn-active={level === LevelEnum.NORMAL}
		on:click={() => dispatch('select', LevelEnum.NORMAL)}
	>
		Normal
	</button>

	<button
		class="btn"
		class:btn-active={level === LevelEnum.HARD}
		on:click={() => dispatch('select', LevelEnum.HARD)}
	>
		Hard
	</button>
</div>
