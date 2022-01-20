<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';

	import PlayerEnum from '$lib/enums/PlayerEnum';
	import GameIdInput from './GameIdInput.svelte';

	const uuidPattern = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
	const dispatch = createEventDispatcher();

	let id: UUID = '';
	let gameId: UUID = '';

	$: hasError = gameId && !gameId.match(uuidPattern);

	function handleCreate() {
		if (!gameId) id = gameId = uuid();
	}

	function handleJoin() {
		if (gameId) {
			const player = id === gameId ? PlayerEnum.ONE : PlayerEnum.TWO;
			dispatch('join', { gameId, player });
		}
		handleClose();
	}

	function handleClose() {
		window.location.hash = '';
		const noHashURL = window.location.href.replace(/#.*$/, '');
		window.history.replaceState('', document.title, noHashURL);
		gameId = '';
	}
</script>

<div id="network" class="modal" on:click|self={handleClose}>
	<div class="modal-box">
		<div class="form-control">
			<label class="label" for="gameId">
				<span class="label-text ml-1">Game ID</span>
			</label>
			<GameIdInput bind:gameId {hasError} />
			{#if gameId && !hasError}
				<span class="hint">Share this game ID with your opponent</span>
			{:else if hasError}
				<span class="hint error">This game ID is not valid</span>
			{/if}
		</div>
		<div class="modal-action">
			<button class="btn btn-primary" on:click={handleCreate} disabled={!!gameId}> Create </button>
			<button class="btn" on:click={handleJoin} disabled={!gameId || hasError}> Join </button>
		</div>
	</div>
</div>

<style lang="postcss">
	.hint {
		@apply label-text-alt my-1 ml-2;
	}
	.hint.error {
		@apply text-error;
	}
</style>
