---
title: "What Rewriting with AI Taught Me"
description: "A reflection on rewriting a legacy system with AI and the tradeoffs that became clear along the way"
date: "2026-03-14"
author: "Carlos Salamanca"
category: ["Software Engineering"]
slug: "what-rewriting-with-ai-taught-me"
---

# What Rewriting with AI Taught Me

Over the last six months, I’ve been deep in a rewrite.

Not a greenfield build. Not a careful evolution. A rewrite of a system I didn’t design, built on top of decisions I didn’t make, with constraints that weren’t going away. The kind of work where understanding why something exists is often harder than changing it.

The motivation was straightforward: the existing foundation had reached a dead end. Upgrading wasn’t realistic, and continuing forward meant owning the problem ourselves.

What changed this time wasn’t just the work—it was how I approached it.

I leaned heavily on AI.

## How AI Shifted the Work

At first, it was tactical: helping reverse engineer legacy flows, tracing through brittle logic, and generating rough explanations of what the system was doing. But over time, it became more structural. AI assisted in migrating business logic, scaffolding tests around fragile areas, reviewing changes, and even suggesting when a feature should be rethought instead of ported.

A few things became clear along the way.

## 1) You’re always trading quality for velocity

I had to lower my standards in some areas. Not recklessly, but intentionally. Perfect code wasn’t the goal—forward progress was. The difference now is that iteration is cheap. When something isn’t quite right, fixing it later is faster than over-optimizing upfront.

## 2) Guardrails matter more than ever

I started relying on simple markdown files to define architecture, patterns, and conventions. These became the “source of truth” for both me and the AI. Without them, output drifted. With them, consistency improved dramatically.

## 3) Scale improves output

As the codebase grew, the quality of AI-generated suggestions improved. More context meant better alignment. The system started to “feel” more coherent—not because the original code was good, but because there was enough surface area to infer intent.

## 4) Generated work is cheap to fix

Documentation, tests, even entire chunks of code—when they were off, they were quick to correct. The cost of being wrong dropped significantly. That changed how I evaluated “good enough.”

## 5) Bad code is less of a liability than it used to be

This was the biggest shift for me. AI is surprisingly effective at reading and working with messy, inconsistent code. The burden of understanding bad code has decreased.
But that doesn’t mean structure doesn’t matter.
If anything, it matters more.

## The Core Shift

Design patterns, architecture, and conventions are now the leverage points. They shape how both humans and AI interact with the system. They determine whether the codebase compounds in clarity or entropy.
The takeaway is a bit counterintuitive:
Bad code matters less.
Good structure matters more.
That’s the tradeoff I’ve been operating in, and it’s changed how I think about building and maintaining systems going forward.