import {browser} from "$app/environment";

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';

/** daisyUI theme names as declared in src/app.css (`fantasy --default, dracula --prefersdark`). */
const DAISYUI_THEME = {
    dark: 'dracula',
    light: 'fantasy',
} satisfies Record<Theme, string>;

/**
 * Shared theme state. `theme.current` is the effective theme actually rendered;
 * read it from any component or page. Only the NavBar toggle mutates the state
 * (via `set` / `followSystem`).
 */
class ThemeState {
    /** The user's system color-scheme preference, tracked live. */
    systemPrefersDark = $state(false);

    /** User override. `null` means follow the system preference. */
    override = $state<Theme | null>(null);

    /** The effective theme actually rendered. One of 'dark' or 'light'. */
    get current(): Theme {
        return this.override ?? (this.systemPrefersDark ? 'dark' : 'light');
    }

    constructor() {
        if (!browser) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemPrefersDark = mediaQuery.matches;

        // A stored override wins over the system preference until the user
        // toggles back to following the system.
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
            this.override = stored;
        }

        mediaQuery.addEventListener('change', (event) => {
            this.systemPrefersDark = event.matches;
        });

        this.apply();
        // No cleanup: this is an app-lifetime singleton.
    }

    /** Pin the theme to an explicit choice and persist it. */
    set(next: Theme) {
        this.override = next;
        if (browser) {
            localStorage.setItem(STORAGE_KEY, next);
        }
        this.apply();
    }

    /** Drop the override and follow the system preference again. */
    followSystem() {
        this.override = null;
        if (browser) {
            localStorage.removeItem(STORAGE_KEY);
        }
        this.apply();
    }

    // An explicit data-theme attribute beats the prefers-color-scheme media rule
    // (daisyUI re-emits every theme's [data-theme] vars after it), so a stored
    // override reliably applies. When following the system, the media rule
    // applies the theme natively — also before any JS runs.
    private apply() {
        if (!browser) return;
        const root = document.documentElement;
        if (this.override === null) {
            root.removeAttribute('data-theme');
        } else {
            root.dataset.theme = DAISYUI_THEME[this.current];
        }
    }
}

export const theme = new ThemeState();
