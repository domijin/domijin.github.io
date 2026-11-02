"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  PERSONA_DATA,
  INTELLECTUAL_PILLARS,
  OPEN_PROJECTS,
  WRITINGS_DATA,
  GC_RESEARCH_FINDINGS,
  WritingNode,
} from "@/data/contextMapData";

const ConstellationCanvas = dynamic(
  () => import("@/components/ConstellationCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] sm:h-[520px] rounded-2xl border border-slate-200 bg-[#0b2034] flex flex-col items-center justify-center text-sky-200 font-mono text-xs sm:text-sm shadow-inner p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1DAEDF] border-t-transparent animate-spin mb-3" />
        <span>Initialising globular cluster &amp; LISA gravitational-wave model…</span>
        <span className="text-[11px] text-sky-300/70 mt-1">
          Stellar evolution in relaxation-time units (t / τ_rh) and compact binary strain
        </span>
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DAEDF]" />
              NOTES &amp; PROJECTS
            </span>
            <span className="text-slate-500 hidden md:inline text-[11px]">
              Research, experiments and occasional writing
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="/articles/"
              className="text-slate-600 hover:text-[#2980b9] font-mono transition"
            >
              Local article archive
            </a>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setAgentModalOpen(!agentModalOpen)}
              className="text-[#2980b9] hover:text-[#1DAEDF] font-mono cursor-pointer transition flex items-center gap-1"
            >
              <span className="text-[10px]">✦</span>
              <span>{agentModalOpen ? "Close site data" : "Site data"}</span>
            </button>
            <span className="text-slate-300">|</span>
            <a
              href="/pages/about-me.html?env=blue"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2980b9] transition font-medium"
            >
              <span>Archive</span>
              <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Machine-Readable Protocol Drawer */}
      {agentModalOpen && (
        <div className="border-b border-sky-100 bg-white/95 backdrop-blur-xl shadow-md transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9]">
                  Text and structured data
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
                  A plain-text profile, local article mirror and source index
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/articles/"
                  className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0369a1] text-xs font-mono hover:bg-sky-100 transition"
                >
                  GET /articles/
                </a>
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
{`# Profile, local article archive and source files
curl -s https://domij.info/llms.txt          # Profile and interests
curl -s https://domij.info/llms-full.txt     # Background, topics and local/original article URLs
curl -s https://domij.info/agent-context.json | jq '.persona, .researchFindings, .writings[0]'`}
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
              About
            </a>
            <a href="#constellation" className="hover:text-[#2980b9] transition">
              Simulation &amp; Ideas
            </a>
            <a href="#systems" className="hover:text-[#2980b9] transition">
              Projects
            </a>
            <a href="#writings" className="hover:text-[#2980b9] transition">
              Writing
            </a>
            <a href="#inquiries" className="hover:text-[#2980b9] transition">
              Contact
            </a>
          </nav>

          {/* Desktop Direct Links & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="/articles/"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1DAEDF] text-xs font-medium text-slate-700 hover:text-[#2980b9] transition bg-white"
            >
              Articles archive
            </a>
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
              Contact
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
                About
              </a>
              <a
                href="#constellation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Globular cluster &amp; ideas
              </a>
              <a
                href="#systems"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Selected projects
              </a>
              <a
                href="#writings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Writing and notes
              </a>
              <a
                href="/articles/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Local article copies
              </a>
              <a
                href="#inquiries"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Correspondence
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
        {/* Introduction */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 text-[#2980b9] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#1DAEDF]" />
              <span>Astrophysics</span>
              <span className="text-slate-300">·</span>
              <span>Machine learning</span>
              <span className="text-slate-300">·</span>
              <span>Human–AI collaboration</span>
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

            {/* Ongoing question */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(41,128,185,0.06)] space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                A question I keep returning to
              </p>
              <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif italic border-l-2 border-[#1DAEDF] pl-4">
                &ldquo;{PERSONA_DATA.centralQuestion}&rdquo;
              </blockquote>
            </div>

            {/* Explore the work */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#constellation"
                className="px-5 py-2.5 rounded-xl bg-[#2980b9] hover:bg-[#20638f] text-white font-medium text-sm transition shadow-sm"
              >
                Explore the simulation &amp; ideas
              </a>
              <a
                href="/articles/"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm transition shadow-xs"
              >
                Local article archive
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

          {/* Background overview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(41,128,185,0.07)] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                    Background
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                    Research and practice
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-[11px] font-mono text-[#0369a1] font-medium">
                  2013 &rarr; Present
                </span>
              </div>

              <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-sans">
                <p>{PERSONA_DATA.background[0].narrative}</p>
                <p>{PERSONA_DATA.background[1].narrative}</p>
                <p>{PERSONA_DATA.background[2].narrative}</p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 border-t border-slate-100 text-sm text-[#2980b9]">
                <a href="/pages/research.html" className="hover:underline underline-offset-4">
                  Research archive ↗
                </a>
                <a href="/articles/" className="hover:underline underline-offset-4">
                  Local copies
                </a>
                <a href="#writings" className="hover:underline underline-offset-4">
                  Writing
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GLOBULAR CLUSTER SIMULATION, LISA DETECTOR SIDE WINDOW & CONTEXT MAP */}
        <section id="constellation" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                <span>Stellar Dynamics · LISA Gravitational Waves · Connections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Globular cluster evolution, LISA signals and map of interests
              </h2>
              <p className="text-sm text-slate-600 max-w-4xl leading-relaxed">
                An interactive model of a globular cluster evolving in units of its half-mass relaxation time (
                <code className="text-xs font-mono text-[#0369a1]">t / τ_rh</code>, where{" "}
                <code className="text-xs font-mono text-[#0369a1]">τ_rh ≈ 800 Myr</code>), paired with the LISA space
                interferometer response to dynamically formed binary black holes (
                <code className="text-xs font-mono text-[#0369a1]">η ≃ 587 Gpc⁻³ yr⁻¹</code>) and the seven topics that
                connect my writing.
              </p>
            </div>

            {/* Mobile View Toggle & Filter Reset */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="flex lg:hidden rounded-lg bg-slate-200/70 p-1 text-xs font-medium">
                <button
                  onClick={() => setMobileMapView("3d")}
                  className={`px-3 py-1 rounded-md transition ${
                    mobileMapView === "3d"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Simulation &amp; LISA
                </button>
                <button
                  onClick={() => setMobileMapView("list")}
                  className={`px-3 py-1 rounded-md transition ${
                    mobileMapView === "list"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Topic List
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

          {/* Full-width Split Simulation (3D Globular Cluster + LISA Detector Side Window) */}
          <div className={mobileMapView === "list" ? "hidden lg:block" : "block"}>
            <ConstellationCanvas
              selectedPillar={selectedPillar}
              onSelectPillar={setSelectedPillar}
              selectedWriting={selectedWriting}
              onSelectWriting={setSelectedWriting}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 font-mono px-1">
              <span>
                ✦ Orbit: Drag · Zoom: Pinch / Scroll · Scrub cluster age in t / τ_rh · Select compact binary systems in the LISA window
              </span>
              <a
                href={GC_RESEARCH_FINDINGS.dissertationPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2980b9] hover:underline"
              >
                Full dissertation PDF (/pdfs/main.pdf) ↗
              </a>
            </div>
          </div>

          {/* Mobile-Only Structured List View for Quick Reading */}
          {mobileMapView === "list" && (
            <div className="lg:hidden space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-medium">
                  Topics
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

          {/* Context Inspector Cards (Selected Topic + Selected Writing with Local & Original Links) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
            {/* Active Pillar Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                    {activePillarObj ? "Selected topic" : "Related ideas"}
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
                      Explore a connection
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Select a topic pill above or a node inside the cluster to see how it relates to the essays and technical notes collected here.
                    </p>
                  </>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
                {PERSONA_DATA.epistemicDisclaimer}
              </div>
            </div>

            {/* Selected Writing Card */}
            {selectedWriting && (
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white border-2 border-[#1DAEDF]/50 shadow-md flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-sky-50 text-[11px] font-mono text-[#0369a1] font-medium border border-sky-100">
                      {selectedWriting.source} · {selectedWriting.date}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <a
                        href={selectedWriting.localUrl}
                        className="font-medium text-[#0369a1] hover:text-[#1DAEDF] underline underline-offset-4"
                      >
                        Local copy (HTML)
                      </a>
                      <a
                        href={selectedWriting.localMarkdownUrl}
                        className="font-mono text-slate-500 hover:text-[#2980b9] underline underline-offset-4"
                      >
                        .md
                      </a>
                      <a
                        href={selectedWriting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#2980b9] hover:text-[#1DAEDF] underline underline-offset-4"
                      >
                        Original source ↗
                      </a>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedWriting.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedWriting.summary}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/90 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                    Reading note
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedWriting.keyInsight}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FOUNDATIONS & TRAJECTORY SECTION */}
        <section id="trajectory" className="space-y-10 scroll-mt-24">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
              About
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              From astrophysics to applied machine learning
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              The subject matter has changed. The habit of making a model, testing it and revising it has stayed with me.
            </p>
          </div>

          {/* Research and work */}
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

          {/* How I work & 7 Pillars Exploration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                How I work
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
                  Questions I am exploring
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Seven related topics
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
              Work in progress
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Selected projects
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Research notes, software and design specifications at different stages of development. Each project includes a local copy of its specification in this repository alongside the original source.
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
                    <div className="flex items-center gap-2.5 text-xs">
                      {proj.localMirrorUrl && (
                        <a
                          href={proj.localMirrorUrl}
                          className="font-medium text-slate-600 hover:text-[#2980b9] underline underline-offset-4"
                        >
                          Local copy
                        </a>
                      )}
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#2980b9] hover:text-[#1DAEDF] underline underline-offset-4"
                      >
                        Source ↗
                      </a>
                    </div>
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
                      Documentation:
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

        {/* Writing and notes */}
        <section id="writings" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                Writing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Essays and technical notes
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Collected from Domi&rsquo;s Mind Waves, Medium, GitHub and the research archive. Every article is preserved as a{" "}
                <a href="/articles/" className="text-[#2980b9] underline underline-offset-4">
                  local copy in this repository
                </a>{" "}
                with a direct reference to its original publication.
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
                        href={w.localUrl}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#2980b9] transition"
                      >
                        {w.title}
                      </a>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {w.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div>
                      <span className="font-mono text-[#2980b9] font-medium mr-1.5">
                        Reading note:
                      </span>
                      {w.keyInsight}
                    </div>
                    <div
                      className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={w.localUrl}
                        className="text-[#0369a1] hover:text-[#1DAEDF] underline underline-offset-4"
                      >
                        Local copy (HTML)
                      </a>
                      <a
                        href={w.localMarkdownUrl}
                        className="text-slate-500 hover:text-[#2980b9] underline underline-offset-4"
                      >
                        Markdown (.md)
                      </a>
                      <a
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2980b9] hover:text-[#1DAEDF] underline underline-offset-4"
                      >
                        Original ({w.source}) ↗
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Correspondence */}
        <section
          id="inquiries"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6 scroll-mt-24"
        >
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Correspondence
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {PERSONA_DATA.correspondence.intro}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {PERSONA_DATA.correspondence.detail}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:contact@domij.info"
                className="px-5 py-2.5 rounded-xl bg-[#2980b9] hover:bg-[#20638f] text-white font-medium text-sm transition"
              >
                contact@domij.info
              </a>
              <a
                href="https://domijin.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-[#2980b9] text-sm font-medium transition"
              >
                Substack (Domi&rsquo;s Mind Waves) ↗
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-[#2980b9] text-sm font-medium transition"
              >
                GitHub (@domijin) ↗
              </a>
              <a
                href="https://www.linkedin.com/in/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-[#2980b9] text-sm font-medium transition"
              >
                LinkedIn ↗
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
              <a href="/articles/" className="hover:text-[#2980b9] underline underline-offset-4">
                /articles/
              </a>
              <span>·</span>
              <a href="/llms.txt" className="hover:text-[#2980b9] underline underline-offset-4">
                /llms.txt
              </a>
              <span>·</span>
              <a href="/agent-context.json" className="hover:text-[#2980b9] underline underline-offset-4">
                /agent-context.json
              </a>
              <span>·</span>
              <a href="/pages/about-me.html?env=blue" className="hover:text-[#2980b9] underline underline-offset-4">
                Archive
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
          <div className="flex flex-wrap items-center gap-4">
            <a href="/articles/" className="hover:text-[#2980b9] transition">
              Local Article Archive
            </a>
            <span>·</span>
            <a href="/pages/about-me.html?env=blue" className="hover:text-[#2980b9] transition">
              Archive
            </a>
            <span>·</span>
            <a href="/next/" className="text-[#2980b9] font-medium">
              Current edition
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
