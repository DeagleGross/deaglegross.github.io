---
title: 'How this blog is built and deployed'
description: 'The moving parts behind this site: Astro content collections, a Zod front-matter schema, and a GitHub Actions deployment to GitHub Pages.'
pubDate: 'Aug 23 2026'
---

This post doubles as documentation. If future me forgets how any of this works, it is written down here.

## Content collections

Posts live in `src/content/blog/` as `.md` or `.mdx` files. They are picked up by a content collection defined
in `src/content.config.ts`, which attaches a Zod schema to the front matter:

```ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
    }),
});
```

The practical effect is that a missing `title` or an unparseable `pubDate` is a build error, not a runtime
surprise. Coming from C#, this is the closest thing the Markdown world has to a compile-time contract.

## Routing

There is no route table to maintain. `src/pages/blog/[...slug].astro` calls `getCollection('blog')`, returns one
static path per post, and Astro pre-renders them all. The slug is the filename, so `hello-world.md` becomes
`/blog/hello-world/`.

## RSS and sitemap

`src/pages/rss.xml.js` uses `@astrojs/rss` to emit a feed at `/rss.xml`, and the `@astrojs/sitemap` integration
writes `/sitemap-index.xml` at build time. Both need the `site` value in `astro.config.mjs` to produce absolute
URLs, which is one of the reasons that setting is not optional.

## Deployment

A GitHub Actions workflow builds the site on every push to `main` and publishes `dist/` to GitHub Pages using
the official Pages actions. The whole thing is roughly:

```yaml
- uses: actions/configure-pages@v6
- run: npm ci && npm run build
- uses: actions/upload-pages-artifact@v5
  with:
    path: ./dist
- uses: actions/deploy-pages@v5
```

Because the repository is named `deaglegross.github.io`, the site is served from the domain root. That means
`site` is set to `https://deaglegross.github.io` and `base` is deliberately left unset. Setting a `base` here
would prefix every stylesheet and link with a subpath that does not exist, which is the classic way to end up
with an unstyled site.
