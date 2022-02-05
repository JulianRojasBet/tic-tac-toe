<script lang="ts">
	import copy from '$lib/utils/copy';
	import { notifications } from '$lib/stores/notifications'

	export let gameId: UUID;
	export let hasError = false;
  export let readonly = false;

  $: _inputClass = readonly ? 'input-info' : 'input-primary'
	$: _btnClass = readonly ? 'btn-info' : 'btn-primary';
	$: inputClass = hasError ? 'input-error' : _inputClass;
	$: btnClass = hasError ? 'btn-error' : _btnClass;

	function handleCopy() {
		if (!gameId) return;
		
		copy(gameId);
		notifications.send('Game ID copied to clipboard')
	}
</script>

<div class="relative">
	<input
		name="gameId"
		type="text"
		placeholder="Enter the game ID to join"
		class="w-full input input-bordered {inputClass}"
		autocomplete="off"
		{readonly}
		bind:value={gameId}
	/>
	<button class="btn absolute top-0 right-0 rounded-l-none {btnClass}" on:click={handleCopy}>
		<img src="/assets/icons/copy.svg" alt="Copy" />
	</button>
</div>

<style lang="postcss">
	img {
		@apply w-5 h-5;
	}
</style>
