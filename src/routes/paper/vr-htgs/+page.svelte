<script lang="ts">
    import AuthorsBlock from "$lib/AuthorsBlock.svelte";
    import Copy from "@lucide/svelte/icons/copy"
    import Download from "@lucide/svelte/icons/download";
    import DemoCanvas from "./DemoCanvas.svelte";
    import {theme} from "$lib/theme.svelte.js";

    const resourceUrls = import.meta.glob("$lib/data/papers/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}",
        { eager: true, query: '?enhanced' }) as Record<string, { default: string }>;
    const bibTexUrls = import.meta.glob("$lib/data/papers/**/*.bib",
        { eager: true, query: '?url' }) as Record<string, { default: string }>;
    const bibtexSource = import.meta.glob("$lib/data/papers/**/*.bib",
        { eager: true, query: '?raw' }) as Record<string, { default: string }>;

    let { data } = $props();
    let paper = $derived(data.paper);
    let paperBanner = $derived(paper.thumbnail.banner || paper.thumbnail.img);
    let paperBannerDark = $derived(paper.thumbnail.banner_dark || null);

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

<!-- eslint-disable svelte/no-at-html-tags -- all {@html} renders trusted build-time content from papers.yaml (not user input) -->


<div class="flex flex-col w-full paper-sidebar pb-12">
    <div class="flex w-full max-h-64 justify-center">
        {#if paperBanner}
            <enhanced:img src={resourceUrls[`/src/lib/data/papers/${paperBanner.slice(2)}`]?.default}
                          class={"m-1 mb-5 p-1 max-h-46 w-auto text-center bg-center"
                        + ((paperBannerDark && theme.current === 'dark') ? ' hidden' : '')}
                          alt={paper.thumbnail.alt ? paper.thumbnail.alt : `Preview image for paper ${paper.title}`}
                          loading="eager"/>
        {/if}
        {#if paperBannerDark}
            <enhanced:img src={resourceUrls[`/src/lib/data/papers/${paperBannerDark.slice(2)}`]?.default}
                          class={"m-1 mb-5 p-1 max-h-46 w-auto text-center bg-center"
                                 + (!paperBanner || theme.current === 'dark' ? '' : ' hidden')}
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
        </article>

        <div class="flex gap-x-2 gap-y-3 flex-wrap mt-8 mb-8 justify-center">
            {#if paper.links}
                {#each Object.entries(paper.links) as [name, link] (name)}
                    <a class="btn btn-md lg:btn-lg btn-soft btn-secondary px-8" href={link} target="_blank">
                        {#if link == null}{name} (Coming Soon){:else}{name}{/if}
                    </a>
                {/each}
                {#if bibTex}
                    <a class="btn btn-md lg:btn-lg btn-soft btn-secondary px-8" href="#citation">
                        BibTeX
                    </a>
                {/if}
            {/if}
        </div>

        <article class="prose lg:prose-xl mt-2 pb-4">
            <!-- TODO: Replace -->
            <h3>Abstract</h3>
            <p class="text-justify">
                {#if paper.abstract}
                    {@html paper.abstract}
                {:else}
                    {@html paper.short_abstract}
                {/if}
            </p>

            <h3>Interactive Demo</h3>
            <p class="text-justify">
                You can try out an interactive demo of our foveation & dynamic eye-tracked tiling below on an example
                video below.
            </p>
        </article>

        <DemoCanvas/>

        <article class="prose lg:prose-xl mt-8">
            <p class="text-justify text-sm text-base-content/60">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current inline text-warning" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Note: Because this browser-based demo does not call our rasterizer, some features such as
                anti-aliasing are not supported. For the full experience, check out our
                <a href={paper?.links?.Code}>
                    Code Release {#if !paper?.links?.Code} (Coming Soon) {/if}
                </a>.
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
