<script>
	import '../app.postcss';
</script>

<main>
	<slot />
</main>

<style lang="postcss">
	main {
		@apply max-w-md p-4 h-screen;
	}
</style>
