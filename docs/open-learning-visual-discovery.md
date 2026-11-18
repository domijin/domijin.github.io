# Open Learning: Visual Discovery & Cycle Proposal

*Design note · 17 November 2026 · Scope: second figure and navigation metaphor in [`articles/blog/open-learning.md`](../articles/blog/open-learning.md)*

## 1. Diagnosis of the current second figure and navigation prose

The current cycle figure in `articles/blog/open-learning.md` (lines 88–108) and `green-app/src/app/open-learning.css` (lines 11–18) relies on a single vertical list (`<ol class="learning-cycle">`) with centred `↓` glyphs and a detached `↺ Returns to open knowledge` footer:

- **Ambiguous branching and rejoining:** A single `↓` above and below `.learning-branches` points into the gap between `Independent inquiry` and `Voluntary collaboration`. There is no visual split or merge, and nothing signals that the two paths are alternatives (`or`) rather than twin mandatory steps.
- **Weak feedback loop:** `↺ Returns to open knowledge` sits below the sequence as plain text instead of closing the cycle visually, and the `Open commons` destination is omitted from the loop.
- **Scrutiny gate under-emphasised:** While `Evidence, critique, revision` has a heavier border, the layout does not visually enforce that *all* routes—including AI-assisted claims—must converge through critique before entering `New knowledge`.
- **Navigation metaphor unanchored:** In *A world you can navigate*, the *Avatar* forest metaphor explains how learners follow distinct paths and make differences legible without a central authority (“AI is not Eywa”). At present that relationship lives only in prose, though any visual support must remain a restrained whitepaper schematic—no game UI, skill-tree unlocks, or decorative forest artwork.

**Explanatory contract (conceptual model only):** Every visual here represents a *proposed* epistemic relationship, not measured programme outcomes or live software telemetry.

---

## 2. Two concrete alternatives for the discovery cycle

Required cycle:

`Open knowledge` → `Individual learning and mastery` → equal parallel paths (`Independent inquiry` **or** `Voluntary collaboration`) → `Evidence, critique, revision` → `New knowledge` → `Open commons` → back to `Open knowledge`.

### Alternative A (Selected): Semantic HTML/CSS Grid with exact CSS-border fork/merge connectors and a right-hand return rail

- **How it works:** Keep semantic `<figure class="learning-figure">` markup (already special-cased in `green-app/src/components/GreenExperience.tsx` so it renders without an extra wrapper card) and place the 5-stage spine in column 1 of a 2-column CSS grid, with a continuous return rail in column 2. Equal-cell CSS connectors draw a flush `┌──┴──┐` fork (with a centred `or` marker) and `└──┬──┘` merge directly on the centres of the two side-by-side branch boxes at every viewport width. `New knowledge` feeds horizontally into an `Open commons` pill, then travels up the right rail into `Open knowledge`.
- **Mobile & desktop behaviour:** All node labels remain native HTML text (`15–16px` desktop, `13.5–14px` mobile), never shrinking inside a scaled SVG `viewBox`. Both branches stay side-by-side even down to `320px` (the right rail is only `1.5rem` wide on `<= 540px`, leaving comfortable room for `"Independent inquiry"` and `"Voluntary collaboration"`), and the `Open commons` return label stays horizontal on both mobile and desktop.

### Alternative B: Inline SVG flow diagram (`.diagram-figure` style)

- **How it works:** Replace the HTML list with a single inline `<svg viewBox="0 0 580 460">` (matching `all-about-chatgpt.md` and `open-learning-lab.md`) using cubic Bézier fork/merge paths, `<marker>` arrowheads, and a curved right-margin return arc labelled `Open commons`.
- **Why not selected:**
  1. **Mobile typography degradation:** Scaling a `580px`-wide SVG down to a `324px` phone column shrinks SVG text to ~`8.5px`. Avoiding that requires duplicating desktop (horizontal) and mobile (vertical) SVGs, which complicates maintenance.
  2. **Reader integration:** `GreenExperience.tsx` treats `<figure class="learning-figure">` natively without extra card chrome and `render-open-learning.py` already syncs `open-learning.css`.

**Recommendation:** Adopt **Alternative A**. It delivers unambiguous branching, rejoining, non-bypassable scrutiny, and a true closed return loop with zero JavaScript, zero dependencies, and reliable mobile readability.

---

## 3. Implementable sketch for the discovery cycle (Alternative A)

### HTML block for `articles/blog/open-learning.md`

*(Also update the adjacent `<details class="source-record">` Mermaid block so `N["New knowledge"] --> O["Open commons"] --> K` matches.)*

