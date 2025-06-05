<script lang="ts">
    import AuthorsBlock from "$lib/AuthorsBlock.svelte";
    import Copy from "@lucide/svelte/icons/copy"
    import Download from "@lucide/svelte/icons/download";

    const resourceUrls = import.meta.glob("$lib/data/papers/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}",
        { eager: true, query: '?enhanced' }) as Record<string, { default: string }>;
    const bibTexUrls = import.meta.glob("$lib/data/papers/**/*.bib",
        { eager: true, query: '?url' }) as Record<string, { default: string }>;
    const bibtexSource = import.meta.glob("$lib/data/papers/**/*.bib",
        { eager: true, query: '?raw' }) as Record<string, { default: string }>;

    let { data } = $props();
    let paper = $derived(data.paper);
    let paperBanner = $derived(data.paper.thumbnail.banner || data.paper.thumbnail.img);

    let bibTexUrl = $derived(paper.bibtex ?
        (paper.bibtex.startsWith('.')
            ? bibTexUrls[`/src/lib/data/papers/${paper.bibtex.slice(2)}`]?.default
            : paper.bibtex)
        : null);
    let bibTex = $derived(paper.bibtex ?
        (paper.bibtex.startsWith('.') ?
            bibtexSource[`/src/lib/data/papers/${paper.bibtex.slice(2)}`]?.default
            : bibtexSource[paper.bibtex].default)
        : null);
    const copyBibTex = () => {
        if (bibTex === null) {
            console.warn("No BibTeX available to copy.");
            return;
        }
        navigator.clipboard.writeText(bibTex?.trim());
    };
</script>


<div class={"flex flex-col w-full paper-sidebar pb-12"}>
    <div class="flex w-full max-h-52 justify-center">
        {#if paperBanner}
            <enhanced:img src={resourceUrls[`/src/lib/data/papers/${paperBanner.slice(2)}`]?.default}
                 class="m-1 mb-5 p-1 max-h-46 w-auto text-center bg-center"
                 alt={paper.thumbnail.alt ? paper.thumbnail.alt : `Preview image for paper ${paper.title}`}
                 loading="eager"/>
        {/if}
    </div>
    <div class="w-full flex flex-col items-center justify-center px-4">
        <article class="prose lg:prose-xl mt-2">
            <h2 class="text-center">{data.paper.title}</h2>

            <p class="text-center">
                {#if paper.journal}
                    <span class="italic">{paper.journal}{#if paper.publication_date},{/if}</span>
                {/if}
                {#if paper.publication_date}
                    {paper.publication_date}
                {/if}
            </p>

            <AuthorsBlock authors={data.paper.authors} />

<!--            <div class={"flex flex-wrap gap-2 mt-8 justify-center"}>-->
<!--                {#if paper.is_oral_presentation}-->
<!--                    <span class="badge lg:badge-lg badge-primary">Oral Presentation</span>-->
<!--                {:else if paper.is_poster}-->
<!--                    <span class="badge lg:badge-lg badge-secondary">Poster</span>-->
<!--                {/if}-->

<!--                {#if paper.keywords && paper.keywords.length > 0}-->
<!--                    {#each paper.keywords as keyword}-->
<!--                        <span class="badge lg:badge-lg badge-neutral badge-ghost">{keyword}</span>-->
<!--                    {/each}-->
<!--                {/if}-->
<!--            </div>-->
            <div class={"flex gap-x-2 gap-y-3 flex-wrap mt-8 justify-center"}>
                {#if paper.links}
                    {#each Object.entries(paper.links) as [name, link]}
                        <a class="btn btn-md lg:btn-lg btn-soft btn-secondary px-8" href={link} target="_blank">
                            {name}
                        </a>
                    {/each}
                    {#if bibTex}
                        <a class="btn btn-md lg:btn-lg btn-soft btn-secondary px-8" href={'#citation'}>
                            BibTeX
                        </a>
                    {/if}
                {/if}
            </div>
            <h3>Abstract</h3>
            <p class="text-justify">
                {#if paper.abstract}
                    {@html paper.abstract}
                {:else}
                    {@html paper.short_abstract}
                {/if}
            </p>
            {#if bibTex}
                <h3 id="citation">Citation</h3>
                <div class="grid">
                    <pre style="margin-top: 0;"><code>{bibTex}</code></pre>
                </div>
                <button class="btn btn-lg mt-2 font-bold" onclick={copyBibTex}><Copy/> Copy</button>
                <a class="btn btn-lg mt-2 font-bold" href={bibTexUrl} download={`${paper.id}.bib`}>
                    <Download/> Download
                </a>
            {/if}
            {#if paper.acknowledgements}
                <h3 class="mt-16">Acknowledgements</h3>
                <p class="text-justify">
                    {@html paper.acknowledgements}
                </p>
            {/if}
        </article>
    </div>
</div>
