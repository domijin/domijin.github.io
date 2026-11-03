"use client";

import React, { useCallback, useMemo, useState } from "react";
import { NODES, scoreNodes, topNode, NodeScore } from "@/lib/knowledgeScoring";
import {
  loadEmbedder,
  deviceName,
  EMBEDDING_DOWNLOAD_MB,
  EMBEDDING_MODEL,
} from "@/components/semanticMatcher";

/**
 * The digital form of the hand-drawn sketch from "All About ChatGPT"
 * (February 2023) — the author's own conceptual model of how a language
 * model works, why it works, and where it runs out.
 *
 * The sketch and the essay say the same thing:
 *
 *   • the model is a cloud of "mem" nodes — memes and concepts — that are
 *     correlated, not structured ("knowledge might just be the correlation
 *     between terms (embeddings)", "meme/concepts are the nodes in this
 *     graph");
 *   • a prompt conditions one node and the answer is assembled from its
 *     neighbourhood ("the tokens will only be looked at once");
 *   • the model reaches only the shallow part of any deep field, and the
 *     far-fetch is where it stops working ("LLM/statistical model will be
 *     limited by the far-fetch in deepest domain");
 *   • the outer ring is collective human knowledge, with the spikes being
 *     the domain knowledge in each area ("if we could use a ring to
 *     represent basic human knowledge, the spikes on such a ring could
 *     represent the domain knowledge in each different area");
 *   • two routes beat the current model: a new data modality, so the system
 *     queries the real world instead of guessing, and symbolic learning
 *     ("Modality and symbolic learning might be the next step to build
 *     better model?"; "the one different approach that works quite well
 *     for now is Wolfram");
 *   • and the open question the sketch poses in green: knowledge, or a
 *     knowledge graph?
 *
 * The prompt box is open on purpose. Type anything: it is matched against
 * the nodes by a small sentence-embedding model running in this browser
 * (MiniLM-L6, 22 MB, fetched once and cached), so the concepts that light
 * up are the ones the model itself would reach for — not just the words
 * that happen to appear.
 */

interface Edge {
  a: string;
  b: string;
  weak?: boolean;
}

const EDGES: Edge[] = [
  { a: "embedding", b: "meme" },
  { a: "embedding", b: "calib" },
  { a: "meme", b: "mocca" },
  { a: "meme", b: "reglag" },
  { a: "meme", b: "calib", weak: true },
  { a: "mocca", b: "bbh" },
  { a: "bbh", b: "siren" },
  { a: "siren", b: "reglag", weak: true },
  { a: "auction", b: "demand" },
  { a: "auction", b: "signal" },
  { a: "demand", b: "reglag" },
  { a: "signal", b: "calib" },
  { a: "calib", b: "retrieval" },
  { a: "retrieval", b: "reglag", weak: true },
];

/** The ring's spikes — the domain knowledge in each different area. */
const SPIKES: { angle: number; len: number }[] = [
  { angle: -90, len: 13 },
  { angle: -66, len: 9 },
  { angle: -44, len: 16 },
  { angle: -22, len: 10 },
  { angle: 0, len: 18 },
  { angle: 22, len: 9 },
  { angle: 44, len: 15 },
  { angle: 66, len: 8 },
  { angle: 90, len: 12 },
  { angle: 112, len: 17 },
  { angle: 134, len: 9 },
  { angle: 156, len: 14 },
  { angle: 178, len: 8 },
  { angle: 200, len: 16 },
  { angle: 222, len: 10 },
  { angle: 244, len: 8 },
  { angle: 266, len: 13 },
];

const DOMAINS = [
  "Astrophysics",
  "Advertising",
  "Policy & airworthiness",
  "Learning & tutoring",
  "Language & embeddings",
  "Traffic systems",
];

const PRESETS: string[] = [
  "What does a gravitational-wave standard siren let us measure?",
  "Count the binary black holes with 8 < m₁ < 12 M☉ in this cluster.",
  "How many binary black holes did the most recent LISA run detect?",
];

