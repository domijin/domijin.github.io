# Shared Knowledge Model — Specification

**Candidate route:** `/shared-knowledge/` (source `green-app/src/app/shared-knowledge/`, staged export `/next/shared-knowledge/`, promoted root `/shared-knowledge/`)
**Status:** Design specification only (no implementation yet)
**Target prose locale:** `en-GB` (matching `/wormholes/` and `/newtonian-noise/`, per [AGENTS.md](../AGENTS.md))

---

## 1. Purpose and boundary with existing pages

This page demonstrates how two people with distinct circles of competence compare what they know, trace **why** they disagree (provenance of differences), verify mutual understanding rather than assuming overlap equals agreement, test a shared question against evidence that can reject their hypothesis, and contribute an examined note to a shared commons—without erasing either person's perspective or handing judgement to a central authority.

It connects **03 · Human Agency** (individual mastery, cognitive load, dignified self-reliance) and **04 · Working Together** (shared values as GCD, complementary capabilities as LCM, collective competence with individuality intact) in [GreenExperience.tsx](../green-app/src/components/GreenExperience.tsx).

It stays strictly separate from existing interactive figures (per [editorial-and-engineering-lessons.md](editorial-and-engineering-lessons.md), Lesson 5):

| Route | Explanatory subject | Epistemic scope |
| :--- | :--- | :--- |
| `/knowledge/` | Single language model's boundary inside a collective human-knowledge ball | Conceptual sketch from *All About ChatGPT* (2023) |
| `/shared-knowledge/` | **Two people** comparing knowledge maps, checking understanding, testing hypotheses, and examining contributions | Deterministic conceptual & teaching model using an explicitly fictional scenario |

---

## 2. Precise source status

### 2.1 Local repository sources (read directly)

