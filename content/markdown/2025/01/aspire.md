---
title: "Making Microservices Manageable with .NET Aspire, Git Submodules, and OpenTelemetry"
description: "Let's look at .NET Aspire as a potential solution to microservices development"
date: "2025-02-05"
author: "Carlos Salamanca"
category: "Software Engineering"
slug: "microservices-manageable-dotnet-aspire"
---

# Making Microservices Manageable with .NET Aspire, Git Submodules, and OpenTelemetry

Microservices give us flexibility. They also give us a headache.

At their best, microservices enable independent deployment, scalability, and team autonomy. But too often, they introduce local development chaos, debugging nightmares, and operational overhead—especially when we're just trying to deliver cohesive **products**, not architecture for architecture's sake.

This post explores how we can tame microservices using [.NET Aspire](https://devblogs.microsoft.com/dotnet/introducing-dotnet-aspire/), Git submodules, and local OpenTelemetry tracing. We'll walk through practical strategies to create a **monorepo-like developer experience**—even when you don't have a monorepo.

---

## 👎 The Reality of Microservices in Practice

While microservices are great for deployment and scalability, they tend to:

- **Break local dev workflows**: You need to spin up multiple services manually, in the right order, with the right env variables and ports.
- **Make debugging painful**: Tracing a request across multiple services becomes a guessing game.
- **Fragment ownership**: Services owned by different teams may live in different repos, on different deployment pipelines, and with different assumptions.
- **Slow onboarding**: New developers often spend more time setting up services than writing code.

These are real tradeoffs—and often overlooked when teams jump on the "microservices" bandwagon.

---

## ✅ But We're Building Products

Despite the architectural breakdown of services, what we're actually delivering is a **product**. That means we care more about how all the pieces fit together than the internals of each individual service.

When you're building a product:

- **Local cohesion matters.**
- **Cross-service observability matters.**
- **Running everything quickly and predictably matters.**

This is where `.NET Aspire` comes in.

---

## 🚀 .NET Aspire to the Rescue

`.NET Aspire` is a new stack from Microsoft designed to make building distributed apps easier. It gives you a structured way to define, compose, and run a multi-service application locally.

Aspire supports things like:

- Declarative service definitions
- Local dev orchestration (like Docker Compose, but smarter and .NET-native)
- Native integration with OpenTelemetry
- IDE tooling and launch profiles out of the box

Let's look at an example:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var service1 = builder.AddProject("service1", "../services/service1/Service1.API.csproj")
    .WithHttpsEndpoint(port: 7001, name: "api");

var service2 = builder.AddProject("service2", "../services/service2/Service2.API.csproj")
    .WithReference(service1)
    .WithEnvironment("Service1__Uri", service1.GetEndpoint("api"));

var frontend = builder.AddYarnApp("frontend", "../services/frontend", "dev")
    .WithReference(service1)
    .WithReference(service2)
    .WithEnvironment("VITE_SERVICE1_URL", service1.GetEndpoint("api"))
    .WithEnvironment("PORT", "5174")
    .WithHttpsEndpoint(targetPort: 5174, port: 5173, name: "client");

builder.Build().Run();
```

This Aspire `Program.cs` script declares how your product is composed. It specifies startup order, environment variables, references, ports, and more—all in one place.

---

## 🔗 Git Submodules: Repo Independence, Dev Cohesion

What if your services live in separate repositories?

That's where Git submodules help. You can add each service as a submodule to your Aspire app repository:

```bash
git submodule add https://example.com/service1 services/service1
git submodule add https://example.com/service2 services/service2
git submodule add https://example.com/frontend services/frontend
```

This allows:

- Teams to retain ownership and versioning of individual services
- The Aspire app to pull them in for local dev and orchestration
- Isolation of concerns with a single command to clone everything:

```bash
git clone --recurse-submodules https://example.com/aspire-app
```

> ✅ Bonus: In your `.gitmodules`, specify `branch = main` if your submodules don't default to it.

---

## 🔍 Distributed Tracing: Don't Debug in the Dark

Local dev is one thing. But once multiple services are talking to each other, tracing becomes essential. Aspire supports OpenTelemetry (OTel) out of the box.

You can even add your own tracing collector:

```csharp
builder.AddOpenTelemetryCollector("otel")
    .WithHttpEndpoint(port: 4318);
```

And then configure your services and frontends to send traces to `http://localhost:4318`.

For a React/Vite frontend in dev mode:

```env
# .env file
VITE_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Then, in your code:

```ts
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';

if (import.meta.env.MODE === 'development') {
  const provider = new WebTracerProvider();
  // Configure exporter + tracing logic
}
```

Now, whether it's a `.NET API` or a `React app`, you can follow a trace from click to DB and back—all locally.

---

## 🧠 Big Takeaways

1. **You don't need a monorepo to get a monorepo-like experience.**
   - Use `.NET Aspire` + Git submodules to orchestrate services locally.

2. **Deliver products, not services.**
   - Think about the full product experience, from frontend to DB, not just isolated deployables.

3. **Use distributed tracing—even in dev.**
   - Set up local OpenTelemetry to debug and diagnose with confidence.

4. **Simplify local development.**
   - Aspire helps you run your product with one command, instead of 5 terminals and a README.

---

## 🧪 Final Thoughts

Microservices are here to stay—but the way we develop with them has to evolve. `.NET Aspire`, Git submodules, and OpenTelemetry can bridge the gap between independent services and cohesive product delivery.

If you're drowning in `docker-compose.yml` files or juggling 6 terminal windows every time you onboard a new dev, give Aspire a look. You might just enjoy building distributed systems again.


[Back to Home](/) 