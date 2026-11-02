"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  PERSONA_DATA,
  INTELLECTUAL_PILLARS,
  OPEN_PROJECTS,
  WRITINGS_DATA,
  GC_RESEARCH_FINDINGS,
  WritingNode,
} from "@/data/contextMapData";
import { BOOK_ESSAYS_BY_URL, BookEssayEntry } from "@/data/bookContentData";

const GlobularClusterSimulation = dynamic(
  () => import("@/components/GlobularClusterSimulation"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[420px] sm:h-[520px] rounded-2xl border border-slate-200 bg-[#0b2034] flex flex-col items-center justify-center text-sky-200 font-mono text-xs sm:text-sm shadow-inner p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1DAEDF] border-t-transparent animate-spin mb-3" />
        <span>Initialising Figure 1.1: Globular cluster &amp; LISA gravitational-wave model…</span>
        <span className="text-[11px] text-sky-300/70 mt-1">
          Stellar evolution in relaxation-time units (t / τ_rh) and compact binary strain
        </span>
      </div>
    ),
  }
);

const ConstellationCanvas = dynamic(
  () => import("@/components/ConstellationCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-2xl border border-slate-200 bg-[#0b2034] flex flex-col items-center justify-center text-sky-200 font-mono text-xs sm:text-sm shadow-inner p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1DAEDF] border-t-transparent animate-spin mb-3" />
        <span>Initialising Figure E.1: Interactive site map of themes, works and essays…</span>
      </div>
    ),
  }
);

interface BookChapterSpec {
  id: string;
  roman: string;
  partLabel: string;
  title: string;
  subtitle: string;
  epigraph: string;
  period: string;
  essayUrls: string[];
  projectIds: string[];
}