| Source | Status & date | Verified ideas carried into this spec | Explicit exclusions / cautions |
| :--- | :--- | :--- | :--- |
| [open-learning.md](../articles/blog/open-learning.md) | Working draft (17 Nov 2026) | Commons cycle (`Open knowledge → Individual learning & mastery → Independent inquiry / Voluntary collaboration → Evidence, critique, revision → New knowledge → Returns to open knowledge`); "understanding an explanation is not mastery"; "The commons grows only when new claims can be examined, not merely generated"; legible provenance of differences prompts curiosity/empathy; explicit disclosure ("AI is not Eywa... People decide what to share. Claims retain sources, uncertainty and room for challenge"). | Not a programme evaluation or implementation claim; age 12–14 cohort and contested interventions are not claimed as proven. |
| [overachievers-responsibility-reflection.md](../articles/substack/overachievers-responsibility-reflection.md) | Published essay (Substack, Feb 2025) | **GCD** (shared values/principles reducing friction) vs **LCM** (diverse complementary skills expanding collective reach); recognising limits of one's own expertise; incentives before expectations. | Metaphorical framing from number theory, not a quantitative psychometric formula. |
| [serendipity-where-it-sparks.md](../articles/substack/serendipity-where-it-sparks.md) | Published essay (Substack, Dec 2024) | Intergenerational listening (older adults' lived knowledge); Confucian *Ren* (benevolence) and *Li* (reciprocity); connecting distinct peaks into an interdisciplinary "highland"; identifying shared strengths and gaps (*八仙过海 各显神通*). | Personal narrative; no generalised empirical claims extracted. |
| [free-market-in-a-possibility-universe.md](../articles/blog/free-market-in-a-possibility-universe.md) | Published essay (Blog, Sept 2019) | Information barriers; advancing inductive and deductive reasoning while collaborating on a shared knowledge base; multiple agencies rather than a single central overlord. | Early speculative manifesto; governance proposals are not treated as built systems. |
| [libertyearth-and-future.md](../articles/github/libertyearth-and-future.md) | Legacy / repo-adapted notebook (2019–2025) | **Read cautiously.** Retains only the broad motivating question (coordination across finite attention and information asymmetry) and the GCD/LCM motif already verified in Substack. | **Source claims may be unverified.** Spec **must not repeat** its Three-Tier Value Framework, Nine-Stage Arc, Personal Knowledge Graph / Collective Civilizational Knowledge Base architecture, Liquid Democracy claims, zero-externality manufacturing, or any quantified outcomes. |
| [GreenExperience.tsx](../green-app/src/components/GreenExperience.tsx), [contextMapData.ts](../green-app/src/data/contextMapData.ts), [llms.txt](../llms.txt), [llms-full.txt](../llms-full.txt), [agent-context.json](../agent-context.json) | Live green-app source & discovery endpoints | Narrative structure (`03 · Human Agency`, `04 · Working Together`), blue-green `NEXT_BASE_PATH` handling, discovery propagation rule. | No invented metrics or project completions. |
| [wormhole-explorer.md](wormhole-explorer.md), [wormholes/page.tsx](../green-app/src/app/wormholes/page.tsx), [wormholeModels.test.mjs](../green-app/tests/wormholeModels.test.mjs) | Reference standalone route pattern | `en-GB` standalone page shell, skip link, `<noscript>` notice, `#sources` footer, pure TS model in `src/lib/`, `node --experimental-strip-types --test` suite. | No WebGL needed here; deterministic 2D SVG + structured DOM provides higher clarity and accessibility. |

### 2.2 Primary academic references (verified via web search)

*Full papers were not downloaded; bibliographic metadata and core findings were verified via search summaries on 17 Nov 2026.*

| Reference | Grounding mechanism supported |
| :--- | :--- |
| **Clark, H. H., & Brennan, S. E. (1991).** Grounding in communication. In L. B. Resnick, J. M. Levine, & S. D. Teasley (Eds.), *Perspectives on socially shared cognition* (pp. 127–149). APA. DOI `10.1037/10096-006`. | Mutual understanding requires *grounding*—positive evidence that a listener understood what the speaker meant—rather than simply sending an explanation. |
| **Wegner, D. M. (1987).** Transactive memory: A contemporary analysis of the group mind. In B. Mullen & G. R. Goethals (Eds.), *Theories of group behavior* (pp. 185–208). Springer. DOI `10.1007/978-1-4612-4634-3_9`. | Groups coordinate complementary knowledge by maintaining a shared directory of *who knows what*, preserving specialised expertise rather than duplicating everything. |
| **Liang, D. W., Moreland, R., & Argote, L. (1995).** Group versus individual training and group performance: The mediating role of transactive memory. *Personality and Social Psychology Bulletin*, 21(4), 384–393. DOI `10.1177/0146167295214009`. | Empirical mediation via three behavioural dimensions: *memory differentiation*, *task coordination*, and *task credibility*. |
| **Stasser, G., & Titus, W. (1985).** Pooling of unshared information in group decision making: Biased information sampling during discussion. *J. Personality and Social Psychology*, 48(6), 1467–1478. DOI `10.1037/0022-3514.48.6.1467` (and Lu, Yuan, & McLeod, 2012 meta-analysis). | Unstructured groups disproportionately discuss *already-shared* facts and fail to pool *unshared* facts needed for the better decision (hidden profile), motivating explicit surfacing of unshared claims. |
| **Roschelle, J., & Teasley, S. D. (1995).** The construction of shared knowledge in collaborative problem solving. In C. E. O'Malley (Ed.), *Computer supported collaborative learning* (pp. 69–97). Springer. DOI `10.1007/978-3-642-85098-1_5`. | Shared external representations scaffold a *Joint Problem Space* where divergent understandings become inspectable and negotiable. |
| **Fiorella, L., & Mayer, R. E. (2015 / 2016).** *Learning as a Generative Activity* (Ch. 8: Learning by teaching, CUP, DOI `10.1017/CBO9781107707085.010`); Eight ways to promote generative learning, *Educational Psychology Review*, 28(4), 717–741, DOI `10.1007/s10648-015-9348-9`. | Teaching/explaining supports durable understanding only alongside active generative retrieval and reconstruction, not passive exposure. |

---

## 3. Epistemic, privacy and agency guardrails

Every model function and UI control must enforce these six invariants:

1. **Unknowns and disagreement remain legitimate.** Unresolved tensions remain typed as `open_disagreement` or `unknown`. The state machine never forces consensus and never grades disagreement as failure.
2. **Disclosure is explicit.** Each person's claims carry `disclosure: "private" | "shared_context"`. Private nodes never appear in the comparison panel, shared-question inputs, or commons ledger unless explicitly toggled by the user.
3. **No inferred personal profile.** The page never tracks user behaviour to infer traits, skill levels, or preferences, and stores no persistent profile.
4. **No network inference required.** Zero LLM API calls, zero embedding downloads, zero external network requests. All logic runs deterministically in-browser.
5. **No real people data.** The worked example uses explicitly labelled fictional composite characters and synthetic observations.
6. **Claims are not validated by a UI button.** Clicking a button never certifies a proposition as true. A contribution enters the commons ledger only after passing (a) a falsifiable evidence test (`supported_within_scope`) and (b) an explicit examination review (`provenanceCited`, `scopeBounded`, `unknownsRetained`), and still retains conditions under which it could be overturned.

---

## 4. Deterministic data and state model

Target module: `green-app/src/lib/sharedKnowledgeModels.ts` (pure TypeScript, zero DOM/React imports, zero randomness).

### 4.1 Core types

```ts
export type PersonId = "maya" | "kenji";

export type StageId =
  | "compare"
  | "explain_check"
  | "form_question"
  | "test_revise"
  | "share_examined";

export type DisclosureLevel = "private" | "shared_context";

export type ClaimStatus =
  | "held_claim"
  | "declared_unknown"
  | "open_disagreement";

export interface KnowledgeNode {
  id: string;
  ownerId: PersonId;          // Ownership never merges or overwrites
  topicId: string;            // Shared topic key for overlap detection
  topicLabel: string;
  claim: string;
  assumption: string;         // Underlying premise that can differ despite same topicId
  provenance: string;         // Where this view came from (method, vantage point, constraint)
  domain: string;             // Circle-of-competence area
  status: ClaimStatus;
  disclosure: DisclosureLevel;
  defaultDisclosure: DisclosureLevel;
  derivedFrom?: {
    sourcePersonId: PersonId;
    sourceNodeId: string;
  };
}

export interface UnderstandingCheck {
  id: string;
  explainerId: PersonId;
  learnerId: PersonId;
  sourceNodeId: string;
  explained: boolean;         // Set by explain step; DOES NOT grant mastery
  mastered: boolean;          // True only after passing reconstruction check
  selectedOptionId: string | null;
  expectedOptionId: string;
  options: { id: string; label: string; rationale: string }[];
}

export interface HypothesisRecord {
  id: string;
  label: string;
  prediction: string;
  status: "untested" | "rejected" | "supported_within_scope";
  testedEvidenceIds: string[];
  note: string;
}

export interface EvidenceTrial {
  id: string;
  label: string;
  observation: string;
  rejectsHypothesisIds: string[];
  supportsWithinScopeIds: string[];
  remainingUnknown: string;
}

export interface ExaminationReview {
  provenanceCited: boolean;
  scopeBounded: boolean;
  unknownsRetained: boolean;
}

export interface CommonsContribution {
  id: string;
  questionId: string;
  hypothesisId: string;
  evidenceIds: string[];
  summary: string;
  scopeLimit: string;
  openUnknowns: string[];
  contributors: { personId: PersonId; citedNodeIds: string[] }[];
}

export interface SharedKnowledgeState {
  stage: StageId;
  visitedStages: StageId[];
  nodes: KnowledgeNode[];     // Both people's distinct records in one immutable array
  understandingChecks: UnderstandingCheck[];
  selectedQuestionId: string | null;
  activeHypothesisId: string | null;
  hypotheses: HypothesisRecord[];
  examination: ExaminationReview;
  commonsLedger: CommonsContribution[];
  openDisagreements: { topicId: string; note: string }[];
}
```

### 4.2 State transitions and invariants

```
compare ──► explain_check ──► form_question ──► test_revise ──► share_examined
   ▲              │                                  │   ▲              │
   │              │ (teaching alone leaves           │   │ (rejected    │ (requires
   │              │  mastered = false)               │   │  hypothesis  │  inquiry +
   └──────────────┴──────────────────────────────────┴───┘  loops back) ▼  review)
                                                                 commonsLedger (+1)
```

Pure transition functions (each returns a new `SharedKnowledgeState` without mutating inputs):

1. `createInitialState(): SharedKnowledgeState` — deterministic baseline: `stage = "compare"`, `commonsLedger = []`, initial private nodes stay hidden from comparison, initial topical overlaps are **unaligned** because `assumption` differs.
2. `toggleDisclosure(state, ownerId, nodeId, level)` — updates `disclosure` only for that owner's node.
3. `computeComparison(state)` (derived selector):
   - Filters strictly to `disclosure === "shared_context"`.
   - `topicalOverlap`: `topicId`s present in both Maya's and Kenji's disclosed sets.
   - `provenanceDivergences`: overlapping `topicId`s where `mayaNode.assumption !== kenjiNode.assumption` (surface overlap, *not* alignment).
   - `verifiedAlignments`: overlapping `topicId`s where assumptions match **or** both parties hold matching grounded understanding (`mastered === true` for the bridge check).
   - `complementaryReach`: disclosed `held_claim`s unique to one person (hidden-profile / LCM items) plus `declared_unknown`s.
4. `explainNode(state, explainerId, learnerId, sourceNodeId)` — sets `explained = true` on the matching `UnderstandingCheck`. **Invariant:** `mastered` remains `false`; `nodes` of `learnerId` are unchanged.
5. `checkUnderstanding(state, checkId, selectedOptionId)` — evaluates `selectedOptionId === expectedOptionId`. Only on exact match does `mastered` become `true` and append a distinct node owned by `learnerId` with `derivedFrom: { sourcePersonId, sourceNodeId }` (never mutating or merging `explainerId`'s original node).
6. `formSharedQuestion(state, questionId)` — sets `selectedQuestionId` and advances to `"form_question"` (or `"test_revise"` via step navigation). Requires at least one surfaced divergence or complementary unshared claim in `shared_context`.
7. `selectHypothesis(state, hypothesisId)` & `runEvidenceTest(state, evidenceId)` — applies `EvidenceTrial` deterministically:
   - If `evidence.rejectsHypothesisIds.includes(activeHypothesisId)`, sets hypothesis `status = "rejected"`, appends `evidenceId`, and **blocks** transition to `"share_examined"`.
   - If `evidence.supportsWithinScopeIds.includes(activeHypothesisId)`, sets `status = "supported_within_scope"` (and never `"universally_true"`).
8. `updateExamination(state, patch)` & `submitExaminedContribution(state)` — appends to `commonsLedger` **only if**:
   - `selectedQuestionId !== null`
   - active hypothesis exists and has `status === "supported_within_scope"` and `testedEvidenceIds.length > 0`
   - `examination.provenanceCited && examination.scopeBounded && examination.unknownsRetained`
   - duplicate contribution for the same `(questionId, hypothesisId)` is not already in `commonsLedger`
   Otherwise returns `state` unchanged (no silent knowledge creation).
9. `keepDisagreement(state, topicId, note)` — records/retains an explicit `open_disagreement` without blocking inquiry on testable sub-questions.
10. `setStage(state, targetStage)` — allows revisiting earlier stages; blocks advancing directly into `"share_examined"` ready-to-publish state unless inquiry passed, and never mutates `commonsLedger`.
11. `resetScenario()` — returns a fresh `createInitialState()`.

---

## 5. Grounded fictional scenario: *Oak & 4th Crossing*

> **Scenario disclaimer (displayed prominently on page):** *Maya and Kenji are fictional composites in a synthetic crossing scenario. No real individuals, municipal measurements, or field outcomes are represented.*

- **Shared values (GCD):** Both want older neighbours to cross safely with dignity, without unnecessary traffic disruption.
- **Maya (Retired civic volunteer & daily walker):**
  - *Circle of competence:* pedestrian pace, afternoon sightlines, hearing-aid acoustic masking, community walk notes.
  - *Nodes:*
    1. `crossing-hesitation` (`shared_context`, `held_claim`): "Older pedestrians pause or step back at 16:30 even on a green walk sign" — *Provenance:* 3-week afternoon walk-along diary.
    2. `acoustic-masking` (`private` initially, toggleable to `shared_context`, `held_claim`): "High-pitched rapid beeps blur into traffic noise for hearing-aid wearers" — *Provenance:* community listening session.
    3. `curb-glare` (`shared_context`, `held_claim`): "Low western sun washes out the countdown LED face between 16:00 and 17:30" — *Provenance:* eye-level kerb observation.
    4. `turn-rate-unknown` (`shared_context`, `declared_unknown`): "Unknown whether right-turn-on-red speeds or signal timing change at 16:30."
- **Kenji (Embedded-systems volunteer & telemetry analyst):**
  - *Circle of competence:* inductive-loop logs, controller phase specs, sensor blind spots, false-negative rates.
  - *Nodes:*
    1. `crossing-hesitation` (`shared_context`, `held_claim`): "Crossing meets the 12 s municipal walk phase and logs 94% vehicle stop compliance" — *Provenance:* 24-hour controller & loop-detector export.
    2. `turn-conflict-window` (`shared_context`, `held_claim`): "Right-turn queue density peaks 16:15–17:00" — *Provenance:* 15-minute binned induction-loop timestamps.
    3. `sensor-blind-spot` (`private` initially, toggleable to `shared_context`, `held_claim`): "Roadway loops count vehicles; they never detect a walker who aborts on the kerb" — *Provenance:* hardware loop specification.
    4. `sightline-unknown` (`shared_context`, `declared_unknown`): "Never observed the south-west signal head at 16:30 eye level."

### Scenario walkthrough across the five transitions

1. **Compare (`compare`):** Both share `crossing-hesitation`, so topical overlap is non-zero—yet their assumptions clash (`"crossing feels unsafe"` vs `"crossing meets spec"`). Until Maya discloses `acoustic-masking` and Kenji discloses `sensor-blind-spot`, key hidden-profile facts stay invisible.
2. **Explain & Check Understanding (`explain_check`):**
   - Kenji explains `sensor-blind-spot`; Maya must reconstruct *why* 94% vehicle compliance cannot rule out pedestrian kerb hesitation.
   - Maya explains `curb-glare` / `acoustic-masking`; Kenji must reconstruct *why* spec luminance fails under low-angle glare and hearing-aid masking.
   - Teaching alone leaves `mastered = false`; both people's original nodes remain separate.
3. **Form Shared Question (`form_question`):** *"Given a compliant 12 s walk phase, does afternoon kerb hesitation stem from crossing-time shortage, or from cue legibility and right-turn release timing?"*
4. **Test & Revise (`test_revise`):**
   - **Hypothesis H1:** *"Extending the walk phase from 12 s to 16 s eliminates kerb hesitation."* Tested against synthetic trial **E1** (extra 4 s reduces mid-crossing rush, **but kerb-onset hesitation persists** at 16:30 under glare and immediate right-turn release) → **`rejected`**.
   - **Hypothesis H2 (revised):** *"A recessed glare visor, lower-frequency spoken/chime cue, and a 3 s leading pedestrian interval (LPI) before right-turn release reduce kerb hesitation."* Tested against synthetic trial **E2** → **`supported_within_scope`**, explicitly noting remaining unknowns (wet-night glare, maintenance cost).
5. **Share Examined Contribution (`share_examined`):** User checks the three review gates (`provenanceCited`, `scopeBounded`, `unknownsRetained`) and records whether a secondary disagreement (e.g., audio volume vs quiet-hours residential norm) stays open. Only then does `commonsLedger` receive the scoped contribution.

---

## 6. Visual and accessibility design

- **Palette & shell:** Reuses the dark-slate/cyan explorer aesthetic (`#06121e` ground, `#091a29` deck, `#65d9ed` cyan, `#90a8ff` blue, `#fbbf24` amber for divergence/caution) from [wormholes.css](../green-app/src/app/wormholes/wormholes.css), adapted to `shared-knowledge.css` (`sk-*` classes).
- **Layout:**
  - Header (`← Domi Jin` linking to `${basePath}/#working-together`, `Sources & scope ↗`), hero with explicit fictional-model notice, 5-step `<nav aria-label="Model stages">`.
  - **Paired Dual-Map Stage (SVG + structured lists):** Left map = Maya's circle (`#65d9ed`), Right map = Kenji's circle (`#90a8ff`), Centre bridge = `Topical overlap` vs `Verified alignment` vs `Provenance divergences` (visually proving overlap ≠ alignment), Bottom rail = `Examined Commons Ledger (0 contributions initially)`.
  - **Interactive Deck:** Controls for explicit disclosure toggles, `Explain` vs `Check understanding` (radio options + live status), shared question selector, hypothesis/evidence tester (showing `REJECTED` vs `SUPPORTED WITHIN SCOPE`), examination checklist, `Keep disagreement open`, and `Reset scenario`.
- **Accessibility:**
  - All interactive controls are native `<button>`, `<input type="radio">`, or `<input type="checkbox">` with `min-height: 44px` and `:focus-visible` outlines (`2px solid #92e9ff`).
  - Stage tabs use `role="tablist"` / `role="tab"` (`aria-selected`) with `ArrowLeft`/`ArrowRight` keyboard navigation; status changes announce via `aria-live="polite"`.
  - Skip link (`#stage`) and `<noscript>` notice rendering the static scenario summary and primary references.

---

## 7. Verification plan (tests proving the mechanism)

Target test file: `green-app/tests/sharedKnowledgeModels.test.mjs`, executed with `node --experimental-strip-types --test green-app/tests/sharedKnowledgeModels.test.mjs`.

| # | Mechanism invariant tested | Assertion in unit test |
| :--- | :--- | :--- |
| 1 | **Overlap isn't alignment** | Initial `computeComparison(state)` shows `topicalOverlap.length >= 1` (`crossing-hesitation`) while `verifiedAlignments.length === 0` and `provenanceDivergences.length >= 1`. |
| 2 | **Teaching alone doesn't count mastery** | Calling `explainNode(state, "kenji", "maya", "sensor-blind-spot")` sets `explained === true` yet `mastered === false` and Maya's node count is unchanged; mastery becomes `true` only after `checkUnderstanding` with the expected reconstruction option. |
| 3 | **Each person's claims stay distinct** | Across all transitions (`explain`, `checkUnderstanding`, `submitExaminedContribution`), Maya's and Kenji's original `KnowledgeNode`s preserve their distinct `ownerId`, `claim`, and `provenance` without overwriting or merging. |
| 4 | **Evidence can reject hypothesis** | Selecting `H1` and calling `runEvidenceTest(state, "E1")` sets `H1.status === "rejected"` and keeps `submitExaminedContribution` blocked (`commonsLedger.length === 0`). |
| 5 | **No extra new knowledge without inquiry/review** | Calling `submitExaminedContribution` from `"compare"`, `"explain_check"`, `"form_question"`, with a `"rejected"` hypothesis, or with any `ExaminationReview` boolean `false` leaves `commonsLedger.length === 0`; only `supported_within_scope` + all 3 review flags `true` increments `commonsLedger.length` to `1`. |
| 6 | **Reset complete** | After running full scenario to `commonsLedger.length === 1` and toggling disclosures/disagreements, `resetScenario()` returns a state `deepStrictEqual` to `createInitialState()`. |
| 7 | **Keyboard access & disclosure privacy** | Pure-model test verifies `private` nodes never appear in `computeComparison` output until `toggleDisclosure(..., "shared_context")`. UI verification checklist confirms Tab/Enter/Space/Arrow navigation, `aria-live` updates, visible focus rings, and `<noscript>` readability. |

---

## 8. Site integration links

Place `/shared-knowledge/` as the bridge between **03 · Human Agency** and **04 · Working Together**:

1. **[GreenExperience.tsx](../green-app/src/components/GreenExperience.tsx)**:
   - At the bottom of `#human-agency` (or top of `#working-together`, right above/below the `GCD × LCM` interactive figure): add a concise cross-link card using `BASE_PATH`:
     - Link target: `${BASE_PATH === "" ? "" : BASE_PATH}/shared-knowledge/`
     - Framing: *"From individual mastery to joint inquiry: explore how two people with distinct circles of competence compare provenance, test a shared question, and examine new contributions →"*
2. **[contextMapData.ts](../green-app/src/data/contextMapData.ts)**:
   - Add an entry or cross-link under `OPEN_PROJECTS` / `collective-intelligence` pillar pointing to `/shared-knowledge/` with explicit status (`Conceptual teaching model · fictional crossing scenario`).
3. **Discovery endpoints** (keep claims aligned per [AGENTS.md](../AGENTS.md)):
   - [llms.txt](../llms.txt): add bullet under top interactive links (`source route /shared-knowledge/, staged export /next/shared-knowledge/`), stating clearly it is a deterministic conceptual model using a fictional scenario.
   - [llms-full.txt](../llms-full.txt): add matching summary note with primary grounding/TMS/hidden-profile citations and limitations.
   - [agent-context.json](../agent-context.json): add `interactiveArtifacts.sharedKnowledge` entry with `sourceRoute`, `stagedRoute`, `language: "en-GB"`, `limitations`, and `references`.
   - [scripts/validate-live.py](../scripts/validate-live.py) & [sitemap.xml](../sitemap.xml): include `/shared-knowledge/` and `/next/shared-knowledge/` when deployed.

---

## 9. Acceptance criteria

- [ ] `green-app/src/lib/sharedKnowledgeModels.ts` is pure TypeScript with zero network calls, zero randomness, and explicit `private`/`shared_context` disclosure enforcement.
- [ ] All 7 unit test groups in `green-app/tests/sharedKnowledgeModels.test.mjs` pass under `node --experimental-strip-types --test`.
- [ ] Standalone route `green-app/src/app/shared-knowledge/page.tsx` renders server-side explanations, fictional-scenario disclaimer, `<noscript>` fallback, and `#sources` footer in `en-GB`.
- [ ] No real-person data, no inferred user profiling, no unverified LibertyEarth architecture/outcomes, and no UI "validate truth" button.
- [ ] Unresolved disagreement and unknowns remain explicitly visible without blocking non-dependent steps.
- [ ] Full keyboard operability (`Tab`, `Enter`/`Space`, `ArrowLeft`/`ArrowRight` on stage tabs) and responsive mobile layout (`<= 560px`).
- [ ] Integrated cleanly between `#human-agency` and `#working-together` in `GreenExperience.tsx`, and propagated to `contextMapData.ts`, `llms.txt`, `llms-full.txt`, and `agent-context.json`.
- [ ] `bash scripts/blue-green-deploy.sh build-green`, `python3 scripts/verify-articles.py`, and `python3 scripts/verify-build-assets.py` pass cleanly.

---

## 10. File ownership suggestions for parallel build

To run a parallel implementation with zero merge conflicts, assign disjoint file sets across three tracks plus a final serial verification pass:

| Track | Owned files (exclusive) | Deliverable |
| :--- | :--- | :--- |
| **Track 1 — Model & Mechanism Tests** | `green-app/src/lib/sharedKnowledgeModels.ts`<br>`green-app/tests/sharedKnowledgeModels.test.mjs` | Deterministic state types, transitions, fictional scenario data, selectors, and all 7 mechanism unit tests. |
| **Track 2 — Route Page & Interactive UI** | `green-app/src/app/shared-knowledge/page.tsx`<br>`green-app/src/app/shared-knowledge/shared-knowledge.css`<br>`green-app/src/components/SharedKnowledgeExplorer.tsx` | Server-rendered shell (`en-GB`, metadata, `<noscript>`, `#sources`) + accessible dual-map SVG & 5-stage interactive deck consuming Track 1's exported types/functions. *(Wait for Track 1's exported type/function signatures or freeze them from Section 4 first.)* |
| **Track 3 — Site Integration & Discovery** | `green-app/src/components/GreenExperience.tsx`<br>`green-app/src/data/contextMapData.ts`<br>`llms.txt`<br>`llms-full.txt`<br>`agent-context.json`<br>`scripts/validate-live.py`<br>`sitemap.xml` | Link bridge between `03 · Human Agency` and `04 · Working Together`, project metadata, and synchronised discovery endpoints. |
| **Final Integration Pass (Serial)** | *(Read-only checks + generated exports)* | Run unit tests, `bash scripts/blue-green-deploy.sh build-green`, `python3 scripts/verify-articles.py`, `python3 scripts/verify-build-assets.py`, and keyboard/accessibility browser inspection. |
