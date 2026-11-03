# baby-AI: Raising a Household Agent on Edge Hardware

*Human Agency & Edge AI · By Domi Jin (April 2026)*

When you watch a child learn how a home works, you notice something remarkable: they do not ingest ten million unlabeled hours of raw surveillance footage from strangers' living rooms. They learn because the people around them point, speak, correct, and explain in context. *"That mug belongs to Grandpa."* *"Don't touch the stove when the red light is on."* *"We leave the keys in the wooden bowl by the door."*

Back in 2018, I sketched an early note about a household AI that could learn the same way—by being talked to. Years later, after working with older adults through Kin Domi in Palo Alto and listening to their quiet reservations about smart cameras and cloud voice assistants, that question returned with much sharper urgency. People want helpful intelligence in their homes, especially as they age or juggle busy family routines. What they do not want is an always-on sensor pipeline streaming their most intimate spaces to a distant data center for model training.

**baby-AI** is my architectural answer to that tension: an open-specification, edge-deployed household agent that learns about your home by being spoken to, runs on roughly \$100 of off-the-shelf local hardware, and improves over time without ever shipping family video or audio streams to the cloud.

---

## Why Building a Domestic AI Feels Like Raising a Developing Mind

Most agent frameworks treat autonomy as a binary switch: either the model is a passive chatbot waiting for a prompt, or it is given unconstrained tool access and left to improvise. In a real household, neither extreme works. Trust is earned developmentally, through clear boundaries between reversible exploration and high-regret actions:

1. **Reversible vs. High-Regret Gates**: When a developing system indexes an episodic memory, tags an object in a room, or drafts a gentle reminder, the action is locally reversible. When an action crosses the boundary into external communication, physical actuation, or modifying long-term core rules, it hits a strict human-in-the-loop gate.
2. **Transparent, Inspectable Memory**: If an assistant remembers a household preference wrongly, you should not have to retrain a black-box neural network to fix it. Memory must combine fast episodic recall with an explicit, human-editable local knowledge graph so anyone in the home can ask *"Why did you think that?"* and correct it in one sentence.
3. **Safety Escalation Over Silent Hallucination**: A trustworthy companion knows what it does not know. When acoustic direction-of-arrival and visual grounding disagree—or when a spoken instruction conflicts with a safety boundary—the system escalates to a clarifying question rather than guessing silently.

---

## Developmental Autonomy & Edge Guardrail Architecture

```text
[Stage 1: Ambient Edge Sensing]
  Yi Dome 1080p (~$30) + ReSpeaker 4-Mic Array
  (Local LAN only; zero cloud video/audio egress)
         |
         v
[Stage 2: Smart-Moment & Audio-Visual Grounding]
  Raspberry Pi 5 (16 GB) — Spec 01 & Spec 02
  Filters 99% of static frames; fuses Whisper ASR + Direction-of-Arrival (DoA)
         |
         v
[Stage 3: Hybrid Transparent Memory & Verbal Adapter]
  Hailo-8L NPU (13 TOPS) — Spec 03 & Spec 04
  Episodic Vector Store + Editable Knowledge Graph + Local LoRA / KTO / DPO
         |
         v
[Stage 4: Action Gate & Cryptographic Receipt Contract]
  Reversible local memory update -> Auto-commit with trace
  High-regret / external action  -> Explicit verbal confirmation gate
  Benchmark & safety claims      -> Signed Receipt (Spec 05)
```

---

## Privacy and Agency on \$100 of Local Silicon

If an architecture requires an \$8,000 workstation in the closet, it remains a hobbyist toy for engineers. We set the compute floor deliberately low so that any family, student, or independent researcher can replicate the entire node for less than the price of a budget smartphone:

- **Yi Dome 1080p Camera (~USD 30 used, Hi3518EV200 ARMv5)**: Acts strictly as a local RTSP/cron frame source on an isolated subnet.
- **ReSpeaker 4-Mic Array**: Captures far-field speech alongside acoustic Direction-of-Arrival (DoA) vectors so the system knows *where* a speaker is standing relative to the room.
- **Raspberry Pi 5 (16 GB RAM)**: Orchestrates stream routing, voice activity detection, hybrid memory storage, and dialogue state.
- **Hailo-8L M.2 NPU (13 TOPS, ~USD 70)**: Handles real-time vision-language embedding (`SigLIP-2`, `SmolVLM2`, `Moondream2`) and token generation at the edge.
- **Periodic Off-Path Adapter Training**: An optional desktop GPU (RTX 4070 class) is invoked only overnight or offline to consolidate verified verbal feedback into lightweight `LoRA` / `QLoRA` weights via `DPO` and `KTO` preference tuning.

