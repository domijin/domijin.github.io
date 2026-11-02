# baby-AI: Receipt-Verified Edge Household Agent Architecture

*Chapter III · Human Agency, Older People’s Independence and Lifelong Play — By Domi Jin (May 2026)*

> An open-specs, bounty-style project for an edge-deployed, verbally-trainable
> household agent. Five subsystems, one charter, every claim backed by a
> signed receipt.

## What this is

baby-AI builds toward a small AI that *learns about your household by being
talked to*, runs on hardware that costs less than a phone, and gets better
without ever shipping your data off-device for training.

The work is split across five specs. Each one carries a falsifiable
hypothesis and a numeric metric on a named benchmark — see
[`specs/`](https://github.com/domijin/baby-AI/blob/main/specs/). Code is the means. Signed receipts in
[`receipts/`](https://github.com/domijin/baby-AI/blob/main/receipts/) are the goal.

| Spec | Owns | Headline metric (target) |
| --- | --- | --- |
| [`00-charter`](https://github.com/domijin/baby-AI/blob/main/specs/00-charter.md) | the whole project | — |
| [`01-perception`](https://github.com/domijin/baby-AI/blob/main/specs/01-perception.md) | smart-moment selection | precision@10 ≥ 0.55 |
| [`02-audio`](https://github.com/domijin/baby-AI/blob/main/specs/02-audio.md) | streaming ASR + DoA fusion | +0.10 referent accuracy |
| [`03-memory`](https://github.com/domijin/baby-AI/blob/main/specs/03-memory.md) | hybrid episodic-vector + KG | +0.10 hybrid recall@5 |
| [`04-interaction`](https://github.com/domijin/baby-AI/blob/main/specs/04-interaction.md) | edge VLM + verbal-feedback adapter | ≥ 3 tok/s; +0.20 concept acc |
| [`05-eval`](https://github.com/domijin/baby-AI/blob/main/specs/05-eval.md) | the receipt contract itself | 100% receipt validity |

## Hardware target

The compute floor is intentionally cheap so contributors don't need a lab:

- **Yi Dome 1080p** (Hi3518EV200, ARMv5, ~ USD 30 used) — frame source only.
- **Raspberry Pi 5 16 GB** — stream router, audio, memory, dialogue.
- **Hailo-8L M.2** (13 TOPS, ~ USD 70) — VLM + embedding inference.
- **ReSpeaker 4-Mic Array** — audio capture + direction-of-arrival.

Off-device GPU (RTX 4070-class) is used only for periodic adapter
training. The full envelope and tier IDs live in
[`specs/00-charter.md`](https://github.com/domijin/baby-AI/blob/main/specs/00-charter.md).

## SOTA anchors

Each spec cites its load-bearing references; the project as a whole stands
on top of these (circa 2025–2026):

SmolVLM2 / Moondream2 / PaliGemma 2 (small open VLMs) ·
SigLIP-2 (image–text encoder) ·
V-JEPA 2 (predictive video reps, alt backbone) ·
Distil-Whisper / Whisper.cpp ·
DPO and KTO (preference tuning) ·
LoRA / QLoRA ·
mem0 / Letta (memory frameworks).

Original 2018 brain-dump (motion-flag + MobileNet + static KG + hand-wavy
"verbal RL") is preserved in git history; see commits before
`claude/design-specs-evaluation-UUNNc`.

## For humans

Repo state today: this is the **specs and contract**, not the code. There
is no working subsystem implementation yet — that's the work being
distributed. The one piece of operational tooling that exists is the cron
script that pulls recordings from a Yi Dome to a Pi; it lives in
[`CLAUDE.md`](https://github.com/domijin/baby-AI/blob/main/CLAUDE.md) so it's not lost.

To pledge a bounty against a specific spec / tier, see
[`CONTRIBUTING.md`](https://github.com/domijin/baby-AI/blob/main/CONTRIBUTING.md) § Bounty mechanism.

To propose a new spec (e.g. a V-JEPA-2 alternative to spec 01), open a
[feature proposal](https://github.com/domijin/baby-AI/blob/main/github/ISSUE_TEMPLATE/feature-proposal.yml).

## License

Code under [LICENSE](https://github.com/domijin/baby-AI/blob/main/LICENSE). Datasets and model artifacts produced
under this project are released as each spec dictates (CC-BY-NC 4.0 is
the default for human-collected sensor data after PII review).

spec_id: charter
status: active
version: 0.1.0
last_updated: 2026-04-25

---
*Footnote: First published in [GitHub Specification (baby-AI)](https://github.com/domijin/baby-AI) (May 2026).*
