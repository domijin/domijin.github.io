# Shared Knowledge & Collaborative Frontier — Visual and Interaction Spec

*Design specification · 17 November 2026 · Proposed route: `/shared-knowledge/` (`green-app/src/app/shared-knowledge/`)*

> **Status:** Design specification only. No implementation, build, or homepage integration is included here.

---

## 1. Purpose and Scope

This page is a companion interactive exploration to [`/wormholes/`](../green-app/src/app/wormholes/page.tsx), [`/newtonian-noise/`](../green-app/src/app/newtonian-noise/page.tsx), and [`/knowledge/`](../green-app/src/app/knowledge/page.tsx). It gives concrete, inspectable form to the collaborative society and open-learning questions explored across Domi Jin’s essays:

- **One explanatory purpose:** Show how two people with distinct, topic-specific competence profiles encounter an open question together—why shared topic labels do not guarantee shared understanding, how unshared evidence gets overlooked, how mutual learning scaffolds rather than clones mastery, and how coordinating on question and method without forcing consensus extends what either person could test alone.
- **Explicit conceptual scope:** Every shape, ring, and arc on this page is a **conceptual schematic model** illustrating communication and coordination mechanisms. It is **not** a psychometric test, a measure of intelligence or human worth, an empirical validation of the interface, or a central arbiter of truth.

### Non-Negotiable Epistemic Rules

1. **Topic-specific expertise:** Competence varies sharply by domain; nobody has a scalar "overall score".
2. **Source-grounded differences:** Every divergence between two people’s positions traces to visible observations, working experience, or stated assumptions.
3. **Common topic $\neq$ shared understanding:** Standing in the same domain sector initially signals *co-location*, not agreement on definitions or constraints.
4. **Mutual learning $\neq$ instant mastery:** Hearing an insight from a collaborator creates a *provisional, borrowed anchor*—distinct from years of first-hand practice.
5. **No central truth authority and no agreement = truth:** An AI note or facilitation prompt may surface mismatched terms or unshared evidence, never certify truth (“AI is not Eywa”). Even when both people agree, an untested joint claim still requires empirical critique and revision.
6. **Coordinating on method vs forced consensus:** Shared values and inquiry norms (GCD) keep collaboration honest while preserving complementary spikes (LCM). Averaging differences into forced consensus destroys unshared signal.
7. **No arbitrary psychological sliders:** Replace generic percentage sliders (such as those in the homepage Act 04 `GCD × LCM` sketch) with discrete epistemic actions: stepping through grounding stages, surfacing unshared observations, repairing definitions, and toggling coordination regimes.

---

## 2. Essay and Research Grounding

### Connections to Domi’s Writings

| Source | Core Idea Carried into This Visual |
|---|---|
| [`articles/blog/open-learning.md`](../articles/blog/open-learning.md) | Different travellers arrive at the same open question via different routes; making differences legible prompts curiosity and empathy rather than immediate debate; AI is an orientation aid, not Eywa; all claims pass through *evidence, critique, revision*. |
| [`articles/substack/overachievers-responsibility-reflection.md`](../articles/substack/overachievers-responsibility-reflection.md) & Homepage Act 04 ([`GreenExperience.tsx`](../green-app/src/components/GreenExperience.tsx)) | **Large GCD × Large LCM:** shared principles and intellectual honesty (GCD) reduce friction while leaving every person’s complementary strengths intact (LCM), producing collective competence without making people interchangeable. |
| [`articles/substack/serendipity-where-it-sparks.md`](../articles/substack/serendipity-where-it-sparks.md) | Connecting insights from distinct peaks (*“八仙过海，各显神通”*) builds a wider vantage point through mutual respect and authenticity. |
| [`articles/blog/free-market-in-a-possibility-universe.md`](../articles/blog/free-market-in-a-possibility-universe.md) | Avoiding intellectual arrogance and zero-sum monopolies over knowledge; advancing inductive and deductive reasoning collaboratively. |

### External Research Starting Points (Justifying Design Questions Only)

These references motivate *why* the visual highlights grounding failures and unshared evidence; they do **not** validate the effectiveness of this interface. *(Parent verifies exact citations and URLs.)*

