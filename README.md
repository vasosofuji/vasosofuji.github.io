# vasosofuji.github.io

Portfolio site for Mateja Vasojevikj (vasosofuji) — photography and video.

Static HTML pages styled by `style.css` and driven by `script.js`, with a few
React islands (navigation, carousels, hero background, parallax gallery)
mounted into placeholder elements by Vite.

## Running locally

```bash
npm install
npm run dev
```

The pages reference `/src/main.tsx` directly, so they only render fully under
the dev server. Open the printed URL rather than the HTML files on disk.

## Building

```bash
npm run build
```

This runs `vite build` and then `scripts/copy-static.mjs`, which copies
`photos/`, `misc/` and `favicon.ico` into `dist/`. Those folders are referenced
by runtime strings — `photos/...` in `src/main.tsx`, the preloader frames built
from a template literal in `script.js`, and the video's `data-src` — so Vite
cannot see them and would otherwise leave them out of the build.

Preview the built output with `npm run preview`.

## Deployment

Primary hosting is Vercel. `vercel.json` pins the build command and output
directory and sets cache headers: hashed files under `/assets` are immutable for
a year, while `photos/` and `misc/` keep stable filenames so they get a day of
freshness plus a week of stale-while-revalidate. Pushing to `main` deploys;
pull requests get their own preview URL.

`.github/workflows/deploy.yml` still publishes the same build to GitHub Pages,
which keeps vasosofuji.github.io alive. It can be deleted once Vercel is the
only host. Note that Pages does not serve private repositories on the free
plan, so making this repository private disables it.

Whichever host is used, the site must be served from `dist/`, never from the
repository root — the committed `index.html` loads `/src/main.tsx`, which only
resolves under the dev server. Served raw, it arrives as
`application/octet-stream` and every React island silently fails to mount.

## Layout

| Path | Contents |
| --- | --- |
| `*.html` | One file per page |
| `style.css` | All site styling, including the navigation |
| `script.js` | Preloader, translations, calendar, booking, scroll reveal |
| `src/` | React islands and their entry points |
| `photos/`, `misc/` | Images, video, and preloader frames |
