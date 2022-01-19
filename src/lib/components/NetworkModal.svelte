<script lang="ts">
  import PlayerEnum from '$lib/enums/PlayerEnum';

	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';

	let id: UUID = '';
	let gameId: UUID = '';

	const dispatch = createEventDispatcher();

	function handleCopy() {}

	function handleCreate() {
		if (!gameId) id = gameId = uuid();
	}

	function handleJoin() {
		if (gameId) {
      const player = id === gameId ? PlayerEnum.ONE : PlayerEnum.TWO
			dispatch('join', { gameId, player });
		}
		handleClose();
		// TODO: else show error
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
		<form>
			<div class="form-control">
				<span class="label-text ml-1">Game ID</span>
				<label class="label">
					<input
						type="text"
						placeholder="Enter the game ID"
						class="input input-bordered w-full input-primary"
						bind:value={gameId}
					/>
					<div class="copy" on:click={handleCopy}>
						<img src="/src/assets/copy.svg" alt="Copy" />
					</div>
				</label>
			</div>
		</form>
		<div class="modal-action">
			<button class="btn btn-primary" on:click={handleCreate} disabled={!!gameId}> Create </button>
			<button class="btn" on:click={handleJoin}> Join </button>
		</div>
	</div>
</div>

<style lang="postcss">
	img {
		@apply w-5 h-5;
	}
	.copy {
		@apply ml-2 p-3 rounded-full cursor-pointer;
		@apply bg-primary hover:bg-primary-focus;
		@apply border border-transparent;
	}
</style>
