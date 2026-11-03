"use client";

import React, { useMemo, useState } from "react";

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
 */

interface MemNode {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Sits inside the advanced field — the deep domain the model only partly reaches. */
  deep?: boolean;
}

interface Prompt {
  id: string;
  question: string;
  condition: string;
  /** What flat correlation alone cannot do for this prompt. */
  needs: "symbolic" | "modality" | null;
  note: string;
}

const NODES: MemNode[] = [
  { id: "embedding", label: "Correlation between terms (embeddings)", x: 168, y: 168 },
  { id: "meme", label: "Meme / concept node", x: 208, y: 138 },
  { id: "mocca", label: "MOCCA cluster survey", x: 245, y: 168 },
  { id: "bbh", label: "Binary black hole inspiral", x: 312, y: 178, deep: true },
  { id: "siren", label: "LISA standard siren", x: 322, y: 143, deep: true },
  { id: "auction", label: "Ad auction pricing", x: 176, y: 222 },
  { id: "demand", label: "Demand profiling", x: 218, y: 258 },
  { id: "signal", label: "Signal cycle estimation", x: 152, y: 262 },
  { id: "reglag", label: "Regulation lag", x: 256, y: 215 },
  { id: "calib", label: "Calibration check", x: 188, y: 286 },
  { id: "retrieval", label: "Spaced retrieval", x: 258, y: 280 },
];

