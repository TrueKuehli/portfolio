# Portfolio

The public research portfolio of Timon Scholz — built with SvelteKit 2 (Svelte 5), Tailwind CSS 4 + daisyUI 5, and TypeScript.

Each paper is described in `src/lib/data/papers.yaml` and rendered as a card via `PaperContainer` on the research listing and individual paper pages.

## Development

```sh
npm install
npm run dev      # dev server
npm run build    # production build
npm run check    # svelte-check + TypeScript
npm run lint     # ESLint
```

## Adding a paper

1. Add an entry to `src/lib/data/papers.yaml` — the `id` doubles as the page slug. Listings render the yaml in reverse, so add the newest paper last.
2. Put its assets under `src/lib/data/papers/<dir>/` and reference them with `./<dir>/...` paths; the directory name doesn't have to match the `id`. Raster images are optimized automatically (`@sveltejs/enhanced-img`), SVG and video files are served as-is.
3. If the paper uses a category that has no icon yet, add a matching entry to `src/lib/data/categories.ts`.
4. For an external project page, add a static `src/routes/paper/<slug>/+page.server.ts` with a `redirect(308, ...)` to shadow the dynamic route; otherwise the dynamic `src/routes/paper/[slug]/` page renders the paper automatically.
