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
      <div className="w-full h-[360px] sm:h-[480px] lg:h-[580px] rounded-2xl border border-slate-200 bg-[#0b2034] flex flex-col items-center justify-center text-sky-200 font-mono text-xs sm:text-sm shadow-inner p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1DAEDF] border-t-transparent animate-spin mb-3" />
        <span>Initializing Three.js N-Body Celestial Field...</span>
        <span className="text-[11px] text-sky-300/70 mt-1">Modeling 1,200 stellar bodies &amp; 7 intellectual axes</span>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileMapView, setMobileMapView] = useState<"3d" | "list">("3d");

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-[#1DAEDF]/20 selection:text-[#0c4a6e] font-sans antialiased">
      {/* Discreet Environment & Protocol Ribbon */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-[#1DAEDF]/30 text-[#0369a1] font-mono font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DAEDF] animate-pulse" />
              GREEN ARCHITECTURE // NEXT.JS + THREE.JS
            </span>
            <span className="text-slate-500 hidden md:inline text-[11px]">
              Interactive Knowledge Graph &amp; Machine-Readable Context
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setAgentModalOpen(!agentModalOpen)}
              className="text-[#2980b9] hover:text-[#1DAEDF] font-mono cursor-pointer transition flex items-center gap-1"
            >
              <span className="text-[10px]">✦</span>
              <span>{agentModalOpen ? "Close Protocol" : "Agent Protocol (/llms.txt)"}</span>
            </button>
            <span className="text-slate-300">|</span>
            <a
              href="/pages/about-me.html?env=blue"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2980b9] transition font-medium"
            >
              <span>Classic Archive</span>
              <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Machine-Readable Protocol Drawer (AEO / GEO / Autonomous Agents) */}
      {agentModalOpen && (
        <div className="border-b border-sky-100 bg-white/95 backdrop-blur-xl shadow-md transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9]">
                  Machine-Readable Context Endpoints
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
                  Structured Epistemic Context for Autonomous Systems &amp; Evaluators
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0369a1] text-xs font-mono hover:bg-sky-100 transition"
                >
                  GET /llms.txt ↗
                </a>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono hover:bg-slate-100 transition"
                >
                  GET /llms-full.txt ↗
                </a>
                <a
                  href="/agent-context.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono hover:bg-emerald-100 transition"
                >
                  GET /agent-context.json ↗
                </a>
              </div>
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed shadow-sm">
{`# Machine-verifiable endpoints for AI evaluators and researchers
curl -s https://domij.info/llms.txt          # Concise Markdown synthesis & intellectual interests
curl -s https://domij.info/llms-full.txt     # Deep 7-pillar trajectory & complete writing index
curl -s https://domij.info/agent-context.json | jq '.persona, .intellectualInterests'`}
            </pre>
          </div>
        </div>
      )}

      {/* Primary Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Identity */}
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src="/images/Photo.JPG"
              alt="Domi Jin"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#1DAEDF]/80 group-hover:border-[#2980b9] transition shadow-sm"
            />
            <div>
              <span className="font-bold tracking-tight text-slate-900 group-hover:text-[#2980b9] transition block leading-tight">
                {PERSONA_DATA.name}
              </span>
              <span className="text-[11px] font-mono text-[#2980b9] block font-medium">
                {PERSONA_DATA.roles.join(" ")}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#trajectory" className="hover:text-[#2980b9] transition">
              Trajectory
            </a>
            <a href="#constellation" className="hover:text-[#2980b9] transition">
              Context Map
            </a>
            <a href="#systems" className="hover:text-[#2980b9] transition">
              Systems
            </a>
            <a href="#writings" className="hover:text-[#2980b9] transition">
              Monographs ({WRITINGS_DATA.length})
            </a>
            <a href="#inquiries" className="hover:text-[#2980b9] transition">
              Discourse
            </a>
          </nav>

          {/* Desktop Direct Links & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://domijin.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1DAEDF] text-xs font-medium text-slate-700 hover:text-[#2980b9] transition bg-white"
            >
              Substack ↗
            </a>
            <a
              href="#inquiries"
              className="hidden sm:inline-flex px-4 py-1.5 rounded-lg bg-[#2980b9] hover:bg-[#20638f] text-white font-medium text-xs transition shadow-sm"
            >
              Discourse
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <a
                href="#trajectory"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Trajectory &amp; Foundations
              </a>
              <a
                href="#constellation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Context Constellation (3D Map)
              </a>
              <a
                href="#systems"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Selected Systems &amp; Protocols
              </a>
              <a
                href="#writings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Monographs &amp; Essays ({WRITINGS_DATA.length})
              </a>
              <a
                href="#inquiries"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Discourse &amp; Inquiries
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <a
                href="https://domijin.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2980b9] font-medium"
              >
                Substack ↗
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-[#2980b9]"
              >
                GitHub ↗
              </a>
              <a
                href="/llms.txt"
                className="font-mono text-slate-500 hover:text-[#2980b9]"
              >
                /llms.txt
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
        {/* HERO SECTION // AESTHETIC MONOGRAPH & SOVEREIGN INTELLECT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#1DAEDF]/40 text-[#0284c7] text-xs font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#1DAEDF]" />
              <span>COMPUTATIONAL ASTROPHYSICS</span>
              <span className="text-slate-300">·</span>
              <span>DECISION SYSTEMS</span>
              <span className="text-slate-300">·</span>
              <span>HUMAN-AI AGENCY</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {PERSONA_DATA.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-[#2980b9] tracking-tight">
                {PERSONA_DATA.tagline}
              </p>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal pt-1">
                {PERSONA_DATA.mission}
              </p>
            </div>

            {/* Central Scientific & Philosophical Inscription */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(41,128,185,0.06)] space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                Central Inquiry
              </p>
              <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif italic border-l-2 border-[#1DAEDF] pl-4">
                &ldquo;{PERSONA_DATA.centralQuestion}&rdquo;
              </blockquote>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 font-sans">
                {PERSONA_DATA.epistemicDisclaimer}
              </p>
            </div>

            {/* Poised Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#constellation"
                className="px-5 py-2.5 rounded-xl bg-[#2980b9] hover:bg-[#20638f] text-white font-medium text-sm transition shadow-sm"
              >
                Explore Context Constellation
              </a>
              <a
                href="#trajectory"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm transition shadow-xs"
              >
                Read Foundations
              </a>
              <a
                href="https://domijin.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2980b9] font-medium text-sm transition shadow-xs"
              >
                Domi&rsquo;s Mind Waves ↗
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Provenance Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(41,128,185,0.07)] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                    Provenance &amp; Trajectory
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    First Principles × Real-World Scale
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-[11px] font-mono text-[#0369a1] font-medium">
                  2013 &rarr; Present
                </span>
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-sans">
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

              {/* Undeniable Provenance Metrics */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-center">
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200/80">
                  <div className="text-base sm:text-lg font-bold text-[#2980b9] font-mono">
                    3,140
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    HPC Sims (&gt;100 TB)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200/80">
                  <div className="text-base sm:text-lg font-bold text-[#1DAEDF] font-mono">
                    &lt;50ms
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Real-Time Inference
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200/80">
                  <div className="text-base sm:text-lg font-bold text-[#2980b9] font-mono">
                    7 Pillars
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Unified Graph
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3D KNOWLEDGE CONSTELLATION SECTION */}
        <section id="constellation" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                <span>Interactive Knowledge Graph</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Context Constellation
              </h2>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Derived from $10^6$-body globular cluster dynamics: 7 central spheres represent interconnected intellectual inquiries, while orbiting nodes chart public monographs across Substack, Medium, GitHub, and scientific archives.
              </p>
            </div>

            {/* Mobile View Toggle & Filter Reset */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              {/* Mobile View Switcher */}
              <div className="flex lg:hidden rounded-lg bg-slate-200/70 p-1 text-xs font-medium">
                <button
                  onClick={() => setMobileMapView("3d")}
                  className={`px-3 py-1 rounded-md transition ${
                    mobileMapView === "3d"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  3D View
                </button>
                <button
                  onClick={() => setMobileMapView("list")}
                  className={`px-3 py-1 rounded-md transition ${
                    mobileMapView === "list"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  List View
                </button>
              </div>

              {selectedPillar && (
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-[#2980b9] hover:bg-slate-50 transition cursor-pointer shadow-xs"
                >
                  Reset Focus ✕
                </button>
              )}
            </div>
          </div>

          {/* 7 Intellectual Interest Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            {INTELLECTUAL_PILLARS.map((pillar) => {
              const active = selectedPillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() =>
                    setSelectedPillar(active ? null : pillar.id)
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-2 cursor-pointer border shrink-0 ${
                    active
                      ? "bg-[#2980b9] border-[#2980b9] text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-[#1DAEDF] hover:text-[#2980b9]"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: active ? "#ffffff" : pillar.color }}
                  />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Dual View Display: 3D Canvas vs Structured List on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className={`lg:col-span-8 ${mobileMapView === "list" ? "hidden lg:block" : "block"}`}>
              <ConstellationCanvas
                selectedPillar={selectedPillar}
                onSelectPillar={setSelectedPillar}
                selectedWriting={selectedWriting}
                onSelectWriting={setSelectedWriting}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                <span>✦ Orbit: Drag · Zoom: Pinch / Scroll · Inspect: Tap node</span>
                <span className="hidden sm:inline">N-Body gravitational simulation</span>
              </div>
            </div>

            {/* Mobile-Only Structured List View for Quick Reading */}
            {mobileMapView === "list" && (
              <div className="lg:hidden col-span-1 space-y-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-medium">
                    Structured Pillar Index
                  </span>
                  <div className="space-y-3">
                    {INTELLECTUAL_PILLARS.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPillar(p.id)}
                        className={`p-3 rounded-lg border transition cursor-pointer ${
                          selectedPillar === p.id
                            ? "bg-sky-50 border-[#1DAEDF]"
                            : "bg-[#f8fafc] border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-900">
                            {p.title}
                          </h4>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 italic mt-1">
                          &ldquo;{p.question}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Context Inspector Panel */}
            <div className="lg:col-span-4 space-y-4">
              {/* Active Pillar Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                    {activePillarObj ? "Focused Pillar" : "Intellectual Interconnections"}
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
                    <h3 className="text-lg font-bold text-slate-900">
                      {activePillarObj.title}
                    </h3>
                    <p className="text-sm font-medium text-[#2980b9] italic">
                      &ldquo;{activePillarObj.question}&rdquo;
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activePillarObj.synthesis}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-slate-900">
                      Unified Intellectual Graph
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Select any node in the constellation to focus on an inquiry domain and inspect its corresponding public essays, formal papers, and open specifications.
                    </p>
                  </>
                )}

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
                  {PERSONA_DATA.epistemicDisclaimer}
                </div>
              </div>

              {/* Selected Monograph Inspector */}
              {selectedWriting && (
                <div className="p-6 rounded-2xl bg-white border-2 border-[#1DAEDF]/50 shadow-md space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-sky-50 text-[11px] font-mono text-[#0369a1] font-medium border border-sky-100">
                      {selectedWriting.source} · {selectedWriting.date}
                    </span>
                    <a
                      href={selectedWriting.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#2980b9] hover:text-[#1DAEDF] underline underline-offset-4"
                    >
                      Read Source ↗
                    </a>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedWriting.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedWriting.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/90 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                      Core Insight
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedWriting.keyInsight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FOUNDATIONS & TRAJECTORY SECTION */}
        <section id="trajectory" className="space-y-10 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
              Trajectory &amp; Epistemic Foundations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              From Multi-Body Physics to Human-Centered Intelligence
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              A continuous thread: testing hypotheses, building real-world systems, and measuring outcomes against empirical reality.
            </p>
          </div>

          {/* 3 Stage Monograph Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PERSONA_DATA.background.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] transition-all flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono text-[#2980b9] font-semibold block">
                    {item.stage}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    {item.period}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed pt-1">
                    {item.narrative}
                  </p>
                </div>

                <ul className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  {item.proofPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1DAEDF] mt-0.5 font-bold">▹</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Working Principles & 7 Pillars Exploration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Working Principles
              </h3>
              {PERSONA_DATA.philosophy.map((phil, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
                >
                  <h4 className="text-sm font-bold text-[#2980b9]">
                    {phil.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {phil.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  Continuing Intellectual Inquiries
                </h3>
                <span className="text-xs font-mono text-slate-500">
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
                    className="text-left p-4 rounded-xl bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-[#1DAEDF] transition space-y-1.5 cursor-pointer group shadow-xs hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#2980b9] transition">
                        {pillar.title}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: pillar.color }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.question}
                    </p>
                  </button>
                ))}
              </div>

              <p className="text-xs text-slate-500 italic px-1">
                * {PERSONA_DATA.epistemicDisclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* SELECTED SYSTEMS & OPEN PROTOCOLS */}
        <section id="systems" className="space-y-8 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
              An Engineer&rsquo;s Hands // Verifiable Systems
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Selected Systems &amp; Protocols
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Moving beyond theoretical assertions toward executable code, reproducible benchmarks, and verifiable human empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPEN_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] transition flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#0369a1] font-semibold px-2 py-0.5 rounded bg-sky-50 border border-sky-100">
                      {proj.category}
                    </span>
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#2980b9] hover:text-[#1DAEDF] underline underline-offset-4"
                    >
                      Inspect ↗
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{proj.name}</h3>
                  <p className="text-xs font-medium text-[#2980b9]">
                    {proj.tagline}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] text-slate-600">
                    <span className="font-mono text-slate-900 font-semibold block mb-0.5">
                      Protocol Specification:
                    </span>
                    {proj.verificationArtifact}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.metrics.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#f8fafc] border border-slate-200 text-[10px] font-mono text-slate-600"
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

        {/* SELECTED MONOGRAPHS & PUBLIC DISCOURSE */}
        <section id="writings" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                Synthesized Discourse
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Selected Monographs &amp; Technical Essays
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Essays spanning Substack (Domi&rsquo;s Mind Waves), Medium, GitHub engineering specifications, and classic research publications.
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
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1DAEDF] shadow-xs"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {sources.map((src) => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                      sourceFilter === src
                        ? "bg-[#2980b9] text-white font-semibold shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
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
                  onClick={() => {
                    setSelectedWriting(w);
                    document
                      .getElementById("constellation")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-5 rounded-2xl bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700 text-[11px]">
                          {w.source}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {w.date}
                        </span>
                      </div>
                      {pillar && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                          style={{
                            backgroundColor: `${pillar.color}15`,
                            color: pillar.color,
                          }}
                        >
                          {pillar.shortTitle}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#2980b9] transition"
                      >
                        {w.title} ↗
                      </a>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {w.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <span className="font-mono text-[#2980b9] font-medium mr-1.5">
                      Takeaway:
                    </span>
                    {w.keyInsight}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* INQUIRIES & DISCOURSE // HIGH-STATUS INVITATION */}
        <section
          id="inquiries"
          className="rounded-3xl border border-[#2980b9]/20 bg-gradient-to-br from-[#2980b9] via-[#2471a3] to-[#1a5276] p-8 sm:p-12 space-y-8 shadow-xl text-white scroll-mt-24"
        >
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-200 font-semibold">
              Discourse &amp; Inquiries
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Where Ambitious Questions Meet Rigorous Systems
            </h2>
            <p className="text-base sm:text-lg text-sky-100 leading-relaxed font-light">
              {PERSONA_DATA.lookingFor.intro}
            </p>
            <p className="text-sm text-sky-200/90 leading-relaxed">
              {PERSONA_DATA.lookingFor.detail}
            </p>
          </div>

          {/* Understated Audience Tracks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PERSONA_DATA.lookingFor.tracks.map((track, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5"
              >
                <h3 className="text-base font-bold text-white">
                  {track.audience}
                </h3>
                <p className="text-xs font-mono text-sky-200">
                  Focus: {track.focus}
                </p>
                <p className="text-xs text-sky-100 leading-relaxed pt-1">
                  {track.valueProp}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:contact@domij.info"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-[#2980b9] font-bold text-sm transition shadow-sm"
              >
                Inquire: contact@domij.info
              </a>
              <a
                href="https://domijin.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium transition"
              >
                Substack (Domi&rsquo;s Mind Waves) ↗
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium transition"
              >
                GitHub (@domijin) ↗
              </a>
              <a
                href="https://www.linkedin.com/in/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium transition"
              >
                LinkedIn ↗
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-sky-200">
              <a href="/llms.txt" className="hover:text-white underline underline-offset-4">
                /llms.txt
              </a>
              <span>·</span>
              <a href="/agent-context.json" className="hover:text-white underline underline-offset-4">
                /agent-context.json
              </a>
              <span>·</span>
              <a href="/pages/about-me.html?env=blue" className="hover:text-white underline underline-offset-4">
                Classic Blue Archive
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Domi Jin (Dongming Jin) · Scientist. Builder. Founder.
          </p>
          <div className="flex items-center gap-4">
            <a href="/pages/about-me.html?env=blue" className="hover:text-[#2980b9] transition">
              Blue Environment (Classic Pelican)
            </a>
            <span>·</span>
            <a href="/next/" className="text-[#2980b9] font-medium">
              Green Environment (Next.js + Three.js)
            </a>
            <span>·</span>
            <a href="/beta/" className="hover:text-[#2980b9] transition">
              iMessage AI Beta
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