/** [from, to, weak?] — weak edges are the ones the sketch drew dotted. */
const EDGES: [string, string, boolean?][] = [
  ["embedding", "meme"],
  ["embedding", "calib"],
  ["meme", "mocca"],
  ["meme", "reglag"],
  ["meme", "calib", true],
  ["mocca", "bbh"],
  ["bbh", "siren"],
  ["siren", "reglag", true],
  ["auction", "demand"],
  ["auction", "signal"],
  ["demand", "reglag"],
  ["signal", "calib"],
  ["calib", "retrieval"],
  ["retrieval", "reglag", true],
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

/** One domain per spike — the essay's "the spikes on such a ring could
 *  represent the domain knowledge in each different area". */
const DOMAINS = [
  "Astrophysics",
  "Advertising",
  "Policy & airworthiness",
  "Learning & tutoring",
  "Language & embeddings",
  "Traffic systems",
];

const PROMPTS: Prompt[] = [
  {
    id: "siren",
    question: "What does a gravitational-wave standard siren let us measure?",
    condition: "siren",
    needs: null,
    note: "The relation is well represented in the corpus. The model recombines what it has seen.",
  },
  {
    id: "count",
    question: "Count the binary black holes with 8 < m₁ < 12 M☉ in this cluster.",
    condition: "bbh",
    needs: "symbolic",
    note: "Counting between two bounds needs a loop. Flat correlation has no iteration to run.",
  },
  {
    id: "latest",
    question: "How many binary black holes did the most recent LISA run detect?",
    condition: "bbh",
    needs: "modality",
    note: "The corpus ends where the training data ends. The alternative to guessing is to look.",
  },
];

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

export default function CollectiveKnowledgeFigure({
  onOpenEssay,
}: {
  onOpenEssay?: (url: string) => void;
}) {
  const [reading, setReading] = useState<"flat" | "graph">("flat");
  const [modality, setModality] = useState(false);
  const [symbolic, setSymbolic] = useState(false);
  const [promptId, setPromptId] = useState("siren");
  const [override, setOverride] = useState<string | null>(null);

  const prompt = PROMPTS.find((p) => p.id === promptId)!;
  const conditionId = override ?? prompt.condition;
  const condition = nodeById(conditionId);

  /** Nodes one hop from the conditioned node — what the model can reach. */
  const neighbourhood = useMemo(() => {
    const near = new Set<string>([conditionId]);
    for (const [a, b] of EDGES) {
      if (a === conditionId) near.add(b);
      if (b === conditionId) near.add(a);
    }
    return near;
  }, [conditionId]);

  const deep = condition.deep === true;

  const outcome = useMemo(() => {
    if (prompt.needs === null) {
      return {
        state: "answers",
        headline: "Answers from correlation",
        detail: prompt.note,
      };
    }
    if (prompt.needs === "symbolic") {
      return symbolic
        ? {
            state: "computed",
            headline: "Computed, not recalled",
            detail:
              "With a symbolic layer the counting runs as a loop over the catalogue rather than as a guess at a pattern.",
          }
        : {
            state: "stuck",
            headline: "Flat correlation cannot count",
            detail:
              "Any higher-order computation like counting the numbers between a and b needs some sort of recurrent operation — a for-loop the architecture does not have.",
          };
    }
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
  }, [prompt, symbolic, modality]);

  const TONE: Record<string, { text: string; bg: string; border: string }> = {
    answers: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    computed: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    grounded: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    guesses: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    stuck: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  };
  const tone = TONE[outcome.state];

  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
            Interactive Model · How the Model Works
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
            Flat correlation is the foundation of knowledge — and only that
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            The digital form of a hand-drawn sketch from{" "}
            <em>All About ChatGPT</em> (February 2023). A language model is a cloud
            of correlated <span className="font-mono text-[#0369a1]">mem</span> nodes; a
            prompt conditions one of them and the answer is assembled from its
            neighbourhood. Click any node to re-condition it.
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

              {/* edges: solid when read as a graph, faint when read as flat correlation */}
              {EDGES.map(([a, b, weak], i) => {
                const na = nodeById(a);
                const nb = nodeById(b);
                const lit = neighbourhood.has(a) && neighbourhood.has(b);
                const opacity = lit ? (reading === "graph" ? 0.9 : 0.55) : 0.15;
                return (
                  <line
                    key={i}
                    x1={na.x}
                    y1={na.y}
                    x2={nb.x}
                    y2={nb.y}
                    stroke="#22c55e"
                    strokeWidth={weak ? 1 : 1.7}
                    strokeDasharray={reading === "graph" ? (weak ? "4 3" : undefined) : "2 4"}
                    opacity={opacity}
                  />
                );
              })}

              {/* the nodes */}
              {NODES.map((n) => {
                const lit = neighbourhood.has(n.id);
                const isCond = n.id === conditionId;
                return (
                  <g
                    key={n.id}
                    className="cursor-pointer"
                    onClick={() => setOverride(n.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOverride(n.id);
                      }
                    }}
                  >
                    <circle cx={n.x} cy={n.y} r="15" fill="transparent" />
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="8"
                      fill={lit ? "#14532d" : "#0f2a1c"}
                      stroke={lit ? "#4ade80" : "#22c55e"}
                      strokeWidth="1.3"
                      opacity={lit ? 1 : 0.45}
                    />
                    <text
                      x={n.x}
                      y={n.y + 2.6}
                      textAnchor="middle"
                      fill={lit ? "#86efac" : "#4ade80"}
                      fontSize="6.8"
                      opacity={lit ? 1 : 0.5}
                    >
                      mem
                    </text>
                    {isCond && (
                      <>
                        <circle cx={n.x} cy={n.y} r="12.5" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
                        <text x={n.x} y={n.y - 20} fill="#7dd3fc" fontSize="8" textAnchor="middle">
                          condit
                        </text>
                      </>
                    )}
                    {n.deep && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="14"
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
                d={
                  reading === "graph"
                    ? "M 90 214 L 218 158"
                    : "M 90 214 L 158 236"
                }
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold block mb-2">
              The prompt
            </span>
            <div className="space-y-1.5">
              {PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPromptId(p.id);
                    setOverride(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] leading-snug transition cursor-pointer border ${
                    promptId === p.id
                      ? "bg-sky-50 border-[#1DAEDF] text-slate-900 font-medium"
                      : "bg-[#f8fafc] border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {p.question}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Conditioning on{" "}
              <span className="font-mono text-[#0369a1]">{condition.label}</span>
              {deep && " — inside the advanced field, where the corpus runs thin."}
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
            The argument itself is from{" "}
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
