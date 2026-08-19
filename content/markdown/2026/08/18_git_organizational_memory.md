---
title: "Git as Organizational Memory"
description: "How versioned specifications and decision records give teams a durable memory without returning to waterfall"
date: "2026-08-18"
author: "Carlos Salamanca"
category: ["Software Engineering", "AI"]
slug: "git-organizational-memory"
---

# Git as Organizational Memory

Most software teams can tell you what a system does. Far fewer can tell you why it does it that way.

The answer may have lived in a meeting, a Slack thread, or the memory of an engineer who has since left. The code preserves the outcome, but usually not the reasoning behind it.

Spec-driven development is beginning to change that.

The term is still loose, but the basic idea is simple: write down the intended behavior before asking an AI agent to implement it. The specification becomes shared context for the developer and the agent. In a [useful breakdown of the current tools](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html), Birgitta Böckeler distinguishes between specs that exist only for the initial task and specs that remain attached to a feature as it evolves.

That second form has consequences beyond AI-assisted development. Once specifications live beside the code and remain after implementation, the repository starts to hold the team's memory.

## The missing half of the codebase

Code shows which decision survived. It rarely shows which alternatives were considered, what constraints mattered at the time, or which trade-off the team knowingly accepted.

[Architectural Decision Records](https://adr.github.io/) address this directly. An ADR records one significant decision along with its rationale, trade-offs, and consequences. A collection of ADRs becomes a decision log.

Put that log in Git and it gains properties that ordinary documentation often lacks:

- A decision can be reviewed with the code it affects.
- Its history shows when and why it changed.
- A diff makes disagreement and refinement visible.
- An outdated decision can be superseded without erasing the original context.
- The same material is available to engineers and coding agents.

This is more useful than a polished architecture document that describes the system as if it arrived fully formed. Real systems are accumulated decisions. Their documentation should preserve that movement.

## Agile waterfall?

There is an obvious objection here: this sounds like waterfall.

And it can be. Give a team a large template, ask them to predict the whole system, and treat the result as a contract. Now waterfall lives in Markdown.

But that is not what interests me about this.

Documentation is becoming cheap. It can be drafted from a conversation, updated with the implementation, reviewed in the same pull request, and corrected with a visible diff. It does not have to be complete before the work begins. It just has to reflect what the team believes today.

That feels much closer to agile development than waterfall. Make a decision. Write it down. Build something. Learn that part of the decision was wrong. Change both the software and the record.

The document moves because the system moves.

## Maybe self-documenting can finally mean something

We have called readable code “self-documenting” for years. I have never found that completely convincing. A good function name might tell me what the code does. It cannot tell me about the production incident that shaped it, the alternative the team rejected, or the customer constraint that no longer looks obvious five years later.

But we may be getting close to something more literal.

Imagine opening an unfamiliar repository and finding more than code. The feature specs are there. The major decisions are there. You can see when an assumption changed and which implementation changed with it. An AI agent can read the same history, compare it with the current system, and point out where the two have drifted apart.

That is genuinely exciting to me because so much of maintaining legacy software is archaeology. The system works, but nobody is quite sure why. Engineers trace old branches, search abandoned tickets, and ask whether the strange-looking code is accidental or load-bearing.

What if less of that context disappeared in the first place?

This will not make legacy systems easy. Records will still drift. Teams will still make bad decisions and write incomplete explanations. Generated documentation can create a convincing account that is simply wrong. Someone still has to review it and keep it honest.

Still, the maintenance cost is different now. Updating a decision record no longer has to become a separate documentation project. It can be part of the change itself. If that habit sticks, every pull request can leave the system a little easier to understand than it found it.

The immediate promise of spec-driven development is better AI-generated code. The bigger possibility is software that carries more of its own history—and legacy systems that are inherited with memory instead of just source files.
