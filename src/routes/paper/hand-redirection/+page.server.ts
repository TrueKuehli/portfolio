import { redirect } from '@sveltejs/kit';

export function load() {
    redirect(308, 'https://colingroth.github.io/projects/handRedirection.html');
}
