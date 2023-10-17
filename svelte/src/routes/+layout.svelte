<script lang="ts">
	import '../app.postcss';
	import "../app.css";
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Header from '../components/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const {user} = data;

	initializeStores();

</script>

<head>
<title>Time Tracker</title>
<script src="https://code.iconify.design/2/2.0.0/iconify.min.js"></script>
</head>
<body class="bg-surface-900 text-secondary-100 min-h-screen">
	<Header user={user?.username || ''}/>
	<slot />

</body>


