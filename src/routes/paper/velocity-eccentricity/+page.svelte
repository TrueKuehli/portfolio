<script lang="ts">
    import {onMount} from "svelte";

    import bannerSvg from "$lib/data/papers/vel-perception/wide-teaser.svg?raw";
    import modelEquation from "$lib/data/papers/vel-perception/model-equation.svg?raw";
    import gaborAnimated from "$lib/data/papers/vel-perception/gabor_animated.mp4";
    import modelLoop from "$lib/data/papers/vel-perception/model_rotate_loop.webm";
    import bibTexUrl from "$lib/data/papers/vel-perception/bibtex.bib?url";
    import bibTexSource from "$lib/data/papers/vel-perception/bibtex.bib?raw";

    import AuthorsBlock from "$lib/AuthorsBlock.svelte";
    import Download from "@lucide/svelte/icons/download";
    import Copy from "@lucide/svelte/icons/copy";

    let { data } = $props();
    let paper = $derived(data.paper);

    let bannerElement: HTMLDivElement | null = null;
    const copyBibTex = () => {
        navigator.clipboard.writeText(bibTexSource.trim());
    };

    onMount(() => {
        if (bannerElement) {
            if (bannerElement.children[0] !== undefined) {
                bannerElement.children[0].classList.add(
                    "banner-mask", "w-full", "max-h-52", "object-cover", "absolute", "text-center", "bg-center",
                    "blur-lg", "opacity-30"
                );
                bannerElement.children[0].setAttribute("preserveAspectRatio", "none");
            }
            bannerElement.children[1]?.classList.add(
                "m-1", "mb-5", "p-1", "max-h-46", "text-center", "bg-center", "z-10", "fill-base-content",
                "stroke-base-content"
            );

            bannerElement.classList.remove('hidden');
        }
    });
</script>


<div class={"flex flex-col w-full paper-sidebar pb-12"}>
    <div class="flex w-full max-h-52 justify-center relative overflow-clip hidden" bind:this={bannerElement}>
        {@html bannerSvg}
        {@html bannerSvg}
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
                {/if}
                <a class="btn btn-md lg:btn-lg btn-soft btn-secondary px-8" href={'#citation'}>
                    BibTeX
                </a>
            </div>

            <h3>Abstract</h3>
            <p class="text-justify">
                {#if paper.abstract}
                    {@html paper.abstract}
                {:else}
                    {@html paper.short_abstract}
                {/if}
            </p>

            <h3>Experimental Design</h3>
            <p class="text-justify">
                In our main experiment, we investigate the relationship between
                stimulus eccentricity and perceived velocity of an object by presenting
                participants with Gabor patch stimuli at different eccentricities while
                observing and matching a central stimulus. During the entire experiment,
                participants are unable to observe the peripheral Gabor patch directly.
                We ensure this by using an eye tracker to blank the entire screen when
                a participant is no longer looking at the central Gabor patch.
            </p>
            <div class="bg-[#bcbbc2] relative contain-strict w-full h-48 my-6 shadow-xl shadow-base-content/40 xl:w-[133%] xl:ml-[-16.6%] xl:my-12">
                <video class="absolute h-24 left-0" autoplay loop muted playsinline controls={false}>
                    <source src={gaborAnimated} type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <video class="h-24 m-auto relative" autoplay loop muted playsinline controls={false}>
                    <source src={gaborAnimated} type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
            <p class="text-justify">
                To investigate the influence of gaze type on the model, we repeat
                select trials of the main experiment while showing a permanent fixation
                target in the middle of the central Gabor patch.
            </p>
            <div class="bg-[#bcbbc2] relative contain-strict w-full h-48 my-6 shadow-xl shadow-base-content/40 xl:w-[133%] xl:ml-[-16.6%] xl:my-12">
                <video class="absolute h-24 left-0" autoplay loop muted playsinline controls={false}>
                    <source src={gaborAnimated} type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="w-24 h-24 mx-auto relative">
                    <video class="h-24" autoplay loop muted playsinline controls={false}>
                        <source src={gaborAnimated} type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <span class="absolute top-6 left-8 text-pink-600 text-5xl select-none">+</span>
                </div>
            </div>
            <h3>Results</h3>
            <p class="text-justify">
                We found that the perceived velocity of a stimulus not only depends on its
                eccentricity, but this effect changes depending on the velocity of the stimulus
                itself. Concretely, for slower speeds the velocity is overestimated the further
                the stimulus lies in a participant’s periphery, whereas for faster speeds the
                velocity of the stimulus is underestimated. By combining these findings, we
                propose an empirical model to describe this relationship:
            </p>
            <span class="fill-base-content flex justify-center fit">
                {@html modelEquation}
            </span>
            <video class="model-video" autoplay loop muted playsinline controls={false}>
                <source src={modelLoop} type="video/webm">
                Your browser does not support the video tag.
            </video>
            <p>
                Using the secondary experiment we confirmed this model to hold for both fixation and
                smooth pursuit gaze types. Our VR pilot study suggests that this effect exists in
                more complex scenarios as well, and highlights further opportunities to fine-tune the model.
            </p>

            <h3 id="citation">Citation</h3>
            <div class="grid">
                <pre style="margin-top: 0;"><code>{bibTexSource}</code></pre>
            </div>
            <button class="btn btn-lg mt-2 font-bold" onclick={copyBibTex}><Copy/> Copy</button>
            <a class="btn btn-lg mt-2 font-bold" href={bibTexUrl} download={`${paper.id}.bib`}>
                <Download/> Download
            </a>

            {#if paper.acknowledgements}
                <h3>Acknowledgements</h3>
                <p class="text-justify">
                    {@html paper.acknowledgements}
                </p>
            {/if}
        </article>
    </div>
</div>


<style>
    :global(.banner-mask) {
        mask-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 7.5%);
    }

    .model-video {
        margin-top: -12%;
        margin-bottom: -5%;
    }
</style>