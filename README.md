# deaglegross.github.io

Source for my personal blog at **https://deaglegross.github.io**, built with [Astro](https://astro.build/) and published to GitHub Pages.

## Running locally

```bash
npm install     # once, after cloning or when dependencies change
npm run dev     # http://localhost:4321, hot reload; Ctrl+C to stop
```

Other commands:

```bash
npm run check     # type-check and validate post front matter
npm run build     # production build into dist/
npm run preview   # serve the built dist/ locally
```

`check` and `build` also run in CI, so if they pass locally the deploy will not fail on those grounds.

## Adding a post

Each post is a folder under `src/content/blog/`. The folder name becomes the URL slug, and the post itself is `index.md` inside it:

```
src/content/blog/
└── my-new-post/        →  /blog/my-new-post/
    ├── index.md
    └── hero.png
```

Keeping images in the post folder means everything for one post lives together, and deleting the folder removes the post and its assets in one go.

````markdown
---
title: 'Why my endpoint allocates'
description: 'Shown on the index, in the RSS feed, and as the meta description.'
pubDate: 'Aug 23 2026'
updatedDate: 'Aug 24 2026'
heroImage: './hero.png'
---

Body in Markdown. Use ```csharp fences for C#.
````

`title`, `description` and `pubDate` are required; `updatedDate` and `heroImage` are optional. `heroImage` is a path relative to the Markdown file — `./hero.png` for a colocated image. Astro optimizes and fingerprints it at build time, so large source images are fine.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes on every push to `main`, or manually via **Actions → Deploy to GitHub Pages → Run workflow**.