```html
<figure class="learning-figure">
<div class="learning-cycle-map">
  <div class="learning-step learning-commons">Open knowledge</div>
  <div class="learning-rail-top" aria-hidden="true"></div>

  <div class="learning-spine">
    <span class="learning-arrow" aria-hidden="true">↓</span>
    <div class="learning-step">Individual learning and mastery</div>

    <div class="learning-fork" aria-hidden="true">
      <div class="learning-fork-stem"></div>
      <div class="learning-fork-arms"><span></span><span></span></div>
      <span class="learning-or">or</span>
    </div>

    <div class="learning-branches" role="group" aria-label="Equal alternative paths">
      <div class="learning-step">Independent inquiry</div>
      <div class="learning-step">Voluntary collaboration</div>
    </div>

    <div class="learning-merge" aria-hidden="true">
      <div class="learning-merge-arms"><span></span><span></span></div>
      <div class="learning-merge-stem">↓</div>
    </div>

    <div class="learning-step learning-evidence">
      Evidence, critique, revision
      <span class="learning-step-note">Required scrutiny — no claim bypasses review</span>
    </div>

    <span class="learning-arrow" aria-hidden="true">↓</span>
    <div class="learning-step">New knowledge</div>
  </div>

  <div class="learning-rail-mid" aria-hidden="true"></div>

  <div class="learning-return-row">
    <span class="learning-return-drop" aria-hidden="true">↳</span>
    <span class="learning-step learning-commons learning-commons-pill">Open commons</span>
    <span class="learning-return-line" aria-hidden="true"></span>
  </div>
  <div class="learning-rail-bottom" aria-hidden="true"></div>
</div>
<figcaption>A proposed cycle: independent inquiry and voluntary collaboration are equal, optional routes into the same scrutiny gate. No generated or individual claim bypasses critique before new knowledge returns to the open commons.</figcaption>
</figure>
```

### CSS additions/updates for `green-app/src/app/open-learning.css`

Preserves the established blue/cyan palette (`#f0f9ff`, `#e0f2fe`, `#bae6fd`, `#7dd3fc`, `#0284c7`, `#0369a1`, `#1e293b`, `#475569`):

```css
.learning-cycle-map {
  --branch-gap: 1rem;
  --rail-col: 2.25rem;
  --rail-stroke: #0369a1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--rail-col);
  align-items: stretch;
  text-align: center;
}

.learning-spine {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.learning-step {
  display: block;
  padding: .75rem .9rem;
  border: 1px solid #bae6fd;
  background: #f0f9ff;
  border-radius: 10px;
}

.learning-commons {
  border-color: #7dd3fc;
  background: #f8fafc;
  font-weight: 600;
}

.learning-step-note {
  display: block;
  margin-top: .2rem;
  font-size: 13px;
  font-weight: 400;
  color: #0369a1;
}

.learning-arrow {
  display: block;
  color: #0369a1;
  padding: .2rem 0;
  line-height: 1.2;
}

/* Equal parallel paths + exact fork/merge connectors */
.learning-fork, .learning-merge { position: relative; }

.learning-fork-stem {
  width: 1.5px;
  height: 10px;
  background: var(--rail-stroke);
  margin: 0 auto;
}

.learning-fork-arms, .learning-merge-arms {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--branch-gap);
  height: 14px;
}

.learning-fork-arms span, .learning-merge-arms span {
  position: relative;
  display: block;
}

.learning-fork-arms span:first-child::before,
.learning-fork-arms span:last-child::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  border-top: 1.5px solid var(--rail-stroke);
}

.learning-fork-arms span:first-child::before {
  left: 50%;
  right: calc(-0.5 * var(--branch-gap));
  border-left: 1.5px solid var(--rail-stroke);
  border-top-left-radius: 6px;
}

.learning-fork-arms span:last-child::before {
  left: calc(-0.5 * var(--branch-gap));
  right: 50%;
  border-right: 1.5px solid var(--rail-stroke);
  border-top-right-radius: 6px;
}

.learning-or {
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translateX(-50%);
  padding: .05rem .45rem;
  border: 1px solid #bae6fd;
  border-radius: 999px;
  background: #f0f9ff;
  color: #0369a1;
  font-size: 12px;
  line-height: 1.2;
}

.learning-branches {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--branch-gap);
}

.learning-branches .learning-step {
  display: flex;
  align-items: center;
  justify-content: center;
}

.learning-merge-arms span:first-child::before,
.learning-merge-arms span:last-child::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  border-bottom: 1.5px solid var(--rail-stroke);
}

.learning-merge-arms span:first-child::before {
  left: 50%;
  right: calc(-0.5 * var(--branch-gap));
  border-left: 1.5px solid var(--rail-stroke);
  border-bottom-left-radius: 6px;
}

.learning-merge-arms span:last-child::before {
  left: calc(-0.5 * var(--branch-gap));
  right: 50%;
  border-right: 1.5px solid var(--rail-stroke);
  border-bottom-right-radius: 6px;
}

.learning-merge-stem {
  color: var(--rail-stroke);
  line-height: 1.1;
  padding-bottom: .15rem;
}

/* Right-hand return rail: New knowledge -> Open commons -> Open knowledge */
.learning-rail-top, .learning-rail-mid, .learning-rail-bottom {
  position: relative;
  grid-column: 2;
}

.learning-rail-top::before {
  content: "";
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 0;
  width: 50%;
  border-top: 1.5px solid var(--rail-stroke);
  border-right: 1.5px solid var(--rail-stroke);
  border-top-right-radius: 8px;
}

.learning-rail-top::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-2px, -4.5px);
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 7px solid var(--rail-stroke);
}

.learning-rail-mid::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1.5px;
  transform: translateX(-1.5px);
  background: var(--rail-stroke);
}

.learning-return-row {
  grid-column: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: .5rem;
  padding-top: .65rem;
}

.learning-return-drop { color: var(--rail-stroke); font-size: 16px; }

.learning-commons-pill {
  padding: .35rem .85rem;
  border-radius: 999px;
  font-size: 14px;
}

.learning-return-line {
  flex: 0 1 2rem;
  height: 1.5px;
  background: var(--rail-stroke);
}

.learning-rail-bottom::before {
  content: "";
  position: absolute;
  top: 0;
  height: calc(50% + .325rem);
  left: 0;
  width: 50%;
  border-bottom: 1.5px solid var(--rail-stroke);
  border-right: 1.5px solid var(--rail-stroke);
  border-bottom-right-radius: 8px;
}

@media (max-width: 540px) {
  .learning-cycle-map {
    --branch-gap: .5rem;
    --rail-col: 1.5rem;
    font-size: 14px;
  }
  .learning-step { padding: .6rem .5rem; }
  .learning-commons-pill { padding: .3rem .75rem; font-size: 13px; }
  .learning-step-note { font-size: 12px; }
}
```

