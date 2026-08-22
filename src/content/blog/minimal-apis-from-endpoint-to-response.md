---
title: 'Minimal APIs: from endpoint to response'
description: 'A short tour of what an ASP.NET Core minimal API endpoint actually compiles down to, with C# examples.'
pubDate: 'Aug 23 2026'
updatedDate: 'Aug 23 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

Minimal APIs look like a lambda bolted onto a route. Underneath, the framework does a fair amount of work to
turn that lambda into a `RequestDelegate`. This post is mostly an excuse to check that C# syntax highlighting
works on this blog, but the code is real.

## The endpoint

Here is about the smallest interesting endpoint you can write:

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IGreetingService, GreetingService>();

var app = builder.Build();

app.MapGet("/greet/{name}", (string name, IGreetingService greetings) =>
{
    var message = greetings.Greet(name);
    return Results.Ok(new GreetingResponse(message, DateTimeOffset.UtcNow));
});

app.Run();

public interface IGreetingService
{
    string Greet(string name);
}

public sealed class GreetingService : IGreetingService
{
    public string Greet(string name) => $"Hello, {name}!";
}

public readonly record struct GreetingResponse(string Message, DateTimeOffset GeneratedAt);
```

Three different parameter sources show up in that one lambda:

1. `name` is bound from the route template, because the name matches the `{name}` segment.
2. `IGreetingService` is resolved from DI, because it is a registered service.
3. The return value is wrapped into an `IResult` that knows how to write itself to the response.

## Where the binding decision happens

Request delegate creation walks the lambda's parameters once, at startup, and builds an expression tree — it
does not reflect over parameters per request. That is the reason minimal APIs stay competitive with hand-written
delegates.

You can opt out of the inference entirely when the heuristics are not what you want:

```csharp
app.MapPost("/items", async (
    [FromBody] CreateItemRequest request,
    [FromServices] IItemStore store,
    CancellationToken cancellationToken) =>
{
    var id = await store.CreateAsync(request, cancellationToken);
    return Results.Created($"/items/{id}", new { id });
});
```

## A note on `CancellationToken`

`CancellationToken` is special-cased: it is bound to `HttpContext.RequestAborted` rather than DI. Accepting one
and actually passing it down is the cheapest reliability win available in most codebases:

```csharp
public async Task<Guid> CreateAsync(CreateItemRequest request, CancellationToken cancellationToken)
{
    await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);
    // ...
    return Guid.NewGuid();
}
```

For comparison, here is the same idea expressed as a plain middleware, which is what the endpoint ultimately
becomes:

```csharp
app.Use(async (HttpContext context, RequestDelegate next) =>
{
    if (context.Request.Path.StartsWithSegments("/health"))
    {
        context.Response.StatusCode = StatusCodes.Status200OK;
        await context.Response.WriteAsync("OK", context.RequestAborted);
        return;
    }

    await next(context);
});
```

Nothing exotic — but if the highlighting above looks right, the blog's Markdown pipeline is doing its job.
