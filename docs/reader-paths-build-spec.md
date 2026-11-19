# Three ways into the work

## Editorial design

Give every reader the same account of Domi. In 2023 he was weighing which work he could sustain. Today his question includes the cost of winning and who bears it. Describe competition as an incentive and compliance as a minimum. Present the judgement as a current reflection on earlier notes. Keep personal correspondence and the recipient outside the public copy.

Interpret the three open paths as ways a reader can take part. Building a self-sustaining venture can support all three.

- **Back an idea.** Start with a founder’s account of the need, then examine the work behind it.
- **Build together.** Start with a design or technical question, then read the field observation or proposal that motivated it.
- **Learn and teach.** Start with an essay or learning experiment, then try or examine a related piece of work.

Preserve the four scales of work as the biographical sequence. Place the three invitations beside the opening reflection, before that longer sequence. Use original titles, local article links, short reasons to read and accurate descriptions of the status of each work.

## Interaction and build contract

1. Export a complete first visit with the reflection, three paths and useful ordinary links. The archive and existing navigation remain reachable. Enhance the choices after hydration. Support the static root and staged base path.
2. Let a visitor explicitly select an interest. When they open a curated essay in the existing reader, use that action to suggest a different piece and explain the connection. An explicit choice takes priority. Give readers an easy return to the overview. Keep interactions keyboard accessible and avoid moving focus on recommendation changes.
3. Use deterministic local data and ephemeral client state. No identification, third-party lookups or new analytics. Selection describes this visit and should never change biographical facts. Retain ordinary link behaviour for modified clicks.
4. Integrate the shared framing into the homepage metadata and relevant agent discovery files. Preserve article originals. Build through the blue-green wrapper in staging.
5. Review the implementation twice. First verify audience intent, actual titles, link targets and selection logic. Then exercise the exported interface, including no JavaScript, mobile layout, keyboard controls, opening and closing the reader, suggestions and reset. Verify article integrity and asset references. Record findings and corrections.

## Example visits

Someone considering backing a venture may want to know whose problem it solves. “Starting a New Venture” records the conversation that prompted the work with older adults. A second piece can bring the reader closer to what Domi observed in the field. Someone looking to collaborate may instead want the design first and the field account second.

A teacher arriving without a particular role in mind can open a learning essay directly. The reader can offer a related piece and say what question connects the two. Opening an essay is evidence of interest in that piece. It tells us little about the visitor’s profession or whether they agree with its argument.

## Review and verification, 18 November 2026

Two Gemini 4 Hydrogen agents implemented the initial reader experience and discovery updates. Two further Hydrogen passes addressed review feedback.

1. The first export depended on a learning article from another edit in progress. The revised guide uses six article placements drawn from five established pieces, including the Open Learning Lab protocol. It offers one suggestion at the end of an essay. Each control has a distinct accessible name and the static export exposes ordinary article links.
2. On a 375-pixel viewport, the first path button and its suggested essay were 1,387 pixels apart. Grouping the choices above the suggestion reduced that distance to 78 pixels in the same test. The final captions connect the older-driver account with the household agent through a question about control. They also identify the study protocol as earlier than the education draft.

Both root and staged exports were built in a separate local copy based on ebc5ec0 while other archive and release changes were in progress. Headless Chrome exercised the two exports at 375 and 1,280 pixels. Checks covered the six static article placements with JavaScript disabled, keyboard selection, explicit priority, essay-based suggestions, modified-click handling, Escape and focus return, reset, fresh state after reload and horizontal fit. The isolated archive passed its structural check across 29 articles and its index. The asset check passed after correcting the retention helper to collect chunks referenced only by outgoing build manifests.
