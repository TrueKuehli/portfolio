<script lang="ts">
    import AtSign from '@lucide/svelte/icons/at-sign';
    import CircleUser from '@lucide/svelte/icons/circle-user';
    import Library from '@lucide/svelte/icons/library';

    import github from './assets/github.svg?raw';
    import bluesky from './assets/bluesky.svg?raw';
    import linkedin from './assets/linkedin.svg?raw';
    import timon_scholz from './assets/timon_scholz.jpg';

    type Props = {
        standalone: boolean;
    };

    let {standalone = true}: Props = $props();
</script>


<div class={standalone ?
        "hero min-h-screen" :
        "hero bg-base-200 lg:max-h-[calc(100vh_-_2em)] m-4 mb-0 lg:mb-4 lg:mr-0 lg:pt-4 lg:sticky lg:top-4 rounded-xl " +
        "content-start overflow-y-auto w-auto"}>
    <div class={"hero-content flex-col gap-12 text-center" + (standalone ? " lg:flex-row lg:text-left" : "")}>
        <div class="avatar">
            <div class={"mask mask-squircle shadow-2xl " + (standalone ? "w-96" : "w-64 2xl:w-80")}>
                <img src={timon_scholz} />
            </div>
        </div>
        <div>
            <h1 class="text-5xl font-bold">Timon Scholz</h1>
            <p class="py-6">
                👋 Hi there! I'm a PhD student under the supervision of
                <a href="https://graphics.tu-bs.de/people/magnor" target="_blank" class="link">Prof. Dr.-Ing. Marcus Magnor</a>
                at the <a href="https://graphics.tu-bs.de/" target="_blank" class="link">Computer Graphics Lab</a>
                of the <abbr title="Technische Universität Braunschweig">TU Braunschweig</abbr>.

                My research focuses on <a href="/research/nvs" class="link">Novel View Synthesis</a> and
                <a href="/research/perception" class="link">VR Perception</a>.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-1.5 mx-10">
                <div class="max-md:tooltip max-md:tooltip-bottom" data-tip="E-Mail">
                    <a href="mailto:scholz@cg.cs.tu-bs.de" class="btn btn-outline btn-primary">
                        <AtSign />
                        <span class="hidden md:inline">E-Mail</span>
                    </a>
                </div>
                <div class="max-md:tooltip max-md:tooltip-bottom" data-tip="Profile">
                    <a href="https://graphics.tu-bs.de/people/scholz-timon" target="_blank" class="btn btn-outline btn-primary">
                        <CircleUser />
                        <span class="hidden md:inline">Profile</span>
                    </a>
                </div>
                <div class="max-md:tooltip max-md:tooltip-bottom" data-tip="Google Scholar">
                    <a href="https://scholar.google.com/citations?user=UZKZzwoAAAAJ" target="_blank" class="btn btn-outline btn-primary">
                        <Library />
                        <span class="hidden md:inline">Scholar</span>
                    </a>
                </div>
                <div class="max-md:tooltip max-md:tooltip-bottom" data-tip="Bluesky">
                    <a href="https://bsky.app/profile/timonscholz.bsky.social" target="_blank" class="btn btn-outline btn-primary">
                        <div class="h-5 w-5 fill-primary">
                            {@html bluesky}
                        </div>
                        <span class="hidden md:inline">Bluesky</span>
                    </a>
                </div>
                <div class="max-md:tooltip max-md:tooltip-bottom" data-tip="LinkedIn">
                    <a href="https://www.linkedin.com/in/timon-scholz-26bb4a356/" target="_blank" class="btn btn-outline btn-primary">
                        <div class="h-5 w-5 fill-primary">
                            {@html linkedin}
                        </div>
                        <span class="hidden md:inline">LinkedIn</span>
                    </a>
                </div>
                <div class="max-md:tooltip max-md:tooltip-bottom" data-tip="GitHub">
                    <a href="https://github.com/TrueKuehli" target="_blank" class="btn btn-outline btn-primary">
                        <div class="h-5 w-5 fill-primary">
                            {@html github}
                        </div>
                        <span class="hidden md:inline">GitHub</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
