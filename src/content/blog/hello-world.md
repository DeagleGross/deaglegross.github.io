---
title: 'Hello, world'
description: 'Why I finally set up a blog, what I plan to write about, and how this site is built.'
pubDate: 'Aug 23 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

I spend most of my day in C# — mostly inside [dotnet/aspnetcore](https://github.com/dotnet/aspnetcore), where a
surprising amount of interesting detail never makes it out of a pull request description. This blog is where I
plan to write those details down.

## What to expect here

- ASP.NET Core internals: servers, hosting, middleware, and the bits of the stack people rarely look at.
- Performance work: benchmarks, allocation hunting, and the occasional disassembly rabbit hole.
- Diagnostics: dumps, traces, and the tooling I reach for when something misbehaves in production.
- Short notes about things I had to look up twice.

## How this site works

The whole site is a static [Astro](https://astro.build/) project. Posts are plain Markdown files in
`src/content/blog/`, validated at build time by a Zod schema, so a typo in a date or a missing description
fails the build instead of quietly shipping.

Every push to `main` runs a GitHub Actions workflow that builds the site and publishes it to GitHub Pages.
There is no CMS, no database, and no server — just files in a repo.

If something here is wrong, the source is a few clicks away and pull requests are welcome.
