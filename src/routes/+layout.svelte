<script lang="ts">
    import NavBar from "$lib/NavBar.svelte";

    import '../app.css';
    import Footer from "$lib/Footer.svelte";

	let { children } = $props();
</script>

<main>
    <NavBar />
    {@render children()}
    <Footer />
</main>
