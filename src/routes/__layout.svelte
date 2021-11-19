<script>
	import '../app.postcss';
</script>

<main>
	<slot />
</main>


<style lang="postcss">
	main {
		max-width: fit-content;
		@apply mx-auto p-4 h-screen;
	}
</style>