"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NODES, nearestNode, scoreNodes, topNode } from "@/lib/knowledgeScoring";
import { GROWTH_FRAMES, annotationAt, crossingDomains } from "@/lib/knowledgeGrowth";
import { KNOWLEDGE_PRESETS, formulateApproach } from "@/lib/knowledgeApproach";
import { loadEmbedder, deviceName, EMBEDDING_DOWNLOAD_MB } from "@/components/semanticMatcher";
import { WEBLLM_MODELS, proposeConcepts, type WebLLMStatus } from "@/components/webllmGenerator";
import type { GeneratedNode } from "@/components/KnowledgeGrowth3D";

const KnowledgeGrowth3D = dynamic(() => import("@/components/KnowledgeGrowth3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-xs text-sky-200">
      Building the knowledge boundary…
    </div>
  ),
});

const BASE_PATH = process.env.NEXT_BASE_PATH ?? "/next";
const SITE_HREF = BASE_PATH === "" ? "/" : `${BASE_PATH}/`;
const CONTROL = "rounded-lg border border-sky-800 px-3 py-2 text-xs text-sky-100 hover:border-sky-400 focus-visible:outline-2 focus-visible:outline-sky-300 cursor-pointer disabled:opacity-50";
const HEADING = "text-[11px] font-mono uppercase tracking-widest text-sky-300 font-semibold";

