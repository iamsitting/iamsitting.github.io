---
title: "Designing for Asynchronous Work"
description: "Why scalable systems shift from request-bound workflows to background jobs and event-driven design"
date: "2026-03-14"
author: "Carlos Salamanca"
category: ["Software Engineering"]
slug: "designing-for-asynchronous-work"
---

# Designing for Asynchronous Work

Let us start with a real problem.

Your app is doing fine with a few hundred users and a few hundred records.

Then the business grows.

Now admins manage thousands of users and tens of thousands of records. They click "Export all data". They run integrity checks across the whole dataset. They trigger backfills and compliance reports.

Everything still works, technically. But now those operations are slow, fragile, and painful.

This is where most teams reach for the usual playbook:

- Scale out
- Scale up
- Add batching

Those can help, but they do not solve the core problem by themselves.

Scale out is not the solution when load is not the bottleneck. If the issue is one huge workflow per request, adding more replicas just gives you more replicas doing long, expensive work.

Scale up is not the solution when speed is the bottleneck. Bigger machines add capacity, but they do not magically make large data scans fast enough for interactive request timeouts.

Batching helps, but it introduces its own constraints. If batch size is too big, memory pressure spikes. If batch size is too small, runtime explodes. You still have a request lifecycle trying to carry work that should not live there.

That is the real architectural pivot:

> The problem is not only compute. The problem is where the work lives.

Once you see that, asynchronous design stops being a "nice to have" and becomes a system boundary decision.

---

## Why We End Up Here

Most of us learn in a synchronous mental model:

Do A.
Wait.
Do B.

The web reinforces this model:

Client sends request.
Server does work.
Server sends response.

Simple. Clean. Intuitive.

In Node.js, a common endpoint looks like this:

```javascript
app.post("/checkout", async (req, res) => {
	const order = await createOrder(req.body);
	await processPayment(order);
	await sendReceipt(order);

	res.json({
		orderId: order.id,
		status: "complete",
	});
});
```

Even with async I/O, the workflow is still logically synchronous: each step waits for the previous one, and the request owns all the work.

That works great until the work stops being small.

---

## The Request-Response Trap

Now imagine that endpoint is not just "place order."

It also needs to:

- validate inventory
- run fraud checks
- compute tax
- generate invoice PDFs
- send notifications
- update analytics

Or in admin flows:

- export large datasets
- run integrity checks
- compare records across systems
- produce audit artifacts

At that point, request-response becomes a trap.

```text
Client -> Request
          |
          v
     Huge Workflow
          |
          v
       Response
```

Symptoms show up fast:

- long request times
- timeouts and retries
- duplicate operations
- noisy incidents during admin jobs
- unrelated traffic slowing down

The feature is valid. The architecture is misplacing the work.

---

## The Shift: Request Initiates, Workers Execute

Instead of forcing everything into request time, split intent from execution.

The request should capture intent and schedule work. A worker should perform heavy operations.

```javascript
app.post("/exports", async (req, res) => {
	const exportRequest = await createExportRequest(req.body);

	await jobQueue.add("build-export", {
		exportRequestId: exportRequest.id,
	});

	res.status(202).json({
		requestId: exportRequest.id,
		status: "processing",
	});
});
```

Then a worker handles the actual heavy lifting:

```javascript
worker.process("build-export", async (job) => {
	const request = await loadExportRequest(job.data.exportRequestId);

	for await (const chunk of streamExportRows(request)) {
		await appendToExportFile(chunk);
	}

	await markExportAsComplete(request.id);
});
```

Now the lifecycle looks like this:

```text
Client -> Request
          |
          v
   Record + Queue
          |
          v
      Response

Worker -> Process Heavy Job
```

The request is short and predictable. Heavy work can run with retry policies, visibility, and controlled throughput.

---

## Why This Is Better Than "Just Scale"

This design shift solves the right problem.

### 1. It removes long work from request time

Users and APIs are no longer blocked waiting for large data operations.

### 2. It makes scaling options meaningful

Now scaling out workers actually improves throughput, because workers are the right execution boundary.

### 3. It respects the speed constraint

You do not pretend giant data operations are interactive. You treat them as asynchronous workflows.

### 4. It makes batching safe and intentional

Batching still matters, but now you can tune it in worker contexts:

- memory-aware chunk sizes
- backpressure controls
- queue-level concurrency

Instead of hoping one HTTP request can survive all of it.

---

## The Next Step: Reacting to Completion

Once jobs run in the background, the next question is natural:

How do other parts of the system know when work is done?

Polling is one option, but usually not the best one.

```text
Client -> check status
Client -> check status
Client -> check status
```

A cleaner model is event-driven communication.

When work completes, emit an event. Interested consumers react.

```javascript
const EventEmitter = require("events");
const events = new EventEmitter();

async function completeExport(request) {
	await finalizeExport(request.id);
	events.emit("exportCompleted", { requestId: request.id });
}

events.on("exportCompleted", async ({ requestId }) => {
	await notifyAdmin(requestId);
});
```

This decouples responsibilities:

- exporter completes export
- notifier sends email
- audit service records completion

No direct service-to-service choreography in the request path.

---

## A Simple Evolution Model

Think about architecture maturity in three steps:

### 1. Synchronous request-bound work

```text
Request -> Do Work -> Response
```

Great for simple and fast operations.

### 2. Asynchronous background jobs

```text
Request -> Queue Work -> Response
Worker -> Process Job
```

Better for heavy or long-running workflows.

### 3. Event-driven reactions

```text
Worker -> Process Job -> Emit Event
Consumers -> React Independently
```

Best when multiple downstream actions must happen without tight coupling.

---

## Trade-offs You Should Acknowledge

This architecture is better for scale, but it is not free.

You need:

- idempotent job handlers
- retry policies and dead-letter strategies
- observability across queues and workers
- clear status models for clients

You are trading hidden fragility for explicit complexity.

That is usually the right trade.

---

## Final Thought

Request-response is foundational to the web.

It should not dictate where heavy work executes.

If you are handling large exports, integrity checks, and data-wide workflows, this is the key shift:

- stop treating them like interactive request-time tasks
- move them to asynchronous workers
- use events to coordinate downstream reactions

Scale out can help.

Scale up can help.

Batching can help.

But none of them fixes a design where the wrong boundary owns the work.

The breakthrough is architectural:

The request should initiate the work, not contain all of it.
