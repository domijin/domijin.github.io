---
title: "Open Learning Lab: Evidence-Driven Personalized Learning Policies"
author: "Domi Jin (Dongming Jin)"
date: "August 2026"
source: "GitHub (domijin/open-learning-lab)"
original_url: "https://github.com/domijin/open-learning-lab"
local_html: "/articles/github/open-learning-lab.html"
---

> **Repository Mirror & Reference Copy**
> This article is archived directly in [`domijin.github.io`](https://github.com/domijin/domijin.github.io) for preservation and offline inspection.
> - **Original Publication**: [Open Learning Lab: Evidence-Driven Personalized Learning Policies](https://github.com/domijin/open-learning-lab) (GitHub (domijin/open-learning-lab), August 2026)

# Open Learning Lab: Evidence-Driven Personalized Learning Policies

# Open Learning Lab

**Learn something real. Measure whether it lasts. Open the process so others can challenge and improve it.**

Open Learning Lab is an open experiment in evidence-driven personalized learning. It starts with one real learner and one real learning objective, then asks which LLM-mediated learning policies produce durable, transferable capability per unit of learner effort.

The first study uses the active [Marin](https://marin.community/) project as the learning domain.

## North star

> Discover, validate, and operationalize personalized learning policies that maximize durable, transferable capability per unit of learner effort—starting with one learner, while preserving enough provenance that others can reproduce, challenge, and extend the findings.

We optimize learning **outside** the tutoring session, not how fluent or satisfying the conversation feels.

## How the project works

```text
current sources + expert judgment + learner state
                     |
                     v
               learning action
                     |
                     v
                  learner
                     |
                     v
       recall / transfer / calibration
                     |
                     v
        evidence -> policy update -> repeat
```

The public repository is the **research ledger and collaboration surface**. ChatGPT, Claude, Codex, other agents, or humans may act as interfaces. No single model vendor is the platform.

## Research objects

`goal -> hypothesis -> experiment -> observation/evidence -> finding -> decision`

- **Issues** are for proposals and discussion.
- **Pull requests** are for reviewable changes and preregistration.
- **Ledger records** are the durable canonical record.
- Published records are append-only in spirit: corrections supersede; they do not silently rewrite history.

## Experiment 0001: Learn Marin

The first active hypothesis is:

> Asking a learner to make the underlying design judgment before revealing how Marin solved the problem improves later reconstruction and transfer compared with explanation-first learning.

The current session has generated promising observations, but **not a validated finding**. Delayed retrieval and transfer tests are still required.

See [studies/marin](studies/marin/README.md).

## Checkpointing a learning session

Keep the primary learning conversation as the uninterrupted timeline. At a meaningful learning checkpoint, branch the conversation and run [`checkpoint-capture/v0.1`](prompts/checkpoint-capture.md). The side branch records the trace and evidence, opens a reviewable GitHub change, then returns control to the main learning session.

See [prompts/README.md](prompts/README.md) for the workflow.

## Contributing

You can contribute as a learner, domain expert, educator, learning-science researcher, or agent builder. The cheapest useful contribution is often a challenge to a claim or experimental design—not a full lesson.

Read [CHARTER.md](CHARTER.md), [CONTRIBUTING.md](CONTRIBUTING.md), and [AGENTS.md](AGENTS.md).

## Status

**v0 / bootstrap.** Research protocol first; product UI later, when real workflow pain tells us what to build.

Dual licensed: **MIT for software** and **CC BY 4.0 for learning/research content**. See [docs/licensing.md](docs/licensing.md).


---

# Charter

## Mission

Build an open experimental system that learns how an individual learns best, then tests which discoveries generalize.

## North-star outcome

**Durable, transferable capability gained per unit of learner effort.**

Immediate performance, engagement, chat length, and subjective clarity are diagnostics—not the goal.

## A -> B strategy

### A. Optimize one real learner

Start with longitudinal N-of-1 experiments tied to genuine learning goals. The learner receives immediate value while the project accumulates evidence.

### B. Test generalization

Only after an intervention works for the initial learner do we replicate it across other learners, domains, models, and contexts.

Success for learner A is an existence proof, not proof of universality.

## Non-negotiable principles

1. **Behavior over vibes.** Prefer unassisted delayed recall, reconstruction, transfer, and real-world capability over session satisfaction.
2. **Falsifiable claims.** Important interventions attach to hypotheses that can fail.
3. **Exploration != confirmation.** Interesting observations generate hypotheses; fresh evidence confirms them.
4. **Preserve uncertainty.** Record effect size, boundary conditions, contradictions, and confidence where possible.
5. **Failures are evidence.** Negative results remain visible.
6. **Humans contribute judgment.** Expert authority is contextual evidence, never truth by reputation.
7. **Agent-neutral.** The protocol must survive changes in LLM vendor or interface.
8. **Private by default.** Public research artifacts must not require publishing raw private learner conversations.
9. **Append, don't rewrite.** Published findings are superseded by later records rather than silently edited to fit hindsight.
10. **Earn complexity.** New infrastructure must solve observed workflow pain or enable a falsifiable experiment.

## What this project is not

- a chatbot wrapper;
- a generic course generator;
- a flashcard app with an LLM;
- a leaderboard for experts;
- a claim that one learner represents everyone.

## Long-term question

Can the process of discovering effective personalized learning policies become reproducible, evidence-driven, open, and practical enough to be a community commodity?

