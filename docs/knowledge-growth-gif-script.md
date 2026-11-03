# "How a model's knowledge boundary grows" — GIF storyboard

A ~16-second animated GIF for the front-page section **How I Think a Language
Model Works**.

The premise comes from *All About ChatGPT* (February 2023): *"if we could use a
ring to represent basic human knowledge, the spikes on such a ring could
represent the domain knowledge in each different area"*, and *"the maximum
capacity of such statistics-based models would be extracting the underlying
patterns discovered by gifted researchers from well-studied areas to those
correlated but under-studied areas."*

This is a sketch of a question, not a claim: **what happens to the boundary of
what a model can recall, as human knowledge keeps moving?**

---

## Visual language

| Element | Meaning | Colour |
|---|---|---|
| Spiky closed outline | collective human knowledge — the **same silhouette** as the model, but sharper | `#1DAEDF` |
| One spike per domain | that domain's depth of knowledge — **anisotropic**: some fields are deep, most are thin | `#1DAEDF` |
| Bright dot on a spike tip | an expert's result — a breakthrough | `#fbbf24` |
| Growing closed boundary | what the model can recall — a *smoother* copy of the human shape | `#7dd3fc` |
| Dashed stream, expert → model | distillation: the result becomes training data | `#fbbf24` |
| Dashed arc where the two outlines cross | the model is outside the human graph | `#f472b6` |

**The shapes are related on purpose.** The human outline is a polar curve
whose radius carries a sharp Gaussian spike per domain; the model's outline
is the same curve with the spikes broadened and the whole thing scaled down.
So the model looks like a smoothed, lagging copy of what humanity knows —
which is the argument. At the end the two outlines are compared directly, and
the comparison is the point:

- the model is **inside** the human outline almost everywhere;
- it reaches **close** to the edge in mathematics, without touching it;
- it **crosses** only in the two fields where the frontier is sharpest and
  most codifiable — game playing and protein structure.

The mechanism: a breakthrough grows the human spike (the frontier moves out)
and, separately, grows the model's reach toward that field (the result becomes
training data). Whether the model catches up depends on how fast the two
move. In the deep fields it catches up and passes; in the thin fields it
gains a little and falls behind again.

---

## Timing

40 drawn frames. Most frames hold for 300 ms; the first frame of each
annotation holds for 900 ms so the words can be read. Total ≈ 16 s, looping.

---

## Shot list

### Act I — the two shapes (frames 0–11)

**F0–F3 · title card** *(900 ms on F0)*
> **A sketch: how a model's knowledge boundary grows**

The human outline is already drawn, dimmed.

**F4–F8 · the shape** *(900 ms on F4)*
> collective human knowledge — **anisotropic**: deep in some fields, thin in others

The outline brightens. Its spikes draw outward one by one, each a different
length: AlphaGo, AlphaFold and mathematics reach far out; municipal traffic
control, globular-cluster dynamics, eVTOL airworthiness and wet-lab protocols
barely clear the baseline.

**F9–F11 · the model** *(900 ms on F9)*
> a model starts small — the boundary is the edge of what it can recall

A small boundary opens at the centre: the same silhouette, smoothed.

### Act II — the cycle (frames 12–31)

The cycle repeats four times, each time on a different frontier, and each time
with the same three beats:

**Beat A — an expert works a frontier** *(900 ms)*
> an expert works a frontier

An amber dot slides out along a spike and stops at its tip.

**Beat B — the breakthrough** *(900 ms)*
> a breakthrough moves the frontier out

The dot flares; the spike extends. The human graph is now further out than it
was.

**Beat C — distillation** *(900 ms)*
> the result becomes training data — and the boundary moves

A dashed amber stream runs from the breakthrough into the model's boundary.
The boundary grows toward that angle.

On the fourth pass the annotation changes to:

> and again — in fields where the graph is thin, one good result is worth a lot

### Act III — the edge (frames 32–39)

**F32–F34 · the approach** *(900 ms on F32)*
> the singularity moment is not consciousness

**F35–F36 · the edge** *(900 ms on F35)*
> it is the boundary reaching the frontier

Three large lobes grow at AlphaGo, AlphaFold and mathematics. At mathematics
the model's outline stops just short of the human one — a visible gap, and the
last frame it never closes.

**F37–F38 · the crossing** *(900 ms on F37)*
> and where the frontier is sharpest, it goes past

At AlphaGo and AlphaFold the model's outline pushes through the human one and
out past it. The two crossed arcs are drawn in `#f472b6`. Everywhere else —
including every thin field — the model stays inside.

**F39 · hold**
No new words. The final frame holds on the picture: outside the human graph
in two fields, right at the edge in a third, and comfortably inside in all the
rest.

---

## What this deliberately does not claim

- It does not put a number on any of it. No growth curve, no benchmark.
- It does not say the model is conscious, or that it will be. The final
  annotation says the opposite: the singularity moment is a *reach*, not a
  mind.
- It does not say the crossing is good. Where the model passes the human
  graph, the people in that field are the ones who have not had their say
  yet. That is a reason to be careful, not to be pleased.