export default function KnowledgeSandboxPage() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [spinning, setSpinning] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(KNOWLEDGE_PRESETS[0]);
  const [activePrompt, setActivePrompt] = useState(KNOWLEDGE_PRESETS[0]);
  const [embedding, setEmbedding] = useState<Float32Array | null>(null);
  const [modelNote, setModelNote] = useState("Keyword matches are shown now. Ask to refine them with a local embedding model.");
  const [modelBusy, setModelBusy] = useState(false);
  const [modality, setModality] = useState(false);
  const [symbolic, setSymbolic] = useState(false);
  const [webllmModel, setWebllmModel] = useState(WEBLLM_MODELS[0].id);
  const [webllmStatus, setWebllmStatus] = useState<WebLLMStatus>({ phase: "idle" });
  const [generated, setGenerated] = useState<GeneratedNode[]>([]);
  const requestId = useRef(0);
  const generationRunning = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      setSpinning(false);
    }
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    // Advance on elapsed story time, not the interval between animation frames.
    const timer = window.setInterval(() => setFrame((f) => (f + 1) % GROWTH_FRAMES), 900);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select, button, a, summary, [contenteditable]")) return;
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setPlaying(false);
        setFrame((f) => (f + (e.key === "ArrowRight" ? 1 : -1) + GROWTH_FRAMES) % GROWTH_FRAMES);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scores = useMemo(() => scoreNodes(activePrompt, embedding), [activePrompt, embedding]);
  const weights = useMemo(() => Object.fromEntries(scores.map((s) => [s.id, s.weight])), [scores]);
  const best = topNode(scores);
  const selectedId = selected ?? best?.id ?? null;
  const selectedNode = NODES.find((n) => n.id === selectedId);
  const selectedScore = scores.find((s) => s.id === selectedId);
  const approach = formulateApproach(activePrompt, !!best, modality, symbolic);
  const crossings = crossingDomains(frame);
  const generationBusy = ["checking", "downloading", "loading", "generating"].includes(webllmStatus.phase);

  const ask = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;
    const id = ++requestId.current;
    const current = () => mounted.current && requestId.current === id;
    setPrompt(q);
    setActivePrompt(q);
    setSelected(null);
    setEmbedding(null);
    setGenerated([]);
    if (!generationRunning.current) setWebllmStatus({ phase: "idle" });
    setModelBusy(true);
    setModelNote(`Showing keyword matches; loading the ${EMBEDDING_DOWNLOAD_MB} MB embedding model…`);
    try {
      const embed = await loadEmbedder((p) => {
        if (current() && p.status === "download" && typeof p.progress === "number") {
          setModelNote(`Showing keyword matches; downloading the model — ${Math.round(p.progress)}%`);
        }
      });
      if (!current()) return;
      const vec = await embed(q);
      if (!current()) return;
      setEmbedding(vec instanceof Float32Array ? vec : Float32Array.from(vec));
      setModelNote(`Semantic + keyword matching · runs locally on ${deviceName()}.`);
    } catch {
      if (current()) setModelNote("The embedding model could not load. Keyword matching is still active; Ask retries the download.");
    } finally {
      if (current()) setModelBusy(false);
    }
  }, []);

  const askTheModel = useCallback(async () => {
    if (generationRunning.current) return;
    generationRunning.current = true;
    const id = requestId.current;
    const current = () => mounted.current && requestId.current === id;
    setWebllmStatus({ phase: "checking", text: "Checking WebGPU support…" });
    setGenerated([]);
    try {
      const concepts = await proposeConcepts(activePrompt, webllmModel, (status) => {
        // Keep busy while the encoder places the generated concepts.
        if (current() && status.phase !== "done") setWebllmStatus(status);
      });
      if (!current()) return;
      if (!concepts.length) throw new Error("The model did not propose any usable concepts. Try again.");
      setWebllmStatus({ phase: "generating", text: "Placing the proposed concepts in the graph…" });
      const embed = await loadEmbedder();
      const placed: GeneratedNode[] = [];
      for (const [i, c] of concepts.entries()) {
        if (!current()) return;
        const vec = await embed(`${c.name}. ${c.gloss}`);
        const near = nearestNode(vec instanceof Float32Array ? vec : Float32Array.from(vec));
        placed.push({ id: `gen-${i}`, name: c.name, gloss: c.gloss, similarity: Math.max(0, near.similarity), parent: near.id });
      }
      if (current()) {
        setGenerated(placed);
        setWebllmStatus({ phase: "done", text: `Proposed ${placed.length} concepts for this prompt.` });
      }
    } catch (err) {
      if (current()) setWebllmStatus({ phase: "error", text: err instanceof Error ? err.message : String(err) });
    } finally {
      generationRunning.current = false;
      if (mounted.current && !current()) setWebllmStatus({ phase: "idle" });
    }
  }, [activePrompt, webllmModel]);

  return (
    <div className="min-h-dvh bg-[#081827] text-sky-100 lg:h-dvh lg:overflow-hidden flex flex-col">
      <header className="shrink-0 border-b border-sky-900/60 px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-3xl">
          <a href={`${SITE_HREF}#how-the-model-works`} className="text-xs text-sky-300 hover:underline">← Domi Jin</a>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold font-serif text-white">How I Think a Language Model Works</h1>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">Ask a question, trace its concepts, and explore two ways to extend the model.</p>
        </div>
        <a href="/articles/blog/all-about-chatgpt.html" className={`${CONTROL} shrink-0`}>Read the 2023 essay ↗</a>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px] lg:grid-rows-[auto_minmax(0,1fr)] lg:flex-1 lg:min-h-0">
        <section aria-labelledby="ask-heading" className="p-4 sm:p-5 border-b border-sky-900/60 lg:col-start-2 lg:row-start-1 lg:border-l bg-[#0b2034]">
          <h2 id="ask-heading" className={HEADING}>01 · Ask or try</h2>
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); void ask(prompt); }}>
            <label htmlFor="kg-prompt" className="sr-only">Your question</label>
            <input id="kg-prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Type a question…" className="min-w-0 flex-1 rounded-lg border border-sky-800 bg-[#081827] px-3 py-2 text-sm focus:outline-2 focus:outline-sky-300" />
            <button type="submit" disabled={!prompt.trim()} className={`${CONTROL} bg-[#075985]`}>Ask</button>
          </form>
          <p className="mt-3 text-[11px] text-slate-400">Or try a question from the sketch:</p>
          <div className="mt-1 space-y-1">
            {KNOWLEDGE_PRESETS.map((q) => (
              <button key={q} onClick={() => void ask(q)} aria-pressed={activePrompt === q} className={`block w-full rounded-md px-2 py-1.5 text-left text-xs leading-relaxed hover:bg-sky-900/50 focus-visible:outline-2 focus-visible:outline-sky-300 ${activePrompt === q ? "bg-sky-900/40 text-sky-100" : "text-sky-300"}`}>{q}</button>
            ))}
          </div>
          <p role="status" className="mt-2 text-[11px] text-slate-400 leading-relaxed">{modelBusy ? "◌ " : ""}{modelNote}</p>
        </section>

        <section aria-label="Interactive knowledge sphere" className="flex flex-col min-w-0 h-[640px] sm:h-[720px] lg:h-full lg:min-h-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
          <div className="px-4 pt-4 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-sky-400">◌ Human knowledge</span><span className="text-sky-100">◌ Model boundary</span>
              <span className="text-green-400">● Prompt relevance</span><span className="text-amber-300">● Breakthrough</span>
            </div>
            <button className={CONTROL} onClick={() => setSpinning((s) => !s)} aria-pressed={spinning}>{spinning ? "Pause orbit" : "Orbit"}</button>
          </div>
          <div className="flex-1 min-h-0 relative">
            <KnowledgeGrowth3D frame={frame} weights={weights} selected={selectedId} onSelect={(id) => setSelected((s) => s === id ? null : id)} generated={generated} spinning={spinning} modality={modality} symbolic={symbolic} />
          </div>
          <div className="shrink-0 m-3 sm:m-4 rounded-xl border border-sky-900 bg-[#0b2034] p-3 space-y-2">
            <p className="text-xs text-sky-100 min-h-[2.5em]">{annotationAt(frame)}</p>
            <div className="flex items-center gap-3">
              <button className={CONTROL} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause timeline" : "Play timeline"}>{playing ? "Pause" : "Play"}</button>
              <input type="range" min={0} max={GROWTH_FRAMES - 1} value={frame} onChange={(e) => { setPlaying(false); setFrame(Number(e.target.value)); }} aria-label="Timeline position" className="min-w-0 flex-1 accent-sky-400" />
              <span className="font-mono text-[11px] text-sky-300">{frame + 1}/{GROWTH_FRAMES}</span>
            </div>
            <p className="text-[11px] text-slate-400">{crossings.length ? `In this sketch, the model passes the human frontier in: ${crossings.map((d) => d.label).join(", ")}.` : "In this sketch, the model boundary remains within human knowledge."}</p>
            <p className="text-[11px] text-slate-400">Drag to orbit; scroll or pinch to zoom. Space plays / pauses; ← → steps the story.</p>
          </div>
        </section>

        <aside className="lg:col-start-2 lg:row-start-2 lg:overflow-y-auto lg:min-h-0 lg:border-l border-sky-900/60 p-4 sm:p-5 space-y-6 bg-[#0b2034]">
          <section aria-labelledby="approach-heading">
            <h2 id="approach-heading" className={HEADING}>02 · How to beat ChatGPT</h2>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">The proposal in my 2023 sketch: combine correlated memories with observations from the world and explicit symbolic operations. A hypothesis to test, not a benchmark result.</p>
            <div className="mt-3 space-y-2">
              <label className="flex items-start gap-3 rounded-lg border border-rose-400/30 p-3 cursor-pointer">
                <input type="checkbox" checked={modality} onChange={(e) => setModality(e.target.checked)} className="mt-1 accent-rose-400" />
                <span className="text-xs leading-relaxed"><strong className="block text-rose-200">New data modality · observe</strong><span className="text-slate-300">Query the world: retrieve evidence, take a measurement, or run an experiment.</span></span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-rose-400/30 p-3 cursor-pointer">
                <input type="checkbox" checked={symbolic} onChange={(e) => setSymbolic(e.target.checked)} className="mt-1 accent-rose-400" />
                <span className="text-xs leading-relaxed"><strong className="block text-rose-200">Symbolic learning / tools · compute</strong><span className="text-slate-300">Use rules, loops, and unit checks to turn related concepts into a checkable result.</span></span>
              </label>
            </div>
            <div className="mt-3 rounded-lg border border-sky-800 p-3" aria-live="polite">
              <h3 className={`text-xs font-semibold ${approach.missing.length ? "text-amber-200" : "text-green-200"}`}>{approach.headline}</h3>
              <p className="mt-1 text-[11px] text-slate-400 break-words">For: {activePrompt}</p>
              <ol className="mt-3 list-decimal pl-4 space-y-2 text-xs text-slate-300 leading-relaxed">{approach.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              <p className="mt-3 text-[11px] text-slate-400">These switches illustrate a workflow. They do not fetch evidence or execute a calculation.</p>
            </div>
          </section>

          <section aria-labelledby="weights-heading">
            <h2 id="weights-heading" className={HEADING}>03 · Nodes &amp; prompt weights</h2>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">Brighter, larger nodes are more relevant to the submitted prompt. Connections brighten when both ends match. Select a node to inspect it.</p>
            <p className="mt-2 text-[11px] text-slate-400">Illustrative relevance scores, not neural-network weights or answer confidence. {embedding ? "68% scaled embedding similarity + 32% keyword match." : "Keyword-only mode: up to 0.32 until the embedding model loads."}</p>
            {!best && <p className="mt-3 text-xs text-amber-200">No strong match in this concept map. Try another prompt or propose new concepts below.</p>}
            <ul className="mt-3 space-y-1">
              {scores.map((s) => (
                <li key={s.id}>
                  <button onClick={() => setSelected((id) => id === s.id ? null : s.id)} aria-pressed={selectedId === s.id} className={`w-full rounded-lg p-2 text-left focus-visible:outline-2 focus-visible:outline-sky-300 ${selectedId === s.id ? "bg-sky-900/60 ring-1 ring-sky-500" : "hover:bg-sky-900/30"}`}>
                    <span className="flex justify-between gap-3 text-xs"><span>{s.label}</span><span className="font-mono text-green-300 tabular-nums">{s.weight.toFixed(2)}</span></span>
                    <span className="mt-1.5 block h-1 rounded-full bg-sky-950"><span className="block h-full rounded-full bg-green-400" style={{ width: `${s.weight * 100}%` }} /></span>
                  </button>
                </li>
              ))}
            </ul>
            {selectedNode && selectedScore && (
              <div className="mt-3 border-l-2 border-sky-400 pl-3 text-xs leading-relaxed">
                <h3 className="font-semibold text-sky-200">{selectedNode.label}</h3>
                <p className="mt-1 text-slate-300">{selectedNode.description}</p>
                <p className="mt-2 font-mono text-[11px] text-slate-400">Keyword: {selectedScore.lexical.toFixed(2)} · Cosine: {embedding ? selectedScore.semantic.toFixed(2) : "not loaded"}</p>
              </div>
            )}
          </section>

          <details className="rounded-xl border border-rose-400/30 p-3">
            <summary className="text-xs font-semibold text-rose-200 cursor-pointer">Extend the graph with a local LLM</summary>
            <div className="mt-3 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">Propose concepts missing from this map. Requires WebGPU and a model download of about {WEBLLM_MODELS.find((m) => m.id === webllmModel)?.mb} MB, cached by your browser. Suggestions appear in pink and still need verification.</p>
              <label htmlFor="kg-model" className="block text-[11px] text-slate-400">Local model</label>
              <select id="kg-model" value={webllmModel} disabled={generationBusy} onChange={(e) => setWebllmModel(e.target.value)} className="w-full rounded-lg border border-sky-800 bg-[#081827] p-2 text-xs">
                {WEBLLM_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label} · ~{m.mb} MB</option>)}
              </select>
              <button onClick={() => void askTheModel()} disabled={generationBusy} className={`${CONTROL} w-full`}>{generationBusy ? "Working…" : "Propose concepts for this prompt"}</button>
              <p role="status" className="text-[11px] text-rose-200 break-words">{webllmStatus.text}</p>
              {generated.length > 0 && <ul className="space-y-2 text-xs text-rose-100">{generated.map((g) => <li key={g.id}><strong>{g.name}</strong>{g.gloss ? ` — ${g.gloss}` : ""}</li>)}</ul>}
            </div>
          </details>
          <p className="text-[11px] text-slate-400 leading-relaxed">The sphere, domain boundaries, and connections are a conceptual sketch, not measurements of a language model. The prompt matching and optional local generation run in your browser.</p>
        </aside>
      </main>
    </div>
  );
}
