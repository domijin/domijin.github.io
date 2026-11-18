# Shared knowledge — review and verification

17 November 2026. Local implementation and export only; no commit, push or live deployment was performed for this task.

## Work completed

The research and governing implementation specification were written before implementation. Antigravity Gemini 4 Hydrogen explored the model and visual design, then built the state model and interactive page in separate tasks. The parent integrated the route into Human Agency, Working Together, Open Learning, the archive and discovery metadata.

Astra reviewed the article/privacy work and then independently reviewed the new model, page, integration and research attribution. The parent applied these findings:

- Specific reconstruction checks no longer certify whole topics as understood. Common-topic markers remain distinct from the two borrowed-context overlays.
- Reconstruction options appear only after the corresponding note is shared and explained.
- Hypotheses, fictional observations and conclusions consistently concern exercise-step completion. Independent practice, later reconstruction and transfer remain unanswered questions.
- Global single-character shortcuts were removed; native topic buttons and stage navigation remain keyboard accessible.
- Mermaid SVGs use native text rather than foreignObject for portability.

Additional refinement removed fabricated sample counts, preserved the original competence contours, cleared a selected scenario when its hypothesis changes, simplified the surrounding prose, and retained mixed/contradicting results as valid provisional contributions.

## Checks performed

- Nine state-model invariant tests passed: prerequisites, immutable baseline maps, disclosure withdrawal, changed interpretations, evidence/review invalidation, mixed and negative contributions, and reset.
- Sixteen DOM interaction assertions passed at 390px and 320px, using the actual React page and component bundled into self-contained HTML and inspected with html_preview. These covered the full exchange, corrective feedback, withheld options, unchanged contours, mixed/negative notes, hypothesis changes, withdrawal and reset, with no horizontal page overflow.
- Visual inspection at 1100px, 390px and 728px (including the combined map after both exchanges and question alignment). No console errors in the inspected previews. This was an HTML preview check, not a live deployed-browser test.
- TypeScript check passed. Both staged and root builds passed using scripts/blue-green-deploy.sh; all referenced build assets were present after asset retention and the narrow editorial scrub.
- Article verifier: 29 articles plus archive index, zero problems. Earlier article-integrity comparison preserved all 39 original prose blocks after the previously authorised course/table wording corrections.
- Root and staged shared-knowledge exports contain two server-rendered starting SVG maps and readable initial prose. Both canonical URLs are correct; all 13 local links on each page resolve in the export.
- Both Mermaid SVGs parse as XML and contain no foreignObject. The post references both existing rendered assets.
- The retained-client scrub regression preserves unrelated prose and executable code and is idempotent. A scan of 393 public paths found none of the known withdrawn prompt-record markers.
- git diff --check passed.

The public experience is a fictional conceptual illustration, not a programme evaluation, mastery assessment, profile system or publication service. Raw prompts remain outside the repository as private editorial reference. Research references motivate design questions; they do not establish that this interface improves learning or collaboration.