- The thin fields are deliberately the author's own corners — globular-cluster
  dynamics, eVTOL airworthiness, municipal traffic control. The model gains a
  little in each of them and stays well inside. The interesting fields are
  the ones where somebody else did the hard work first.

---

## Rebuilding

```bash
python3 scripts/make-knowledge-growth-gif.py
```

Writes `images/knowledge-growth.gif`. The frame schedule, the domain table and
the annotations live in the script, so a changed wording or a changed field
list is a one-line edit.

### Output

1000 × 760. The GIF sits in a 7-of-12 column and renders at roughly 580 px
wide on desktop, leaving extra resolution for high-density screens.
The frame is drawn at twice the output size — 2000 ×
1520 — and downsampled with a Lanczos filter, because the spikes are one-pixel
narrow lines and drawing them at 1× makes them ragged.

The shape is measured in the model's own units and then multiplied by a
drawing factor of 1.6, which scales how large the shape is *drawn* without
changing a single number of the model. The factor lives in one constant,
`DRAW`, and everything drawn — the outlines, the labels, the expert dots, the
distillation dashes, the crossing arc — is multiplied by it, so the picture
can be resized without the annotation drifting off the thing it names.

On the front page the GIF now sits beside the original 2023 hand-drawn page,
with a short list of what the animation shows under it, so a reader can see
where the picture came from before they watch it.

## The three.js version

The GIF has to guess how long to hold each caption. A three.js version of the
same scene — the spiky human outline and the model's growing boundary as real
geometry, with a scrubber over the 40 frames and the annotation changing under
the reader's hand — would not. The site already runs `react-three-fiber` v9
and `drei` v10, so the machinery is there. The GIF stays as the shareable
artefact; the three.js scene would be the interactive one.

### What shipped

The three.js version is live at `/knowledge/`.

- `green-app/src/lib/knowledgeGrowth.ts` is a direct TypeScript port of the
  model in `scripts/make-knowledge-growth-gif.py`: the same domain table, the
  same amplitudes and reaches, the same 40 frames, the same annotations, and
  the same answer at the end — AlphaGo 1.045 and AlphaFold 1.035 outside the
  human graph, mathematics 0.965 just inside it.
- `green-app/src/components/KnowledgeGrowth3D.tsx` draws it as a **ball**
  rather than a circle, and that is the one place the two renderers differ.
  A circle has a ring of fields around it and a clear "inside"; a ball has
  fields all over its surface and no privileged side. Human knowledge does
  not have a flat side, so the sphere is the honest shape — the GIF stays a
  circle because a GIF is flat anyway.
- Each field keeps its own bearing, so the ball is the old circle lifted
  onto a sphere: a field still points the same way it used to. The latitude
  is an equal-area spread assigned in a golden stride, because without that
  two fields whose bearings are close land on top of each other and their
  spikes merge into one lump — the stride lifts the closest pair from 17
  degrees apart to 32.
- The human boundary is a globe grid that deforms over the deep fields, and
  the model's boundary is a smooth core inside it. The core is translucent
  on purpose: the concept graph lives inside it and has to stay visible
  through it. An amber sphere marks where an expert broke through, and a
  pink needle and bead mark where the model has passed the human graph.
- The bump width is the same as the GIF's — 0.075 rad — so the ball reads
  like the animation and not like a rounder version of it: each field is a
  spike with a point, not a lobe. The shell and the grid are sampled finely
  enough (192 × 96 vertices, 128 steps per grid line) that a narrow spike
  comes out sharp instead of faceted.
- The growth model is shared with the front page's GIF only in appearance. The
  *numbers* differ from the 2023 essay's illustration: they are the current
  table, and the table is the argument.
- The homepage now shows the GIF and original sketch, with a link to the
  interactive page. The former interactive SVG is no longer mounted there.
- `/knowledge/` has three parts: **Ask or try**, the two proposed extensions
  from the 2023 essay, and **Nodes & prompt weights**. Example questions and
  typed prompts use keyword matching immediately; the optional MiniLM
  download refines the ranking with embedding similarity. Stale responses
  cannot replace the scores for a newer prompt.
- Node size, brightness and numeric labels reflect relevance to the submitted
  prompt. Edge brightness follows the weaker endpoint. The side panel lists
  every score and allows keyboard selection. These are illustrative relevance
  scores, not internal neural-network weights or confidence in an answer.
- The data-modality and symbolic-tool switches add labelled connections in
  the sphere and formulate a proposed workflow. A fresh count needs both
  evidence and computation. The switches do not perform retrieval or execute
  a calculation, and the page says so.
- WebLLM remains an optional extension. Its proposed concepts are shown in
  pink, attached to nearby existing nodes, and kept inside the human sphere.
  They are suggestions requiring verification. Unsupported browsers can
  still use keyword matching and the rest of the sketch.
- The timeline advances every 900 ms; pause, scrub and keyboard stepping
  remain available. Reduced-motion preferences pause autoplay and rotation.
  On small screens the prompt, scene and explanatory panels stack without
  covering the canvas.

The GIF stays on the front page because it is the version a reader can
screenshot and send to somebody. The scene is the version a reader can argue
with.