const RECENCY = /\b(current|currently|latest|now|today|recent|recently|as of|this week|this month|right now)\b/;
const COUNT = /\b(count|how many|number of|sum|total|list all|list every|between)\b/;

const BLOB_PATH =
  "M 150 165 C 138 138, 178 112, 214 122 C 244 100, 285 106, 300 130 " +
  "C 330 128, 348 152, 342 180 C 352 205, 336 235, 310 245 " +
  "C 312 275, 286 300, 254 298 C 232 318, 190 312, 170 296 " +
  "C 140 292, 116 268, 124 244 C 106 224, 112 186, 150 165 Z";

const RING = { cx: 285, cy: 225, r: 178 };
const FIELD = { cx: 395, cy: 165, r: 88 };

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

type ModelState = "idle" | "loading" | "ready" | "error";

export default function CollectiveKnowledgeFigure({
  onOpenEssay,
}: {
  onOpenEssay?: (url: string) => void;
}) {
  const [reading, setReading] = useState<"flat" | "graph">("flat");
  const [modality, setModality] = useState(false);
  const [symbolic, setSymbolic] = useState(false);
  const [draft, setDraft] = useState("");
  const [prompt, setPrompt] = useState(PRESETS[0]);
  const [override, setOverride] = useState<string | null>(null);

  const [modelState, setModelState] = useState<ModelState>("idle");
  const [modelNote, setModelNote] = useState("");
  const [embedding, setEmbedding] = useState<Float32Array | null>(null);

  const runModel = useCallback(async (text: string) => {
    setModelState("loading");
    setModelNote(`loading a ${EMBEDDING_DOWNLOAD_MB} MB model — it runs here, and the browser caches it`);
    try {
      const embed = await loadEmbedder((p) => {
        if (p.status === "download" && typeof p.progress === "number") {
          setModelNote(`downloading ${EMBEDDING_DOWNLOAD_MB} MB model — ${Math.round(p.progress)}%`);
        }
      });
      const vec = await embed(text);
      setEmbedding(vec instanceof Float32Array ? vec : Float32Array.from(vec));
      setModelState("ready");
      setModelNote(`matched by ${EMBEDDING_MODEL} running locally on ${deviceName()}`);
    } catch (err) {
      setModelState("error");
      setModelNote(
        "the local model would not load — falling back to keyword matching, which still works"
      );
    }
  }, []);

  const submit = useCallback(
    (text: string) => {
      setDraft(text);
      setPrompt(text.trim() || PRESETS[0]);
      setOverride(null);
      setEmbedding(null);
      runModel(text.trim() || PRESETS[0]);
    },
    [runModel]
  );

  /** Every node scored against the prompt, strongest first. */
  const scores = useMemo(() => scoreNodes(prompt, embedding), [prompt, embedding]);
  const scoreOf = useCallback(
    (id: string) => scores.find((s) => s.id === id) ?? { id, label: "", weight: 0, semantic: 0, lexical: 0 },
    [scores]
  );

  const best = topNode(scores);
  const conditionId = override ?? best?.id ?? null;
  const condition = conditionId ? nodeById(conditionId) : null;
  const deep = condition?.deep === true;

  /** Nodes one hop from the conditioned node — what the model can reach. */
  const neighbourhood = useMemo(() => {
    if (!conditionId) return new Set<string>();
    const near = new Set<string>([conditionId]);
    for (const e of EDGES) {
      if (e.a === conditionId) near.add(e.b);
      if (e.b === conditionId) near.add(e.a);
    }
    return near;
  }, [conditionId]);

  const cue = useMemo(() => {
    const lower = prompt.toLowerCase();
    if (RECENCY.test(lower)) return "recency";
    if (COUNT.test(lower)) return "count";
    return "none";
  }, [prompt]);

  const outcome = useMemo(() => {
    const nothingMatches = !best;
    if (nothingMatches) {
      return modality
        ? {
            state: "grounded",
            headline: "Ground truth, queried",
            detail:
              "Nothing in the model correlates with this, so a new modality has to do the work: look it up in the world rather than recall it.",
          }
        : {
            state: "guesses",
            headline: "Nothing correlates — it would guess",
            detail:
              "There is no memory here to recombine. The answer would still arrive, fluent and confident, and it would be made up.",
          };
    }
    if (cue === "count") {
      return symbolic
        ? {
            state: "computed",
            headline: "Computed, not recalled",
            detail:
              "With a symbolic layer the counting runs as a loop over the catalogue, rather than as a guess at a pattern.",
          }
        : {
            state: "stuck",
            headline: "Flat correlation cannot count",
            detail:
              "Any higher-order computation like counting the numbers between a and b needs some sort of recurrent operation — a for-loop the architecture does not have.",
          };
    }
    if (cue === "recency") {
      return modality
        ? {
            state: "grounded",
            headline: "Ground truth, queried",
            detail:
              "A new modality lets the system look the answer up in the world instead of recalling it from a snapshot of the corpus.",
          }
        : {
            state: "guesses",
            headline: "Guesses, plausibly",
            detail:
              "The corpus ends where the training data ends. The answer will still arrive — it just will not be a measurement.",
          };
    }
    return {
      state: "answers",
      headline: "Answers from correlation",
      detail: "The relation is well represented in the corpus. The model recombines what it has seen.",
    };
  }, [best, cue, symbolic, modality]);

  const TONE: Record<string, { text: string; bg: string; border: string }> = {
    answers: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    computed: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    grounded: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    guesses: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    stuck: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  };
  const tone = TONE[outcome.state];

  const topThree = scores.filter((s) => s.weight > 0.02).slice(0, 3);

  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
            Interactive Model · My Working Sketch
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
            A working model — type a prompt, or click any node
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            The digital form of a hand-drawn sketch I made for{" "}
            <em>All About ChatGPT</em> (February 2023) and have been redrawing since. A model
            as correlated <span className="font-mono text-[#0369a1]">mem</span> nodes; a prompt
            conditions one of them, and the answer is assembled from its neighbourhood. I am
            fairly sure about the shape and less sure about the details — please push back.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ---------------- the figure ---------------- */}
        <div className="lg:col-span-7 rounded-xl bg-[#0b2034] p-3 border border-sky-900/70">
          <svg
            viewBox="0 0 560 460"
            className="w-full h-auto"
            role="img"
            aria-label="A language model as a cloud of correlated memory nodes inside a ring of collective human knowledge, with an advanced field of deep domain knowledge overlapping its edge, and two routes beyond it: a new data modality that queries the real world, and symbolic learning"
          >
            <defs>
              <marker id="ck-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#1DAEDF" />
              </marker>
              <marker id="ck-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#4ade80" />
              </marker>
              <marker id="ck-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill="#fb7185" />
              </marker>
            </defs>

            <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
              {/* the ring: collective human knowledge, with a spike per domain */}
              <circle
                cx={RING.cx}
                cy={RING.cy}
                r={RING.r}
                fill="none"
                stroke="#1DAEDF"
                strokeWidth="1.6"
                strokeDasharray="7 6"
                opacity="0.85"
              />
              {SPIKES.map((sp, i) => {
                const rad = (sp.angle * Math.PI) / 180;
                const x1 = RING.cx + Math.cos(rad) * (RING.r + 5);
                const y1 = RING.cy + Math.sin(rad) * (RING.r + 5);
                const x2 = RING.cx + Math.cos(rad) * (RING.r + 5 + sp.len);
                const y2 = RING.cy + Math.sin(rad) * (RING.r + 5 + sp.len);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#1DAEDF"
                    strokeWidth="1.7"
                    opacity="0.9"
                  />
                );
              })}
              <text x={RING.cx} y="16" fill="#7dd3fc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                COLLECTIVE HUMAN KNOWLEDGE
              </text>
              <text x="14" y="428" fill="#64748b" fontSize="7.5">
                one spike per domain:
              </text>
              <text x="14" y="439" fill="#64748b" fontSize="7.5">
                {DOMAINS.join(" · ")}
              </text>

              {/* the advanced field: deep domain knowledge, straddling the model's edge */}
              <circle
                cx={FIELD.cx}
                cy={FIELD.cy}
                r={FIELD.r}
                fill="#94a3b8"
                fillOpacity="0.10"
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <text x={FIELD.cx} y={FIELD.cy + 44} fill="#94a3b8" fontSize="9" textAnchor="middle">
                advanced field
              </text>
              <text x={FIELD.cx} y={FIELD.cy + 55} fill="#94a3b8" fontSize="9" textAnchor="middle">
                deep domain knowledge
              </text>

              {/* the model */}
              <path d={BLOB_PATH} fill="#0d2642" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="140" y="322" fill="#7dd3fc" fontSize="8.5" fontWeight="bold">
                THE MODEL
              </text>

              {/* edges: brighter where the prompt gave both ends weight */}
              {EDGES.map((e, i) => {
                const na = nodeById(e.a);
                const nb = nodeById(e.b);
                const lit = neighbourhood.has(e.a) && neighbourhood.has(e.b);
                const w = scoreOf(e.a).weight * scoreOf(e.b).weight;
                const opacity = lit
                  ? 0.35 + 0.5 * w + (reading === "graph" ? 0.15 : 0)
                  : 0.08 + 0.25 * w;
                return (
                  <line
                    key={i}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke="#22c55e"
                    strokeWidth={e.weak ? 1 : 1.7}
                    strokeDasharray={reading === "graph" ? (e.weak ? "4 3" : undefined) : "2 4"}
                    opacity={Math.min(1, opacity)}
                  />
                );
              })}

              {/* the nodes: size and glow follow the weight */}
              {NODES.map((n) => {
                const s = scoreOf(n.id);
                const lit = neighbourhood.has(n.id);
                const isCond = n.id === conditionId;
                const r = 7 + s.weight * 13;
                return (
                  <g
                    key={n.id}
                    className="cursor-pointer"
                    onClick={() => setOverride(n.id === conditionId ? null : n.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOverride(n.id === conditionId ? null : n.id);
                      }
                    }}
                  >
                    <circle cx={n.x} cy={n.y} r="15" fill="transparent" />
                    {s.weight > 0.05 && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={r + 7}
                        fill="#4ade80"
                        fillOpacity={0.10 + s.weight * 0.16}
                      />
                    )}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={r}
                      fill={lit ? "#14532d" : "#0f2a1c"}
                      stroke={lit ? "#4ade80" : "#22c55e"}
                      strokeWidth={1.3 + s.weight * 1.6}
                      opacity={lit ? 1 : 0.4 + s.weight * 0.6}
                    />
                    <text
                      x={n.x}
                      y={n.y + 3}
                      textAnchor="middle"
                      fill={lit ? "#86efac" : "#4ade80"}
                      fontSize="6.8"
                      opacity={lit ? 1 : 0.5}
                    >
                      mem
                    </text>
                    {isCond && (
                      <>
                        <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
                        <text x={n.x} y={n.y - r - 8} fill="#7dd3fc" fontSize="8" textAnchor="middle">
                          condit
                        </text>
                      </>
                    )}
                    {n.deep && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={r + 4}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        opacity={lit ? 0.9 : 0.4}
                      />
                    )}
                  </g>
                );
              })}

              {/* lever 1: a new data modality — query the real world instead of guessing */}
              {modality && (
                <g>
                  <path
                    d="M 320 258 L 466 302"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="1.6"
                    strokeDasharray="5 3"
                    markerEnd="url(#ck-arrow-red)"
                  />
                  <text x="474" y="298" fill="#fb7185" fontSize="8">
                    query the
                  </text>
                  <text x="474" y="309" fill="#fb7185" fontSize="8">
                    real world
                  </text>
                </g>
              )}

              {/* lever 2: symbolic learning — a rule layer attached to the graph */}
              {symbolic && (
                <g>
                  <path
                    d="M 333 336 L 333 300"
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="1.6"
                    strokeDasharray="5 3"
                    markerEnd="url(#ck-arrow-red)"
                  />
                  <rect x="296" y="336" width="74" height="22" rx="6" fill="#0d2642" stroke="#fb7185" strokeWidth="1.2" />
                  <text x="333" y="351" fill="#fb7185" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Σ rules
                  </text>
                </g>
              )}

              {/* the frontier */}
              <path
                d="M 505 405 L 402 345"
                fill="none"
                stroke="#1DAEDF"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                markerEnd="url(#ck-arrow)"
              />
              <text x="505" y="420" fill="#7dd3fc" fontSize="8.5" textAnchor="end">
                potential new frontier
              </text>
              <text x="505" y="431" fill="#7dd3fc" fontSize="8.5" textAnchor="end">
                of collective knowledge
              </text>

              {/* the open question the sketch poses, with its two arrows into the model */}
              <text x="12" y="196" fill="#4ade80" fontSize="8.5" fontWeight="bold">
                knowledge?
              </text>
              <text x="12" y="208" fill="#4ade80" fontSize="8.5" fontWeight="bold">
                knowledge graph?
              </text>
              <path
                d="M 90 200 L 152 190"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1.3"
                markerEnd="url(#ck-arrow-green)"
              />
              <path
                d={reading === "graph" ? "M 90 214 L 218 158" : "M 90 214 L 158 236"}
                fill="none"
                stroke="#4ade80"
                strokeWidth="1.3"
                markerEnd="url(#ck-arrow-green)"
              />
            </g>
          </svg>
        </div>

        {/* ---------------- controls ---------------- */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label
              htmlFor="ck-prompt"
              className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block mb-2"
            >
              Ask the model something
            </label>
            <div className="flex gap-2">
              <input
                id="ck-prompt"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit(draft);
                }}
                placeholder="Type a prompt…"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-200 bg-[#f8fafc] text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1DAEDF] focus:ring-1 focus:ring-[#1DAEDF]"
              />
              <button
                onClick={() => submit(draft)}
                className="px-3 py-2 rounded-lg bg-[#2980b9] text-white text-xs font-semibold hover:bg-[#0369a1] transition cursor-pointer shrink-0"
              >
                Ask
              </button>
            </div>

            <div className="mt-3 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                or try one of mine
              </span>
              <ul className="space-y-1">
                {PRESETS.map((p) => (
                  <li key={p}>
                    <button
                      onClick={() => submit(p)}
                      className="text-left text-[12px] leading-snug text-[#0369a1] hover:underline underline-offset-2 cursor-pointer"
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              {modelState === "idle" && "Type a prompt and a small language model runs here, in your browser."}
              {modelState === "loading" && modelNote}
              {modelState === "ready" && modelNote}
              {modelState === "error" && modelNote}
            </p>
          </div>

          {/* what the model reached for */}
          <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
              What the model reached for
            </span>
            {topThree.length === 0 ? (
              <p className="text-xs text-slate-500">Nothing lit up — no node correlates with this.</p>
            ) : (
              <ul className="space-y-1.5">
                {topThree.map((s) => (
                  <li key={s.id} className="space-y-0.5">
                    <div className="flex justify-between text-[12px] text-slate-700 gap-2">
                      <span className="truncate">{s.label}</span>
                      <span className="font-mono text-[#0369a1] shrink-0">
                        {(s.weight * 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-[#22c55e] rounded-full"
                        style={{ width: `${Math.round(s.weight * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {condition ? (
                <>
                  Conditioning on{" "}
                  <span className="font-mono text-[#0369a1]">{condition.label}</span>
                  {override && (
                    <button
                      onClick={() => setOverride(null)}
                      className="ml-1 text-[#2980b9] hover:underline cursor-pointer"
                    >
                      (you forced this one — undo)
                    </button>
                  )}
                  {deep && " — inside the advanced field, where the corpus runs thin."}
                </>
              ) : (
                "No node correlates closely enough to condition on."
              )}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {cue === "recency"
                ? "Your prompt asks for what is happening now — the corpus stops where the training data stops."
                : cue === "count"
                  ? "Your prompt asks for a count — that needs a loop, not a correlation."
                  : best
                    ? "Your prompt asks for something the corpus already covers."
                    : "Nothing in the model correlates with this."}
            </p>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-700 font-semibold block">
              How to beat ChatGPT?
            </span>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={modality}
                onChange={(e) => setModality(e.target.checked)}
                className="mt-1 accent-rose-600 cursor-pointer"
              />
              <span className="text-[13px] leading-snug text-slate-700">
                <strong className="text-slate-900">Data modality</strong>{" "}
                <span className="text-slate-500">— aka guess to query the real world</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={symbolic}
                onChange={(e) => setSymbolic(e.target.checked)}
                className="mt-1 accent-rose-600 cursor-pointer"
              />
              <span className="text-[13px] leading-snug text-slate-700">
                <strong className="text-slate-900">Symbolic learning</strong>{" "}
                <span className="text-slate-500">— like Wolfram</span>
              </span>
            </label>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f8fafc] p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
              Read the model as
            </span>
            <div className="inline-flex rounded-lg bg-slate-200/70 p-1 text-xs font-medium">
              <button
                onClick={() => setReading("flat")}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  reading === "flat"
                    ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                flat correlation
              </button>
              <button
                onClick={() => setReading("graph")}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  reading === "graph"
                    ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                knowledge graph
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {reading === "flat"
                ? "Terms that correlate. The graph may be extractable from the model — that is the open question."
                : "Memes and concepts as the nodes of a graph. Now a rule layer has something to attach to."}
            </p>
          </div>

          <div className={`rounded-xl border ${tone.border} ${tone.bg} p-4 space-y-1.5`}>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block">
              What happens
            </span>
            <p className={`text-sm font-bold ${tone.text}`}>{outcome.headline}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{outcome.detail}</p>
          </div>
        </div>
      </div>

      {/* ---------------- the original ---------------- */}
      <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-5 items-start">
        <a
          href="/images/all-about-chatgpt-sketch.png"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 block rounded-lg border border-slate-200 overflow-hidden hover:border-[#1DAEDF] transition"
        >
          <img
            src="/images/all-about-chatgpt-sketch.png"
            alt="The original hand-drawn sketch: a model as a cloud of mem nodes inside a ring of collective human knowledge, with an advanced field of deep domain knowledge, the question of knowledge versus knowledge graph, and two routes beyond — data modality and symbolic learning"
            className="w-[220px] h-auto block"
            loading="lazy"
          />
        </a>
        <div className="text-xs text-slate-500 leading-relaxed space-y-2">
          <p>
            The original sketch, drawn by the author and signed{" "}
            <span className="font-mono text-[#0369a1]">@domij-info</span>. Every element
            above is in it: the ring with its spikes, the mem cloud, the conditioned
            node, the advanced field, the two routes, the frontier, and the green
            question.
          </p>
          <p>
            The argument is from{" "}
            <button
              onClick={() => onOpenEssay?.("/articles/blog/all-about-chatgpt.html")}
              className="text-[#0369a1] hover:underline font-mono"
            >
              All About ChatGPT: Flat Correlation, Unit Economics &amp; Alignment
            </button>{" "}
            (February 2023) — the section{" "}
            <em className="text-slate-600">why ChatGPT works</em>: knowledge might just
            be the correlation between terms; memes and concepts are the nodes in the
            graph; the model is limited by the far-fetch in the deepest domain; and
            modality plus symbolic learning might be the next step.
          </p>
        </div>
      </div>
    </figure>
  );
}