const BOOK_CHAPTERS: BookChapterSpec[] = [
  {
    id: "chapter-1",
    roman: "I",
    partLabel: "Part I · Understanding and Building",
    title: "Stellar Dynamics and the Practice of Modelling",
    subtitle:
      "How a million stars relax, segregate by mass and forge binary black holes—and what N-body physics teaches about long-horizon dynamical systems.",
    epigraph:
      "Before a model can predict a rare event, it must respect the timescale on which ordinary interactions reshape the whole system.",
    period: "2013 – 2018 · UT Arlington Astrophysics & LSST",
    essayUrls: ["/articles/research/astrophysics-bbh-dissertation.html"],
    projectIds: ["astrophysics-lisa-gw"],
  },
  {
    id: "chapter-2",
    roman: "II",
    partLabel: "Part I · Understanding and Building",
    title: "Decisions Under Constraints",
    subtitle:
      "From traffic intersections and marketplace pricing to multi-agent advertising control planes and the ergonomics of everyday interfaces.",
    epigraph:
      "In production systems, the hardest constraint is rarely model capacity; it is making a sound decision within fifty milliseconds without eroding human trust.",
    period: "2018 – 2026 · Uber, Airbnb, SmartNews & Independent Systems",
    essayUrls: [
      "/articles/medium/from-traffic-lights-to-lifes-direction-57176d5d7a06.html",
      "/articles/github/observations-in-advertising.html",
      "/articles/medium/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced.html",
      "/articles/medium/the-future-of-advertising-moving-beyond-relevance-to-demand-profiling-and-dynamic-personalization-5f4ccc03697c.html",
      "/articles/medium/trace-of-applovins-7x-annual-hypergrowth-39dcb154f5d0.html",
      "/articles/medium/is-dark-mode-doing-more-harm-than-good-a-deeper-look-at-our-choices-a9685daad170.html",
      "/articles/medium/why-is-some-professional-handwriting-illegible-d07bd8acb818.html",
    ],
    projectIds: ["agent-ad-systems"],
  },
  {
    id: "chapter-3",
    roman: "III",
    partLabel: "Part II · Living and Working Together",
    title: "Human Agency, Older People’s Independence and Lifelong Play",
    subtitle:
      "Field lessons from Palo Alto seniors, autonomous mobility, active reading and tools designed to strengthen human judgement rather than replace it.",
    epigraph:
      "Technology serves people best when it preserves the dignity of independent action and leaves room for curiosity at every age.",
    period: "2024 – 2026 · Kin Domi, Open Learning Lab & Household AI",
    essayUrls: [
      "/articles/substack/starting-a-new-venture.html",
      "/articles/substack/tesla-seniors-love-your-self-drivingnow.html",
      "/articles/substack/reclaiming-play-as-a-life-skill.html",
      "/articles/substack/building-the-context-for-reading.html",
      "/articles/github/open-learning-lab.html",
      "/articles/github/baby-ai.html",
      "/articles/blog/imessage-ai-router.html",
      "/articles/medium/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285.html",
      "/articles/substack/relections-from-coach-seeking-impulse.html",
    ],
    projectIds: ["open-learning-lab", "baby-ai", "imessage-router", "kin-domi"],
  },
  {
    id: "chapter-4",
    roman: "IV",
    partLabel: "Part II · Living and Working Together",
    title: "Institutions, Incentives and Possible Futures",
    subtitle:
      "Shared values as Greatest Common Divisor, complementary skills as Least Common Multiple, intentional life rhythms and civic renovation.",
    epigraph:
      "We exhaust our gifts across a whole life to express what lies deep in the soul—and our most durable achievements arise when we build together.",
    period: "2018 – Present · Civic Notes, Engineering Culture & Synthesis",
    essayUrls: [
      "/articles/substack/hello-world.html",
      "/articles/substack/overachievers-responsibility-reflection.html",
      "/articles/substack/serendipity-where-it-sparks.html",
      "/articles/substack/momentum-momentum-momentum.html",
      "/articles/substack/a-colorful-year-ahead.html",
      "/articles/github/libertyearth-and-future.html",
      "/articles/blog/free-market-in-a-possibility-universe.html",
      "/articles/blog/all-about-chatgpt.html",
      "/articles/medium/boeings-future-at-stake-the-growing-challenge-from-spacex-177b63b10882.html",
      "/articles/medium/observation-the-dilemma-and-cultural-difference-behind-the-evtol-field-df42e91af109.html",
      "/articles/medium/why-tiktok-is-so-popular-6fcc7b678bc7.html",
    ],
    projectIds: ["libertyearth-future"],
  },
];

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokenRegex =
    /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const [, label, href] = m;
        const isExternal = href.startsWith("http://") || href.startsWith("https://");
        return (
          <a
            key={idx}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-[#2980b9] underline underline-offset-3 hover:text-[#1DAEDF]"
          >
            {label}
          </a>
        );
      }
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[0.86em] text-[#0369a1]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderFormattedBlock(block: string, idx: number) {
  const lines = block
    .split("\n")
    .map((ln) => ln.trim())
    .filter(Boolean);
  if (
    lines.length >= 2 &&
    lines[0].startsWith("|") &&
    lines[0].endsWith("|") &&
    lines[1].includes("---")
  ) {
    const headers = lines[0]
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());
    const rows = lines
      .slice(2)
      .filter((r) => r.startsWith("|"))
      .map((r) =>
        r
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim())
      );
    return (
      <div key={idx} className="my-5 overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm font-sans">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-900"
                >
                  {renderInlineMarkdown(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-slate-200">
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="border border-slate-200 px-3 py-2 text-slate-700 align-top"
                  >
                    {renderInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.startsWith("### ")) {
    return (
      <h4
        key={idx}
        className="text-lg font-bold text-slate-900 mt-6 mb-2 font-serif tracking-tight"
      >
        {renderInlineMarkdown(block.slice(4))}
      </h4>
    );
  }
  if (block.startsWith("## ")) {
    return (
      <h3
        key={idx}
        className="text-xl font-bold text-slate-900 mt-8 mb-3 font-serif tracking-tight"
      >
        {renderInlineMarkdown(block.slice(3))}
      </h3>
    );
  }
  if (block.startsWith("> ")) {
    return (
      <blockquote
        key={idx}
        className="my-5 pl-4 border-l-3 border-[#2980b9] italic text-slate-700 font-serif text-base leading-relaxed"
      >
        {renderInlineMarkdown(block.slice(2))}
      </blockquote>
    );
  }
  if (block.startsWith("• ")) {
    const items = block.split("\n").map((line) => line.replace(/^•\s*/, ""));
    return (
      <ul
        key={idx}
        className="my-4 pl-5 list-disc space-y-1.5 text-slate-800 font-serif text-[17px] leading-relaxed"
      >
        {items.map((it, i) => (
          <li key={i}>{renderInlineMarkdown(it)}</li>
        ))}
      </ul>
    );
  }
  return (
    <p
      key={idx}
      className="mb-4 text-slate-800 font-serif text-[17px] sm:text-[18px] leading-[1.82]"
    >
      {renderInlineMarkdown(block)}
    </p>
  );
}

export default function GreenExperience() {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedWriting, setSelectedWriting] = useState<WritingNode | null>(
    WRITINGS_DATA[0]
  );
  const [chapterFilter, setChapterFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [agentModalOpen, setAgentModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileMapView, setMobileMapView] = useState<"3d" | "list">("3d");

  // Active essay open in the self-sufficient In-Page Book Reader
  const [activeReaderUrl, setActiveReaderUrl] = useState<string | null>(null);
  const readerScrollRef = useRef<HTMLDivElement | null>(null);

  // Interactive Figure 2.1 state (Chapter II: Latency vs Coordination & Traffic Signal Experiment)
  const [fig2Mode, setFig2Mode] = useState<"ad-plane" | "traffic">("ad-plane");
  const [fig2Participation, setFig2Participation] = useState<number>(65);
  const [fig2LatencyBudget, setFig2LatencyBudget] = useState<number>(45);

  // Interactive Figure 3.1 state (Chapter III: 5-Stage Agency-Preserving Learning & Senior Mobility)
  const [fig3StageIndex, setFig3StageIndex] = useState<number>(0);

  // Interactive Figure 4.1 state (Chapter IV: GCD Shared Values & LCM Complementary Skills)
  const [fig4Gcd, setFig4Gcd] = useState<number>(78);
  const [fig4Lcm, setFig4Lcm] = useState<number>(82);

  const activeReaderEssay: BookEssayEntry | null = useMemo(() => {
    if (!activeReaderUrl) return null;
    return BOOK_ESSAYS_BY_URL[activeReaderUrl] || null;
  }, [activeReaderUrl]);

  // Keyboard Escape handler, scroll lock and scroll-to-top for In-Page Book Reader
  useEffect(() => {
    if (!activeReaderUrl) return;
    if (readerScrollRef.current) {
      readerScrollRef.current.scrollTop = 0;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveReaderUrl(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeReaderUrl]);

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
      const bookEntry = BOOK_ESSAYS_BY_URL[w.localUrl];
      const chRoman = bookEntry?.chapterRoman || "IV";
      const matchesChapter =
        chapterFilter === "All" || chapterFilter === `Chapter ${chRoman}`;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.keyInsight.toLowerCase().includes(q);
      return matchesPillar && matchesChapter && matchesQuery;
    });
  }, [selectedPillar, chapterFilter, searchQuery]);

  const chapterTabs = [
    "All",
    "Chapter I",
    "Chapter II",
    "Chapter III",
    "Chapter IV",
  ];

  const openEssayInBook = (url: string) => {
    if (BOOK_ESSAYS_BY_URL[url]) {
      setActiveReaderUrl(url);
    } else {
      window.location.href = url;
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, url: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEssayInBook(url);
    }
  };

  const fig3Stages = [
    {
      step: "Stage 1 · Frame the Problem",
      passive: "User pastes prompt; model immediately outputs a polished answer.",
      agency:
        "Learner states their current hypothesis and what constraints make the problem hard before any generation occurs.",
      seniorParallel:
        "In Kin Domi & Tesla FSD interviews: clear route intent before the vehicle begins a complex turn.",
    },
    {
      step: "Stage 2 · First-Principles Attempt",
      passive: "Skipped—the user reads a fluent explanation and mistakes fluency for mastery.",
      agency:
        "Learner sketches a rough mechanism or calculation first, surfacing hidden gaps in understanding.",
      seniorParallel:
        "Older adults strongly preferred trying a task themselves with a quiet safety net over having a system take over unannounced.",
    },
    {
      step: "Stage 3 · Targeted Critique",
      passive: "Generic praise or full rewrite that erases the author’s voice.",
      agency:
        "AI acts as a Socratic sparring partner, questioning a specific assumption or boundary condition.",
      seniorParallel:
        "Replacing sudden high-frequency cockpit chimes with calm, intelligible spoken context.",
    },
    {
      step: "Stage 4 · Deliberate Revision",
      passive: "Copy-pasted output with low 30-day retention.",
      agency:
        "Learner revises their own model, code or essay in response to the critique.",
      seniorParallel:
        "Adjusting driving-assistance sensitivity and voice-command confirmation to match personal comfort.",
    },
    {
      step: "Stage 5 · Reflection & Transfer",
      passive: "Session ends as soon as the immediate task is completed.",
      agency:
        "Learner records a short transfer note on what changed in their mental model and where the principle applies next.",
      seniorParallel:
        "Reclaiming ‘play’ not as frivolous pastime, but as lifelong curiosity and dignified self-reliance.",
    },
  ];

  // Derived illustrative trade-off curves for Figure 2.1
  const fig2Stats = useMemo(() => {
    if (fig2Mode === "ad-plane") {
      const syncServedPct = Math.min(99.8, Math.max(85, 92 + (fig2LatencyBudget - 25) * 0.18));
      const fatigueReduction = Math.round(18 + fig2Participation * 0.28);
      return {
        headline: `Illustrative hot-path target: ${fig2LatencyBudget} ms p99 budget (${syncServedPct.toFixed(1)}% within SLA curve)`,
        subline: `In this heuristic scaling model, an 8-agent asynchronous loop recalibrates demand and creative priors every ~${Math.max(2, Math.round(12 - fig2Participation * 0.08))} min, illustrating how separating slow profiling from fast serving bounds repetitive fatigue (~${fatigueReduction}% modeled reduction).`,
        metricA: `${fig2LatencyBudget} ms`,
        labelA: "Hot-path p99 target",
        metricB: "8 agents",
        labelB: "Async control plane",
        metricC: `~${fatigueReduction}%`,
        labelC: "Modeled fatigue drop",
      };
    } else {
      const waitReduction = Math.round(12 + fig2Participation * 0.42);
      const inferConfidence = Math.min(98, Math.round(54 + fig2Participation * 0.44));
      return {
        headline: `Illustrative telemetry share: ${fig2Participation}% of approaching vehicles`,
        subline: `In this conceptual traffic-flow model, pairing sparse vehicle kinematics with symbolic conservation laws illustrates how phase-state confidence (~${inferConfidence}%) and queue clearance (~${waitReduction}% less idle wait) scale with participation.`,
        metricA: `${fig2Participation}%`,
        labelA: "Crowdsourced fleet share",
        metricB: `${inferConfidence}%`,
        labelB: "Modeled phase confidence",
        metricC: `-${waitReduction}%`,
        labelC: "Modeled idle delay",
      };
    }
  }, [fig2Mode, fig2Participation, fig2LatencyBudget]);

  // Derived metrics for Figure 4.1
  const fig4Synthesis = useMemo(() => {
    const trustIndex = Math.round(fig4Gcd * 0.9 + 8);
    const creativeReach = Math.round((fig4Gcd * 0.45 + fig4Lcm * 0.55));
    const frictionRisk = Math.max(5, Math.round(100 - fig4Gcd * 0.75 + (fig4Lcm - fig4Gcd) * 0.25));
    let archetype = "High-Trust Collaborative Guild";
    if (fig4Gcd < 45 && fig4Lcm >= 60) {
      archetype = "Fragmented Specialists (High Capability, Low Cohesion)";
    } else if (fig4Gcd >= 65 && fig4Lcm < 45) {
      archetype = "Harmonious Monoculture (High Cohesion, Narrow Reach)";
    } else if (fig4Gcd < 45 && fig4Lcm < 45) {
      archetype = "Low-Trust Bureaucracy (High Coordination Tax)";
    }
    return { trustIndex, creativeReach, frictionRisk, archetype };
  }, [fig4Gcd, fig4Lcm]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 selection:bg-[#1DAEDF]/20 selection:text-[#0c4a6e] font-sans antialiased">
      {/* Top Book Edition Bar */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-[#1DAEDF]/30 text-[#0369a1] font-mono font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DAEDF]" />
              INTERACTIVE MONOGRAPH
            </span>
            <span className="text-slate-500 hidden md:inline text-[11px] font-serif italic">
              Notes on modelling, engineering practice, human agency and social renovation
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="/articles/"
              className="text-slate-600 hover:text-[#2980b9] font-mono transition"
            >
              Table of contents (28 essays)
            </a>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setAgentModalOpen(!agentModalOpen)}
              className="text-[#2980b9] hover:text-[#1DAEDF] font-mono cursor-pointer transition flex items-center gap-1"
            >
              <span className="text-[10px]">✦</span>
              <span>{agentModalOpen ? "Close colophon & data" : "Colophon & data"}</span>
            </button>
            <span className="text-slate-300">|</span>
            <a
              href="/pages/about-me.html?env=blue"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2980b9] transition font-medium"
            >
              <span>2018 Pelican edition</span>
              <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Colophon & Machine-Readable Data Drawer */}
      {agentModalOpen && (
        <div className="border-b border-sky-100 bg-white/95 backdrop-blur-xl shadow-md transition-all">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9]">
                  Colophon &amp; Structured Book Index
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
                  Self-sufficient essays and machine-readable index
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  All twenty-eight essays and system specifications are published in full directly on this site, with original publication venues recorded as footnotes.
                </p>
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
{`# Read the book index and structured essays
curl -s https://domij.info/llms.txt          # Monograph overview and chapter outline
curl -s https://domij.info/llms-full.txt     # Full chapter notes and essay index
curl -s https://domij.info/agent-context.json | jq '.persona, .researchFindings, .writings[0]'`}
            </pre>
          </div>
        </div>
      )}

      {/* Primary Sticky Book Spine Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src="/images/Photo.JPG"
              alt="Domi Jin"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#1DAEDF]/80 group-hover:border-[#2980b9] transition shadow-sm"
            />
            <div>
              <span className="font-bold tracking-tight text-slate-900 group-hover:text-[#2980b9] transition block leading-tight font-serif">
                {PERSONA_DATA.name}
              </span>
              <span className="text-[11px] font-mono text-[#2980b9] block font-medium">
                Notes from Research &amp; Practice
              </span>
            </div>
          </a>

          {/* Desktop Chapter Navigation */}
          <nav
            aria-label="Book chapters"
            className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600"
          >
            <a href="#prologue" className="hover:text-[#2980b9] transition">
              Prologue
            </a>
            <a href="#chapter-1" className="hover:text-[#2980b9] transition">
              I · Stellar Dynamics
            </a>
            <a href="#chapter-2" className="hover:text-[#2980b9] transition">
              II · Decisions
            </a>
            <a href="#chapter-3" className="hover:text-[#2980b9] transition">
              III · Human Agency
            </a>
            <a href="#chapter-4" className="hover:text-[#2980b9] transition">
              IV · Institutions
            </a>
            <a href="#constellation" className="hover:text-[#2980b9] transition">
              Site Map
            </a>
            <a href="#writings" className="hover:text-[#2980b9] transition">
              Index
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="/articles/"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1DAEDF] text-xs font-medium text-slate-700 hover:text-[#2980b9] transition bg-white"
            >
              All 28 Essays
            </a>
            <a
              href="#inquiries"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg bg-[#2980b9] hover:bg-[#20638f] text-white font-medium text-xs transition shadow-sm"
            >
              Correspondence
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle chapter navigation"
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
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

        {/* Mobile Chapter Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700">
              <a
                href="#prologue"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Prologue · Questions Carried Between Fields
              </a>
              <a
                href="#chapter-1"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Chapter I · Stellar Dynamics and the Practice of Modelling
              </a>
              <a
                href="#chapter-2"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Chapter II · Decisions Under Constraints
              </a>
              <a
                href="#chapter-3"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Chapter III · Human Agency, Seniors &amp; Lifelong Play
              </a>
              <a
                href="#chapter-4"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Chapter IV · Institutions, Incentives and Possible Futures
              </a>
              <a
                href="#constellation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Epilogue · Interactive Site Map
              </a>
              <a
                href="#writings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Complete Essay Index (28 Essays)
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* In-Page Book Reader Modal / Drawer (Self-Sufficient Essay Reading Experience) */}
      {activeReaderEssay && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-reader-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end"
          onClick={() => setActiveReaderUrl(null)}
        >
          <div
            ref={readerScrollRef}
            className="w-full max-w-3xl bg-[#fcfcfd] h-full overflow-y-auto shadow-2xl border-l border-slate-200 p-6 sm:p-10 lg:p-14 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between gap-4 pb-5 mb-8 border-b border-slate-200 sticky top-0 bg-[#fcfcfd]/95 backdrop-blur-md z-10 pt-1">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] block">
                    {activeReaderEssay.chapterTitle}
                  </span>
                  <span className="text-xs text-slate-500">
                    By Domi Jin (Dongming Jin) · {activeReaderEssay.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activeReaderEssay.url}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:border-[#1DAEDF] hover:text-[#2980b9] transition"
                  >
                    Standalone page
                  </a>
                  <button
                    onClick={() => setActiveReaderUrl(null)}
                    aria-label="Close essay reader (Escape)"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-700 transition cursor-pointer"
                  >
                    Close (Esc) ✕
                  </button>
                </div>
              </div>

              <header className="mb-8">
                <h2
                  id="book-reader-title"
                  className="text-2xl sm:text-4xl font-bold text-slate-900 font-serif leading-tight tracking-tight"
                >
                  {activeReaderEssay.title}
                </h2>
              </header>

              <article className="max-w-none">
                {activeReaderEssay.blocks.map((block, idx) =>
                  renderFormattedBlock(block, idx)
                )}
              </article>
            </div>

            <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-2">
              <p>
                <strong className="text-slate-700">Footnote:</strong> First published in{" "}
                <a
                  href={activeReaderEssay.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2980b9] underline underline-offset-4"
                >
                  {activeReaderEssay.venue}
                </a>{" "}
                ({activeReaderEssay.date}).
              </p>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveReaderUrl(null)}
                  className="text-[#2980b9] hover:underline font-medium cursor-pointer"
                >
                  &larr; Return to chapter narrative
                </button>
                <a
                  href="/articles/"
                  className="text-slate-500 hover:text-[#2980b9] font-mono"
                >
                  Full Table of Contents &rarr;
                </a>
              </div>
            </footer>
          </div>
        </div>
      )}

      <main
        id="top"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-24 sm:space-y-32"
      >
        {/* BOOK TITLE PAGE & PROLOGUE */}
        <section id="prologue" className="space-y-12 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 text-[#2980b9] text-xs font-mono uppercase tracking-widest">
                <span>Prologue · Questions Carried Between Fields</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-slate-900 leading-[1.12] font-serif">
                  Notes from Research and Practice
                </h1>
                <p className="text-xl sm:text-2xl text-[#2980b9] font-serif italic leading-snug">
                  A personal monograph on stellar dynamics, real-time decision systems, human agency and collaborative institutions.
                </p>
              </div>

              <div className="space-y-4 text-slate-700 font-serif text-[17px] sm:text-[18px] leading-[1.8]">
                <p>
                  The subject matter of my work has shifted over the past decade—from simulating binary black hole mergers inside dense globular clusters at the University of Texas at Arlington, to building pricing, recommendation and advertising systems at Uber, Airbnb and SmartNews, to sitting in living rooms and cars with older residents in Palo Alto. Yet the underlying habit has remained the same: state a clear model of how a system behaves, test it against honest feedback, and revise it when reality disagrees.
                </p>
                <p>
                  This site is organised as a self-contained book in four chapters. Rather than scattering work across external platforms, every essay, field note and technical specification lives here in full alongside interactive figures that let you inspect the mechanisms directly. Where a piece first appeared in a dissertation archive, Substack, Medium or a code repository, that provenance is noted quietly as a footnote at the end of the text.
                </p>
              </div>

              {/* Epigraph / Central Question */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(41,128,185,0.06)] space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                  The Thread Across All Four Chapters
                </p>
                <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif italic border-l-3 border-[#1DAEDF] pl-4">
                  &ldquo;{PERSONA_DATA.centralQuestion}&rdquo;
                </blockquote>
                <p className="text-xs text-slate-500 pt-1">
                  As I wrote in my first Substack note, translating a favourite Chinese line often attributed to Steve Jobs:{" "}
                  <span className="font-serif italic text-slate-700">
                    “我们都在穷尽自己仅有的一点天赋，来表达内心深处的感受”
                  </span>{" "}
                  — we spend our whole lives exhausting our modest gifts to express what we feel deep in the soul, and to build things that leave society a little more capable and humane.
                </p>
              </div>
            </div>

            {/* Book Table of Contents Spine Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.05)] space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                      Contents of This Book
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 font-serif mt-0.5">
                      Two Parts · Four Chapters · 28 Essays
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-[11px] font-mono text-[#0369a1] font-medium">
                    2013 – 2026
                  </span>
                </div>

                <div className="space-y-3.5">
                  {BOOK_CHAPTERS.map((ch) => (
                    <a
                      key={ch.id}
                      href={`#${ch.id}`}
                      className="block p-3.5 rounded-xl border border-slate-200/80 hover:border-[#1DAEDF] hover:bg-sky-50/40 transition group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                        <span className="text-[#2980b9] font-semibold">
                          CHAPTER {ch.roman}
                        </span>
                        <span>{ch.essayUrls.length} essays · {ch.period.split("·")[0]}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2980b9] font-serif transition">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {ch.subtitle}
                      </p>
                    </a>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <a
                    href="#constellation"
                    className="text-[#2980b9] hover:underline font-medium"
                  >
                    Interactive Site Map &rarr;
                  </a>
                  <a
                    href="/articles/"
                    className="text-slate-600 hover:text-[#2980b9] font-mono"
                  >
                    Complete Table of Contents &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER I: STELLAR DYNAMICS AND THE PRACTICE OF MODELLING
           ===================================================================== */}
        <section
          id="chapter-1"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Part I · Understanding and Building — Chapter I
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                  Stellar Dynamics and the Practice of Modelling
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                  {BOOK_CHAPTERS[0].subtitle}
                </p>
              </div>

              <div className="space-y-4 text-slate-700 font-serif text-[17px] leading-[1.82]">
                <p>
                  A globular cluster contains between ten thousand and a million stars packed into a sphere only a few parsecs across. On a human timescale it looks static; on the timescale of its half-mass relaxation time (<code className="text-sm font-mono text-[#0369a1]">τ_rh ≈ 800 Myr</code>), weak two-body gravitational encounters steadily redistribute kinetic energy across the cluster. Heavier stellar remnants—neutron stars and stellar-mass black holes—lose kinetic energy to lighter main-sequence stars and sink toward the dense core through Spitzer mass segregation.
                </p>
                <p>
                  In my doctoral dissertation at the University of Texas at Arlington (<em>Prospective Detection of Binary Black Holes in the Local Universe with Gravitational Waves</em>, July 2018), I synthesised a population of <strong>662,772 globular clusters</strong> across <strong>8,946 galaxies</strong> within <code className="text-sm font-mono text-[#0369a1]">30 Mpc</code> by drawing from <strong>3,240 MOCCA Monte Carlo cluster evolution models</strong>. Tracking 17,883,760 inspiralling binary black holes and 86,939 mergers across <code className="text-sm font-mono text-[#0369a1]">13.5 Gyr</code> (<code className="text-sm font-mono text-[#0369a1]">≈ 16.9 τ_rh</code>) established a lower-bound local merger rate density of <code className="text-sm font-mono text-[#0369a1]">η ≃ 587 Gpc⁻³ yr⁻¹</code> and identified <strong>17 extragalactic standard sirens</strong> localised by the LISA space interferometer to within <code className="text-sm font-mono text-[#0369a1]">ΔV ≤ 1 Mpc³</code>.
                </p>
              </div>
            </div>

            {/* Chapter I Marginalia / Footnote Box */}
            <aside className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                Chapter I · Marginalia &amp; Findings
              </span>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">¹</span>
                  <span>
                    <strong>Local Merger Rate:</strong> <code className="font-mono text-[#0369a1]">η ≃ 587 Gpc⁻³ yr⁻¹</code> derived from 3,240 MOCCA models across 662,772 globular clusters within 30 Mpc.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">²</span>
                  <span>
                    <strong>LISA Standard Sirens:</strong> 17 dynamically formed BBHs localised within <code className="font-mono text-[#0369a1]">ΔV ≤ 1 Mpc³</code> (including 4 systems in PGC 1628) for independent Hubble constant (<code className="font-mono">H₀</code>) constraints.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">³</span>
                  <span>
                    <strong>Practical carryover:</strong> Separating fast local interactions (three-body encounters) from slow global relaxation (<code className="font-mono">t / τ_rh</code>) directly shaped how I later architected real-time vs. asynchronous machine learning loops.
                  </span>
                </li>
              </ul>
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs">
                <button
                  onClick={() =>
                    openEssayInBook(
                      "/articles/research/astrophysics-bbh-dissertation.html"
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-[#2980b9] hover:bg-[#20638f] text-white font-medium transition cursor-pointer"
                >
                  Read Dissertation Chapter
                </button>
                <a
                  href={GC_RESEARCH_FINDINGS.dissertationPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#1DAEDF] text-slate-700 hover:text-[#2980b9] font-medium transition"
                >
                  Full Thesis PDF ↗
                </a>
              </div>
            </aside>
          </div>

          {/* Figure 1.1: Dedicated Globular Cluster & LISA Simulation */}
          <div id="gc-simulation" className="space-y-3 scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Figure 1.1 · Interactive Globular Cluster Relaxation (t / τ_rh) &amp; LISA Gravitational-Wave Observatory
              </span>
              <span className="text-xs font-mono text-[#0369a1]">
                Drag to orbit · Pause or scrub evolutionary epoch · Inspect binary strain
              </span>
            </div>
            <GlobularClusterSimulation onOpenEssay={openEssayInBook} />
          </div>
        </section>

        {/* =====================================================================
            CHAPTER II: DECISIONS UNDER CONSTRAINTS
           ===================================================================== */}
        <section
          id="chapter-2"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Part I · Understanding and Building — Chapter II
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                  Decisions Under Constraints
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                  {BOOK_CHAPTERS[1].subtitle}
                </p>
              </div>

              <div className="space-y-4 text-slate-700 font-serif text-[17px] leading-[1.82]">
                <p>
                  Moving from computational astrophysics into industrial machine learning meant trading clean conservation laws for noisy human feedback and strict latency budgets. Waiting at a red light at an empty intersection one morning prompted the essay <em>From Traffic Lights to Life’s Direction</em>: why do cities still rely on rigid fixed-cycle timers when even partial crowdsourced telemetry from approaching vehicles, paired with symbolic physical constraints (such as Stephen Wolfram’s proposals for hybrid neural-symbolic reasoning), can infer phase states and dynamically clear queues?
                </p>
                <p>
                  The same structural tension appears at scale in digital marketplaces and advertising. At Uber, Airbnb and SmartNews, and later in the open architectural specification <code className="text-sm font-mono text-[#0369a1]">Observations_in_Advertising</code>, the central engineering lesson was to decouple the <strong>synchronous serving hot-path</strong> (targeted at <code className="text-sm font-mono text-[#0369a1]">&lt;50 ms p99</code>) from the <strong>asynchronous multi-agent control plane</strong>. Rather than treating advertising as high-frequency guesswork that exhausts user attention, an eight-agent control plane can continuously profile genuine demand, pace frequency and audit creative ergonomics—much as my essay on <em>Dark Mode</em> argues against shipping superficial visual trends without testing their optical and cognitive cost on human readers.
                </p>
              </div>
            </div>

            {/* Chapter II Marginalia */}
            <aside className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                Chapter II · Marginalia &amp; Scope Note
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Epistemic distinction:</strong> Production work at Uber, Airbnb and SmartNews informed the architectural patterns discussed here. The 8-agent advertising control plane (<code className="font-mono text-[#0369a1]">Observations_in_Advertising</code>) is an open reference specification whose <code className="font-mono">&lt;50 ms p99</code> serving budget and asynchronous loop cadence represent explicit engineering design targets.
              </p>
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-slate-700 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#0369a1] font-semibold block">
                  Recurring Principle
                </span>
                <p>
                  Pair statistical learning (to estimate noisy human intent) with explicit physical or economic invariants (to bound tail failures).
                </p>
              </div>
            </aside>
          </div>

          {/* Figure 2.1: Interactive Explorable Diagram for Chapter II */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Figure 2.1 · Illustrative Trade-Off Explorer
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  Fast Serving vs. Slow Coordination in Constrained Decision Systems
                </h3>
              </div>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-medium self-start">
                <button
                  onClick={() => setFig2Mode("ad-plane")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    fig2Mode === "ad-plane"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  8-Agent Advertising Control Plane
                </button>
                <button
                  onClick={() => setFig2Mode("traffic")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    fig2Mode === "traffic"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Crowdsourced Traffic Intersection
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-5">
                {fig2Mode === "ad-plane" ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                        <span>Synchronous Hot-Path Budget (p99)</span>
                        <span className="text-[#2980b9] font-semibold">{fig2LatencyBudget} ms</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={80}
                        value={fig2LatencyBudget}
                        onChange={(e) => setFig2LatencyBudget(Number(e.target.value))}
                        aria-label="Synchronous hot-path p99 latency budget in milliseconds"
                        className="w-full accent-[#2980b9] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                        <span>Demand-Feedback Signal Coverage</span>
                        <span className="text-[#2980b9] font-semibold">{fig2Participation}%</span>
                      </div>
                      <input
                        type="range"
                        min={15}
                        max={95}
                        value={fig2Participation}
                        onChange={(e) => setFig2Participation(Number(e.target.value))}
                        aria-label="Demand-feedback signal coverage percentage"
                        className="w-full accent-[#2980b9] cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                        <span>Approaching Vehicles Sharing Telemetry</span>
                        <span className="text-[#2980b9] font-semibold">{fig2Participation}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={95}
                        value={fig2Participation}
                        onChange={(e) => setFig2Participation(Number(e.target.value))}
                        aria-label="Percentage of approaching vehicles sharing telemetry"
                        className="w-full accent-[#2980b9] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#0369a1]">
                      {fig2Stats.metricA}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {fig2Stats.labelA}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#2980b9]">
                      {fig2Stats.metricB}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {fig2Stats.labelB}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-emerald-700">
                      {fig2Stats.metricC}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {fig2Stats.labelC}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-5 rounded-xl bg-[#0b2034] text-sky-100 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-sky-300 border-b border-sky-800/70 pb-2">
                  <span>
                    {fig2Mode === "ad-plane"
                      ? "ARCHITECTURE: HOT SERVING PATH vs. ASYNC AGENT LOOP"
                      : "HYBRID INFERENCE: SPARSE TELEMETRY + SYMBOLIC CONSERVATION"}
                  </span>
                  <span className="text-[#1DAEDF]">HEURISTIC SCALING MODEL</span>
                </div>
                <p className="text-sm font-sans font-semibold text-white">
                  {fig2Stats.headline}
                </p>
                <p className="text-xs font-sans text-sky-200/90 leading-relaxed">
                  {fig2Stats.subline}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-800/60">
                    <span className="text-[#1DAEDF] block font-semibold mb-0.5">
                      Fast Local Loop (Milliseconds)
                    </span>
                    {fig2Mode === "ad-plane"
                      ? "Candidate retrieval, lightweight ranking & hard safety filters within strict p99 SLA."
                      : "Local vehicle stop/go kinematics and collision-avoidance invariants at the intersection."}
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-950/80 border border-sky-800/60">
                    <span className="text-amber-300 block font-semibold mb-0.5">
                      Slow Structural Loop (Minutes)
                    </span>
                    {fig2Mode === "ad-plane"
                      ? "8 specialised agents recalibrate demand taxonomy, pacing priors and creative fatigue weights."
                      : "Symbolic flow solver aggregates multi-block arrival waves to adapt green-phase splits."}
                  </div>
                </div>
              </div>
            </div>
          </figure>

          {/* Chapter II Primary Essays Shelf */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Chapter II · Essays &amp; Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOOK_CHAPTERS[1].essayUrls.map((url) => {
                const entry = BOOK_ESSAYS_BY_URL[url];
                const writing = WRITINGS_DATA.find((w) => w.localUrl === url);
                if (!entry) return null;
                return (
                  <article
                    key={url}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEssayInBook(url)}
                    onKeyDown={(e) => handleCardKeyDown(e, url)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{entry.date}</span>
                        <span className="text-[#2980b9] group-hover:translate-x-0.5 transition">
                          Read in book &rarr;
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2980b9] font-serif leading-snug transition">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {writing?.summary || entry.blocks[0]}
                      </p>
                    </div>
                    <div
                      className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate">
                        Footnote: {entry.venue}
                      </span>
                      <a
                        href={entry.url}
                        className="font-mono text-[#0369a1] hover:underline shrink-0"
                      >
                        Page ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER III: HUMAN AGENCY, OLDER PEOPLE'S INDEPENDENCE & LIFELONG PLAY
           ===================================================================== */}
        <section
          id="chapter-3"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Part II · Living and Working Together — Chapter III
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                  Human Agency, Older People’s Independence and Lifelong Play
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                  {BOOK_CHAPTERS[2].subtitle}
                </p>
              </div>

              <div className="space-y-4 text-slate-700 font-serif text-[17px] leading-[1.82]">
                <p>
                  In late 2024 I stepped out of pure software loops to begin field research in Palo Alto under a simple working name—<em>Kin Domi</em>—listening to older adults talk about how they navigate daily life, mobility and technology. Riding along with senior drivers testing Tesla’s Full Self-Driving (FSD) revealed a striking paradox: older drivers have the most to gain from autonomous mobility—returning the freedom to visit friends after dark without feeling like a burden on family—yet cockpit interfaces are almost universally calibrated for thirty-year-old engineers. Sudden visual takeover chimes, cryptic icons and unforgiving voice-command syntax create anxiety precisely when calm clarity is needed.
                </p>
                <p>
                  A second lesson came when I published <em>Reclaiming Play as a Life Skill</em>. Several older readers pushed back thoughtfully on the word “play,” noting that to their generation it sounded frivolous or childish. That disagreement was a gift: what they valued was not “play” as idle amusement, but <strong>unhurried curiosity, dignified self-reliance and the freedom to experiment without fear of embarrassment</strong>. Whether in <code className="text-sm font-mono text-[#0369a1]">Open Learning Lab</code> (which structures AI around first-principles human attempts rather than passive answer generation), <code className="text-sm font-mono text-[#0369a1]">baby-AI</code> (privacy-first household intelligence kept on local hardware), or <code className="text-sm font-mono text-[#0369a1]">iMessage AI Router</code> (meeting people inside the plain-text SMS/iMessage channel they already know), the goal is identical: technology should widen human agency, never domesticate it.
                </p>
              </div>
            </div>

            {/* Chapter III Marginalia */}
            <aside className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                Chapter III · Field Notes &amp; Prototypes
              </span>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">¹</span>
                  <span>
                    <strong>Kin Domi (Palo Alto):</strong> Community conversations with older adults on ageing in place, autonomous driving ergonomics and scam-resilient communication.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">²</span>
                  <span>
                    <strong>Open Learning Lab:</strong> A 5-stage learning protocol (Frame → Attempt → Critique → Revise → Reflect) built to prevent cognitive offloading.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">³</span>
                  <span>
                    <strong>Household &amp; Low-Friction Channels:</strong> <code className="font-mono text-[#0369a1]">baby-AI</code> (edge-first architecture specification) and <code className="font-mono text-[#0369a1]">imessage-ai-router</code> (zero-install text assistant).
                  </span>
                </li>
              </ul>
            </aside>
          </div>

          {/* Figure 3.1: Interactive 5-Stage Agency-Preserving Loop Explorer */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Figure 3.1 · Interactive 5-Stage Protocol Comparison
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  Answer-First Automation vs. Agency-Preserving Human–AI Collaboration
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {fig3Stages.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFig3StageIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                      fig3StageIndex === idx
                        ? "bg-[#2980b9] text-white font-semibold shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Stage {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  Conventional Answer-First AI
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {fig3Stages[fig3StageIndex].step}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fig3Stages[fig3StageIndex].passive}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-sky-50/70 border-2 border-[#1DAEDF]/60 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0369a1] font-semibold block">
                  Open Learning Lab (Judgement-First)
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {fig3Stages[fig3StageIndex].step}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {fig3Stages[fig3StageIndex].agency}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0b2034] text-sky-100 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#1DAEDF] font-semibold block">
                  Elder Independence Parallel (Kin Domi)
                </span>
                <h4 className="text-sm font-bold text-white">
                  Human-Centred Renovation
                </h4>
                <p className="text-xs text-sky-200/90 leading-relaxed">
                  {fig3Stages[fig3StageIndex].seniorParallel}
                </p>
              </div>
            </div>
          </figure>

          {/* Chapter III Primary Essays Shelf */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Chapter III · Essays, Field Notes &amp; Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOOK_CHAPTERS[2].essayUrls.map((url) => {
                const entry = BOOK_ESSAYS_BY_URL[url];
                const writing = WRITINGS_DATA.find((w) => w.localUrl === url);
                if (!entry) return null;
                return (
                  <article
                    key={url}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEssayInBook(url)}
                    onKeyDown={(e) => handleCardKeyDown(e, url)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{entry.date}</span>
                        <span className="text-[#2980b9] group-hover:translate-x-0.5 transition">
                          Read in book &rarr;
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2980b9] font-serif leading-snug transition">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {writing?.summary || entry.blocks[0]}
                      </p>
                    </div>
                    <div
                      className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate">
                        Footnote: {entry.venue}
                      </span>
                      <a
                        href={entry.url}
                        className="font-mono text-[#0369a1] hover:underline shrink-0"
                      >
                        Page ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            CHAPTER IV: INSTITUTIONS, INCENTIVES AND POSSIBLE FUTURES
           ===================================================================== */}
        <section
          id="chapter-4"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Part II · Living and Working Together — Chapter IV
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                  Institutions, Incentives and Possible Futures
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                  {BOOK_CHAPTERS[3].subtitle}
                </p>
              </div>

              <div className="space-y-4 text-slate-700 font-serif text-[17px] leading-[1.82]">
                <p>
                  Why do some organisations compound technical curiosity into generational breakthroughs while others with deeper capital reserves stall? In comparing <em>Boeing and SpaceX</em>, or examining the regulatory and cultural divergence of the <em>eVTOL</em> industry across the Pacific, the decisive factor is rarely individual talent; it is whether institutional incentives reward first-principles honesty or short-term financial optics. On a personal scale, the essay <em>Overachievers’ Responsibility Reflection</em> asks what obligation capable engineers carry when the systems they optimise shape public attention and social cohesion.
                </p>
                <p>
                  In <em>Serendipity: Where It Sparks</em> and the long-running civic notebook <code className="text-sm font-mono text-[#0369a1]">LibertyEarth</code> (<em>Free Market in a Possibility Universe</em>), I borrowed a simple mathematical metaphor for healthy human collaboration: treat <strong>shared ethical values as the Greatest Common Divisor (GCD)</strong> that keeps trust intact, and treat <strong>diverse, complementary skills as the Least Common Multiple (LCM)</strong> that expands what a community can build together. Paired with an intentional personal rhythm—now in the eighth annual iteration of my colour-coded calendar—this balance between inner discipline and civic responsibility is represented here by the Chinese motto I adopted after marriage:{" "}
                  <strong className="text-slate-900">“但行好事，莫问前程”</strong> (do good work wholeheartedly, without fixating on the reward ahead).
                </p>
              </div>
            </div>

            {/* Chapter IV Marginalia */}
            <aside className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                Chapter IV · Synthesis &amp; Civic Notes
              </span>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">¹</span>
                  <span>
                    <strong>GCD / LCM Collaboration Model:</strong> Shared core principles (GCD) lower verification friction, allowing high skill variance (LCM) to compound rather than fracture.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">²</span>
                  <span>
                    <strong>8th-Iteration Calendar Rhythm:</strong> Designing the week around deep creative blocks, physical restoration and unhurried family time.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DAEDF] font-bold">³</span>
                  <span>
                    <strong>LibertyEarth (2018–2025):</strong> Philosophical notes on knowledge graphs, post-scarcity incentives and human alignment.
                  </span>
                </li>
              </ul>
            </aside>
          </div>

          {/* Figure 4.1: Interactive GCD / LCM Collaboration Explorer */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Figure 4.1 · Illustrative Institutional Model
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  Greatest Common Divisor (Shared Values) &amp; Least Common Multiple (Complementary Skills)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-[#0369a1]">
                {fig4Synthesis.archetype}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>GCD · Shared Ethical Values &amp; Epistemic Honesty</span>
                    <span className="text-[#2980b9] font-semibold">{fig4Gcd}%</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={95}
                    value={fig4Gcd}
                    onChange={(e) => setFig4Gcd(Number(e.target.value))}
                    aria-label="Greatest Common Divisor shared values percentage"
                    className="w-full accent-[#2980b9] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>LCM · Diversity of Complementary Capabilities</span>
                    <span className="text-[#2980b9] font-semibold">{fig4Lcm}%</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={95}
                    value={fig4Lcm}
                    onChange={(e) => setFig4Lcm(Number(e.target.value))}
                    aria-label="Least Common Multiple complementary capabilities percentage"
                    className="w-full accent-[#2980b9] cursor-pointer"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                  <div className="text-xl font-bold font-mono text-[#0369a1]">
                    {fig4Synthesis.trustIndex}%
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Baseline Trust &amp; Low Verification Tax
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                  <div className="text-xl font-bold font-mono text-[#2980b9]">
                    {fig4Synthesis.creativeReach}%
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Serendipity &amp; Problem-Solving Reach
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                  <div className="text-xl font-bold font-mono text-amber-700">
                    {fig4Synthesis.frictionRisk}%
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Coordination &amp; Governance Drift Risk
                  </div>
                </div>
              </div>
            </div>
          </figure>

          {/* Chapter IV Primary Essays Shelf */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Chapter IV · Essays, Reflections &amp; Civic Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOOK_CHAPTERS[3].essayUrls.map((url) => {
                const entry = BOOK_ESSAYS_BY_URL[url];
                const writing = WRITINGS_DATA.find((w) => w.localUrl === url);
                if (!entry) return null;
                return (
                  <article
                    key={url}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEssayInBook(url)}
                    onKeyDown={(e) => handleCardKeyDown(e, url)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{entry.date}</span>
                        <span className="text-[#2980b9] group-hover:translate-x-0.5 transition">
                          Read in book &rarr;
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2980b9] font-serif leading-snug transition">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {writing?.summary || entry.blocks[0]}
                      </p>
                    </div>
                    <div
                      className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate">
                        Footnote: {entry.venue}
                      </span>
                      <a
                        href={entry.url}
                        className="font-mono text-[#0369a1] hover:underline shrink-0"
                      >
                        Page ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            EPILOGUE & VISUAL INDEX: SEPARATE INTERACTIVE SITE MAP
           ===================================================================== */}
        <section
          id="constellation"
          className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                <span>Epilogue · Visual Index of the Monograph</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
                Interactive Site Map of Themes, Works and Essays
              </h2>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Separate from the astrophysical simulation in Chapter I, this spatial index maps how seven recurring questions connect across six open systems and all twenty-eight essays in this volume. Select any node to read the essay right on this page.
              </p>
            </div>

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
                  3D Site Map
                </button>
                <button
                  onClick={() => setMobileMapView("list")}
                  className={`px-3 py-1 rounded-md transition ${
                    mobileMapView === "list"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Theme List
                </button>
              </div>

              {selectedPillar && (
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-[#2980b9] hover:bg-slate-50 transition cursor-pointer shadow-xs"
                >
                  Reset Filter ✕
                </button>
              )}
            </div>
          </div>

          {/* 7 Intellectual Theme Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            {INTELLECTUAL_PILLARS.map((pillar) => {
              const active = selectedPillar === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(active ? null : pillar.id)}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div
              className={`lg:col-span-8 ${
                mobileMapView === "list" ? "hidden lg:block" : "block"
              }`}
            >
              <ConstellationCanvas
                selectedPillar={selectedPillar}
                onSelectPillar={setSelectedPillar}
                selectedWriting={selectedWriting}
                onSelectWriting={setSelectedWriting}
                onOpenEssay={openEssayInBook}
              />
            </div>

            {mobileMapView === "list" && (
              <div className="lg:hidden col-span-1 space-y-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-medium">
                    Themes Across Chapters
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

            {/* Inspector Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">
                    {activePillarObj ? "Selected Theme" : "Map Guide"}
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
                    <h3 className="text-lg font-bold text-slate-900 font-serif">
                      {activePillarObj.title}
                    </h3>
                    <p className="text-sm font-medium text-[#2980b9] italic font-serif">
                      &ldquo;{activePillarObj.question}&rdquo;
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {activePillarObj.synthesis}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-slate-900 font-serif">
                      Explore Cross-Chapter Connections
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Select any theme sphere, project cube or essay node in the map to inspect its reading notes and open the full text right inside this book.
                    </p>
                  </>
                )}

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
                  {PERSONA_DATA.epistemicDisclaimer}
                </div>
              </div>

              {selectedWriting && (
                <div className="p-6 rounded-2xl bg-white border-2 border-[#1DAEDF]/50 shadow-md space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-sky-50 text-[11px] font-mono text-[#0369a1] font-medium border border-sky-100">
                      {BOOK_ESSAYS_BY_URL[selectedWriting.localUrl]?.chapterTitle.split("·")[0] ||
                        "Monograph"}{" "}
                      · {selectedWriting.date}
                    </span>
                    <button
                      onClick={() => openEssayInBook(selectedWriting.localUrl)}
                      className="px-3 py-1 rounded-lg bg-[#2980b9] hover:bg-[#20638f] text-white text-xs font-medium transition cursor-pointer"
                    >
                      Read essay &rarr;
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-serif leading-snug">
                    {selectedWriting.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedWriting.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/90 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                      Author’s Note
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedWriting.keyInsight}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      Footnote: First published in{" "}
                      <a
                        href={selectedWriting.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-[#2980b9] underline underline-offset-2"
                      >
                        {selectedWriting.source}
                      </a>
                    </span>
                    <a
                      href={selectedWriting.localUrl}
                      className="font-mono text-[#0369a1] hover:underline"
                    >
                      Standalone URL ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================================
            OPEN SYSTEMS & ARTEFACTS IN THIS MONOGRAPH
           ===================================================================== */}
        <section
          id="systems"
          className="space-y-8 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
              Practical Artefacts Across Chapters I–IV
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
              Research Models and Open Specifications
            </h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              Each system specification or research archive discussed in the chapters above can be read directly inside this book, with its source repository noted as a footnote.
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
                    {proj.localMirrorUrl && (
                      <button
                        onClick={() => openEssayInBook(proj.localMirrorUrl!)}
                        className="text-xs font-medium text-[#2980b9] hover:text-[#1DAEDF] cursor-pointer"
                      >
                        Read specification &rarr;
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    {proj.name}
                  </h3>
                  <p className="text-xs font-medium text-[#2980b9]">
                    {proj.tagline}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
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
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>
                      Footnote:{" "}
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-[#2980b9] underline underline-offset-2"
                      >
                        Source repository ↗
                      </a>
                    </span>
                    {proj.localMirrorUrl && (
                      <a
                        href={proj.localMirrorUrl}
                        className="font-mono text-[#0369a1] hover:underline"
                      >
                        Page ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            COMPLETE INDEX OF WRITINGS & NOTES (ALL 28 ESSAYS)
           ===================================================================== */}
        <section
          id="writings"
          className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                Complete Index &amp; Reader ({filteredWritings.length} of {WRITINGS_DATA.length} Essays)
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
                Essays, Field Notes and Technical Specifications
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Select any entry to read the full text immediately in the book reader, or open the{" "}
                <a
                  href="/articles/"
                  className="text-[#2980b9] underline underline-offset-4"
                >
                  complete 28-essay Table of Contents
                </a>
                .
              </p>
            </div>

            {/* Search & Chapter Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters, essays, concepts..."
                aria-label="Search chapters, essays and concepts"
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1DAEDF] shadow-xs"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                {chapterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setChapterFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                      chapterFilter === tab
                        ? "bg-[#2980b9] text-white font-semibold shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab}
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
              const bookEntry = BOOK_ESSAYS_BY_URL[w.localUrl];
              return (
                <article
                  key={w.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEssayInBook(w.localUrl)}
                  onKeyDown={(e) => handleCardKeyDown(e, w.localUrl)}
                  className="p-5 rounded-2xl bg-white hover:bg-sky-50/30 border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-sm group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-100 font-mono text-[#0369a1] text-[11px] font-medium">
                          Chapter {bookEntry?.chapterRoman || "IV"}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {bookEntry?.date || w.date}
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

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2980b9] font-serif leading-snug transition">
                      {w.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {w.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div>
                      <span className="font-mono text-[#2980b9] font-medium mr-1.5">
                        Author’s note:
                      </span>
                      {w.keyInsight}
                    </div>
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-slate-400">
                        Footnote: First published in{" "}
                        <a
                          href={bookEntry?.originalUrl || w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-[#2980b9] underline underline-offset-2"
                        >
                          {bookEntry?.venue || w.source}
                        </a>{" "}
                        ({bookEntry?.date || w.date})
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <button
                          onClick={() => openEssayInBook(w.localUrl)}
                          className="text-[#2980b9] hover:text-[#1DAEDF] font-medium cursor-pointer"
                        >
                          Read in book
                        </button>
                        <a
                          href={w.localUrl}
                          className="text-[#0369a1] hover:underline"
                        >
                          Page ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* =====================================================================
            COLOPHON & CORRESPONDENCE
           ===================================================================== */}
        <section
          id="inquiries"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6 scroll-mt-24"
        >
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
              Colophon &amp; Correspondence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
              Write to the Author
            </h2>
            <p className="text-base sm:text-lg text-slate-700 font-serif leading-relaxed">
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
                href="/articles/"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-[#2980b9] text-sm font-medium transition"
              >
                Complete Table of Contents (28 Essays)
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#2980b9] text-sm font-medium transition"
              >
                GitHub (@domijin) ↗
              </a>
              <a
                href="https://www.linkedin.com/in/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#2980b9] text-sm font-medium transition"
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
                2018 Pelican Edition
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-serif">
            &copy; {new Date().getFullYear()} Domi Jin (Dongming Jin) ·{" "}
            <em>Notes from Research and Practice</em>.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/articles/" className="hover:text-[#2980b9] transition">
              Table of Contents
            </a>
            <span>·</span>
            <a href="/pages/about-me.html?env=blue" className="hover:text-[#2980b9] transition">
              2018 Pelican Edition
            </a>
            <span>·</span>
            <a href="/next/" className="text-[#2980b9] font-medium">
              Current Edition
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
