# Running a small language model in the visitor's browser

**The question:** map a free-text prompt onto the *weights* of the concept
nodes in the *All About ChatGPT* sketch — which concepts light up, and how
strongly — without a server.

This is the research behind what now runs on the front page, and the numbers
behind the choice.

---

## 1. The framing that decides everything

"Have a small LLM decode the prompt" points at a generative model. But the
output the figure needs is not prose — it is **a vector of weights over eleven
nodes**. That is a *similarity* problem, not a generation problem:

```
prompt → vector → cosine against eleven precomputed vectors → eleven weights
```

A sentence-embedding model is a transformer encoder: a small language model
in every sense that matters here, and 10–100× lighter than the decoder that
would generate the sentence instead. So the first question is not "which
decoder" but "how small can the encoder be".

---

## 2. The candidates, with real numbers

Measured, not quoted: model file sizes are the `Content-Length` of the actual
ONNX weights on the Hugging Face CDN; the rest are from the projects' own
repositories.

### In the browser, embedding model — **the one that shipped**

| Option | Model | Download | Notes |
|---|---|---|---|
| **transformers.js v4** | `Xenova/all-MiniLM-L6-v2` | **21.9 MB** int8 (+ 0.7 MB tokenizer) | ONNX Runtime Web; WebGPU with a WASM fallback. 6 layers, 384 dims. |
| transformers.js v4 | `Xenova/bge-small-en-v1.5` | 32.4 MB int8 | Better on long-form retrieval, 12 layers. The same shape of solution, 50 % heavier. |
| transformers.js v4 | `onnx-community/embeddinggemma-300m-ONNX` | 167 MB (q4f16 + external data) | Best quality of the three, far too heavy for a portfolio site. |

`@huggingface/transformers` v4.3.2 is 9.5 MB unpacked; the browser build is
1.16 MB of JS, delivered as a **lazy chunk** — the page's first-load JS went
from 221 kB to 240 kB, and the 128 kB transformers chunk is not fetched until
the visitor actually asks a question. The ONNX runtime's WebAssembly is
fetched from jsdelivr, so nothing needs to be served from the host.

**One trap worth recording.** `onnxruntime-web`'s WebGPU bundle references its
27 MB `asyncify` wasm with `new URL(..., import.meta.url)`, which webpack
resolves into a real file in the build — 27 MB of dead weight in the
repository and on the page, because transformers.js points the runtime at the
jsDelivr copy and never fetches it. The fix is a webpack rule that keeps the
reference but stops the emission:

```js
config.module.rules.push({
  test: /\.wasm$/i,
  type: "asset/resource",
  generator: { emit: false },
});
```

The WebGPU path still works: the WebGPU JavaScript bundle (115 kB) is
emitted, and the wasm itself comes from the CDN at run time.

### In the browser, generative model — heavier, and not needed for this

| Option | Smallest useful model | Download | Notes |
|---|---|---|---|
| **WebLLM** (MLC) | `SmolLM2-135M-Instruct` | ~92 MB | 32 curated MLC models, WebGPU only, no WASM fallback. |
| WebLLM | `Qwen2.5-0.5B-Instruct` | ~350 MB | Better quality, still a large first-run download. |
| llama.cpp WASM | any GGUF | 100 MB+ | 160 000+ models available; breadth instead of polish. |

A decoder *would* let the model write its own sentence about why those nodes
lit up — which is a lovely thing to have and a bad first thing to pay for.
92 MB is not a download a visitor grants a stranger on a phone.

### Hosted API — the wrong shape for this site

`api.openai.com/v1/embeddings`, Voyage, Cohere and Jina all do this well, in
one request, with a better model than anything that fits in a browser.

The blocker is not quality, it is deployment. `domij.info` is a GitHub Pages
static export: there is no server, and an API key compiled into a client
bundle is a public API key. It would need a proxy — a Cloudflare Worker, a
Lambda — which is a piece of infrastructure to run, bill, secure, and keep
alive for the life of the site, in exchange for a worse model and a round trip
to someone else's computer. The point of the figure is that the reasoning
runs *here*; a hosted API breaks that.

### The zero-download option

Precompute embeddings for a vocabulary of a few thousand domain terms and
match in plain JavaScript. No model at all, ~1 MB, instant. It loses
compositional semantics — "why does a model make things up" would miss a node
whose words never appear — but it is the right answer if the download is
unacceptable. It is also what the keyword half of the shipped hybrid already
does.

---

## 3. What shipped

```
build time   scripts/embed-nodes.mjs  (via green-app/scripts/)
             └─ embeds each node's description once
                → green-app/src/data/nodeEmbeddings.ts   (11 × 384 floats, 51 KB)

run time     the visitor's first question
             └─ transformers.js loads MiniLM-L6-v2 int8 (21.9 MB, cached after)
             └─ one forward pass over the prompt
             └─ cosine against the eleven precomputed vectors
```

**Only the prompt is embedded at runtime.** The nodes were embedded at build
time and cost the visitor nothing, which is what makes a 22 MB model
affordable at all.

### The score is a hybrid, and the hybrid matters

