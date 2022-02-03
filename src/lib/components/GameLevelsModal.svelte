<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import LevelEnum from '$lib/enums/LevelEnum'
	export let hasError = false;
    export let readonly = false;
    export let level:LevelEnum = LevelEnum.EASY;

    const dispatch = createEventDispatcher();

</script>

<div class="btn-group">
	<ul>
        <li>
            <button
                class="btn btn-active" 
                class:btn-active={level===LevelEnum.EASY}
                on:click={() => dispatch('select', LevelEnum.EASY)}> Easy
            </button>
            
            <button
                class="btn" 
                class:btn-active={level===LevelEnum.NORMAL}
                on:click={() => dispatch('select', LevelEnum.NORMAL)}> Normal
            </button>
            
            <button 
                class="btn" 
                class:btn-active={level===LevelEnum.HARD}
                on:click={() => dispatch('select', LevelEnum.HARD)}> Hard
            </button>
        </li>
    </ul>
</div>

<style lang="postcss">
	img {
		@apply w-5 h-5;
	}
</style>