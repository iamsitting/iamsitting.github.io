---
title: "Scaling Out"
description: "Concepts on scaling out"
date: "2025-07-26"
author: "Carlos Salamanca"
category: ["Software Engineering"]
slug: "scaling-out"
---

# Scaling Out

If you’ve ever had a web app get slower as traffic increases, you’ve already brushed up against a core problem in software engineering: how do we scale?

There are two major ways to scale a system:  
**Scaling up** (vertical scaling) and **scaling out** (horizontal scaling). 

Let’s break those down real quick.

- **Scaling up** means upgrading your server. Add more CPU. Add more memory. You’re trying to beef up a single machine to handle more load.
- **Scaling out** means adding more machines (or containers, or processes). Instead of making one server stronger, you create more instances of the same server and distribute the load.

Scaling up is simple but limited—you’ll eventually max out what one machine can do. Scaling out is more flexible and resilient, but it comes with design trade-offs you have to plan for. And that’s what this article is about.

## How Scaling Out Works in the Cloud

In a cloud environment like Azure, AWS, or Google Cloud, scaling out typically involves creating **multiple instances** of your app. These could be containers in Kubernetes, App Service instances, or EC2 machines.

But here’s the key piece: you’re not routing traffic to these instances yourself.

Instead, a **load balancer** sits in front of them. The load balancer receives incoming traffic and distributes it across the available instances. It might do this based on round-robin, least connections, or even geographic proximity—but those details are out of scope for now.

The important thing is this:  
> When you scale out, **your users aren't guaranteed to hit the same server twice**.

That sounds obvious, but it changes everything. If your app stores anything locally—files, memory, scheduled tasks—you need to rethink how those things work across multiple instances.

Let’s look at a few concrete examples.

## A Basic Example: File Storage

Imagine you have a simple app that lets users upload profile pictures. Nothing fancy. Maybe it's running on a single server, and every file upload just gets saved to a local folder on disk:

```
/uploads/user-123/avatar.jpg
```

This works great—until it doesn't.

Let’s say your app starts to grow. You add more servers behind a load balancer to keep up with demand. Now, a user might upload their image on **Server A**, but then refresh the page and get routed to **Server B**. Uh-oh—Server B doesn’t have that file, because it was saved locally on Server A.

### The Fix: Shared Remote Storage

This is where **shared file storage** comes in. Instead of writing files to the local disk, write them to a centralized location like AWS S3, Azure Blob Storage, or a shared NFS. Now it doesn’t matter which server handles the request—everyone can access the same file store.

### Why This Matters

This design change might feel small, but it’s the foundation of building systems that can scale out cleanly. You have to **design for multiple instances** from the start. Otherwise, your app will break the moment you move beyond a single machine.

Now, let’s look at an example that’s a bit more sneaky.

## A Subtle Example: In-Memory Cron Jobs

Let’s say you have a background job that runs every hour to clean up expired records. Seems harmless enough. In Node, you might use something like `node-cron`, or in .NET maybe just a `Timer` or a hosted background service.

It looks something like this:

**Node.js (using `node-cron`)**
```javascript
const cron = require('node-cron');

cron.schedule('0 * * * *', () => {
  deleteExpiredRecords();
});
```

**.NET (using `IHostedService`)**
```csharp
public class CleanupService : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DeleteExpiredRecords, null, TimeSpan.Zero, TimeSpan.FromHours(1));
        return Task.CompletedTask;
    }

    private void DeleteExpiredRecords(object? state)
    {
        // Cleanup logic here
    }
}
```

This works perfectly… until you scale out.

### What Happens When You Scale Out?

Now that you’ve added multiple instances of your app, **every instance runs the same job** at the same time. If you have five servers, that job runs five times. That might be okay—or it might cause race conditions, database contention, or just unnecessary work.

This one bit me early in my career. I was working on a customer notifications system, and the reminder emails started going out five times an hour. One for each app server. The fix? A better design for distributed jobs.

### The Fix: Centralized Job Scheduling

Instead of running cron jobs in memory, you can move job scheduling and execution to a **centralized queue**—something like Redis, SQL Server, or a dedicated message broker. The idea is simple: only one worker (or one instance at a time) should run the job.

Let’s see how this looks in practice.

#### Node.js with BullMQ (Redis-backed)
```javascript
import { Queue, Worker } from 'bullmq';

const queue = new Queue('cleanup-jobs', { connection: { host: 'localhost', port: 6379 } });

// Schedule a job once per hour
await queue.add('delete-expired', {}, { repeat: { cron: '0 * * * *' } });

// A worker picks it up – only one runs the job
const worker = new Worker('cleanup-jobs', async job => {
  if (job.name === 'delete-expired') {
    await deleteExpiredRecords();
  }
});
```

#### .NET with Hangfire (SQL-backed)
```csharp
RecurringJob.AddOrUpdate(
    "delete-expired-records",
    () => DeleteExpiredRecords(),
    Cron.Hourly
);
```

Both BullMQ and Hangfire take care of **distributed locking**. You can have many app instances running, but only one will pick up and run the job.

## Final Thoughts

Scaling out is powerful, but only if your application is **designed** for it. That’s the key takeaway. Problems like shared file systems or duplicate cron jobs aren’t bugs—they’re symptoms of a design that assumes one instance.

And scaling out breaks that assumption.

So if you’re starting a new app—or refactoring an old one—take a moment to ask:  
> What happens when I run two of these at once?

Design for that. Test for that.  
Because if your app is successful, it’s not a question of *if* you’ll need to scale. It’s just a question of *when*.