---
title: 'Asprify or Doomify?'
description: 'Can you play Doom while managing your Aspire resources?'
pubDate: 'Aug 23 2026'
heroImage: './hero.png'
---

That's my first article - I wanted it to be short and fun. It was always exciting to read about legendary DOOM game being run in [Excel](https://github.com/Pranshul-Thakur/DOOM-in-excel) or on the [pregnancy test](https://www.reddit.com/r/gaming/comments/ncmegl/doom_running_on_a_pregnancy_test/). Since I am not a hardware expert (yet?), I decided to connect DOOM to something I am aware of (and actually even contributed a small feature to) - [Aspire](https://aspire.dev).

Aspire is amazing: it has many definitions for different use-cases, but for me it's a tool to manage all of my dependencies in the inner-loop. Let's consider this example:

```csharp
var builder = DoomedApplication.CreateBuilder(args);

var redis = builder.AddRedis("redis");
var storage = builder.AddAzureStorage("storage");
var postgres = builder.AddPostgres("postgres");

var api = builder.AddProject<Projects.AspireDoomify_Api>("api")
    .WithReference(redis)
    .WithReference(blobs)
    .WithReference(database);
```

This aspire host is trivial - we have a web-api, which has a dependency on redis, azure storage and postgres.

