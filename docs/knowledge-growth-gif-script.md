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

## The three.js version

The GIF has to guess how long to hold each caption. A three.js version of the
same scene — the spiky human outline and the model's growing boundary as real
geometry, with a scrubber over the 40 frames and the annotation changing under
the reader's hand — would not. The site already runs `react-three-fiber` v9
and `drei` v10, so the machinery is there. The GIF stays as the shareable
artefact; the three.js scene would be the interactive one.
