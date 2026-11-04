# Working on Domi’s website

Read [the project lessons](docs/editorial-and-engineering-lessons.md) before changing editorial content, scientific figures or deployment behaviour.

## Editorial rules

- Write in Domi’s grounded, reflective first-person voice. Use his actual Substack essays as references for rhythm and vocabulary. Prefer scenes, specific observations and questions to promotional abstractions. Use understated British English in new editorial prose; preserve original quotations and published titles.
- Let the work demonstrate competence. Avoid recruitment or investor pitches, status language and invented credentials, employers, architecture or results.
- Treat the biography/book idea as a narrative structure. Use natural section names, connections and reading order; do not add theatrical chapter, monograph or publishing terminology.
- Serve complete articles on this site. Original publication links belong in attribution footnotes. Preserve source text; label any adaptation, excerpt, reconstruction or new commentary accurately.
- Check claims against the original article, repository or research document. A proposal is not an implementation; a target is not a measured result. Propagate corrections through article copies, UI data, metadata, `llms.txt`, `llms-full.txt` and `agent-context.json`.

## Figures and interactions

- Give each figure one explanatory purpose. Keep the astrophysical simulation separate from the interactive map of writings and projects.
- Identify units, time scales, assumptions and sources. Distinguish research results, analytic approximations, synthetic experiments and conceptual illustrations. Do not imply that an animation reproduces a research simulation or that a merger-rate density is a detector event count.
- Derive visual behaviour from the stated model. A boundary described as a ball must be three-dimensional. Keep the GIF, interactive figure and captions consistent.
- Distinguish lexical matching, embedding similarity and generated suggestions. Explain downloads and capability requirements when they affect a visitor’s choice. Provide useful fallbacks and accurate status messages.
- Preserve the established blue/cyan palette and mobile readability. Use diagrams to explain mechanisms, with accompanying readable text and controls.

## Build and delivery

- Edit source files; use the existing export/deployment scripts to produce static output. Inspect local changes before working and preserve unrelated edits.
- Use `scripts/blue-green-deploy.sh` for staged builds and promotion. Its asset retention and verification steps protect clients holding older HTML; do not replace it with a raw export-and-copy shortcut.
- Verify article integrity, build asset references and relevant exported routes. Compilation, browser interaction and live deployment are different checks: report only those performed.
- Investigate secret-scanning alerts before classifying them. Do not expose credentials or bypass protection based on a familiar library name. Review the existing build scrubber when dependencies change.
- State delivery status precisely: edited, built, committed, pushed, deployed and live-verified are separate states. Earlier handoff summaries can be stale; inspect the repository and deployment evidence.
