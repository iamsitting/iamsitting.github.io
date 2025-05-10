---
title: "Correlating Hangfire Background Jobs with HTTP Requests Using Datadog and .NET"
description: "Let's look at how to correlate hangfire jobs with http requests using datadog"
date: "2025-03-04"
author: "Carlos Salamanca"
category: "Software Engineering"
slug: "correlating-hangfire-jobs-http-requests-datadog"
---

# Correlating Hangfire Background Jobs with HTTP Requests Using Datadog and .NET

Distributed tracing can feel like magic — until it doesn't work.

Recently, while integrating observability into a .NET web app using **Datadog**, I hit a wall. I had traces from HTTP requests. I had logs. I had background jobs running through **Hangfire**. But there was one crucial gap:

> **Traces from my background jobs weren't correlated with the original HTTP requests.**

Here's how I fixed it, and more importantly — **what I learned about tracing and observability along the way**.

---

## 🤯 The Problem: Disconnected Traces

In a typical setup:

- An HTTP request comes in.
- You queue a background job to do some work (via Hangfire).
- That job executes *later*, often on a different thread or even a different machine.

If you're using **Datadog APM**, the default behavior is:

- The HTTP request gets a trace.
- The background job gets a *separate trace*.
- You, the human, get lost trying to connect the dots.

That's because **traces don't magically carry over**. Unless you explicitly pass trace context, each job runs in its own isolated observability bubble.

---

## 🧠 A Quick Primer on Traces, Spans, and Context

If you're new to distributed tracing, here's what you need to know:

- A **trace** represents the full journey of a request through a system.
- A **span** is a single unit of work (e.g., an HTTP handler, a DB call, or a background job).
- Every span has:
  - A `trace_id` (identifying the whole trace)
  - A `span_id` (identifying the specific work)
  - A `parent_span_id` (the span that called it)

To connect your background job to the original HTTP request, you need to:

1. **Capture the trace and span info when queuing the job**
2. **Rehydrate that context when the job executes**
3. **Start a new span as a child of the original span**

---

## 🛠 The Solution in .NET with Hangfire and Datadog

### Step 1: Capture the Trace Context

When queuing a background job, we extract the current trace context using `Datadog.Trace` and save it to Hangfire's Job Parameters:

```csharp
public string Enqueue(BackgroundJob job) : IBackgroundJobQueuer
{
    var jobId = _backgroundJobClient.Enqueue(p => p.Process(job));

    var scope = Tracer.Instance.ActiveScope;
    if (scope != null)
    {
        var traceId = scope.Span.TraceId.ToString();
        var spanId = scope.Span.SpanId.ToString();

        using var connection = JobStorage.Current.GetConnection();
        connection.SetJobParameter(jobId, "TraceId", traceId);
        connection.SetJobParameter(jobId, "ParentSpanId", spanId);
    }

    return jobId;
}
```

---

### Step 2: Create a Hangfire Filter to Restore the Context

Before the background job runs, we use a `IServerFilter` to start a new span linked to the original trace:

```csharp
public sealed class DatadogTracingFilter : IServerFilter
{
    private const string ScopeKey = "DatadogScope";

    public void OnPerforming(PerformingContext context)
    {
        var traceIdStr = context.Connection.GetJobParameter(context.BackgroundJob.Id, "TraceId");
        var parentSpanIdStr = context.Connection.GetJobParameter(context.BackgroundJob.Id, "ParentSpanId");

        if (ulong.TryParse(traceIdStr, out var traceId) &&
            ulong.TryParse(parentSpanIdStr, out var parentSpanId))
        {
            var tracer = Tracer.Instance;

            var settings = new SpanCreationSettings
            {
                Parent = new SpanContext(traceId, parentSpanId)
            };

            var scope = tracer.StartActive("background.job", settings);
            scope.Span.ResourceName = context.BackgroundJob.Job.Type.Name;
            scope.Span.SetTag("hangfire.job_id", context.BackgroundJob.Id);
            scope.Span.SetTag("background.job_type", context.BackgroundJob.Job.Type.FullName);
            scope.Span.SetTag("dd.trace_id", traceIdStr);

            context.Items[ScopeKey] = scope;
        }
    }

    public void OnPerformed(PerformedContext context)
    {
        if (context.Items.TryGetValue(ScopeKey, out var scopeObj) && scopeObj is Scope scope)
        {
            scope.Dispose();
        }
    }
}
```

---

### Step 3: Register the Filter

Make sure this filter is registered globally in your Hangfire setup:

```csharp
GlobalJobFilters.Filters.Add(new DatadogTracingFilter());
```

---

## 🧭 What I Learned (That Applies Beyond .NET)

### 1. Observability is Not Automatic

Just because you're using an APM tool doesn't mean your observability is complete. You still need to be intentional about **propagating context across boundaries** like queues, jobs, and microservices.

### 2. Traces and Logs Are Not the Same

You might be logging a `trace_id`, but unless that ID is part of a real, active trace context — **your traces won't be linked**.

### 3. Spans Must Be Linked Explicitly

Creating a new span doesn't mean it's part of an existing trace. To link spans, you must **pass the parent context** — either via headers (in web requests), or job metadata (like we did).

### 4. Tags Help Humans, Context Helps Systems

Setting `dd.trace_id` as a tag is helpful for searching, but it's not enough to link spans. **Tags are for you; context is for the APM**.

---

## 📦 Bonus: Why Not OpenTelemetry?

Yes, OpenTelemetry could help standardize this, and Datadog supports OTLP ingestion. But:

- OpenTelemetry is still evolving in .NET
- Datadog's native SDK offers powerful control
- This solution works now — and plays well with Datadog's UI

That said, the principles here still apply if you're using OTEL — it just changes **how** you carry and restore context.

---

## 🔚 Final Thoughts

Getting this working took some deep dives — not just into code, but into how distributed tracing *really works*. But now, when I look at a trace in Datadog and see an HTTP request linked cleanly to a background job, it feels worth it.

> Observability isn't just about capturing data — it's about **connecting it**.

---

👋 Have questions or want to see how this fits into your stack? Reach out or leave a comment!

[Back to Home](/) 