1. **Clark, H. H., & Brennan, S. E. (1991).** *Grounding in communication.* In L. B. Resnick, J. M. Levine, & S. D. Teasley (Eds.), *Perspectives on socially shared cognition* (pp. 127–149). American Psychological Association. ([Author PDF](https://web.stanford.edu/~clark/1990s/Clark%2C%20H.H.%20_%20Brennan%2C%20S.E.%20_Grounding%20in%20communication_%201991.pdf))
   - **Design question justified:** Communication requires active *grounding*—updating mutual knowledge, beliefs, and assumptions—whose cost depends on the medium. Therefore, two collaborators sharing a topic word on screen must *not* automatically display a merged green overlap; the UI must model ungrounded co-location, terminology collision, and explicit repair.
2. **Stasser, G., & Titus, W. (1985).** *Pooling of unshared information in group decision making: Biased information sampling during discussion.* *Journal of Personality and Social Psychology*, 48(6), 1467–1478. ([University PDF](https://www.uni-muenster.de/imperia/md/content/psyifp/aeechterhoff/vorlesungkommunikation/stasser_titus_unsharedinfogroupdisc_jpsp1985.pdf))
   - **Design question justified:** In Stasser and Titus’s political-caucus experiment, 83% of four-person groups chose the superior candidate when all facts were shared beforehand, compared with 18% when decisive positive facts were distributed as *unshared* items across individuals—because discussion disproportionately samples already-shared information. Therefore, the visual must explicitly separate **already-shared talking points** from **unshared field/telemetry evidence** and show how the joint frontier stalls until unshared items are surfaced.

---

## 3. Two Visual Approaches and Selection

> **Geometry constraint:** In line with [`docs/editorial-and-engineering-lessons.md`](editorial-and-engineering-lessons.md), any knowledge boundary described as a *ball* must be three-dimensional; 2D closed contours are permitted here **only** when framed explicitly as **schematic personal competence maps** (polar profiles), never as “balls” or “spheres”.

### Approach A (Selected): Paired Schematic Polar Competence Maps + Interactive Grounding Bridge

- **Visual form:** A two-stage dark-navy SVG + HTML workspace matching the `/wormholes/` aesthetic (`#06121e` / `#081827` surface, `#65d9ed` cyan, `#90a8ff` periwinkle, `#fbbf24` amber, `#f472b6` rose).
  - **Left / Top Stage — Schematic Personal Competence Maps:** Two anisotropic 6-sector polar competence silhouettes (Person A in cyan `#65d9ed`, Person B in periwinkle `#90a8ff`), switchable between **Side-by-Side Personal Maps** and **Superimposed Question Map**. Each radial spoke is a concrete topic tied to the open question; contour depth reflects qualitative familiarity tier (*Foundational / Peripheral*, *Working Practice*, *Deep Primary Experience*), with clickable **Provenance Pins** seated along the spokes.
  - **Right / Bottom Stage — Grounding & Assumption Ledger:** A structured, live-updating comparison drawer bound 1:1 to the selected topic spoke and current stage. It displays Person A’s anchor (source + working assumption), Person B’s anchor, whether the shared term is *Ungrounded* or *Repaired*, any *Unshared Evidence* waiting to be surfaced, and the *Evidence Gate* required before a joint frontier claim leaves the sandbox.
- **Why selected:**
  1. **Zero occlusion of differences:** Two overlapping 2D polar silhouettes with distinct stroke patterns (solid vs dashed/hatched) keep both contours and every assumption pin simultaneously legible—whereas two overlapping 3D translucent shells hide back-side spikes and inner disagreements.
  2. **Honest schematic framing:** A polar radar/lobe diagram reads unambiguously as a *schematic competence map* across named topics, avoiding the implicit “larger sphere volume = worthier person” bias.
  3. **Precision accessibility & zero WebGL risk:** Every spoke, pin, and stage control is native focusable SVG/HTML with crisp typography down to `320 px` viewports, full SSR readability, and zero GPU/WebGL fallback failures.

### Approach B (Rejected): Dual 3D Anisotropic Competence Balls in Three.js

- **Visual form:** Extending [`KnowledgeGrowth3D.tsx`](../green-app/src/components/KnowledgeGrowth3D.tsx) with two spiky Three.js spheres (Person A and Person B) orbiting and intersecting across a glowing shared-question equatorial plane, connected by 3D filament arcs when unshared facts are exchanged.
- **Why rejected:**
  1. **Severe visual occlusion:** Overlapping spiky translucent meshes make it hard to tell *why* two people disagree on a shared topic without constant manual camera orbiting.
  2. **Implicit worth bias:** Volume and surface area in 3D invite visual comparison of “who knows more overall”, violating the rule against scoring people’s worth.
  3. **Mobile & keyboard friction:** Raycasted 3D pins and camera orbit controls degrade keyboard navigation, screen-reader inspection, and `<noscript>` parity.

---

## 4. Illustrative Fictional Scenario

To make expertise, hidden profiles, and grounding concrete without inventing real-world credentials, the page uses **two clearly labelled fictional collaborators** working on a question directly aligned with Domi’s systems and human-agency writing:

> **Open Question:** *“How should a neighbourhood autonomous micro-shuttle communicate unexpected route detours and takeover moments to older riders without triggering panic or eroding independence?”*

### Collaborator Profiles & Topic Map (6 Concrete Sectors)

| Angle | Topic Sector | Person A — **Linnea Park** *(Community Mobility Coordinator, 9 yrs senior ride-alongs)* | Person B — **Mateo Alvarez** *(Embedded Routing Engineer, 7 yrs low-latency transit software)* |
|---|---|---|---|
| `0°` (Top) | **System Reliability** *(Shared focus · collision risk)* | **Tier 2 (Working Practice):** Ride-along observation logs. *Assumption:* “Reliability means rider predictability—a 30 s advance plain-language heads-up prevents panic.” | **Tier 3 (Deep Primary):** Fault-tree analysis & recovery SLAs. *Assumption:* “Reliability means $<50\text{ ms}$ fault containment; exposing intermediate planner state confuses riders.” |
| `60°` | **Rider Stress & Pacing** | **Tier 3 (Deep Primary):** 42 accompanied rides, post-ride interviews, hesitation notes. | **Tier 1 (Peripheral):** Generic UX checklists; no direct observation of older riders. |
| `120°` | **Caregiver & Community Norms** | **Tier 3 (Deep Primary):** Monthly Palo Alto–style community centre listening circles; caregiver handoff notes. | **Tier 1 (Peripheral):** Assumes riders travel solo and learn icons once. |
| `180°` (Bottom) | **Pre-Actuation Planning** | **Tier 1 (Peripheral):** Assumes the vehicle only discovers a detour at the instant the chime sounds. | **Tier 3 (Deep Primary):** Path-planner logs showing route recalculation settles **12 s before** steering actuation. |
| `240°` | **Latency & Edge Compute** | **Tier 1 (Peripheral):** Notices slow audio lag but treats compute timing as a black box. | **Tier 3 (Deep Primary):** Real-time sensor-fusion budgets and deterministic alert queues. |
| `300°` | **Takeover Handoffs** *(Shared focus · collision risk)* | **Tier 2 (Working Practice):** Observes high-frequency cockpit chimes causing rider startle and self-blame. | **Tier 2 (Working Practice):** Designs binary takeover alarms around actuator deadlines, not narrative context. |

### Hidden Profile Items (Stasser & Titus Asymmetry)

- **Shared baseline (already known to both):** Punctuality matters; sudden loud beeps are unpopular; safety bounds cannot be relaxed.
- **Linnea’s Unshared Observation (`Rider Stress & Pacing`):** Across 14 Tuesday morning rides, when a detour chime sounded without context, 9 of 14 older riders assumed *they* had pressed a wrong button and tried to apologise or grab grab-handles abruptly.
- **Mateo’s Unshared Observation (`Pre-Actuation Planning`):** The trajectory planner already commits to most detours **12 seconds before** physical steering begins, but suppresses that intent from the cabin screen to “avoid UI clutter”.

---

## 5. Visual Mapping Contract

| Visual Element | Encoding / Geometry | Conceptual Meaning | Deliberately Does *Not* Claim |
|---|---|---|---|
| **Angular sector** ($\theta_k$, $k=0\dots5$) | Fixed 60° wedge per named topic around the schematic polar map. | A specific, bounded topic relevant to the open question. | Does not represent all human knowledge or a universal taxonomy. |
| **Radial tier** ($r \in \{1, 2, 3\}$) | Three stepped concentric dashed rings (*1 · Peripheral*, *2 · Working Practice*, *3 · Deep Primary*). | Qualitative provenance depth (reading/hearsay vs structured practice vs sustained primary work). | Not a continuous IQ/skill percentage; no numeric total area is displayed. |
| **Person A contour** | Solid cyan `#65d9ed` smooth-cornered polygon + filled translucent tint (`0.12`). | Linnea’s current schematic competence profile. | Not a rigid boundary; thin sectors can still ask crucial questions. |
| **Person B contour** | Solid periwinkle `#90a8ff` polygon + filled translucent tint (`0.12`). | Mateo’s current schematic competence profile. | Larger radius in one spoke never outranks another person’s spoke. |
| **Inner GCD ring** | Subtle amber `#fbbf24` core polygon/ring at the centre ($r = 0.55$). | **Shared working compact (GCD):** mutual respect, honest provenance, shared concern for rider dignity and physical safety. | Visible only in *Coordinate on Method* mode; collapses/fragments in *Ungrounded Debate* or *Forced Consensus*. |
| **Common-topic collision marker** | Split hatched dual-arc (`cyan / periwinkle` zig-zag or separated parallel brackets) inside sectors `0°` and `300°` before Step 4. | **Lexical illusion:** both work in this sector, but their assumptions disagree. | Does **not** merge into green simply because both contours reach Tier 2+. |
| **Mutual learning (scaffolded reach)** | Translucent hatched extension band (`opacity: 0.35`, dashed outer rim) added to a partner’s Tier 1 spoke in Step 4. | **Borrowed working anchor:** understanding *why* a constraint matters via a collaborator’s evidence. | Explicitly labelled *“Provisional · borrowed from collaborator”*—does **not** jump to solid Tier 3 mastery. |
| **Unshared-evidence beacons** | Unlit hollow diamonds (`◇`) on `120°`/`60°` and `180°` that turn solid amber (`◆`) with a bridge chord when surfaced. | Unshared observations (Stasser & Titus hidden profile) brought onto the shared table. | Highlighting a beacon surfaces evidence for discussion; it does not prove a conclusion. |
| **Joint frontier lobe** | Rose/magenta `#f472b6` outward wedge between `300°` and `0°` (extending past both Tier 2/3 rims into a *“Legible Pre-Actuation Handoffs”* dashed frontier ring) in Step 5 under *Coordinate on Method*. | **Extended LCM frontier:** testing a 10 s calm spoken route-intent preview that neither discipline conceived alone. | Marked *“Hypothesis to test in 20 pilot rides”*—not an accomplished result until passing the scrutiny gate. |
| **Consensus-collapse silhouette** | Greyed, pinched inner polygon shown when toggling *Forced Consensus*. | Compromising away both spikes into vague “moderate alerts” leaves the 12 s lookahead unused. | Illustrates structural loss of complementary insight, not a rule against compromise in general. |

---

## 6. Step-by-Step Interaction Flow

The user progresses through **5 interactive stages** (via stage tabs, `Next / Previous`, or `ArrowLeft` / `ArrowRight`) and can inspect any spoke or switch coordination regimes at any stage:

1. **Step 01 · Separate Maps (Asymmetric Profiles)**
   - **On screen:** Toggle defaults to *Side-by-Side* (or *Overlay* preview). Linnea’s and Mateo’s polar competence maps appear clearly asymmetric. The common sectors (*System Reliability*, *Takeover Handoffs*) are marked as **untested overlap**.
   - **Message:** Different lived routes bring complementary peaks to the same question.
2. **Step 02 · Common Topic, Hidden Divergence (Clark & Brennan Grounding Gap)**
   - **On screen:** Maps superimpose. Sector `0°` (*System Reliability*) highlights with a split dual-colour bracket. The Grounding Ledger places Linnea’s rider-predictability assumption beside Mateo’s `<50 ms` fault-containment assumption.
   - **Interaction:** Clicking **"Assume Shared Meaning"** shows the failure mode (both argue over “reliability” without repairing the term). Clicking **"Inspect Provenance"** reveals the underlying evidence sources.
3. **Step 03 · Surface Unshared Evidence (Stasser & Titus Hidden Profile)**
   - **On screen:** By default, the bridge displays only the *Shared Talking Points* (punctuality, loud chimes are annoying)—where neither person sees a path forward. Two hollow diamond beacons (`◇`) pulse gently on `60°` (*Rider Stress*) and `180°` (*Pre-Actuation Planning*).
   - **Interaction:** The user clicks **"Surface Linnea’s Ride Log"** and **"Surface Mateo’s 12 s Lookahead"** (or *"Surface Both Unshared Notes"*). Chords connect both beacons to the central Grounding Ledger.
4. **Step 04 · Ground Terms & Scaffolded Mutual Learning**
   - **On screen:** Repairing `"System Reliability"` splits it explicitly into two reconciled constraints: *(a) $<50\text{ ms}$ actuator safety loop* + *(b) $\ge 10\text{ s}$ calm narrative notice before visible detour*. Simultaneously, a dashed translucent **scaffolded reach band** extends Mateo into `60°` (*understands self-blame panic*) and Linnea into `180°` (*knows 12 s lookahead exists*)—explicitly distinguished from their solid primary spikes.
5. **Step 05 · Coordinate on Question & Method → Extend the Frontier**
   - **On screen:** A rose `#f472b6` **Joint Frontier Lobe** (*“Legible 10 s Spoken Pre-Actuation Handoff”*) projects beyond both individuals’ original silhouettes. Below it sits the **Evidence, Critique & Revision Gate** showing the falsifiable 20-ride field test (*measure rider self-blame questions and takeover hesitation, not just latency*).
   - **Interactive Regime Switcher (Active in Step 05):**
     - `Coordinate on Method (GCD + LCM)` *(default)*: Preserves both primary spikes + inner GCD compact + rose frontier lobe.
     - `Force Consensus (Average Away)`: Collapses the silhouette inward to a pinched average; dims the 12 s lookahead beacon; the rose frontier lobe retracts inside known territory.
     - `Agree Without Scrutiny (Echo)`: Shows both agreeing prematurely on “add a nicer chime” without surfacing unshared logs or defining a pilot test; displays an amber scrutiny warning (*Agreement $\neq$ truth*).

---

## 7. Controls, Keyboard, Mobile, and SSR Fallback

### Controls Inventory

- **Stage Stepper (`01`–`05` tabs + `Prev` / `Next` buttons):** Advances through the narrative sequence; never auto-advances without user intent.
- **View Toggle (`Overlay Bridge` | `Side-by-Side Maps`):** Lets readers compare individual maps separately before seeing them superimposed.
- **Topic Spoke Selector (`6` interactive SVG wedges / buttons):** Clicking or focusing any topic updates the Grounding & Provenance Ledger on the right/below.
- **Hidden-Evidence Reveal Buttons (`Surface Linnea’s log`, `Surface Mateo’s telemetry`):** Available directly in Step 03 (and inspectable later) so the user manually triggers the hidden-profile unlock.
- **Term Repair Action (`Repair "System Reliability"`):** Toggles the Clark & Brennan grounding state in Steps 02–04.
- **Coordination Regime Selector (`Coordinate on Method` | `Force Consensus` | `Agree Without Scrutiny`):** Directly demonstrates the structural difference between preserving complementary expertise and flattening it.
- **Zero psychology sliders:** No continuous range inputs for traits, trust percentages, or agreement scores.

### Keyboard & Accessibility

- **Semantic structure:** Skip link (`Skip to the interactive map`), `<h1>`–`<h3>` hierarchy, `aria-live="polite"` on the Grounding Ledger readout so stage/regime changes announce cleanly to screen readers.
- **Keyboard shortcuts (when focus is not inside an input/button):**
  - `ArrowLeft` / `ArrowRight`: Step backward / forward across Stages `01`–`05`.
  - `1`–`6`: Jump focus/selection to Topic Sector 1–6.
- **Focus visibility:** `2px solid #92e9ff` (`outline-offset: 4px`) matching `wormholes.css`; every SVG spoke/pin is an accessible `<button>` or `role="button"` with `tabIndex={0}`, `aria-pressed`, and descriptive `aria-label`.
- **Motion:** No mandatory continuous animations. Beacon pulses pause automatically under `@media (prefers-reduced-motion: reduce)`.

### Mobile & Responsive Layout

- **`>= 960 px` (Desktop):** 2-column grid (`minmax(0, 1.15fr) minmax(0, 1fr)`) pairing the polar SVG stage on the left with the sticky Grounding & Provenance Ledger on the right.
- **`<= 959 px` (Tablet / Mobile):** Stacks vertically—Stage Controls → Polar SVG (`max-width: 440px`, square `viewBox="0 0 560 560"`, external spoke labels placed carefully within safe padding so text never clips or shrinks below readable proportions) → Grounding Ledger directly below.
- **Touch targets:** All interactive stage tabs, topic pills, and action buttons enforce `min-height: 44px` and adequate spacing (`gap >= 8px`), matching `wormholes.css`.
- **Small-screen text legibility:** On `< 560 px`, if SVG labels risk crowding, provide an adjacent horizontal scrollable/wrapping HTML **Topic Pill Bar** (`6` topics) directly synced to the SVG so labels are always crisp `13px–14px` HTML text.

### SSR & `<noscript>` Fallback

- **Server-rendered initial HTML:** Because the primary visual is pure declarative React + inline SVG (not `ssr: false` WebGL), Stage `01`’s full polar map, the complete scenario framing, the 6-topic provenance comparison table, the hidden-profile summary, and `#sources` render directly in static HTML at build time.
- **`<noscript>` callout:** Displays a clear notice (matching `wormholes/page.tsx`): interactive stage switching, hidden-evidence toggles, and regime comparisons require JavaScript, while the full topic comparison, assumptions, and primary references remain readable below in static HTML.

---

## 8. Route, File Architecture, and Dependencies

- **New dependencies:** **None.** Built strictly with existing `react`, `next`, TypeScript, inline SVG, and scoped CSS (no WebGL/Three.js, no chart library, no icon bloat).
- **Proposed file layout (for the future build phase):**
  - `green-app/src/app/shared-knowledge/page.tsx` — Server component page shell, metadata (`en-GB`, canonical URL using `process.env.NEXT_BASE_PATH ?? "/next"`), hero, reading-order nav, `<noscript>` fallback, static provenance summary, and `#sources` footer.
  - `green-app/src/app/shared-knowledge/shared-knowledge.css` — Scoped dark-navy/cyan styling reusing the `.wh-*` token grammar (`#06121e`, `#65d9ed`, `#90a8ff`, `#fbbf24`, `#f472b6`).
  - `green-app/src/lib/sharedKnowledgeModel.ts` — Pure TypeScript data model and deterministic state transition functions (6 topics, 2 collaborator profiles, hidden-profile items, grounding repair state, regime geometry, and frontier rules—unit-testable with `node --experimental-strip-types --test`).
  - `green-app/src/components/SharedKnowledgeExplorer.tsx` — Client interactive workspace rendering the SVG polar competence maps, spoke/beacon interactions, stage stepper, regime toggles, and Grounding & Provenance Ledger.
  - `green-app/tests/sharedKnowledgeModel.test.mjs` — Pure unit tests verifying state invariants (e.g., common topics remain ungrounded until repaired; surfaced unshared items never grant Tier 3 mastery; forced consensus retracts the joint frontier lobe; no scalar person scores exist).
- **Build & discovery propagation (when implemented):** Follow `scripts/blue-green-deploy.sh` (`build-green`, `verify-articles.py`, `verify-build-assets.py`) and add a quiet contextual link from homepage Act 04 / `open-learning.md` plus `llms.txt` / `agent-context.json` if desired in the build step.

---

## 9. Acceptance Criteria (for Build & Verification Phase)

1. **Visual & Conceptual Honesty:**
   - [ ] Page explicitly states the polar diagrams are *schematic personal competence maps* (never “balls” or “spheres”) and conceptual models rather than measured psychology.
   - [ ] Zero numeric “person score”, “IQ”, “worth”, or arbitrary psychological percentage sliders appear anywhere in UI or code.
   - [ ] No central AI truth arbiter appears; every claim retains its human/empirical source and passes through an explicit *Evidence, Critique & Revision* gate.
2. **Core Epistemic Mechanics Verified by Tests & Browser Interaction:**
   - [ ] Step 02 displays shared topics (`System Reliability`, `Takeover Handoffs`) as **co-located but ungrounded** with visible conflicting assumptions.
   - [ ] Step 03 separates already-shared points from unshared observations and requires surfacing unshared evidence before unlocking the reconciled definition.
   - [ ] Step 04 renders mutual learning as a **provisional borrowed anchor** distinct from solid primary mastery.
   - [ ] Step 05 contrasts **Coordinate on Method** (extending the rose joint frontier lobe while keeping spikes intact) against **Force Consensus** (collapsing the frontier inward) and **Agree Without Scrutiny** (triggering an unverified-agreement warning).
3. **Accessibility, Mobile & Static Export:**
   - [ ] Full keyboard navigation (`Tab`, `ArrowLeft`/`ArrowRight`, `1`–`6`, visible focus rings) works across all stages, spokes, and regime toggles.
   - [ ] Readable and non-overlapping at `320 px`, `375 px`, `768 px`, and `1280 px`, with `>= 44 px` touch targets and `prefers-reduced-motion` support.
   - [ ] SSR / `<noscript>` renders the initial SVG, scenario text, provenance table, and `#sources` cleanly with zero console errors.
   - [ ] Type-checking (`tsc --noEmit`), Node unit tests (`node --experimental-strip-types --test`), and `scripts/blue-green-deploy.sh build-green` pass cleanly.
