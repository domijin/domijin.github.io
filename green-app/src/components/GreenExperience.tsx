"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  PERSONA_DATA,
  INTELLECTUAL_PILLARS,
  OPEN_PROJECTS,
  WRITINGS_DATA,
  WritingNode,
} from "@/data/contextMapData";

const ConstellationCanvas = dynamic(
  () => import("@/components/ConstellationCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] lg:h-[600px] rounded-2xl border border-slate-800 bg-[#050814] flex flex-col items-center justify-center text-slate-400 font-mono text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin mb-3" />
        Initializing Three.js N-Body &amp; Context Constellation...
      </div>
    ),
  }
);

export default function GreenExperience() {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedWriting, setSelectedWriting] = useState<WritingNode | null>(
    WRITINGS_DATA[0]
  );
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [agentModalOpen, setAgentModalOpen] = useState<boolean>(false);

  const activePillarObj = useMemo(
    () => INTELLECTUAL_PILLARS.find((p) => p.id === selectedPillar) || null,
    [selectedPillar]
  );

  const filteredWritings = useMemo(() => {
    return WRITINGS_DATA.filter((w) => {
      const matchesPillar =
        !selectedPillar ||
        w.pillar === selectedPillar ||
        w.secondaryPillars.includes(selectedPillar);
      const matchesSource =
        sourceFilter === "All" || w.source === sourceFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.keyInsight.toLowerCase().includes(q);
      return matchesPillar && matchesSource && matchesQuery;
    });
  }, [selectedPillar, sourceFilter, searchQuery]);

  const sources = ["All", "Substack", "Medium", "GitHub", "Blog", "Research"];

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Blue-Green Environment Switcher Bar */}
      <div className="border-b border-emerald-500/20 bg-emerald-950/25 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              GREEN ENVIRONMENT // v2026 NEXT.JS + THREE.JS
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Interactive Context Map &amp; Agent-First Architecture
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAgentModalOpen(!agentModalOpen)}
              className="text-sky-300 hover:text-sky-200 font-mono underline underline-offset-4 cursor-pointer"
            >
              {agentModalOpen ? "Hide Agent Protocol" : "AI / LLM Protocol (/llms.txt)"}
            </button>
            <span className="text-slate-700">|</span>
            <a
              href="/pages/about-me.html?env=blue"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
            >
              <span>Switch to Blue (Classic Archive)</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Collapsible Agent & Search Engine Discovery Drawer (KR 3) */}
      {agentModalOpen && (
        <div className="border-b border-sky-500/30 bg-slate-950/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-sky-400">
                  KR 3 // Agent &amp; Search Engine Optimization (AEO / GEO)
                </p>
                <h3 className="text-lg font-semibold text-white mt-0.5">
                  Machine-Readable Context Endpoints for Autonomous Agents &amp; Stakeholders
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-200 text-xs font-mono hover:bg-sky-500/25 transition"
                >
                  GET /llms.txt ↗
                </a>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-400/40 text-indigo-200 text-xs font-mono hover:bg-indigo-500/25 transition"
                >
                  GET /llms-full.txt ↗
                </a>
                <a
                  href="/agent-context.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs font-mono hover:bg-emerald-500/25 transition"
                >
                  GET /agent-context.json ↗
                </a>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-[#02040a] border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`# Quick Agent Verification & Context Ingestion
curl -s https://domij.info/llms.txt          # Concise Markdown Context Map & Persona
curl -s https://domij.info/llms-full.txt     # Deep 7-Pillar Synthesis & Full Writing Archive
curl -s https://domij.info/agent-context.json | jq '.persona, .intellectualInterests'`}
            </pre>
          </div>
        </div>
      )}

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#040711]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src="/images/Photo.JPG"
              alt="Domi Jin"
              className="w-9 h-9 rounded-full object-cover border border-sky-400/50 group-hover:border-sky-300 transition"
            />
            <div>
              <span className="font-semibold tracking-tight text-white block leading-none">
                {PERSONA_DATA.name}
              </span>
              <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                {PERSONA_DATA.tagline}
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#mission" className="hover:text-white transition">
              Trajectory &amp; Philosophy
            </a>
            <a href="#constellation" className="hover:text-white transition">
              3D Context Map
            </a>
            <a href="#systems" className="hover:text-white transition">
              Systems &amp; Protocols
            </a>
            <a href="#writings" className="hover:text-white transition">
              Public Writings ({WRITINGS_DATA.length})
            </a>
            <a href="#connect" className="hover:text-white transition">
              What I’m Looking For
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="https://domijin.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-xs font-medium text-slate-200 transition"
            >
              Substack ↗
            </a>
            <a
              href="#connect"
              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-sky-500/20"
            >
              Connect
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        {/* HERO SECTION + SEEDING MISSION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono">
              <span>PH.D. COMPUTATIONAL ASTROPHYSICS</span>
              <span>·</span>
              <span>APPLIED ML</span>
              <span>·</span>
              <span>FOUNDER</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
                {PERSONA_DATA.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                {PERSONA_DATA.roles.join(" ")}
              </p>
              <p className="text-lg font-mono text-slate-400">
                {PERSONA_DATA.tagline}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 space-y-3">
              <p className="text-xs font-mono uppercase tracking-widest text-sky-400">
                Mission
              </p>
              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed font-medium">
                {PERSONA_DATA.mission}
              </p>
              <div className="pt-2 border-t border-slate-800/80">
                <p className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-1">
                  Central Question
                </p>
                <p className="text-sm sm:text-base text-slate-300 italic">
                  “{PERSONA_DATA.centralQuestion}”
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#constellation"
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-sky-500/20"
              >
                Explore 3D Context Map
              </a>
              <a
                href="#connect"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-medium text-sm transition"
              >
                For AI Teams &amp; Investors
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-sm font-mono transition"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-sm font-mono transition"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Right Column: Executive Synthesis Card for Critical Stakeholders */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 block">
                    Persona &amp; Trust Alignment
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    Why First Principles × Real-World Systems
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300">
                  2013 → 2026
                </span>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  {PERSONA_DATA.background[0].narrative}
                </p>
                <p>
                  {PERSONA_DATA.background[1].narrative}
                </p>
                <p>
                  {PERSONA_DATA.background[2].narrative}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                  <div className="text-base font-bold text-sky-300 font-mono">
                    3,140
                  </div>
                  <div className="text-[11px] text-slate-400">
                    HPC N-Body Sims (&gt;100 TB)
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                  <div className="text-base font-bold text-indigo-300 font-mono">
                    &lt;50ms
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Real-Time ML &amp; Agent Spec
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70">
                  <div className="text-base font-bold text-emerald-300 font-mono">
                    7 Pillars
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Unified Context Graph
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE 3D THREE.JS CONTEXT CONSTELLATION (KR 1 & KR 4) */}
        <section id="constellation" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-sky-400">
                KR 1 &amp; KR 4 // Interactive Three.js Knowledge Constellation
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Intellectual Interests &amp; Public Writings Context Map
              </h2>
              <p className="text-sm text-slate-400 max-w-3xl">
                Inspired by $10^6$-body globular cluster simulations: the 7 core spheres represent continuing intellectual interests, while the orbiting polyhedra represent 20 public essays and open-source specifications across Substack, Medium, GitHub, and research archives.
              </p>
            </div>
            {selectedPillar && (
              <button
                onClick={() => setSelectedPillar(null)}
                className="self-start md:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-sky-300 transition cursor-pointer"
              >
                Reset Pillar Filter ✕
              </button>
            )}
          </div>

          {/* 7 Intellectual Interest Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {INTELLECTUAL_PILLARS.map((pillar) => {
              const active = selectedPillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() =>
                    setSelectedPillar(active ? null : pillar.id)
                  }
                  style={{
                    borderColor: active ? pillar.color : undefined,
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 cursor-pointer border ${
                    active
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pillar.color }}
                  />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* 3D Canvas + Live Node Inspector Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <ConstellationCanvas
                selectedPillar={selectedPillar}
                onSelectPillar={setSelectedPillar}
                selectedWriting={selectedWriting}
                onSelectWriting={setSelectedWriting}
              />
            </div>

            {/* Right Panel: Selected Pillar + Writing Inspector */}
            <div className="lg:col-span-4 space-y-4">
              {/* Active Pillar Card */}
              <div className="p-5 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    {activePillarObj ? "Selected Pillar" : "All 7 Intellectual Interests"}
                  </span>
                  {activePillarObj && (
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activePillarObj.color }}
                    />
                  )}
                </div>

                {activePillarObj ? (
                  <>
                    <h3 className="text-lg font-bold text-white">
                      {activePillarObj.title}
                    </h3>
                    <p className="text-sm font-medium text-sky-300 italic">
                      “{activePillarObj.question}”
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activePillarObj.synthesis}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-white">
                      Interconnected Inquiry
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Click any colored sphere in the 3D constellation (or a pill above) to isolate an intellectual pillar and inspect its connected essays and open-source artifacts.
                    </p>
                  </>
                )}

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                  {PERSONA_DATA.epistemicDisclaimer}
                </div>
              </div>

              {/* Selected Writing / Artifact Card */}
              {selectedWriting && (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-sky-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-[11px] font-mono text-sky-300">
                      {selectedWriting.source} · {selectedWriting.date}
                    </span>
                    <a
                      href={selectedWriting.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-sky-400 hover:text-sky-300 underline underline-offset-4"
                    >
                      Read Source ↗
                    </a>
                  </div>

                  <h4 className="text-base font-semibold text-white leading-snug">
                    {selectedWriting.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedWriting.summary}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                      Core Takeaway / First-Principles Insight
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedWriting.keyInsight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BACKGROUND TRAJECTORY & PHILOSOPHY (KR 2) */}
        <section id="mission" className="space-y-12 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              KR 2 // Coherent Trajectory &amp; Epistemic Trustworthiness
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Background &amp; Philosophy
            </h2>
            <p className="text-sm text-slate-400 max-w-3xl">
              From fundamental physics simulations to real-time decision systems and zero-to-one human-centered ventures.
            </p>
          </div>

          {/* 3 Background Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PERSONA_DATA.background.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between space-y-5 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono text-sky-400 block">
                    {item.stage}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {item.period}
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed pt-1">
                    {item.narrative}
                  </p>
                </div>

                <ul className="space-y-2 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                  {item.proofPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">▹</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Philosophy Cards + 7 Intellectual Interests Explicit Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold text-white">Philosophy</h3>
              {PERSONA_DATA.philosophy.map((phil, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2"
                >
                  <h4 className="text-sm font-semibold text-sky-300">
                    {phil.title}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {phil.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Intellectual Interests
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  7 Interconnected Domains
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {INTELLECTUAL_PILLARS.map((pillar) => (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      setSelectedPillar(pillar.id);
                      document
                        .getElementById("constellation")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-left p-4 rounded-xl bg-slate-900/45 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition space-y-1.5 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white group-hover:text-sky-300 transition">
                        {pillar.title}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: pillar.color }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pillar.question}
                    </p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-400 italic px-1">
                * {PERSONA_DATA.epistemicDisclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* OPEN-SOURCE & FOUNDER SYSTEMS (VERIFIABLE ARTIFACTS) */}
        <section id="systems" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              An Engineer’s Hands // Verifiable Systems &amp; Open Protocols
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Selected Open-Source &amp; Founder Projects
            </h2>
            <p className="text-sm text-slate-400 max-w-3xl">
              Challenge assumptions, build working systems, measure outcomes with signed receipts and preregistered ledgers, and revise our understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPEN_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-sky-500/40 transition flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-sky-400">
                      {proj.category}
                    </span>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-slate-300 hover:text-white underline underline-offset-4"
                    >
                      Inspect ↗
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-white">{proj.name}</h3>
                  <p className="text-xs font-medium text-indigo-300">
                    {proj.tagline}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    <span className="font-mono text-emerald-400 block mb-0.5">
                      Verification Contract:
                    </span>
                    {proj.verificationArtifact}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.metrics.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PUBLIC WRITINGS ARCHIVE (SUBSTACK, MEDIUM, GITHUB, BLOG) */}
        <section id="writings" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-sky-400">
                KR 1 // Unified Cross-Platform Context Map
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Public Writings &amp; Technical Essays
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                Synthesizing essays across Substack (Domi’s Mind Waves), Medium, GitHub specifications, and classic research notes.
              </p>
            </div>

            {/* Search & Source Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search essays, concepts..."
                aria-label="Search essays and concepts"
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
              />
              {sources.map((src) => (
                <button
                  key={src}
                  onClick={() => setSourceFilter(src)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                    sourceFilter === src
                      ? "bg-sky-500 text-slate-950 font-semibold"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWritings.map((w) => {
              const pillar = INTELLECTUAL_PILLARS.find(
                (p) => p.id === w.pillar
              );
              return (
                <article
                  key={w.id}
                  onClick={() => setSelectedWriting(w)}
                  className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-sky-300">
                          {w.source}
                        </span>
                        <span className="font-mono text-slate-400">
                          {w.date}
                        </span>
                      </div>
                      {pillar && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{
                            backgroundColor: `${pillar.color}20`,
                            color: pillar.color,
                          }}
                        >
                          {pillar.shortTitle}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-sky-300 transition"
                      >
                        {w.title} ↗
                      </a>
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {w.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/70 text-xs text-slate-400">
                    <span className="font-mono text-emerald-400 mr-1.5">
                      Insight:
                    </span>
                    {w.keyInsight}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* WHAT I'M LOOKING FOR (STAKEHOLDER ALIGNMENT) */}
        <section
          id="connect"
          className="rounded-3xl border border-sky-500/30 bg-gradient-to-br from-slate-900 via-[#070d20] to-slate-950 p-8 sm:p-12 space-y-8 shadow-2xl scroll-mt-20"
        >
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-sky-400">
              What I’m Looking For
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Let’s Build Where Ambitious Questions Meet Rigorous Execution
            </h2>
            <p className="text-base text-slate-200 leading-relaxed">
              {PERSONA_DATA.lookingFor.intro}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {PERSONA_DATA.lookingFor.detail}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PERSONA_DATA.lookingFor.tracks.map((track, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/75 border border-slate-800/90 space-y-2.5"
              >
                <h3 className="text-base font-bold text-sky-300">
                  {track.audience}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Focus: {track.focus}
                </p>
                <p className="text-xs text-slate-200 leading-relaxed pt-1">
                  {track.valueProp}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:contact@domij.info"
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition"
              >
                Email: contact@domij.info
              </a>
              <a
                href="https://www.linkedin.com/in/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm transition"
              >
                LinkedIn (/in/domijin) ↗
              </a>
              <a
                href="https://domijin.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm transition"
              >
                Substack (Domi’s Mind Waves) ↗
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm transition"
              >
                GitHub (@domijin) ↗
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <a href="/llms.txt" className="hover:text-sky-300">
                /llms.txt
              </a>
              <span>·</span>
              <a href="/agent-context.json" className="hover:text-sky-300">
                /agent-context.json
              </a>
              <span>·</span>
              <a href="/archives.html" className="hover:text-sky-300">
                Classic Archive (Blue)
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-[#02040a] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Domi Jin (Dongming Jin) · Scientist. Builder. Founder.
          </p>
          <div className="flex items-center gap-4">
            <a href="/pages/about-me.html?env=blue" className="hover:text-slate-300">
              Blue Environment (Classic Pelican)
            </a>
            <span>·</span>
            <a href="/next/" className="text-emerald-400">
              Green Environment (Next.js + Three.js)
            </a>
            <span>·</span>
            <a href="/beta/" className="hover:text-slate-300">
              iMessage AI Beta
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
