---
title: "Correlating Hangfire Background Jobs with HTTP Requests Using Datadog and .NET"
description: "Correlating Hangfire background jobs with their originating HTTP requests in Datadog"
date: "2025-03-04"
author: "Carlos Salamanca"
category: ["Software Engineering"]
slug: "correlating-hangfire-jobs-http-requests-datadog"
---

# Correlating Hangfire Background Jobs with HTTP Requests Using Datadog and .NET

While adding observability to a .NET web application, I found that Datadog could show the incoming HTTP request and the Hangfire job it queued, but only as unrelated traces. The data existed; the connection between the two did not.

> **Traces from my background jobs weren't correlated with the original HTTP requests.**

The fix was to carry the active trace context into Hangfire's job parameters and restore it when the job began.

---

## The problem: disconnected traces

In a typical setup:

- An HTTP request comes in.
- You queue a background job to do some work (via Hangfire).
- That job executes *later*, often on a different thread or even a different machine.

If you're using **Datadog APM**, the default behavior is:

- The HTTP request gets a trace.
- The background job gets a *separate trace*.
- An engineer investigating the request has to connect them manually.

The HTTP execution context ends before the queued work begins. Unless the trace context crosses that boundary explicitly, the job starts a new trace.

---

## Traces, spans, and context

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

## Passing the context through Hangfire

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

## What this clarified for me

### 1. Observability is Not Automatic

Just because you're using an APM tool doesn't mean your observability is complete. You still need to be intentional about **propagating context across boundaries** like queues, jobs, and microservices.

### 2. Traces and Logs Are Not the Same

You might be logging a `trace_id`, but unless that ID is part of a real, active trace context — **your traces won't be linked**.

### 3. Spans Must Be Linked Explicitly

Creating a new span doesn't mean it's part of an existing trace. To link spans, you must **pass the parent context** — either via headers (in web requests), or job metadata (like we did).

### 4. Tags Help Humans, Context Helps Systems

Setting `dd.trace_id` as a tag is helpful for searching, but it's not enough to link spans. **Tags are for you; context is for the APM**.

---

## Why not OpenTelemetry?

Yes, OpenTelemetry could help standardize this, and Datadog supports OTLP ingestion. But:

- OpenTelemetry is still evolving in .NET
- Datadog's native SDK offers powerful control
- This solution works now — and plays well with Datadog's UI

That said, the principles here still apply if you're using OTEL — it just changes **how** you carry and restore context.

---

## The result

After this change, a request and its background work appear as one trace in Datadog. The useful lesson was narrower than “add more observability”: data collected on both sides of an asynchronous boundary is not connected unless the context crosses that boundary too.
