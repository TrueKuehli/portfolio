import type {Author} from "./Author";


export type Paper = {
    id: string;
    title: string;
    authors: Author[];
    abstract: string;
    short_abstract?: string;
    publication_date: string;
    journal: string;
    is_oral_presentation?: boolean;
    is_poster?: boolean;
    keywords?: string[];
    categories?: string[];
    links?: {
        [key: string]: string;
    }
    thumbnail: {
        // Relative to /lib/data/papers/... (as ./...), or /public/... (as /...) or absolute URL
        img: string;
        video: string;
        alt: string;
    }
};
