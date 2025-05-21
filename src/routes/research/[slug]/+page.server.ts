import { error } from '@sveltejs/kit';

import { type Paper } from "$lib/types/Paper";
import _papers from "$lib/data/papers.yaml";


export function load({ params }) {
    const papers = (_papers['papers'] as Paper[]).toReversed();
    const filteredPapers = papers.filter(
        (paper) => {
            const categories = paper.categories?.map(
                cat => cat.toLowerCase()
            );
            const slug = params.slug.toLowerCase();

            return categories?.includes(slug);
        }
    );

    if (filteredPapers.length === 0) error(404);

    return {
        filteredPapers
    };
}
