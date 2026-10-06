<script lang="ts">
    import AboutBlock from "$lib/AboutBlock.svelte";
    import ResearchBlock from "$lib/ResearchBlock.svelte";
</script>

<div class="grid grid-cols-1 lg:grid-cols-[max(400px,_28%)_minmax(200px,_1fr)] gap-0 lg:gap-2 box-border">
    <AboutBlock standalone={false}/>
    <ResearchBlock standalone={false}/>
</div>
