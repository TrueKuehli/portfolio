<script lang="ts">
    let { authors } = $props();
</script>


{#snippet author(name: string)}
    {#if name === PORTFOLIO_OWNER}
        <span class="font-bold">{name}</span>
    {:else}
        <span>{name}</span>
    {/if}
{/snippet}

{#snippet authorLink(name: string, link: string | undefined)}
    {#if link}
        <a href={link} class="text-primary link">{name}</a>
    {:else}
        {@render author(name)}
    {/if}
{/snippet}

{#snippet authorLinkAffilliation(name: string, link: string | undefined, affiliation: string | undefined)}
    {#if affiliation}
        {@render authorLink(name, link)}
        {#each affiliation.split(';') as aff_entry (aff_entry)}
            {#each aff_entry.split(',') as aff_line, idx (aff_line)}
                {#if idx > 0}
                    <span class="text-xs text-base-content/70 font-thin">{aff_line}</span>
                {:else}
                    <span class="text-xs text-base-content/70">{aff_line}</span>
                {/if}
            {/each}
        {/each}
    {:else}
        {@render authorLink(name, link)}
    {/if}
{/snippet}


<div class="w-full md:flex-1/2 flex flex-row flex-wrap gap-x-10 gap-y-4 justify-center">
    {#each authors as author (author.name)}
        <div class="flex flex-col text-center">
            {@render authorLinkAffilliation(author.name, author.link, author.affiliation)}
        </div>
    {/each}
</div>
