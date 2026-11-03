"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NODES, nearestNode, scoreNodes, topNode } from "@/lib/knowledgeScoring";
import {
  GROWTH_FRAMES,
  annotationAt,
  crossingDomains,
} from "@/lib/knowledgeGrowth";
import { loadEmbedder, deviceName, EMBEDDING_MODEL } from "@/components/semanticMatcher";
import {
  WEBLLM_MODELS,
  proposeConcepts,
  type WebLLMStatus,
} from "@/components/webllmGenerator";
import type { GeneratedNode } from "@/components/KnowledgeGrowth3D";

const KnowledgeGrowth3D = dynamic(
  () => import("@/components/KnowledgeGrowth3D"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#081827]">
        <div className="flex items-center gap-3 font-mono text-xs text-sky-200">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1DAEDF] border-t-transparent" />
          Building the knowledge boundary
        </div>
      </div>
    ),
  }
);

const BASE_PATH = process.env.NEXT_BASE_PATH ?? "/next";
const SITE_HREF = BASE_PATH === "" ? "/" : `${BASE_PATH}/`;

export default function KnowledgeSandboxPage() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [spinning, setSpinning] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const [prompt, setPrompt] = useState("");
  const [activePrompt, setActivePrompt] = useState("");
  const [embedding, setEmbedding] = useState<Float32Array | null>(null);
  const [modelNote, setModelNote] = useState("");
  const [modelBusy, setModelBusy] = useState(false);

  const [webllmModel, setWebllmModel] = useState(WEBLLM_MODELS[0].id);
  const [webllmStatus, setWebllmStatus] = useState<WebLLMStatus>({ phase: "idle" });
  const [generated, setGenerated] = useState<GeneratedNode[]>([]);

  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  // --- the timeline plays on its own until the reader touches it ---------
  useEffect(() => {
    if (!playing) return;
    let alive = true;
    last.current = performance.now();
    const step = (now: number) => {
      if (!alive) return;
      const dt = now - last.current;
      last.current = now;
      // 900 ms per frame: the GIF's pace, so the reading speed matches.
      if (dt > 900) {
        setFrame((f) => (f + 1) % GROWTH_FRAMES);
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      alive = false;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing]);

  // --- keyboard ---------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight") {
        setPlaying(false);
        setFrame((f) => (f + 1) % GROWTH_FRAMES);
      } else if (e.key === "ArrowLeft") {
        setPlaying(false);
        setFrame((f) => (f - 1 + GROWTH_FRAMES) % GROWTH_FRAMES);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scores = useMemo(() => scoreNodes(activePrompt, embedding), [activePrompt, embedding]);
  const weights = useMemo(() => {
    const w: Record<string, number> = {};
    for (const s of scores) w[s.id] = s.weight;
    return w;
  }, [scores]);

  const best = useMemo(() => topNode(scores), [scores]);
  const lit = useMemo(
    () => scores.filter((s) => s.weight > 0.02).slice(0, 5),
    [scores]
  );

  const ask = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setActivePrompt(q);
    setEmbedding(null);
    setModelBusy(true);
    setModelNote(`loading a 22 MB model — it runs here, and the browser caches it`);
    try {
      const embed = await loadEmbedder((p) => {
        if (p.status === "download" && typeof p.progress === "number") {
          setModelNote(`downloading the embedding model — ${Math.round(p.progress)}%`);
        }
      });
      const vec = await embed(q);
      setEmbedding(vec instanceof Float32Array ? vec : Float32Array.from(vec));
      setModelNote(`matched by ${EMBEDDING_MODEL} running locally on ${deviceName()}`);
    } catch {
      setModelNote("the local model would not load — falling back to keyword matching");
    } finally {
      setModelBusy(false);
    }
  }, []);

  const askTheModel = useCallback(async () => {
    const q = activePrompt.trim();
    if (!q) {
      setWebllmStatus({ phase: "error", text: "ask something first" });
      return;
    }
    setWebllmStatus({ phase: "checking" });
    setGenerated([]);
    try {
      const concepts = await proposeConcepts(q, webllmModel, setWebllmStatus);
      if (!concepts.length) {
        setWebllmStatus({ phase: "error", text: "the model did not give any usable concepts" });
        return;
      }
      // Place each new concept by embedding it and finding the node it is
      // closest to. The decoder names the concept; the encoder says where it
      // belongs.
      const embed = await loadEmbedder();
      const placed: GeneratedNode[] = [];
      for (const [i, c] of concepts.entries()) {
        const vec = await embed(`${c.name}. ${c.gloss}`);
        const near = nearestNode(vec instanceof Float32Array ? vec : Float32Array.from(vec));
        placed.push({
          id: `gen-${i}-${c.name.replace(/\s+/g, "-").toLowerCase()}`,
          name: c.name,
          gloss: c.gloss,
          similarity: Math.max(0, near.similarity),
          parent: near.id,
        });
      }
      setGenerated(placed);
      setWebllmStatus({ phase: "done", text: `proposed ${placed.length} concepts` });
    } catch (err) {
      setWebllmStatus({
        phase: "error",
        text: err instanceof Error ? err.message : String(err),
      });
    }
  }, [activePrompt, webllmModel]);

  const crossings = crossingDomains(frame);

  return (
    <div className="fixed inset-0 bg-[#081827] text-sky-100 overflow-hidden">
      <div className="absolute inset-0 sm:right-[360px]">
        <KnowledgeGrowth3D
          frame={frame}
          weights={weights}
          selected={selected ?? best?.id ?? null}
          onSelect={(id) => setSelected((s) => (s === id ? null : id))}
          generated={generated}
          spinning={spinning}
        />
      </div>

      {/* ---- header ---- */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto max-w-md">
          <a
            href={SITE_HREF}
            className="font-mono text-[11px] uppercase tracking-widest text-sky-300/70 hover:text-sky-200 transition"
          >
            ← Domi Jin
          </a>
          <h1 className="mt-1 text-lg sm:text-xl font-bold font-serif text-white leading-tight">
            How a model&apos;s knowledge boundary grows
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs text-sky-200/70 leading-relaxed">
            The same sketch as the front page, as a ball rather than a circle.
            Drag to orbit, scrub the timeline, and ask it something.
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <button
            onClick={() => setSpinning((s) => !s)}
            className="rounded-lg border border-sky-800/70 bg-sky-950/60 px-3 py-1.5 font-mono text-[11px] text-sky-200 hover:border-[#1DAEDF] transition cursor-pointer"
          >
            {spinning ? "pause orbit" : "orbit"}
          </button>
        </div>
      </header>

      {/* ---- the prompt panel ---- */}
      <aside className="absolute right-0 top-0 z-10 h-full w-full sm:w-[360px] overflow-y-auto border-l border-sky-900/60 bg-sky-950/70 backdrop-blur-sm p-4 sm:p-5 pt-20 sm:pt-20">
        <label
          htmlFor="kg-prompt"
          className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-semibold block mb-2"
        >
          Ask the model something
        </label>
        <div className="flex gap-2">
          <input
            id="kg-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") ask(prompt);
            }}
            placeholder="What does it take to measure the Hubble constant?"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-sky-800/70 bg-sky-950/70 text-[13px] text-sky-100 placeholder:text-sky-500/70 focus:outline-none focus:border-[#1DAEDF]"
          />
          <button
            onClick={() => ask(prompt)}
            disabled={modelBusy}
            className="px-3 py-2 rounded-lg bg-[#2980b9] text-white text-xs font-semibold hover:bg-[#0369a1] disabled:opacity-50 transition cursor-pointer shrink-0"
          >
            {modelBusy ? "…" : "Ask"}
          </button>
        </div>
        <p className="mt-2 text-[11px] text-sky-300/70 leading-relaxed">
          {modelNote ||
            "A small sentence-embedding model runs here, in your browser, and lights up the concepts your prompt reaches for."}
        </p>

        {lit.length > 0 && (
          <div className="mt-5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-semibold block mb-2">
              What the model reached for
            </span>
            <ul className="space-y-1.5">
              {lit.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelected(s.id)}
                    className="w-full text-left"
                  >
                    <div className="flex justify-between text-[12px] text-sky-100 gap-2">
                      <span className="truncate">{s.label}</span>
                      <span className="font-mono text-sky-300 shrink-0">
                        {(s.weight * 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-sky-900 overflow-hidden">
                      <div
                        className="h-full bg-[#4ade80] rounded-full"
                        style={{ width: `${Math.round(s.weight * 100)}%` }}
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---- the generative layer ---- */}
        <div className="mt-6 rounded-xl border border-rose-400/30 bg-rose-950/25 p-4 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-300 font-semibold block">
            Let a local LLM write the concepts
          </span>
          <p className="text-[11px] text-rose-200/70 leading-relaxed">
            The encoder can only light up concepts that are already in the diagram.
            A decoder can propose new ones. This needs WebGPU and downloads a
            real model — {WEBLLM_MODELS.find((m) => m.id === webllmModel)?.mb} MB,
            once, cached by the browser.
          </p>
          <select
            value={webllmModel}
            onChange={(e) => setWebllmModel(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-rose-400/30 bg-sky-950/80 text-[12px] text-sky-100 focus:outline-none focus:border-rose-300 cursor-pointer"
          >
            {WEBLLM_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} · {m.mb} MB
              </option>
            ))}
          </select>
          <button
            onClick={askTheModel}
            disabled={webllmStatus.phase === "downloading" || webllmStatus.phase === "loading" || webllmStatus.phase === "generating"}
            className="w-full px-3 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-semibold disabled:opacity-60 transition cursor-pointer"
          >
            {webllmStatus.phase === "generating"
              ? "thinking…"
              : webllmStatus.phase === "downloading" || webllmStatus.phase === "loading"
                ? "loading the model…"
                : "name the concepts this needs"}
          </button>
          {webllmStatus.text && (
            <p className="text-[11px] text-rose-200/80 leading-relaxed break-words">
              {webllmStatus.phase === "downloading" && webllmStatus.progress !== undefined
                ? `${webllmStatus.progress}% — ${webllmStatus.text}`
                : webllmStatus.text}
            </p>
          )}
          {generated.length > 0 && (
            <ul className="space-y-1 pt-1">
              {generated.map((g) => (
                <li key={g.id} className="text-[11px] text-rose-100 leading-snug">
                  <span className="font-semibold">{g.name}</span>
                  {g.gloss ? <span className="text-rose-200/70"> — {g.gloss}</span> : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5 text-[11px] text-sky-400/60 leading-relaxed">
          <p>
            Space plays and pauses. ← → step a frame. The spiky ball is
            collective human knowledge; the smooth one inside it is what the
            model can recall.
          </p>
        </div>
      </aside>

      {/* ---- the timeline ---- */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 sm:px-6 pb-4 sm:pb-5 sm:pr-[380px]">
        <div className="rounded-2xl border border-sky-800/60 bg-sky-950/70 backdrop-blur-sm p-3 sm:p-4 space-y-2.5">
          <p className="text-[12px] sm:text-sm text-sky-100 leading-snug font-medium min-h-[2.2em]">
            {annotationAt(frame)}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="shrink-0 rounded-lg border border-sky-800/70 px-3 py-1.5 font-mono text-[11px] text-sky-200 hover:border-[#1DAEDF] transition cursor-pointer"
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <input
              type="range"
              min={0}
              max={GROWTH_FRAMES - 1}
              value={frame}
              onChange={(e) => {
                setPlaying(false);
                setFrame(Number(e.target.value));
              }}
              aria-label="Timeline position"
              className="flex-1 accent-[#1DAEDF] cursor-pointer"
            />
            <span className="shrink-0 font-mono text-[11px] text-sky-300/70 w-16 text-right">
              {frame}/{GROWTH_FRAMES - 1}
            </span>
          </div>
          <p className="text-[11px] text-sky-400/70 leading-relaxed">
            {crossings.length > 0
              ? `the model is outside the human graph at: ${crossings
                  .map((d) => d.label)
                  .join(", ")}`
              : "the model is still inside the human graph"}
            {best ? ` · conditioning on ${best.label}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
