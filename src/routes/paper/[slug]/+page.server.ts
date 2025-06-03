import { error } from '@sveltejs/kit';

import { type Paper } from "$lib/types/Paper";
import _papers from "$lib/data/papers.yaml";


export function load({ params }) {
    const papers = (_papers['papers'] as Paper[]).toReversed();
    const paper = papers.find(
        (paper) => {
            const id = paper.id.toLowerCase();
            const slug = params.slug.toLowerCase();

            return id === slug;
        }
    );

    if (paper === undefined) error(404);

    return {
        paper
    };
}
