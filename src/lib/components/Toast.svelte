<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications } from '$lib/stores/notifications';
</script>

<section class="notifications">
	{#each $notifications as { id, message } (id)}
		<div class="alert" transition:fly={{ y: -30 }} animate:flip>
			<div class="flex-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="#2196f3"
					class="w-6 h-6 mx-2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{message}</span>
			</div>
		</div>
	{/each}
</section>

<style lang="postcss">
	.notifications {
		z-index: 9999;
		@apply fixed w-96 px-2 flex flex-col justify-center items-center pointer-events-none;
    right: calc(calc(100% - 384px) / 2);
	}
</style>
