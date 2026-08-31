import { redirect } from '@sveltejs/kit';

export function load() {
    redirect(308, 'https://junboli-cn.github.io/spags/');
}
