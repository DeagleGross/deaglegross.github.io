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

Inline images work the same way: `![Alt text](./diagram.png)`.

## Adding a video

Astro optimizes images but passes video through untouched, so video uses a plain HTML5 player via [`src/components/Video.astro`](src/components/Video.astro).

A component has to be imported, so the post must be `index.mdx` instead of `index.md`. Nothing else changes — MDX is Markdown that also accepts imports.

````mdx
---
title: 'Playing Doom in the Aspire dashboard'
description: 'Shown on the index and in the RSS feed.'
pubDate: 'Aug 23 2026'
---

import Video from '../../../components/Video.astro';
import demo from './demo.mp4';

<Video src={demo} caption="The dashboard, mid-descent." />
````

Props: `src` (required), `poster`, `caption`, `autoplay`, `controls`.

`autoplay` is the silent looping treatment for short screen recordings — it forces `muted` and `loop`, since browsers refuse to autoplay audio. Pair with `controls={false}` for a GIF-like clip:

```mdx
<Video src={demo} autoplay controls={false} />
```

Add a `poster` for anything longer than a few seconds, otherwise the player is a blank rectangle until the reader presses play.

Video is committed to the repo and counts against the GitHub Pages limits (1 GB repo, 100 MB per file, soft 100 GB/month bandwidth), so re-encode before committing:

```bash
ffmpeg -i raw.mp4 -vcodec libx264 -crf 28 -preset slow -an -movflags +faststart demo.mp4
```

`-an` drops the audio track and `-movflags +faststart` lets playback begin before the whole file downloads. For anything long, host on YouTube and embed instead.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes on every push to `main`, or manually via **Actions → Deploy to GitHub Pages → Run workflow**.