# Open Learning Visual Framework (Figure 1 Proposal)

Status: design proposal for [articles/blog/open-learning.md](../articles/blog/open-learning.md) and [green-app/src/app/open-learning.css](../green-app/src/app/open-learning.css). Preserves the existing working draft voice, blue/cyan palette (`#f0f9ff`–`#0369a1`), explicit conceptual status, and two-figure scope (Figure 2’s knowledge-commons cycle already covers a distinct mechanism; no third figure is proposed).

## 1. Explanatory contract and current gaps

**What Figure 1 must clarify:**

1. **Four human capabilities (equal, non-sequential pillars):** Purpose (effective altruism), Possibility (future thinking), Communication (design thinking), and Resilience (positive psychology).
2. **Three independent experience principles (cross-cutting, non-sequential):** Informative (orientation), Interactive (action, feedback, revision), and Adaptive (challenge and support evolving with learner agency).
3. **Orthogonality and joint orientation:** Every principle applies across all four capabilities; no principle sits under a single pillar, neither dimension is a prerequisite stage for the other, and together they inform both **individual mastery** and **collective discovery**.

**Why the current first diagram falls short:**

- **Weak relational signal:** Two side-by-side cards above a single `Both inform ↓` label look like two separate lists feeding an output pipeline rather than two cross-cutting dimensions.
- **Mobile reading order implies sequence:** Below `540px`, the two panels stack vertically (`Human capabilities` above `Learning experience`), visually suggesting a step-by-step flow.
- **Redundancy risk:** Repeating prose already presented in the two tables above without adding spatial clarity gives the reader no new structural insight.

## 2. Two concrete alternatives

### Alternative 1 (Selected): Cross-Cutting Orthogonal Weave (HTML + CSS)

- **Structure:** Four equal vertical **pillar columns** (Purpose, Possibility, Communication, Resilience) sit at the top of a 4-column grid, with faint vertical guide tracks extending downward behind **three full-width horizontal principle bands** (Informative, Interactive, Adaptive). Below the woven field, a balanced two-column horizon pairs **Individual mastery** and **Collective discovery** side by side.
- **Mobile (`<= 560px`):** The four pillars switch to a **2×2 grid** (preventing a 1–4 vertical sequence and keeping labels single-line at `14–15px`), followed by a compact `×` junction (`Each capability × all three principles`), the three full-width horizontal bands, and the side-by-side two-column horizon.
- **Why it works:** Directly encodes Domi’s spatial language (*pillars* as vertical supports, *principles* as horizontal strata spanning all four pillars). Visually impossible to nest a principle under one pillar, avoids tiny scaled SVG text on narrow screens, and keeps text ultra-concise so it complements rather than duplicates the preceding tables.

### Alternative 2: Dual-Axis Coordinate L-Frame (HTML + CSS)

- **Structure:** Places the four human capabilities along a left vertical axis and the three experience principles along a top horizontal axis, bounding a single unified light-cyan interior field (`Individual mastery` · `Collective discovery`) rather than 12 text-filled cells.
- **Trade-off / why not selected:** While geometrically pure on desktop (`>= 640px`), a 2D L-frame (1 label rail + 3 principle columns) becomes too cramped below `560px` and has to collapse into two stacked groups—reintroducing the same vertical stacking problem as the current diagram. A single blank box inside a 4×3 frame can also resemble an unfinished matrix table.

## 3. Implementable sketch for Alternative 1

### HTML block for `articles/blog/open-learning.md`

Keep no blank lines inside `<figure class="learning-figure">…</figure>` so `scripts/regen-book-content.py` (`split_blocks`) and `green-app/src/components/GreenExperience.tsx` keep the figure intact as a single block.

