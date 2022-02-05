<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { blur } from 'svelte/transition';

	import PlayerEnum from '$lib/enums/PlayerEnum';

	const dispatch = createEventDispatcher();

	export let winner: PlayerEnum;

	$: btnColor =
		winner === PlayerEnum.NONE
			? 'btn-neutral'
			: winner === PlayerEnum.ONE
				? 'btn-primary'
				: 'btn-accent';
	$: borderColor =
		winner === PlayerEnum.NONE
			? 'border-neutral'
			: winner === PlayerEnum.ONE
				? 'border-primary'
				: 'border-accent';
</script>

{#if winner}
	<div class="wrapper" transition:blur={{ duration: 200 }}>
		<div class="black-drop" />
		<div class="content {borderColor}">
			{#if winner === PlayerEnum.NONE}
				<p class="text-center text-3xl my-4">Draw!</p>
			{:else}
				<p class="text-center text-3xl my-4">Player {winner} win!</p>
			{/if}
			<div class="actions">
				<button class="btn {btnColor} mr-4" on:click={() => dispatch('next')}>
					Next round
				</button>
				<button class="btn btn-outline {btnColor}" on:click={() => dispatch('finish')}>
					Finish
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.wrapper {
		@apply z-10 absolute inset-0 flex justify-center items-center w-screen h-screen;
	}
	.black-drop {
		@apply absolute inset-0 bg-black opacity-70 w-full h-full;
	}
	.content {
		z-index: 1;
		@apply max-w-md;
		@apply p-4 rounded-lg bg-black text-primary-content border;
	}
	.actions {
		@apply mt-8 flex justify-between;
	}
</style>
