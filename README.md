# deaglegross.github.io

Source for my personal blog, published at **https://deaglegross.github.io**.

It is a static site built with [Astro](https://astro.build/). Posts are Markdown files in this repository — there is no CMS, no database, and no server. Pushing to `main` rebuilds and republishes the site.

---

## For the .NET developer who does not live in the JS ecosystem

A rough mental mapping if you are coming from `dotnet`:

| Node / Astro | .NET equivalent |
| --- | --- |
| `package.json` | `*.csproj` — dependencies and "scripts" (like MSBuild targets) |
| `package-lock.json` | `packages.lock.json` — exact resolved versions, **commit this** |
| `node_modules/` | `~/.nuget/packages` + `obj/` — restored packages, never committed |
| `npm ci` | `dotnet restore` with a locked graph (CI-safe, exact lockfile) |
| `npm install` | `dotnet restore` that may also *update* the lockfile |
| `npm run build` | `dotnet publish` — output lands in `dist/` |
| `npm run check` | `dotnet build` type/analyzer pass, no output artifacts |
| `dist/` | `bin/Release/net10.0/publish/` — deployable output |

`npx <tool>` runs a tool from the local `node_modules` (roughly `dotnet tool run`).

---

## Prerequisites

- **Node.js 22.12 or newer** (`node --version`). Anything from the current LTS line is fine.
- npm, which ships with Node.

Nothing else. No global installs required.

## Running locally

```bash
npm install       # once, after cloning or after dependencies change
npm run dev       # dev server with hot reload -> http://localhost:4321
```

Press `Ctrl+C` to stop the dev server.

Other useful commands:

```bash
npm run check     # type-check .astro/.ts files and validate front matter (run this before pushing)
npm run build     # production build into dist/
npm run preview   # serve the built dist/ locally, to check the real output
```

`npm run check` and `npm run build` are both run in CI, so if they pass locally the deployment will not fail on those grounds.

---

## Adding a new blog post

1. Create a new file in `src/content/blog/`. The **filename becomes the URL slug**, so `my-new-post.md` is published at `/blog/my-new-post/`. Use lowercase-with-hyphens.

2. Start the file with YAML front matter between `---` fences:

   ```markdown
   ---
   title: 'Why my endpoint allocates'
   description: 'A short summary used on the blog index, in the RSS feed, and as the page meta description.'
   pubDate: 'Aug 23 2026'
   updatedDate: 'Aug 24 2026'
   heroImage: '../../assets/blog-placeholder-1.jpg'
   ---

   Your content starts here, in normal Markdown.
   ```

3. Write the body in Markdown. Fenced code blocks are syntax-highlighted; use `csharp` for C#:

   ````markdown
   ```csharp
   app.MapGet("/hello", () => Results.Ok("world"));
   ```
   ````

That is the whole workflow — no index file to update, no route to register. The blog index, the individual post page, the RSS feed and the sitemap all pick it up automatically.

### Front-matter fields

Defined and validated in [`src/content.config.ts`](src/content.config.ts):

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `title` | **yes** | string | Post title, used as the `<h1>` and in the feed |
| `description` | **yes** | string | One or two sentences; shown on the index, in RSS, and as `<meta name="description">` |
| `pubDate` | **yes** | date | Any string `new Date()` can parse, e.g. `'Aug 23 2026'` or `'2026-08-23'`. Drives sort order |
| `updatedDate` | no | date | Rendered as "Last updated on …" when present |
| `heroImage` | no | image path | Path **relative to the Markdown file**, e.g. `'../../assets/blog-placeholder-1.jpg'`. Must point at a real file under `src/assets/` |

These are enforced by a Zod schema, which is the point: a missing `title` or an unparseable `pubDate` **fails the build** rather than quietly shipping a broken page. Think of it as compile-time checking for your front matter.

Images referenced by `heroImage` must live under `src/` (typically `src/assets/`) so Astro can optimize and hash them. Files dropped in `public/` are copied verbatim instead, without optimization.

`.mdx` files are also supported if you ever need components inside a post; the front matter rules are identical.

---

## Project layout

```
.
├── .github/workflows/deploy.yml   # build + publish to GitHub Pages
├── public/                        # copied to the site root as-is (favicon, .nojekyll)
├── src/
│   ├── assets/                    # images and fonts processed by the build
│   ├── components/                # header, footer, formatted date, <head> tags
│   ├── content/blog/              # >>> blog posts live here <<<
│   ├── content.config.ts          # front-matter schema (Zod)
│   ├── consts.ts                  # site title, description, GitHub URL
│   ├── layouts/BlogPost.astro     # layout for a single post
│   ├── pages/
│   │   ├── index.astro            # home page
│   │   ├── about.astro            # about page
│   │   ├── rss.xml.js             # RSS feed at /rss.xml
│   │   └── blog/
│   │       ├── index.astro        # blog index
│   │       └── [...slug].astro    # one page per post, generated at build time
│   └── styles/global.css          # global styles
└── astro.config.mjs               # site URL, integrations (MDX, sitemap)
```

Generated URLs:

- `/` — home
- `/blog/` — post index
- `/blog/<slug>/` — individual posts
- `/about/`
- `/rss.xml` — RSS feed
- `/sitemap-index.xml` — sitemap

---

## Deployment

Deployment is fully automated by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**Triggered by:**

- any push to `main`, or
- a manual run: repository → **Actions** → *Deploy to GitHub Pages* → **Run workflow** (`workflow_dispatch`).

**What it does:** checks out the repo, installs with `npm ci`, runs `npm run check`, runs `npm run build`, uploads `dist/` as a Pages artifact, then deploys it with the official `actions/deploy-pages` action. It uses OIDC (`id-token: write`) rather than a personal access token, so there is no secret to manage.

A deployment usually takes a couple of minutes. Watch it under the **Actions** tab.

### One-time GitHub setting (required)

The workflow will fail until this is done once:

> **Settings → Pages → Build and deployment → Source → select "GitHub Actions"**

Do **not** select "Deploy from a branch" — that is the legacy mode and is incompatible with this workflow.

### Why `base` is not set in `astro.config.mjs`

This repository is named `deaglegross.github.io`, which makes it a GitHub Pages **user site**, served from the root of the domain. So the config sets:

```js
site: 'https://deaglegross.github.io',
// no `base`
```

A `base` is only needed for *project* sites served from a subpath (`https://user.github.io/some-repo/`). Setting one here would prefix every stylesheet and link with a path that does not exist, producing the classic "site deployed but completely unstyled" symptom. If you ever move to a custom domain, change `site` and add a `public/CNAME` file — still no `base`.

---

## License

Site content © Dmitry Korolev. Code in this repository is free to reuse.
