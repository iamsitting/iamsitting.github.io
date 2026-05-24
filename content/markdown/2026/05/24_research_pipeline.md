---
title: "AI Is Changing Research, but Not in the Way Most People Think"
description: "How AI-assisted workflows reduce research friction while preserving human responsibility for judgment and conclusions"
date: "2026-05-24"
author: "Carlos Salamanca"
category: ["AI", "Research"]
slug: "ai-changing-research-operational-abstraction"
---

# AI Is Changing Research — But Not in the Way Most People Think

Over the past year, I have been experimenting with an AI-assisted research workflow for graduate research, technical writing, and knowledge synthesis. It is not a workflow where AI "does the research"; it is a workflow where AI reduces operational overhead so the researcher can focus on the parts of research that actually matter most:

* literature review
* research design
* critical analysis
* interpretation
* execution

There is a tendency in AI discussions to frame the technology in extremes:

* AI will replace researchers
* AI will destroy academia
* AI-generated content is inherently low quality
* or conversely, AI will automate knowledge work entirely

I think all of these perspectives miss what is actually happening. The real shift is not replacement, but abstraction.

## Research Has Operational Workflows Too

As a software engineer, I cannot help but notice how similar modern research workflows are becoming to software development workflows.

Software engineering evolved through layers of abstraction:

* assembly → high-level languages
* manual deployment → CI/CD
* hand-written SQL → ORMs
* manual infrastructure → infrastructure as code

These abstractions did not eliminate engineers.

They changed where engineers spent cognitive effort.

Instead of managing memory manually, engineers could focus on architecture.
Instead of manually provisioning servers, teams could focus on systems design.
Instead of hand-writing boilerplate, developers could focus on business logic.

Research appears to be entering a similar transition.

Much of research is not purely intellectual discovery. A significant portion is operational work:

* searching for papers
* organizing references
* formatting citations
* summarizing literature
* categorizing findings
* transforming notes into drafts
* managing document structures

These tasks are important, but they are not necessarily where the highest scholarly value is created.

## My Current Workflow

The workflow I have been experimenting with looks something like this:

```text
AI Research Search Engines (e.g., Scopus AI, aka AI Discovery)
        ↓
Paper Collection + Zotero
        ↓
NotebookLM for Synthesis
        ↓
Markdown + Git for Long-Term Notes
        ↓
Python for Analysis
        ↓
Typst + GitHub Copilot for Writing
```

Each tool serves a distinct purpose.

### Discovery

AI-powered research engines, such as Scopus AI (aka AI Discovery), help surface relevant literature, citation graphs, and related work faster than traditional keyword-only searching.

But discovery still requires human judgment.

AI can help retrieve papers.
It cannot determine methodological quality, theoretical rigor, or whether a source actually belongs in a literature review.

That responsibility still belongs to the researcher.

### Synthesis

This is where tools like NotebookLM become genuinely interesting.

Once you upload a curated corpus of papers, AI becomes less of a “chatbot” and more of a bounded research assistant operating against a constrained knowledge base.

That distinction matters.

The value is not that AI magically understands your field.
The value is that it can accelerate:

* comparative synthesis
* theme extraction
* contradiction identification
* terminology normalization
* summarization across multiple sources

In other words, it helps compress the mechanical effort required to navigate large volumes of information.

### Analysis

For empirical work, Python remains essential.

This is where reproducibility, statistics, visualization, and validation happen.

Ironically, this is also where human understanding becomes even more important.

AI can assist with code generation and statistical tooling, but interpretation of results remains fundamentally human work.

### Production

For writing, I have been exploring Typst alongside GitHub Copilot.

Typst provides deterministic, structured document rendering similar to LaTeX, but with a more modern authoring experience.

The important distinction is this: AI assists with drafting and formatting acceleration, but the structure, arguments, and conclusions still require deliberate authorship.

## The Most Important Distinction

I do not think AI is replacing scholarship. I think it is compressing operational friction, and that is a very different claim.

The danger in modern AI discourse is assuming that all cognitive tasks are equal. They are not.

There is a major difference between:

* retrieving information
* organizing information
* synthesizing information
* interpreting information
* generating conclusions

Current AI systems are increasingly strong at the first three.
They remain unreliable at the last two without significant human oversight.

That boundary matters academically and professionally.

## The Risk Nobody Talks About

The biggest danger is not hallucination; it is premature synthesis.

AI is extremely good at generating coherent narratives from incomplete evidence.

In research, that is dangerous.

Especially in emerging fields where:

* terminology is unstable
* evidence is limited
* hype cycles distort perception
* empirical validation is still immature

A well-written AI summary can create the illusion of consensus where none actually exists.

Which means researchers using AI must become even more disciplined about:

* source validation
* methodological critique
* contradiction analysis
* evidence quality
* epistemic humility

AI lowers operational cost, but it does not lower the burden of intellectual responsibility.

## Where I Think This Is Going

I increasingly believe the future of research will involve layered human-AI collaboration: not autonomous AI researchers, and not purely manual workflows, but systems where:

* AI assists retrieval
* AI accelerates synthesis
* AI reduces mechanical overhead
* humans remain responsible for judgment, methodology, and conclusions

We have seen this pattern before in software: better tools removed manual overhead, but engineers were still responsible for architecture, tradeoffs, and outcomes.

I think research is moving in the same direction. AI can speed up retrieval and synthesis, but researchers still own the judgment, methodology, and conclusions.
