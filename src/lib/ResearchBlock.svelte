<script lang="ts">
    import { type Paper } from "$lib/types/Paper";
    import PaperContainer from "$lib/PaperContainer.svelte";

    import _papers from "$lib/data/papers.yaml";
    const papers = (_papers['papers'] as Paper[]).toReversed();

    type Props = {
        standalone?: boolean;
    };
    let {standalone = true}: Props = $props();
</script>


<div class={"flex flex-col w-full" + (standalone ? " paper-sidebar" : "")}>
    {#each papers as paper, paperIdx (paper.id)}
        <PaperContainer {paper} {paperIdx} standaloneContainer={standalone} titleLink />
    {/each}
</div>
