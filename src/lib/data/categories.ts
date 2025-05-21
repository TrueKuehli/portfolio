import type { Category } from "$lib/types/Category";

import Box from '@lucide/svelte/icons/box';
import RectangleGoggles from '@lucide/svelte/icons/rectangle-goggles';
import Eye from '@lucide/svelte/icons/eye';


export default [
    {
        name: "Novel View Synthesis",
        icon: Box,
    },
    {
        name: "Virtual Reality",
        icon: RectangleGoggles,
    },
    {
        name: "Perception",
        icon: Eye,
    },
] satisfies Category[];
