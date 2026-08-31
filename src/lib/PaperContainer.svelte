<script lang="ts">
    import { type Paper } from '$lib/types/Paper';
    const resourceUrls = import.meta.glob("$lib/data/papers/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}",
            { eager: true, query: '?enhanced' }) as Record<string, { default: string }>;
    const bibTexUrls = import.meta.glob("$lib/data/papers/**/*.bib",
            { eager: true, query: '?url' }) as Record<string, { default: string }>;

    type Props = {
        paper: Paper;
        paperIdx: number;
        standaloneContainer?: boolean;
    };
    let {paper, paperIdx, standaloneContainer = true}: Props = $props();
</script>


{#snippet author(name: string, last: boolean)}
    {#if name === PORTFOLIO_OWNER}
        <span class="font-bold">{name}</span>{last ? '' : ', '}
    {:else}
        <span>{name}</span>{last ? '' : ','}
    {/if}
{/snippet}

{#snippet authorLink(name: string, link: string | undefined, last: boolean)}
    {#if link}
        <a href={link} class="text-primary link">{name}</a>{last ? '' : ', '}
    {:else}
        {@render author(name, last)}
    {/if}
{/snippet}

{#snippet authorLinkAffilliation(name: string, link: string | undefined, affiliation: string | undefined, last: boolean)}
    {#if affiliation}
        <span class="pointer-fine:tooltip pointer-fine:tooltip-accent pointer-fine:tooltip-bottom">
            <span class="tooltip-content not-pointer-fine:hidden">
                {@html affiliation.replaceAll(',', ',<br>').replaceAll(';', '<br><hr style="margin: 0.25rem;">')}
            </span>
            {@render authorLink(name, link, last)}
        </span>
    {:else}
        {@render authorLink(name, link, last)}
    {/if}
{/snippet}



<div class={"hero w-auto m-4 mb-0 max-sm:m-2 max-md:border-base-300 max-md:border-solid max-md:border-1 " +
            "max-md:rounded-xl max-md:shadow-xl max-md:mb-3 max-sm:mb-3 overflow-clip"}>
    <div class={"hero-content w-full md:gap-x-6 flex-col"
            + (paperIdx % 2 === 0 ? " md:flex-row" : " md:text-end md:flex-row-reverse")
            + (standaloneContainer ? "" : " lg:max-xl:flex-col lg:max-xl:text-start")
    }>
        {#if paper.thumbnail.img}
            <enhanced:img src={resourceUrls[`/src/lib/data/papers/${paper.thumbnail.img.slice(2)}`]?.default}
                 class="max-w-2xs xl:max-w-sm max-md:max-w-sm min-h-32 mb-4 w-full rounded-lg bg-base-200 shadow-xl text-center bg-center"
                 alt={paper.thumbnail.alt ? paper.thumbnail.alt : `Preview image for paper ${paper.title}`}
                 loading="lazy"/>
        {/if}
        <!-- TODO: Add video thumbnail -->

        <div class="w-full md:flex-1/2">
            <h1 class="text-2xl font-bold">{paper.title}</h1>
            <div class="py-6">
                <div class={"flex flex-wrap gap-2 "
                        + (paperIdx % 2 === 0 ? "" : "md:justify-end")
                        + (standaloneContainer ? "" : " lg:max-xl:justify-start")
                }>
                    {#if paper.is_oral_presentation}
                        <span class="badge badge-primary">Oral Presentation</span>
                    {:else if paper.is_poster}
                        <span class="badge badge-secondary">Poster</span>
                    {/if}

                    {#if paper.keywords && paper.keywords.length > 0}
                        {#each paper.keywords as keyword}
                            <span class="badge badge-neutral badge-ghost">{keyword}</span>
                        {/each}
                    {/if}
                </div>

                <br>

                {#if paper.journal}
                    <span class="italic">{paper.journal}{#if paper.publication_date},{/if}</span>
                {/if}
                {#if paper.publication_date}
                    {paper.publication_date}
                {/if}

                <br>

                {#each paper.authors as author, authorIdx}
                <span class="mr-0.5">
                    {@render authorLinkAffilliation(author.name, author.link, author.affiliation, authorIdx === paper.authors.length - 1)}
                </span>
                {/each}
            </div>
            <p class="py-6">
                {#if paper.short_abstract}
                    {@html paper.short_abstract}
                {:else}
                    {@html paper.abstract}
                {/if}
            </p>
            <div class={"flex gap-x-1 gap-y-2 flex-wrap"
                    + (paperIdx % 2 === 0 ? "" : " md:justify-end")
                    + (standaloneContainer ? "" : " lg:max-xl:justify-start")
            }>
                <a class="btn btn-primary" href={`/paper/${paper.id}`}>Project Page</a>
                {#if paper.links}
                    {#each Object.entries(paper.links) as [name, link]}
                        <a class="btn btn-soft btn-secondary" href={link} target="_blank">
                            {name}
                        </a>
                    {/each}
                {/if}
                {#if paper.bibtex}
                    <a class="btn btn-soft btn-secondary"
                       href={paper.bibtex.startsWith('.')
                            ? bibTexUrls[`/src/lib/data/papers/${paper.bibtex.slice(2)}`]?.default
                            : paper.bibtex}
                       download={`${paper.id}.bib`}>
                        BibTeX
                    </a>
               {/if}
            </div>
        </div>
    </div>
</div>