```html
<figure class="learning-figure" aria-labelledby="learning-model-caption">
<div class="learning-weave">
<div class="learning-tracks" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
<p class="learning-axis-label learning-axis-pillars">Human capabilities · four equal pillars</p>
<ul class="learning-pillars">
<li><strong>Purpose</strong><span>Effective altruism</span></li>
<li><strong>Possibility</strong><span>Future thinking</span></li>
<li><strong>Communication</strong><span>Design thinking</span></li>
<li><strong>Resilience</strong><span>Positive psychology</span></li>
</ul>
<p class="learning-axis-label learning-axis-principles">Cross-cut equally by three experience principles</p>
<ul class="learning-principles">
<li><strong>Informative</strong><span>Orientation across where you came from, are, and could go</span></li>
<li><strong>Interactive</strong><span>Action, feedback, and revision</span></li>
<li><strong>Adaptive</strong><span>Challenge and support evolve with agency</span></li>
</ul>
</div>
<p class="learning-join">Together, without fixed order, both inform <span aria-hidden="true">↓</span></p>
<div class="learning-horizons">
<p><strong>Individual mastery</strong></p>
<p><strong>Collective discovery</strong></p>
</div>
<figcaption id="learning-model-caption">Proposed conceptual framework (working hypothesis, not a sequence or measured outcome): three independent experience principles cut across all four human capabilities to inform both individual mastery and collective discovery.</figcaption>
</figure>
```

### CSS additions/updates in `green-app/src/app/open-learning.css`

Keep existing `.learning-cycle`, `.learning-step`, `.learning-branches`, `.learning-arrow`, `.learning-evidence`, `.learning-return`, `.learning-join`, and `.learning-figure figcaption` rules for Figure 2; replace the old `.learning-dimensions`, `.learning-panel`, `.learning-label`, and `.learning-outcome` rules with:

```css
.learning-weave { position: relative; display: grid; gap: .75rem; }
.learning-tracks { position: absolute; inset: 1.75rem 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; pointer-events: none; z-index: 0; }
.learning-tracks span { background: rgba(224, 242, 254, .35); border: 1px dashed #bae6fd; border-radius: 10px; }
.learning-axis-label { position: relative; z-index: 1; margin: 0; font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: #0369a1; }
.learning-axis-principles { margin-top: .25rem; text-align: center; background: rgba(255, 255, 255, .92); justify-self: center; padding: .15rem .65rem; border-radius: 999px; border: 1px solid #bae6fd; }
.learning-pillars { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; }
.learning-pillars li { background: #f0f9ff; border: 1px solid #7dd3fc; border-top: 3px solid #0284c7; border-radius: 10px; padding: .75rem .65rem; text-align: center; }
.learning-pillars strong, .learning-pillars span { display: block; }
.learning-pillars strong { font-size: 15px; color: #0f172a; }
.learning-pillars span { font-size: 13px; color: #0369a1; margin-top: .15rem; }
.learning-principles { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; }
.learning-principles li { display: flex; flex-wrap: wrap; align-items: baseline; gap: .25rem .65rem; background: rgba(240, 249, 255, .94); border: 1px solid #7dd3fc; border-left: 3px solid #0284c7; border-radius: 10px; padding: .6rem .85rem; }
.learning-principles strong { font-size: 15px; color: #0f172a; min-width: 6.5rem; }
.learning-principles span { font-size: 14px; color: #334155; }
.learning-horizons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; }
.learning-horizons p { margin: 0; text-align: center; padding: .85rem .75rem; background: #e0f2fe; border: 1px solid #7dd3fc; border-radius: 12px; color: #0c4a6e; }
@media (max-width: 560px) {
  .learning-tracks { display: none; }
  .learning-pillars { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; }
  .learning-principles strong { min-width: 0; }
  .learning-horizons { gap: .5rem; }
}
```

### Alignment note for the Mermaid record

If implemented in `articles/blog/open-learning.md`, keep `<details class="source-record">` updated so the Mermaid diagram also splits the convergence node into two equal endpoints (`Individual mastery` and `Collective discovery`) rather than a single stacked box.

## Integration note

The author subsequently requested **Potentials** instead of **Possibility** and explicit course names. The article uses four proposed courses (Effective altruism, Future thinking, Design thinking, Positive psychology), retaining the independent experience principles and the two equal outcomes. The original proposal above records the earlier terminology.
