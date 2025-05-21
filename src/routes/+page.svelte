<script lang="ts">
    import About from "./about/+page.svelte";
    import Research from "./research/+page.svelte";
</script>

<div class="grid grid-cols-1 lg:grid-cols-[max(400px,_28%)_minmax(200px,_1fr)] gap-0 lg:gap-2 box-border">
    <About standalone={false}/>
    <Research standalone={false}/>
</div>
