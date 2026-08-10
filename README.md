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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages.

This requires the repository's **Settings → Pages → Source** to be set to
**GitHub Actions**. With the default branch-based source, Pages serves the
repository root verbatim, `/src/main.tsx` is sent as `application/octet-stream`,
and every React island silently fails to mount.

## Layout

| Path | Contents |
| --- | --- |
| `*.html` | One file per page |
| `style.css` | All site styling, including the navigation |
| `script.js` | Preloader, translations, calendar, booking, scroll reveal |
| `src/` | React islands and their entry points |
| `photos/`, `misc/` | Images, video, and preloader frames |
