import type {Author} from "./Author";


export type Paper = {
    id: string;
    title: string;
    authors: Author[];
    abstract: string;
    short_abstract?: string;
    acknowledgements?: string;
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
        banner?: string;
        banner_dark?: string;
        video?: string;
        alt: string;
    }
    bibtex?: string;
};
