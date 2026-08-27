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
sourceUrl: 'https://github.com/DeagleGross/AspireDoomify'
---

Body in Markdown. Use ```csharp fences for C#.
````

`title`, `description` and `pubDate` are required; `updatedDate`, `heroImage` and `sourceUrl` are optional. `heroImage` is a path relative to the Markdown file — `./hero.png` for a colocated image. Astro optimizes and fingerprints it at build time, so large source images are fine. The same image is also used for the article's Twitter/X and other social link previews; posts without one use the blog placeholder.

`sourceUrl` renders as a "Source code" link under the post title, with a GitHub mark if it points at GitHub. It is validated as a real URL, so a typo fails the build.

Inline images work the same way: `![Alt text](./diagram.png)`.

## Adding a video

Astro optimizes images but passes video through untouched, so video is a plain HTML5 player. Put the file in `public/videos/` and reference it by absolute path — this works in a normal `index.md`:

```markdown
<video src="/videos/demo.mp4" controls playsinline preload="metadata"></video>
```

`preload="metadata"` matters: without it the browser downloads the whole clip on page load rather than just enough to draw the player.

For a silent looping clip in place of a GIF:

```markdown
<video src="/videos/demo.mp4" autoplay loop muted playsinline></video>
```

`muted` is not optional there — browsers refuse to autoplay video with sound.

Anything in `public/` is copied to the site verbatim, which means a typo'd path still builds green and only fails as a 404 in the browser. If you would rather have a broken video break the build, rename the post to `index.mdx`, keep the file next to it, and use [`src/components/Video.astro`](src/components/Video.astro) instead:

````mdx
import Video from '../../../components/Video.astro';
import demo from './demo.mp4';

<Video src={demo} caption="Doom, mid-descent." />
````

### Compress before committing

Video is committed to the repo permanently and counts against the GitHub Pages limits (1 GB repo, 100 MB per file, soft 100 GB/month bandwidth). Screen recordings are usually enormously overspecified — the first one here went from 22.5 MB to 3.1 MB with no visible loss:

```bash
ffmpeg -i raw.mp4 -vcodec libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 96k -movflags +faststart demo.mp4
```

Raise `-crf` to shrink further (28 is already conservative), add `-vf scale=1280:-2` to halve it again, or `-an` to drop audio entirely. `-movflags +faststart` lets playback begin before the whole file arrives.

Do not convert to GIF to save space — GIF has no motion compensation and caps at 256 colours, so the same clip lands in the hundreds of megabytes.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes on every push to `main`, or manually via **Actions → Deploy to GitHub Pages → Run workflow**.