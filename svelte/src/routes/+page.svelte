
<script lang="ts">
	import { Drawer, getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';


	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'example-2',
		meta: { foo: 'bar', fizz: 'buzz', age: 40 }
	};


</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>



<div class="container mx-auto p-8 space-y-8">
	<h1 class="h1">Hello Skeleton</h1>
	<p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
	<section>
		<a class="btn variant-filled-primary" href="https://kit.svelte.dev/">SvelteKit</a>
		<a class="btn variant-filled-secondary" href="https://tailwindcss.com/">Tailwind</a>
		<a class="btn variant-filled-tertiary" href="https://github.com/">GitHub</a>
	</section>

	<button on:click={() => 
		drawerStore.open(drawerSettings)
	}>Open</button>
	
	<Drawer />
</div>