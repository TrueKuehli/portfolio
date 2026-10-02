<script lang="ts">
    import Library from '@lucide/svelte/icons/library';
    import Info from '@lucide/svelte/icons/info';
    import House from '@lucide/svelte/icons/house';
    import Menu from '@lucide/svelte/icons/menu';
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';

    import categories from "./data/categories";
    import {theme} from "$lib/theme.svelte.js";

    const handleModeSwitch = (event: Event) => {
        const input = event.currentTarget as HTMLInputElement;
        if (input.checked) {
            theme.set(theme.current === 'dark' ? 'light' : 'dark');
        } else {
            theme.followSystem();
        }
    };
</script>


<div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start w-2/5 md:w-1/2">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-md btn-ghost tooltip tooltip-right" data-tip="Navigation"
                 aria-label="Navigation Drowpdown Menu"
            >
                <Menu class="h-7 w-7 text-primary" />
            </div>
            <ul class="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 lg:w-100 md:w-80 w-60 p-2 shadow">
                <li>
                    <a href="/research"><Library /> Research</a>
                    <ul class="p-2">
                        {#each categories as category}
                            <li>
                                <a href={"/research/" + encodeURIComponent(category.name.toLowerCase())}>
                                    <category.icon />
                                    {category.name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </li>
                <li><a href="/about"><Info />About</a></li>
            </ul>
        </div>
    </div>
    <div class="navbar-center hidden md:inline-flex">
        <a href="/" class="text-xl select-none font-semibold">
            <img src="/favicon.svg" alt="Favicon"
                 class={'h-10 w-10 inline-block' + (theme.current === 'dark' ? ' invert' : '')} />
            Timon Scholz
        </a>
    </div>
    <div class="navbar-end inline-flex grow justify-self-end">
        <label id="theme-switch" class="toggle toggle-lg text-primary" aria-label="Theme Switch">
            <input type="checkbox"
                   checked={theme.override !== null}
                   on:change={handleModeSwitch}
                   aria-labelledby="theme-switch" />

            {#if theme.systemPrefersDark}
                <Moon size={20} />
                <Sun size={20} />
            {:else}
                <Sun size={20} />
                <Moon size={20} />
            {/if}
        </label>
        <div class="pointer-fine:tooltip pointer-fine:tooltip-bottom ml-2 block" data-tip="Home">
            <a href="/" class="btn btn-md btn-ghost btn-secondary" aria-label="Home" role="button">
                <House class="h-7 w-7 text-primary" />
            </a>
        </div>
    </div>
</div>