<script lang="ts">
    import PaperContainer from "$lib/PaperContainer.svelte";

    let { data } = $props();
</script>


<div class={"flex flex-col w-full paper-sidebar"}>
    {#each data.filteredPapers as paper, paperIdx}
        <PaperContainer {paper} {paperIdx} />
    {/each}
</div>
