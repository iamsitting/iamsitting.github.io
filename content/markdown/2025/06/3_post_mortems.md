---
title: "Rethinking the Post-Mortem"
description: "Let's take a look at post-mortems"
date: "2025-06-03"
author: "Carlos Salamanca"
category: ["Software Engineering"]
slug: "rethinking-the-post-mortem"
---

# Rethinking the Post-Mortem

We had an incident recently.

It wasn't catastrophic. No alerts blazing through the night. No major outages. But it was enough to interrupt normal operations, and enough to ask, "What went wrong here?"

Like most teams aiming for reliability, we followed up with a post-mortem.

The name always feels a bit dramatic to me. *Post-mortem.* It carries the tone of something final. Clinical. Like something died and now it's time to dissect it.

But that's not what we were doing.

We weren't examining a corpse. We were reviewing a system, *a living, evolving system*, that buckled under pressure. And more importantly, we were looking at **how we contributed to that pressure**.

---

## The Process Isn't Optional

The post-mortem process itself isn't comfortable. It requires slowing down. Rewinding. Confronting decisions we made with good intentions but bad assumptions. It means recognizing where process was missing, or where we chose to bypass it.

But this discomfort is necessary. Because if you're building anything complex, failure isn't optional. It's inevitable. The difference is whether you treat it as a setback or an opportunity.

In our case, it wasn't a single misstep. It was a chain of issues:  
- Overconfidence in how far our current systems could stretch  
- Underutilizing the expertise of our technical partners  
- Gaps in handoffs and unclear ownership  

The system didn't fail us. *We failed to support the system.*

---

## Scaling Means Supporting the System

As I was reflecting on the incident, a line from *The Art of Scalability* stood out:

> "Scalable systems depend on scalable processes."

It's simple, but it's deeply true.

You can write solid code. Deploy it with confidence. Monitor it with the best tools. But if your team doesn't have the process to support growth, even a well-built system can break under its own weight.

That's what the post-mortem helps reveal. Not just what broke, but *why it was able to break in that particular way*.

And once you start seeing it through that lens, the post-mortem stops being a reaction to failure, and starts becoming a tool for designing better systems.

---

## Not Looking Back, Looking Ahead

So maybe *post-mortem* isn't the right word for what this really is.

We didn't lose something. We learned something.

We identified pressure points. We surfaced blind spots. And we made changes to keep the next version of the system more resilient than the last.

That's not about blame. That's about **building forward**.

And in any team serious about scale, that's the only direction worth going.