---

## 4. Optional restrained visual for “A world you can navigate” (only if needed)

**Editorial check:** Per `AGENTS.md` (*one explanatory purpose per figure*) and the draft’s own rule against over-explaining, the essay already works with two figures. Add a third figure in *A world you can navigate* **only** if readers find *“making differences legible”* too abstract without a diagram.

If included, it should be a quiet **Converging routes** card-pair—not an *Avatar* tree, skill tree, or AI oracle:

```html
<figure class="learning-figure">
<div class="learning-routes">
  <div class="learning-route-list">
    <div class="learning-route"><strong>Route A</strong><span>Prior path &amp; working assumptions</span></div>
    <div class="learning-route"><strong>Route B</strong><span>Different path &amp; working assumptions</span></div>
  </div>
  <div class="learning-route-join" aria-hidden="true">→</div>
  <div class="learning-step learning-commons">
    Shared open question
    <span class="learning-step-note">Differences stay visible; no central arbiter certifies truth</span>
  </div>
</div>
<figcaption>Conceptual illustration: learners can reach the same question from different starting points. Making prior routes and assumptions visible supports comparison without turning AI into a central authority.</figcaption>
</figure>
```

Minimal supporting CSS (stacks vertically at `<= 540px`, changing `→` cleanly or hiding the arrow on narrow screens):

```css
.learning-routes {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) auto minmax(0, 1fr);
  gap: .75rem;
  align-items: center;
}
.learning-route-list { display: grid; gap: .6rem; }
.learning-route {
  padding: .65rem .85rem;
  border: 1px solid #bae6fd;
  background: #f0f9ff;
  border-radius: 10px;
  font-size: 14px;
}
.learning-route strong { display: block; color: #0369a1; font-size: 13px; }
.learning-route-join { color: #0369a1; text-align: center; }
@media (max-width: 540px) {
  .learning-routes { grid-template-columns: 1fr; }
  .learning-route-join { transform: rotate(90deg); }
}
```

**When to omit it:** If the prose in *A world you can navigate* already feels clear alongside the two structural figures, leave this section text-only and rely on the prose caveat (*“The forest is an illustration, not a governance model. AI is not Eywa.”*).

## Integration note

Adopted the fork, merge and return rail. Kept the original cycle’s direct return from New knowledge to Open knowledge rather than adding a redundant Open commons node. The paths allow independent inquiry, voluntary collaboration or both. No third figure was added.