---

## The Eight Core Specifications & Falsifiable Contracts

In open-source AI, hype is cheap and reproducible benchmarks are rare. Rather than publishing a monolithic codebase full of hand-wavy claims, `baby-AI` is structured around **falsifiable specifications and cryptographic receipts**. Code is the means; signed evaluation receipts on named benchmarks are the contract.

| Spec ID | Subsystem & Scope | Core Mechanism & SOTA Anchors | Falsifiable Target Metric | Safety & Guardrail Gate |
| :--- | :--- | :--- | :--- | :--- |
| **`00-charter`** | System Envelope & Hardware Bill of Materials | Defines the \$100 edge hardware floor (Pi 5 + Hailo-8L + Yi Dome + 4-Mic) and zero-cloud training boundary | Hardware BOM \(\le \$150\); 0 bytes unapproved WAN egress | Hardware-enforced local VLAN isolation |
| **`01-perception`** | Smart-Moment Selection | Novelty-gated frame sampling using lightweight `SigLIP-2` / `V-JEPA 2` predictive embeddings | `precision@10 >= 0.55` on household key-event retrieval | Immediate discard of routine background frames |
| **`02-audio`** | Streaming ASR & Spatial DoA Fusion | Low-latency `Whisper.cpp` / `Distil-Whisper` fused with 4-mic acoustic Direction-of-Arrival | `+0.10` referent resolution accuracy over audio-only baseline | Local voice activity gating; mute switch hardware override |
| **`03-memory`** | Hybrid Episodic-Vector + Knowledge Graph | Dual-store architecture (`mem0` / `Letta` style) pairing vector episodes with a relational entity graph | `+0.10` hybrid `recall@5` on multi-hop household queries | Human-inspectable & verbally erasable graph triples |
| **`04-interaction`** | Edge VLM & Verbal-Feedback Adapter | Small open VLM (`SmolVLM2` / `Moondream2` / `PaliGemma 2`) with overnight `LoRA` + `KTO`/`DPO` updates | \(\ge 3\text{ tok/s}\) edge latency; `+0.20` concept accuracy after 5 verbal corrections | Confirmation gate before overwriting core household rules |
| **`05-eval`** | Signed Evaluation Receipt Contract | Deterministic harness emitting cryptographically signed JSON benchmark receipts | `100%` schema & signature verification across submitted runs | Rejects unverified or cherry-picked model checkpoints |
| **`06-privacy-gate`** | Local Redaction & PII Boundary | Pre-storage face/PII scrubbing for any diagnostic trace exported by the household owner | `0` unredacted PII leaks across diagnostic test suite | Mandatory owner sign-off before any trace leaves device |
| **`07-escalation`** | Uncertainty & Human-in-the-Loop Escalation | Calibrated abstention when visual-acoustic grounding confidence falls below threshold | \(\ge 90\%\) abstention accuracy on ambiguous/high-regret prompts | Hard block on high-regret actions without verbal confirmation |

---

## Verbal Reinforcement Over Surveillance

When someone says, *"Hey, that pill bottle on the counter is my morning vitamin, not my evening blood pressure medicine,"* a household agent has to do four things well:

1. **Ground the moment in space and time** (`01-perception` + `02-audio`): Align the spoken demonstratives (*"that pill bottle on the counter"*) with the acoustic direction of the speaker's voice and the active visual frame.
2. **Update explicit relational memory** (`03-memory`): Write a structured, inspectable link in the local knowledge graph (`[Blue Bottle @ Kitchen Counter] -> [Role: Morning Vitamin]`) while archiving the episodic context.
3. **Adapt visual-language priors** (`04-interaction`): Queue the verified correction as a positive/negative preference pair so the next local `LoRA` adapter pass internalizes the visual concept without catastrophic forgetting.
4. **Verify without regressing** (`05-eval` + `07-escalation`): Run the updated adapter against the household regression suite and issue a signed receipt confirming that learning the new object did not degrade prior safety rules.

---

## The Mission Ahead

When we design AI for the home, we are not just optimizing tokens per second—we are shaping the quiet architecture of domestic trust. Whether a system is helping an older adult keep track of daily essentials or helping a young family coordinate a busy week, dignity depends on keeping ownership, memory, and control in the hands of the people who live there.

By separating specifications from implementations and requiring every claim to carry a verifiable receipt, `baby-AI` invites engineers, researchers, and tinkerers to build domestic intelligence the right way: small enough to own, humble enough to ask when uncertain, and wise enough to learn from a human voice.

---
*Originally published on [GitHub (domijin/baby-AI)](https://github.com/domijin/baby-AI) (April 2026).*