Pure embedding similarity has a failure mode: it is good at meaning and bad
at *terms*. "What is the safest way to **certify** a new aircraft?" was
correctly about airworthiness certification, and the embedding ranked
*Calibration check* first — because "safest" and "check" are near each other
in meaning — while the node whose own vocabulary contains *certification* came
third.

So the score is:

```
weight = 0.68 · semantic + 0.32 · lexical
```

where `semantic` is the cosine mapped through an **absolute floor** (0.12)
rather than divided by the best score in the set, and `lexical` is the
overlap with the node's own words, with light stemming so *certify* and
*certification* are the same word.

The absolute floor matters for the same reason. Normalising by the maximum
rescales the weakest cosine to 1.0, which made "What did I have for lunch
yesterday?" light up *LISA standard siren* at 68 %. With the floor, it lights
up nothing — and that is the interesting answer: the model has nothing to
condition on and would be guessing.

### It degrades, and it says so

The keyword matcher always works, needs no download, and is instant. The
embedding only ever *re-ranks*. If the model fails to load — no WebGPU, a
failed fetch, an offline visitor — the figure still answers, and the caption
says *"the local model would not load — falling back to keyword matching,
which still works"*.

---

## 4. Why the weights are the right thing to draw

The sketch's own claim is that the model holds *"the correlation between
terms"*. So a node's weight is not decoration: it is a picture of how much
correlation the model would have to draw on to answer. Two facts fall out of
it that prose would have hidden:

- *What does a gravitational-wave standard siren let us measure?* → **LISA
  standard siren 74, MOCCA cluster survey 21, binary black hole inspiral
  10.** The concept lights up; the two adjacent ones come along.
- *What did I have for lunch yesterday?* → **nothing.** Every cosine is below
  the floor. The model would still answer, and it would be made up.

Both are the same claim the essay makes, arriving by a different route.

---

## 5. On three.js

The site already runs `react-three-fiber` v9, `drei` v10 and `three`
^0.184 — the globular-cluster simulation and the idea constellation are both
WebGL. So the question is not whether three.js is available but whether the
growth story is better in it.

**What three.js would buy:** the boundary growth becomes scrubbable rather
than a loop — a slider over "year 1 … year 40" with the annotation changing
under the reader's hand, and the spikes extending as they drag. The 16-second
GIF has to guess how long to hold each caption; a scrubber does not. The
crossing at AlphaGo and AlphaFold could be shown as an actual penetration
rather than a marked arc.

**What it would cost:** a WebGL context, an accessibility story that the
current SVG has for free, and a second set of semantics to keep in step with
the GIF.

**The recommendation:** keep the SVG figure — it is a faithful digitisation of
a hand-drawn sketch, and it is the thing a reader can screenshot. Build the
growth story in three.js, because the growth story is *inherently* a sequence
and the GIF is inherently not interactive. The two are not competing: one is
the argument, the other is the mechanism.

If that is done, the same embedding weights can drive the three.js scene
directly — node radius and emissive intensity from `weight`, edge opacity
from the product of the two endpoints — so the prompt box would light up the
cloud in 3D as well.

### What shipped

The three.js scene is live at `/knowledge/`, and it does exactly this: the
same `scoreNodes()` output drives node radius (`3 + weight × 6.5`), sphere
opacity, label visibility and edge width in the 3D cloud.

The generative layer went further than the encoder. An encoder can only rank
concepts that are already in the diagram, so a second layer was added: a
WebLLM decoder (`@mlc-ai/web-llm`, 0.2.87) that runs on WebGPU in the same
page and *names* concepts the diagram does not contain. The decoder proposes,
the encoder places: each new concept is embedded with the same MiniLM model
and dropped next to the node it is closest to.

The cost of that layer is the reason it is opt-in rather than automatic:

| model | download | needs |
| --- | --- | --- |
| `Xenova/all-MiniLM-L6-v2` (q8) | ~22 MB | WebGPU *or* WASM |
| `SmolLM2-360M-Instruct-q4f16_1-MLC` | ~194 MB | WebGPU |
| `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` | ~265 MB | WebGPU |

Both MLC model ids were checked against the prebuilt registry in the
installed package, so neither can fail on a typo.

WebLLM needs a GPU adapter. On a browser without one the button reports
exactly that and the encoder path continues to work — the two layers fail
independently, which is the only way a 194 MB opt-in can sit on the same page
as a 22 MB default.

---

## Sources

- [Transformers.js v3: WebGPU support, new models and quantization](https://huggingface.co/blog/transformersjs-v3)
- [huggingface/transformers](https://github.com/huggingface/transformers/)
- [mlc-ai/web-llm](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts)
- [The three walls of in-browser LLM inference](https://daneel.injen.io/research/three-walls-browser-llm-inference-2026.html)
- [browser-llm-fit — a model matrix for the browser](https://h3manth.com/ai/browser-llm-fit/)
- [LocalMode — 160,000+ models via llama.cpp WASM](https://localmode.dev/blog/gguf-models-browser-wasm)
- [caniuse: WebGPU](https://github.com/Fyrd/caniuse/blob/main/features-json/webgpu.json)
- [Promptfoo's Transformers.js provider](https://www.promptfoo.dev/docs/providers/transformers/)
