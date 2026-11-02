# Open Learning Lab: Evidence-Driven Personalized Learning Policies

*Chapter III · Human Agency, Older People’s Independence and Lifelong Play — By Domi Jin (August 2026)*

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

See [studies/marin](https://github.com/domijin/open-learning-lab/blob/main/studies/marin/README.md).

## Checkpointing a learning session

Keep the primary learning conversation as the uninterrupted timeline. At a meaningful learning checkpoint, branch the conversation and run [`checkpoint-capture/v0.1`](https://github.com/domijin/open-learning-lab/blob/main/prompts/checkpoint-capture.md). The side branch records the trace and evidence, opens a reviewable GitHub change, then returns control to the main learning session.

See [prompts/README.md](https://github.com/domijin/open-learning-lab/blob/main/prompts/README.md) for the workflow.

## Contributing

You can contribute as a learner, domain expert, educator, learning-science researcher, or agent builder. The cheapest useful contribution is often a challenge to a claim or experimental design—not a full lesson.

Read [CHARTER.md](https://github.com/domijin/open-learning-lab/blob/main/CHARTER.md), [CONTRIBUTING.md](https://github.com/domijin/open-learning-lab/blob/main/CONTRIBUTING.md), and [AGENTS.md](https://github.com/domijin/open-learning-lab/blob/main/AGENTS.md).

## Status

**v0 / bootstrap.** Research protocol first; product UI later, when real workflow pain tells us what to build.

Dual licensed: **MIT for software** and **CC BY 4.0 for learning/research content**. See [docs/licensing.md](https://github.com/domijin/open-learning-lab/blob/main/docs/licensing.md).

---
*Footnote: First published in [GitHub Specification (open-learning-lab)](https://github.com/domijin/open-learning-lab) (August 2026).*
