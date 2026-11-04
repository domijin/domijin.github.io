# Lessons from the website revisions

Recorded 3 November 2026. This is a working guide drawn from user corrections, repository history and the current implementation. It records decisions and failure modes, rather than certifying every existing page or scientific claim.

## 1. Credibility comes from faithful evidence

The early positioning used luxury-brand language: provenance, monographs, ambitious questions and stakeholder-specific pitches. Domi asked for a modest, technical and intellectual voice. The useful change was to make the writing concrete and allow readers to form their own judgement of the work.

The more serious failure was factual. Commit `1dabd83` records that an advertising essay had acquired an invented eight-agent architecture, latency guarantees, performance behaviour and employer claims. The correction restored the published essay and replaced the simulated business metrics with a traffic-light estimation experiment using synthetic observations and known ground truth.

**Rule:** build the claim from its source. Plausibility, technical sophistication and repetition across generated pages do not constitute evidence. When a source supports an idea but not an implementation, describe the idea. Trace corrections across every representation, including discovery endpoints.

Before publishing a quantitative claim, record its source location, units, population, time horizon and status: observation, estimate, proposal, target or measured result. If those cannot be established, qualify or remove the claim.

## 2. Narrative should emerge from the experience

The book analogy initially became literal interface language. Domi clarified that it was a concept: tell a coherent intellectual story through lived experience, practical work and social responsibility.

**Rule:** organise the journey without making readers navigate a publishing metaphor. Natural headings, related work, progress cues and a clear reading sequence can carry the structure.

The four scales—complex systems, decisions, human agency and collective competence—are an editorial connection between bodies of work. They do not prove that the same scientific model explains all four.

## 3. Use the author’s writing as the voice reference

Substack was the requested reference: first-person observations, concrete situations, short paragraphs and questions developed through experience. An abstract prestige brief was too weak a substitute.

**Rule:** read representative source passages before rewriting. Preserve the author’s reasoning, uncertainty and specific details. Do not invent a scene or personal recollection to make a biography more vivid. Keep quotations and original titles intact; distinguish new framing from source text.

Example editorial choices:

- “Essays and technical notes” gives readers a useful label.
- “If you are working on a related question, I would be glad to compare notes” makes correspondence straightforward.
- A repository link and a description of its actual contents provide evidence of work.

## 4. Self-sufficient publishing means the reader can stay

“Local archive” foregrounded storage and migration rather than reading. Domi wanted complete articles available here, with external publication references as quiet footnotes.

**Rule:** local reading is the primary path. Retain original publication URL, date and title as provenance. Check that HTML, Markdown and embedded reader content agree, including lists, equations, quotations and article endings. A summary or rewritten essay must not be labelled a complete original copy.

Relevant locations: `articles/`, `green-app/src/data/bookContentData.ts`, `green-app/src/data/contextMapData.ts` and `scripts/verify-articles.py`.

## 5. Visuals need a clear contract with the reader

Domi explicitly separated the map of writings from the globular-cluster simulation. Combining them blurred the distinction between navigation and scientific explanation. Later revisions also corrected the knowledge-boundary metaphor from a circle to a three-dimensional ball.

**Rule:** specify what each visual represents before polishing its appearance. Define the mapping from a quantity or concept to position, size, colour, motion and labels. Keep the caption, implementation and exported animation aligned.

For the cluster and LISA views, document the physical time scale and its relation to relaxation time, the stellar-evolution approximation, binary parameters, detector assumptions and source of research rates. A merger-rate density, a simulated population and a detectable source count are different quantities. Research-derived numbers need the conditions under which they were obtained.

For the knowledge figure, describe the boundary as a conceptual model. Its shape is not a measured inventory of human knowledge. Generated concepts and similarity scores are model outputs, not evidence that a proposition is true.

## 6. Useful AI interactions expose their limits

The browser-model notes document two concrete matching failures: semantic similarity could rank a neighbouring concept above an explicit vocabulary match, and normalising by the best match could give an unrelated prompt a strong-looking score. The implementation introduced hybrid lexical/semantic scoring and an absolute similarity floor.

**Rule:** verify relevant, ambiguous and unrelated prompts. Empty matches can be correct. Keep the keyword fallback useful, distinguish encoder ranking from decoder generation, and report the actual operating mode.

Local inference also requires careful wording: model downloads are network activity. “Inference runs locally” is more precise than an unconditional claim of zero network calls or complete privacy. Download sizes and supported model IDs are dependency-specific observations; recheck them when changing packages. See `in-browser-model-options.md`.

## 7. A successful build is only one delivery checkpoint

Commit `69ffe52` records a dependency class name triggering secret scanning. Commits `c8d9d45` and `cc1beeb` address another failure: replacing hashed assets could break visitors still holding earlier HTML, while retaining only part of an old generation could leave the same problem unresolved.

**Rule:** treat HTML, manifests and chunks as a consistent release. Retain the outgoing assets needed by cached clients and verify their references. Use the deployment wrapper that includes these steps; invoking the export script directly does not provide the same protection.

Inspect security alerts using evidence. The existing scrubber is a narrow dependency-specific workaround, not a general permission to rename suspicious strings or bypass push protection.

Report each delivery checkpoint separately. A dry-run push is not a push, an exported root directory is not proof of a live release, and HTTP 200 alone does not establish that new content or interactions work.

## Applying the lessons

1. Inspect current changes and identify the source material for the requested revision.
2. Specify the reader’s purpose, proposed wording and each figure’s explanatory contract.
3. Implement in the source and propagate shared claims to the relevant public representations.
4. Run the checks appropriate to the change: article integrity, compilation/types, asset references, interaction checks and live route/content checks as applicable.
5. Review the result against the author’s actual writing and the evidence behind its claims.
6. Report what changed, what was verified and what remains uncertain.

Existing verification and release tools live in `scripts/`: `verify-articles.py`, `verify-build-assets.py`, `validate-live.py`, `keep-previous-assets.py` and `blue-green-deploy.sh`. Inspect their current behaviour before using them; a checklist cannot substitute for understanding what a check establishes.

## State at the time of this reflection

The inspected checkout is at commit `8064074` with existing uncommitted changes in simulation, knowledge-figure, research-copy and exported assets. The earlier handoff’s statement that `f39b3e4` was awaiting push is therefore stale as an account of the local history. This documentation change does not certify the current deployment or include those existing edits in a release.
