---
title: "Amdahl’s Law Is Coming for AI Agents"
description: "What coordination research reveals about the hype around armies of AI agents, and how Amdahl’s Law helps explain the limits"
date: "2026-09-19"
author: "Carlos Salamanca"
categories: ["Software Engineering", "AI"]
slug: "amdahls-law-ai-agents"
---

# Amdahl’s Law Is Coming for AI Agents

An “army of agents” makes for a compelling pitch. Give each agent a role, launch dozens of them, and watch the work happen in parallel. Once one agent can write code, use tools, and complete tasks, a hundred of them sounds like a substantial upgrade.

The pitch gets ahead of the engineering when agent count becomes evidence of productivity. Launching a hundred agents demonstrates that a system can launch a hundred agents. It leaves open the harder questions: how much useful work did they complete, at what cost, and how much of it survived integration and review?

Research on multi-agent coordination gives us reason to challenge that assumption. The results show that adding agents can help considerably on some tasks and make performance worse on others. The structure of the work matters, and communication does not automatically turn a collection of capable agents into a capable team.

Amdahl’s Law offers a useful way to interpret that pattern.

## A browser built by hundreds of agents

Cursor’s browser experiment gives the pitch a concrete result to examine. The team reported hundreds of agents working concurrently on a browser codebase for nearly a week, producing over a million lines of code. Building a browser is substantial technical work, and this is evidence that large agent teams can make progress on a complex shared project. [Cursor’s initial report](https://cursor.com/blog/scaling-agents)

Cursor describes the browser as research, not intended for external use. That establishes a capability experiment; it leaves its practical value as a product untested. [Cursor’s technical follow-up](https://cursor.com/blog/self-driving-codebases)

The coordination findings are particularly relevant. Lock contention reduced 20 agents to the throughput of roughly one to three. A central integrator bottlenecked hundreds of workers and was removed. Requiring correctness at every commit also slowed progress. The final design used hierarchical planners and focused workers, accepting a reportedly small, stable error rate. Cursor ultimately reported useful linear scaling of token throughput. [Cursor’s coordination findings](https://cursor.com/blog/self-driving-codebases)

That is a positive result, achieved through repeated coordination redesign. Token throughput alone, however, does not establish a proportional gain in verified software delivery. The experiment supports the potential of large agent teams while exposing the engineering and correctness trade-offs behind that potential.

## What the benchmarks show

[SILO-BENCH](https://aclanthology.org/2026.acl-long.1354/), published at ACL 2026, evaluates agents working with information split among them on algorithmic tasks. Across 1,620 experiments, researchers observed a gap between active communication and successful distributed computation. On the benchmark’s most complex class of tasks, the tested systems achieved zero success beyond 50 agents.

That is a significant problem for the army-of-agents premise. The agents were communicating, but their exchanges did not reliably produce a correct collective result. More participants and more messages were insufficient to solve the coordination problem.

[A Google Research study of 180 agent configurations](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/) makes the dependency on task structure particularly clear. Centralized coordination improved performance by about 81% relative to a single agent on Finance-Agent, a parallelizable financial-reasoning benchmark. On PlanCraft, a sequential planning benchmark, every multi-agent architecture tested performed worse than the single-agent baseline, with relative declines of 39% to 70%.

The positive result matters just as much as the negative one. Parallel agents can be valuable. But the benefit depends on whether the task can be divided effectively. “More agents” is an incomplete explanation for why a system should perform better.

In [LLM-Coordination](https://aclanthology.org/2025.findings-naacl.448/), Agashe and colleagues studied coordination games and found another limitation: agents did better when coordination depended primarily on environmental information. They struggled when success required considering their partners’ beliefs and intentions.

These benchmarks do not establish a universal ceiling for agent teams, and they do not directly measure the productivity of a software organization. They do challenge the assumption that useful collaboration follows naturally from launching more agents and giving them a way to talk.

## Amdahl’s Law is a useful lens

Amdahl’s Law comes from parallel computing. For a fixed workload, the speedup from adding processors is limited by the portion that must still execute sequentially.

Suppose 90% of a program can run in parallel, while the remaining 10% must run sequentially. Even with infinitely many processors, that sequential 10% remains. The theoretical maximum speedup is 10x, before accounting for coordination overhead.

The connection to agents is the dependency structure. Additional workers help where work can proceed independently. They cannot eliminate the decisions and intermediate results that other work must wait for.

The benchmark results cited above concern task success rather than execution speed, so they do not prove that agent systems obey a particular Amdahl-style scaling curve. The interpretation is narrower: the contrast between parallelizable and sequential tasks is consistent with a familiar constraint on parallel work. Cursor’s discarded integrator illustrates an architectural bottleneck that could be removed. Its removal also shows why these results should not be read as a fixed ceiling on what agent teams can achieve.

How much can be divided matters more than how many workers are available to divide it among.

That is the missing qualification in the army-of-agents pitch.

## Software work only looks independent from a distance

Imagine a project divided among agents. One handles authentication, another changes the database schema, another implements an API, and another builds the UI. Each has a task. Each can start producing code.

Then the authentication agent makes a decision that changes the API contract. The API agent was working against the previous assumption. The database agent changes a model used by both. Two agents introduce different abstractions for the same concept. Another discovers an ambiguity in the requirements that affects ten other tasks.

Now some of the work has to stop. A decision has to be made, assumptions have to be updated, and conflicting implementations have to be reconciled. Eventually, the system has to be integrated and verified.

Assigning separate tasks did not make those tasks independent.

This is where the Amdahl interpretation becomes useful in practice. Accelerating implementation exposes the decisions and dependencies that implementation was waiting on. A dashboard full of busy agents can conceal how much work still depends on the same unresolved question.

## Adding agents can also add work

The simple Amdahl model may even be too generous. It assumes the original sequential work stays fixed. Agent coordination can introduce additional work as the group grows.

The Google study reported a [tool-coordination trade-off](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/): coordination costs grew disproportionately as tasks required more tools. Independent agents also amplified errors more than centrally coordinated ones in the experiments.

In software development, the potential costs are easy to recognize. More agents can produce more overlapping changes, more assumptions to reconcile, and more outputs to verify. Some of that work can happen in parallel. Some lands directly on the path everyone else is waiting for.

At some point, another agent may create as much work as it completes. Counting the agents or their generated output will not reveal that crossover. Measuring completed, verified work against a smaller team or a single-agent baseline can.

There is an authority problem here too. Engineering agents may have access to source code, shells, credentials, databases, and external services. Launching dozens of them also means coordinating what they are allowed to change. Isolation, scoped permissions, and clear ownership help preserve the independence the system is counting on.

Those are substantial engineering requirements hidden inside the word “army.”

## What would make the claim convincing?

A convincing demonstration of agent scaling needs to show more than simultaneous activity. It should show that additional agents complete more useful work at an acceptable cost, with integration and verification included in the accounting.

It should also explain why the work scales. Are the requirements explicit? Are interfaces stable? Can each task be checked locally? Which decisions still require synchronization? What happens when two agents make incompatible assumptions?

Clear contracts, modularity, ownership, and good tests already help people work in parallel. They become even more consequential when implementations can be generated faster than the team can settle the decisions behind them.

The research leaves room for substantial gains from parallel agents. It also makes the blanket enthusiasm for simply launching dozens of them difficult to justify. Coordination is part of the problem to be solved, and increasing agent count can make that problem harder.

Amdahl’s Law gives the critique its shape: once the independent work gets faster, the dependencies determine what happens next.

Cursor’s browser shows that hundreds of agents can produce a substantial experimental system. What these reports leave unresolved is how much that scale improves the delivery of reliable software people actually use, once coordination, verification, and cost are counted.
