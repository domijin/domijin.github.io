"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  PERSONA_DATA,
  INTELLECTUAL_PILLARS,
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
        <span>Loading 3D Globular Cluster &amp; LISA Gravitational-Wave Sandbox…</span>
        <span className="text-[11px] text-sky-300/70 mt-1">
          1,000,000-star relaxation dynamics and binary black hole standard sirens
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
        <span>Loading Interactive Idea Constellation…</span>
      </div>
    ),
  }
);

interface NarrativeThemeSpec {
  id: string;
  num: string;
  shortLabel: string;
  kicker: string;
  title: string;
  subtitle: string;
  period: string;
  essayUrls: string[];
  projectIds: string[];
}

const NARRATIVE_THEMES: NarrativeThemeSpec[] = [
  {
    id: "stars-and-gravity",
    num: "01",
    shortLabel: "01 · Stars & Gravity",
    kicker: "01 · Cosmic Scale · 2013 – 2018",
    title: "The Story of a Million Stars: a Complex Adaptive System",
    subtitle:
      "Simulating 662,772 globular clusters and 17.88 million binary black holes at UT Arlington, watching a million stars rearrange themselves, and finding that the same feedback rules traffic, auctions and teams.",
    period: "2013 – 2018 · UT Arlington Astrophysics & LSST",
    essayUrls: ["/articles/research/astrophysics-bbh-dissertation.html"],
    projectIds: ["astrophysics-lisa-gw"],
  },
  {
    id: "realtime-decisions",
    num: "02",
    shortLabel: "02 · 50ms Decisions",
    kicker: "02 · System Scale · 2018 – 2026",
    title: "Making Sense in 50 Milliseconds—From Red Lights to Ad Auctions",
    subtitle:
      "Waiting at an empty morning intersection, pricing rides and rooms at Uber and Airbnb, and decoupling fast reflex serving (<50 ms) from slow, thoughtful coordination.",
    period: "2018 – 2026 · Uber, Airbnb, SmartNews & Systems Architecture",
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
    id: "human-agency",
    num: "03",
    shortLabel: "03 · Human Agency",
    kicker: "03 · Human Scale · 2024 – 2026",
    title: "Designing AI That Keeps Us in the Driver’s Seat",
    subtitle:
      "Riding in self-driving Teslas with Palo Alto seniors, reclaiming play as lifelong curiosity, and building local tools that sharpen human judgment instead of replacing it.",
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
      "/articles/substack/reflections-from-coach-seeking-impulse.html",
    ],
    projectIds: ["open-learning-lab", "baby-ai", "imessage-router", "kin-domi"],
  },
  {
    id: "working-together",
    num: "04",
    shortLabel: "04 · Working Together",
    kicker: "04 · Civic Scale · 2018 – Present",
    title: "Shared Values (GCD), Complementary Skills (LCM), and Rhythm",
    subtitle:
      "Why engineering cultures soar or stall, how eight years of color-coded calendars keep life whole, and how shared ethics let diverse minds build a larger future.",
    period: "2018 – Present · Domi’s Mind Waves & Civic Notes",
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

const ORDERED_ESSAY_URLS = NARRATIVE_THEMES.flatMap((t) => t.essayUrls);

// Blue-green: the app is staged at /next/ and promoted to the site root.
// Self-referential links must follow whichever environment is live.
const BASE_PATH = process.env.NEXT_BASE_PATH ?? "/next";
const SELF_HREF = BASE_PATH === "" ? "/" : `${BASE_PATH}/`;

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
  const trimmed = block.trim();
  if (
    trimmed.startsWith("<figure") ||
    trimmed.startsWith("<svg") ||
    trimmed.startsWith("<pre") ||
    trimmed.startsWith("<div class=\"table") ||
    trimmed.startsWith("<table")
  ) {
    return (
      <div
        key={idx}
        className="my-6 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/90 p-4 sm:p-6 shadow-xs"
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

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
  const [themeFilter, setThemeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataDrawerOpen, setDataDrawerOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileMapView, setMobileMapView] = useState<"3d" | "list">("3d");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Active essay open in the self-sufficient In-Page Essay Reader
  const [activeReaderUrl, setActiveReaderUrl] = useState<string | null>(null);
  const readerScrollRef = useRef<HTMLDivElement | null>(null);

  // Act 02 Interactive State (Latency vs Coordination & Traffic Signal Experiment)
  const [fig2Mode, setFig2Mode] = useState<"ad-plane" | "traffic">("ad-plane");
  const [fig2Participation, setFig2Participation] = useState<number>(65);
  const [fig2LatencyBudget, setFig2LatencyBudget] = useState<number>(45);

  // Act 03 Interactive State (5-Stage Sparring Partner vs Answer-First AI)
  const [fig3StageIndex, setFig3StageIndex] = useState<number>(0);

  // Act 04 Interactive State (GCD Shared Values & LCM Complementary Skills)
  const [fig4Gcd, setFig4Gcd] = useState<number>(78);
  const [fig4Lcm, setFig4Lcm] = useState<number>(82);

  // Subtle top reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeReaderEssay: BookEssayEntry | null = useMemo(() => {
    if (!activeReaderUrl) return null;
    return BOOK_ESSAYS_BY_URL[activeReaderUrl] || null;
  }, [activeReaderUrl]);

  const nextReaderEssay: BookEssayEntry | null = useMemo(() => {
    if (!activeReaderUrl) return null;
    const idx = ORDERED_ESSAY_URLS.indexOf(activeReaderUrl);
    if (idx === -1) return null;
    const nextUrl = ORDERED_ESSAY_URLS[(idx + 1) % ORDERED_ESSAY_URLS.length];
    return BOOK_ESSAYS_BY_URL[nextUrl] || null;
  }, [activeReaderUrl]);

  // Keyboard Escape handler, scroll lock and scroll-to-top for In-Page Reader
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
      const themeIdx = NARRATIVE_THEMES.findIndex((t) =>
        t.essayUrls.includes(w.localUrl)
      );
      const themeLabel =
        themeIdx >= 0 ? NARRATIVE_THEMES[themeIdx].shortLabel : "04 · Working Together";
      const matchesTheme =
        themeFilter === "All" || themeFilter === themeLabel;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.summary.toLowerCase().includes(q) ||
        w.keyInsight.toLowerCase().includes(q);
      return matchesPillar && matchesTheme && matchesQuery;
    });
  }, [selectedPillar, themeFilter, searchQuery]);

  const themeTabs = [
    "All",
    "01 · Stars & Gravity",
    "02 · 50ms Decisions",
    "03 · Human Agency",
    "04 · Working Together",
  ];

  const openEssayReader = (url: string) => {
    if (BOOK_ESSAYS_BY_URL[url]) {
      setActiveReaderUrl(url);
    } else {
      window.location.href = url;
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, url: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEssayReader(url);
    }
  };

  const fig3Stages = [
    {
      step: "1 · Frame the Question",
      shortTitle: "Frame",
      passive: "Paste a prompt and let the model define the problem for you.",
      agency:
        "State your own hypothesis and constraints first, before any AI generation begins.",
      seniorParallel:
        "In Tesla FSD ride-alongs: showing clear route intent on screen before the car starts a turn.",
    },
    {
      step: "2 · First-Principles Try",
      shortTitle: "Attempt",
      passive: "Skip the struggle—read a fluent answer and mistake fluency for mastery.",
      agency:
        "Sketch a rough solution or mechanism yourself to surface where your mental model has gaps.",
      seniorParallel:
        "Palo Alto seniors preferred trying a task themselves with a quiet safety net over sudden automation takeovers.",
    },
    {
      step: "3 · Socratic Sparring",
      shortTitle: "Spar",
      passive: "Accept generic praise or a wholesale rewrite that erases your voice.",
      agency:
        "Use AI as a sparring partner to challenge a specific assumption or edge case.",
      seniorParallel:
        "Replacing jarring high-frequency cockpit beeps with calm, plain-language spoken context.",
    },
    {
      step: "4 · Deliberate Revision",
      shortTitle: "Revise",
      passive: "Copy-paste the output with near-zero recall a month later.",
      agency:
        "Revise your own code, calculation, or draft in response to the critique.",
      seniorParallel:
        "Letting older drivers tune following distance and voice confirmation to match their own comfort.",
    },
    {
      step: "5 · Own & Transfer",
      shortTitle: "Own",
      passive: "Close the tab the moment the immediate task is finished.",
      agency:
        "Jot down a one-line note on what changed in your thinking and where it applies next.",
      seniorParallel:
        "Reclaiming ‘play’ not as idle amusement, but as lifelong curiosity and dignified independence.",
    },
  ];

  const fig2Stats = useMemo(() => {
    if (fig2Mode === "ad-plane") {
      const syncServedPct = Math.min(99.8, Math.max(85, 92 + (fig2LatencyBudget - 25) * 0.18));
      const fatigueReduction = Math.round(18 + fig2Participation * 0.28);
      const loopMin = Math.max(2, Math.round(12 - fig2Participation * 0.08));
      return {
        headline: `Fast Lane: ${fig2LatencyBudget} ms p99 budget (${syncServedPct.toFixed(1)}% within SLA) · Slow Lane: ${loopMin} min agent cycle`,
        subline: `Decoupling the <50ms serving reflex from an 8-agent background loop cuts repetitive ad fatigue by ~${fatigueReduction}% while keeping tail latency predictable.`,
        metricA: `${fig2LatencyBudget} ms`,
        labelA: "Fast reflex budget",
        metricB: `${loopMin} min`,
        labelB: "8-agent reflection",
        metricC: `-${fatigueReduction}%`,
        labelC: "Ad fatigue drop",
      };
    } else {
      const waitReduction = Math.round(12 + fig2Participation * 0.42);
      const inferConfidence = Math.min(98, Math.round(54 + fig2Participation * 0.44));
      return {
        headline: `Connected Vehicles: ${fig2Participation}% sharing trajectory · Phase Confidence: ${inferConfidence}%`,
        subline: `Even when only ${fig2Participation}% of approaching cars share speed and position, symbolic flow conservation laws reconstruct the full queue and cut idle red-light waiting by ~${waitReduction}%.`,
        metricA: `${fig2Participation}%`,
        labelA: "Connected cars",
        metricB: `${inferConfidence}%`,
        labelB: "Signal confidence",
        metricC: `-${waitReduction}%`,
        labelC: "Idle red-light wait",
      };
    }
  }, [fig2Mode, fig2Participation, fig2LatencyBudget]);

  const fig4Synthesis = useMemo(() => {
    const trustIndex = Math.round(fig4Gcd * 0.9 + 8);
    const creativeReach = Math.round(fig4Gcd * 0.45 + fig4Lcm * 0.55);
    const frictionRisk = Math.max(
      5,
      Math.round(100 - fig4Gcd * 0.75 + (fig4Lcm - fig4Gcd) * 0.25)
    );
    let archetype = "High-Trust Creative Guild (Strong GCD × Wide LCM)";
    if (fig4Gcd < 45 && fig4Lcm >= 60) {
      archetype = "Fragmented Specialists (High Skill Variance, Low Shared Trust)";
    } else if (fig4Gcd >= 65 && fig4Lcm < 45) {
      archetype = "Echo Chamber (High Cohesion, Narrow Perspective)";
    } else if (fig4Gcd < 45 && fig4Lcm < 45) {
      archetype = "High-Friction Bureaucracy (Low Alignment, Low Reach)";
    }
    return { trustIndex, creativeReach, frictionRisk, archetype };
  }, [fig4Gcd, fig4Lcm]);

  const getThemeLabelForUrl = (url: string) => {
    const found = NARRATIVE_THEMES.find((t) => t.essayUrls.includes(url));
    return found ? found.shortLabel : "Domi’s Mind Waves";
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-800 selection:bg-[#1DAEDF]/20 selection:text-[#0c4a6e] font-sans antialiased">
      {/* Subtle Top Reading Progress Bar (Implicit narrative flow) */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-slate-200/50 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#2980b9] to-[#1DAEDF] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Publication Bar */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 border border-[#1DAEDF]/30 text-[#0369a1] font-mono font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DAEDF]" />
              DOMI’S MIND WAVES
            </span>
            <span className="text-slate-500 hidden md:inline text-[11px] font-serif italic">
              Essays, visual models, and field notes on science, systems, and human agency
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="/articles/"
              className="text-slate-600 hover:text-[#2980b9] font-mono transition"
            >
              All 28 essays
            </a>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setDataDrawerOpen(!dataDrawerOpen)}
              className="text-[#2980b9] hover:text-[#1DAEDF] font-mono cursor-pointer transition flex items-center gap-1"
            >
              <span className="text-[10px]">✦</span>
              <span>{dataDrawerOpen ? "Close open feeds" : "Open feeds & JSON"}</span>
            </button>
            <span className="text-slate-300">|</span>
            <a
              href="/pages/about-me.html?env=blue"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2980b9] transition font-medium"
            >
              <span>2018 Classic Site</span>
              <span aria-hidden="true" className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Open Feeds & Machine-Readable Index Drawer */}
      {dataDrawerOpen && (
        <div className="border-b border-sky-100 bg-white/95 backdrop-blur-xl shadow-md transition-all">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9]">
                  Self-Hosted Archive &amp; Open Feeds
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-0.5">
                  Every essay and visual diagram lives on this domain
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  28 essays in full, with their inline diagrams and a note of where each first ran.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/articles/"
                  className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0369a1] text-xs font-mono hover:bg-sky-100 transition"
                >
                  /articles/
                </a>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0369a1] text-xs font-mono hover:bg-sky-100 transition"
                >
                  /llms.txt ↗
                </a>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono hover:bg-slate-100 transition"
                >
                  /llms-full.txt ↗
                </a>
                <a
                  href="/agent-context.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono hover:bg-emerald-100 transition"
                >
                  /agent-context.json ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Sticky Header */}
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
                Scientist · Builder · Writer
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-600"
          >
            <a href="#story" className="hover:text-[#2980b9] transition">
              Start Here
            </a>
            <a href="#stars-and-gravity" className="hover:text-[#2980b9] transition">
              01 · Stars &amp; Gravity
            </a>
            <a href="#realtime-decisions" className="hover:text-[#2980b9] transition">
              02 · 50ms Decisions
            </a>
            <a href="#human-agency" className="hover:text-[#2980b9] transition">
              03 · Human Agency
            </a>
            <a href="#working-together" className="hover:text-[#2980b9] transition">
              04 · Working Together
            </a>
            <a href="#constellation" className="hover:text-[#2980b9] transition">
              Idea Map
            </a>
            <a href="#writings" className="hover:text-[#2980b9] transition">
              All Writing
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="/articles/"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#1DAEDF] text-xs font-medium text-slate-700 hover:text-[#2980b9] transition bg-white"
            >
              Archive (28)
            </a>
            <a
              href="#inquiries"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg bg-[#2980b9] hover:bg-[#20638f] text-white font-medium text-xs transition shadow-sm"
            >
              Say Hello
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
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

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-4 py-4 space-y-3 shadow-lg">
            <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700">
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Start Here · Across Four Scales
              </a>
              <a
                href="#stars-and-gravity"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                01 · Stars &amp; Gravity (Astrophysics &amp; LISA)
              </a>
              <a
                href="#realtime-decisions"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                02 · 50ms Decisions (Traffic &amp; Ad Systems)
              </a>
              <a
                href="#human-agency"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                03 · Human Agency (Palo Alto Seniors &amp; AI)
              </a>
              <a
                href="#working-together"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                04 · Working Together (GCD × LCM &amp; Rhythm)
              </a>
              <a
                href="#constellation"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                Interactive Idea Constellation
              </a>
              <a
                href="#writings"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-sky-50 hover:text-[#2980b9] transition"
              >
                All 28 Essays &amp; Notes
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* In-Page Essay Reader Drawer (Substack-Style Reading Experience with Next Post flow) */}
      {activeReaderEssay && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="essay-reader-title"
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
                    {getThemeLabelForUrl(activeReaderEssay.url)} · {activeReaderEssay.venue}
                  </span>
                  <span className="text-xs text-slate-500">
                    By Domi Jin · {activeReaderEssay.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activeReaderEssay.url}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-700 hover:border-[#1DAEDF] hover:text-[#2980b9] transition"
                  >
                    Full page ↗
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
                  id="essay-reader-title"
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

            <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-4">
              <p>
                Originally published on{" "}
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

              {nextReaderEssay && (
                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#0369a1] font-semibold block">
                      Next Essay in Sequence
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-serif">
                      {nextReaderEssay.title}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveReaderUrl(nextReaderEssay.url)}
                    className="px-3.5 py-2 rounded-lg bg-[#2980b9] hover:bg-[#20638f] text-white text-xs font-medium transition shrink-0 cursor-pointer"
                  >
                    Next Post &rarr;
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setActiveReaderUrl(null)}
                  className="text-[#2980b9] hover:underline font-medium cursor-pointer"
                >
                  &larr; Back to main story
                </button>
                <a
                  href="/articles/"
                  className="text-slate-500 hover:text-[#2980b9] font-mono"
                >
                  All 28 essays &rarr;
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
        {/* =====================================================================
            HERO: SUBSTACK-STYLE PERSONAL OPENING + VISUAL FOUR-SCALE JOURNEY MAP
           ===================================================================== */}
        <section id="story" className="space-y-10 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 text-[#2980b9] text-xs font-mono uppercase tracking-widest">
                <span>A Sci-Fi Mind · An Engineer’s Hands</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-slate-900 leading-[1.12] font-serif">
                  From a Million Orbiting Stars to the Human Sitting Next to You
                </h1>
                <p className="text-lg sm:text-xl text-[#2980b9] font-serif italic leading-snug">
                  How computational astrophysics, 50-millisecond decision systems, and Palo Alto field research shaped one question: what helps people think clearly, keep their independence, and build together?
                </p>
              </div>

              <div className="space-y-4 text-slate-700 font-serif text-[17px] sm:text-[18px] leading-[1.78]">
                <p>
                  Ten years ago at the University of Texas at Arlington, I spent my days watching a million virtual stars tug on one another inside supercomputer simulations, waiting billions of years of model time for two black holes to spiral together. Since then, my work has moved closer and closer to everyday human life—from pricing and recommendation engines at Uber, Airbnb, and SmartNews, to sitting in passenger seats with older drivers in Palo Alto testing self-driving cars.
                </p>
                <p>
                  Across every change of scale, the habit that works best has stayed the same: <strong>sketch a clear picture of how the system works, test it in the real world, and listen honestly when human experience pushes back</strong>.
                </p>
                <p>
                  Everything is here in full: 28 essays, field notes and specifications under four threads. The figures are interactive, so you can check the mechanism yourself. Where a piece first ran elsewhere, the original is credited at the end.
                </p>
              </div>

              {/* Bilingual Soul Quote Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_12px_rgba(41,128,185,0.06)] space-y-2">
                <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-serif italic border-l-3 border-[#1DAEDF] pl-4">
                  “我们都在穷尽自己仅有的一点天赋，来表达内心深处的感受”
                </blockquote>
                <p className="text-xs sm:text-sm text-slate-600 pl-4 leading-relaxed">
                  We spend our whole lives exhausting our modest gifts to express what lies deep in the soul—and, as my family motto reminds me, <strong className="text-slate-800">“但行好事，莫问前程”</strong> (do good work wholeheartedly, without fixating on the reward ahead).
                </p>
              </div>
            </div>

            {/* Right Column: Visual 4-Scale Journey Diagram ("A picture is worth a thousand words") */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#2980b9] font-semibold block">
                      Visual Overview · Click Any Scale to Jump
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                      One Thread Across Four Scales of Work
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-100 text-[11px] font-mono text-[#0369a1] font-medium">
                    28 Essays
                  </span>
                </div>

                {/* Self-Explanatory 4-Scale SVG Diagram */}
                <svg
                  viewBox="0 0 420 210"
                  className="w-full h-auto rounded-xl bg-gradient-to-br from-[#0b2034] via-[#102a45] to-[#081827] p-2 border border-sky-900/60"
                  role="img"
                  aria-label="Four scales of work: Cosmic N-body gravity, 50ms real-time systems, 1-on-1 human agency, and GCD by LCM civic cooperation"
                >
                  {/* Connecting flow line */}
                  <line x1="58" y1="92" x2="362" y2="92" stroke="#1DAEDF" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.55" />

                  {/* Node 1: Cosmic */}
                  <g transform="translate(55, 92)">
                    <circle r="34" fill="#0d2642" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle r="18" fill="none" stroke="#7dd3fc" strokeWidth="0.9" strokeDasharray="2,2" />
                    <circle cx="-6" cy="-3" r="4" fill="#f59e0b" />
                    <circle cx="7" cy="4" r="3.2" fill="#38bdf8" />
                    <text x="0" y="-44" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      01 · COSMIC
                    </text>
                    <text x="0" y="50" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      10⁶ Stars
                    </text>
                    <text x="0" y="63" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                      13.5 Gyr · LISA
                    </text>
                  </g>

                  {/* Node 2: System */}
                  <g transform="translate(158, 92)">
                    <circle r="34" fill="#0d2642" stroke="#1DAEDF" strokeWidth="1.5" />
                    <path d="M -18 -8 L 18 -8 M -18 8 L 18 8" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="-8" cy="-8" r="3.5" fill="#10b981" />
                    <circle cx="8" cy="8" r="3.5" fill="#f59e0b" />
                    <text x="0" y="-44" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      02 · SYSTEM
                    </text>
                    <text x="0" y="50" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      &lt; 50 ms
                    </text>
                    <text x="0" y="63" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                      Fast vs. Slow
                    </text>
                  </g>

                  {/* Node 3: Human */}
                  <g transform="translate(262, 92)">
                    <circle r="34" fill="#0d2642" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="-9" cy="-4" r="6" fill="none" stroke="#f59e0b" strokeWidth="1.6" />
                    <circle cx="9" cy="-4" r="6" fill="none" stroke="#38bdf8" strokeWidth="1.6" />
                    <path d="M -4 8 Q 0 14 4 8" fill="none" stroke="#7dd3fc" strokeWidth="1.5" />
                    <text x="0" y="-44" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      03 · HUMAN
                    </text>
                    <text x="0" y="50" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      1-on-1 Agency
                    </text>
                    <text x="0" y="63" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                      Seniors &amp; Play
                    </text>
                  </g>

                  {/* Node 4: Civic */}
                  <g transform="translate(365, 92)">
                    <polygon points="0,-34 30,-17 30,17 0,34 -30,17 -30,-17" fill="#0d2642" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle r="13" fill="#1DAEDF" fillOpacity="0.35" stroke="#7dd3fc" strokeWidth="1.4" />
                    <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontFamily="monospace" fontWeight="bold">
                      GCD
                    </text>
                    <text x="0" y="-44" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      04 · CIVIC
                    </text>
                    <text x="0" y="50" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      GCD × LCM
                    </text>
                    <text x="0" y="63" textAnchor="middle" fill="#94a3b8" fontSize="8.5" fontFamily="monospace">
                      Trust &amp; Rhythm
                    </text>
                  </g>

                  <text x="210" y="194" textAnchor="middle" fill="#cbd5e1" fontSize="9" fontFamily="sans-serif">
                    Same first-principles loop: Observe → Model → Test → Empower People
                  </text>
                </svg>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {NARRATIVE_THEMES.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className="p-3 rounded-xl border border-slate-200/80 hover:border-[#1DAEDF] hover:bg-sky-50/40 transition group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="text-[#2980b9] font-semibold">
                          {t.shortLabel}
                        </span>
                        <span>{t.essayUrls.length} {t.essayUrls.length === 1 ? "essay" : "essays"}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#2980b9] font-serif mt-1 line-clamp-1">
                        {t.title}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            01 · STARS & GRAVITY (COMPUTATIONAL ASTROPHYSICS & LISA)
           ===================================================================== */}
        <section
          id="stars-and-gravity"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                {NARRATIVE_THEMES[0].kicker}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                {NARRATIVE_THEMES[0].title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                {NARRATIVE_THEMES[0].subtitle}
              </p>

              <div className="space-y-3.5 text-slate-700 font-serif text-[17px] leading-[1.78]">
                <p>
                  Look at a globular cluster through a backyard telescope and it appears frozen—a quiet snow globe of a million stars packed into a sphere a few parsecs wide. Speed up the clock to an 800-million-year relaxation time (<code className="text-sm font-mono text-[#0369a1]">τ_rh</code>), however, and that snow globe turns into a restless gravitational engine. Heavy black holes lose kinetic energy to lighter stars, sink to the core, and lock into tight binary dances.
                </p>
                <p>
                  In my doctoral work at UT Arlington, I ran and synthesized <strong>3,240 MOCCA cluster simulations</strong> across <strong>8,946 galaxies</strong> within 30 Mpc. That cosmic census revealed <strong>17.88 million inspiralling binary black holes</strong>, a local merger rate of <code className="text-sm font-mono text-[#0369a1]">η ≃ 587 Gpc⁻³ yr⁻¹</code>, and <strong>17 LISA “standard sirens”</strong> pinpointed tightly enough (<code className="text-sm font-mono text-[#0369a1]">ΔV ≤ 1 Mpc³</code>) to measure the expansion of the universe independently of starlight.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1 text-xs">
                <button
                  onClick={() =>
                    openEssayReader(
                      "/articles/research/astrophysics-bbh-dissertation.html"
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#2980b9] hover:bg-[#20638f] text-white font-medium transition cursor-pointer shadow-xs"
                >
                  Read the Illustrated Astrophysics Essay &rarr;
                </button>
                <a
                  href={GC_RESEARCH_FINDINGS.dissertationPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:border-[#1DAEDF] text-slate-700 hover:text-[#2980b9] font-medium transition bg-white"
                >
                  2018 Dissertation PDF ↗
                </a>
              </div>
            </div>

            {/* Right Column: Visual 4-Stage Cosmic Funnel SVG (Replaces text-heavy Marginalia) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                    From Local Galaxies to LISA Standard Sirens
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    D ≤ 30 Mpc
                  </span>
                </div>

                <svg
                  viewBox="0 0 400 250"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Cosmic synthesis funnel: 8,946 galaxies to 662,772 globular clusters to 17.88M binary black holes to 17 LISA standard sirens"
                >
                  {/* Step 1 */}
                  <rect x="12" y="10" width="376" height="46" rx="10" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.2" />
                  <circle cx="40" cy="33" r="14" fill="#0284c7" />
                  <text x="40" y="37" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">01</text>
                  <text x="66" y="29" fill="#0f172a" fontSize="12" fontWeight="bold">8,946 Local Universe Galaxies</text>
                  <text x="66" y="44" fill="#475569" fontSize="10" fontFamily="monospace">Catalogued within 30 Mpc · Luminosity &amp; morphological scaling</text>

                  <path d="M 200 56 L 200 68" stroke="#0284c7" strokeWidth="1.8" />

                  {/* Step 2 */}
                  <rect x="28" y="68" width="344" height="46" rx="10" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="1.2" />
                  <circle cx="56" cy="91" r="14" fill="#0369a1" />
                  <text x="56" y="95" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">02</text>
                  <text x="82" y="87" fill="#0f172a" fontSize="12" fontWeight="bold">662,772 Globular Clusters</text>
                  <text x="82" y="102" fill="#334155" fontSize="10" fontFamily="monospace">Populated via 3,240 MOCCA N-body runs (25k TACC node-hrs)</text>

                  <path d="M 200 114 L 200 126" stroke="#0369a1" strokeWidth="1.8" />

                  {/* Step 3 */}
                  <rect x="46" y="126" width="308" height="46" rx="10" fill="#0c2138" stroke="#1DAEDF" strokeWidth="1.2" />
                  <circle cx="74" cy="149" r="14" fill="#1DAEDF" />
                  <text x="74" y="153" textAnchor="middle" fill="#081827" fontSize="10" fontFamily="monospace" fontWeight="bold">03</text>
                  <text x="100" y="145" fill="#ffffff" fontSize="12" fontWeight="bold">17.88M Binary Black Holes</text>
                  <text x="100" y="160" fill="#7dd3fc" fontSize="10" fontFamily="monospace">86,939 mergers · Lower-bound rate η ≃ 587 Gpc⁻³ yr⁻¹</text>

                  <path d="M 200 172 L 200 184" stroke="#f59e0b" strokeWidth="1.8" />

                  {/* Step 4 */}
                  <rect x="68" y="184" width="264" height="52" rx="10" fill="#081827" stroke="#f59e0b" strokeWidth="1.6" />
                  <circle cx="96" cy="210" r="14" fill="#f59e0b" />
                  <text x="96" y="214" textAnchor="middle" fill="#081827" fontSize="10" fontFamily="monospace" fontWeight="bold">04</text>
                  <text x="120" y="205" fill="#fbbf24" fontSize="12" fontWeight="bold">17 LISA Standard Sirens</text>
                  <text x="120" y="221" fill="#e2e8f0" fontSize="9.5" fontFamily="monospace">Pinpointed to ΔV ≤ 1 Mpc³ for H₀ cosmology</text>
                </svg>
              </div>
            </div>
          </div>

          {/* 3D Globular Cluster & LISA Simulation */}
          <div id="gc-simulation" className="space-y-3 scroll-mt-24">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                Interactive · Globular Cluster &amp; LISA
              </span>
              <a
                href={`${BASE_PATH === "" ? "" : BASE_PATH}/cluster/`}
                className="font-mono text-[#0369a1] hover:text-[#2980b9] underline underline-offset-4 whitespace-nowrap"
              >
                Open full screen &rarr;
              </a>
            </div>
            <GlobularClusterSimulation onOpenEssay={openEssayReader} />
          </div>
        </section>

        {/* =====================================================================
            02 · 50ms DECISIONS (TRAFFIC LIGHTS, MARKETPLACES & AD CONTROL PLANES)
           ===================================================================== */}
        <section
          id="realtime-decisions"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                {NARRATIVE_THEMES[1].kicker}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                {NARRATIVE_THEMES[1].title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                {NARRATIVE_THEMES[1].subtitle}
              </p>

              <div className="space-y-3.5 text-slate-700 font-serif text-[17px] leading-[1.78]">
                <p>
                  Sitting at a red light at an empty intersection one morning, I found myself doing the math: why do cities still run intersections on blind, fixed timers when approaching cars already carry GPS sensors? Even if only a fraction of vehicles share telemetry, pairing that sparse data with physical conservation laws (like Stephen Wolfram’s symbolic-neural hybrids) lets a system infer queue lengths and clear traffic dynamically.
                </p>
                <p>
                  I ran into the exact same structural puzzle working on marketplace pricing and advertising systems at Uber, Airbnb, and SmartNews. When you have <strong>less than 50 milliseconds</strong> to serve a decision, you cannot run deep reasoning on the hot path—and if you only optimize for immediate clicks, you burn out user trust. The solution is a <strong>two-speed architecture</strong>: a lightweight, safety-bounded reflex lane (<code className="text-sm font-mono text-[#0369a1]">&lt;50 ms p99</code>) steered by an asynchronous 8-agent reflection loop that recalibrates real user demand and creative fatigue every few minutes.
                </p>
              </div>
            </div>

            {/* Right Column: Visual Two-Speed Architecture SVG */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                    The Two-Speed Decision Pattern
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Reflex vs. Reflection
                  </span>
                </div>

                <svg
                  viewBox="0 0 400 220"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Two-speed decision architecture comparing the sub-50ms synchronous reflex path with the multi-minute 8-agent asynchronous control loop"
                >
                  {/* Top Lane: Fast Reflex (<50ms) */}
                  <rect x="12" y="14" width="376" height="74" rx="12" fill="#f0f9ff" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="26" y="34" fill="#0369a1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    FAST REFLEX LANE · SYNCHRONOUS (&lt; 50 ms p99)
                  </text>
                  <g transform="translate(26, 44)">
                    <rect x="0" y="0" width="96" height="30" rx="6" fill="#ffffff" stroke="#7dd3fc" />
                    <text x="48" y="19" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">Request / Car</text>
                    <path d="M 98 15 L 122 15" stroke="#0284c7" strokeWidth="1.6" />
                    <rect x="124" y="0" width="104" height="30" rx="6" fill="#0284c7" />
                    <text x="176" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Safety + Rank</text>
                    <path d="M 230 15 L 254 15" stroke="#0284c7" strokeWidth="1.6" />
                    <rect x="256" y="0" width="92" height="30" rx="6" fill="#10b981" />
                    <text x="302" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Serve Decision</text>
                  </g>

                  {/* Feedback arrows between lanes */}
                  <path d="M 310 88 L 310 118" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="3,2" />
                  <text x="348" y="107" textAnchor="middle" fill="#b45309" fontSize="8.5" fontFamily="monospace">Telemetry</text>
                  <path d="M 95 118 L 95 88" stroke="#0284c7" strokeWidth="1.6" strokeDasharray="3,2" />
                  <text x="54" y="107" textAnchor="middle" fill="#0369a1" fontSize="8.5" fontFamily="monospace">Updated Priors</text>

                  {/* Bottom Lane: Slow Reflection (Minutes) */}
                  <rect x="12" y="118" width="376" height="88" rx="12" fill="#0b2034" stroke="#1DAEDF" strokeWidth="1.5" />
                  <text x="26" y="139" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    SLOW REFLECTION LANE · ASYNCHRONOUS (MINUTES / HOURS)
                  </text>
                  <g transform="translate(26, 148)">
                    <rect x="0" y="0" width="108" height="42" rx="6" fill="#102a45" stroke="#38bdf8" strokeWidth="0.8" />
                    <text x="54" y="17" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">Demand &amp; Flow</text>
                    <text x="54" y="31" textAnchor="middle" fill="#7dd3fc" fontSize="8.5" fontFamily="monospace">Symbolic Solver</text>

                    <rect x="120" y="0" width="108" height="42" rx="6" fill="#102a45" stroke="#38bdf8" strokeWidth="0.8" />
                    <text x="174" y="17" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="bold">Fatigue &amp; Pacing</text>
                    <text x="174" y="31" textAnchor="middle" fill="#7dd3fc" fontSize="8.5" fontFamily="monospace">Ergonomic Guard</text>

                    <rect x="240" y="0" width="108" height="42" rx="6" fill="#102a45" stroke="#f59e0b" strokeWidth="0.8" />
                    <text x="294" y="17" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontWeight="bold">Causal Audit</text>
                    <text x="294" y="31" textAnchor="middle" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace">8-Agent Loop</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Interactive Two-Speed System Sandbox */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Interactive System Sandbox
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  Explore the Trade-Off: Fast Serving vs. Slow Coordination
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
                  8-Agent Advertising Loop
                </button>
                <button
                  onClick={() => setFig2Mode("traffic")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    fig2Mode === "traffic"
                      ? "bg-white text-[#2980b9] shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Smart Traffic Intersection
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-5">
                {fig2Mode === "ad-plane" ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                        <span>Fast-Lane Latency Budget (p99)</span>
                        <span className="text-[#2980b9] font-semibold">{fig2LatencyBudget} ms</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={80}
                        value={fig2LatencyBudget}
                        onChange={(e) => setFig2LatencyBudget(Number(e.target.value))}
                        aria-label="Fast-lane p99 latency budget in milliseconds"
                        className="w-full accent-[#2980b9] cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                        <span>Explicit User Preference Signal</span>
                        <span className="text-[#2980b9] font-semibold">{fig2Participation}%</span>
                      </div>
                      <input
                        type="range"
                        min={15}
                        max={95}
                        value={fig2Participation}
                        onChange={(e) => setFig2Participation(Number(e.target.value))}
                        aria-label="Explicit user preference signal percentage"
                        className="w-full accent-[#2980b9] cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                        <span>Approaching Cars Sharing Telemetry</span>
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

              {/* Dynamic Visual SVG Readout */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-[#0b2034] text-sky-100 space-y-3">
                <svg
                  viewBox="0 0 460 120"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Live visual meter of fast lane latency and slow lane signal quality"
                >
                  {/* Fast lane bar */}
                  <text x="10" y="24" fill="#7dd3fc" fontSize="10" fontFamily="monospace">
                    {fig2Mode === "ad-plane" ? `HOT PATH SLA (${fig2LatencyBudget}ms / 80ms)` : `CONNECTED TELEMETRY (${fig2Participation}%)`}
                  </text>
                  <rect x="10" y="32" width="440" height="14" rx="7" fill="#071524" stroke="#1e293b" />
                  <rect
                    x="10"
                    y="32"
                    width={Math.round(
                      440 *
                        (fig2Mode === "ad-plane"
                          ? fig2LatencyBudget / 80
                          : fig2Participation / 100)
                    )}
                    height="14"
                    rx="7"
                    fill="#38bdf8"
                  />

                  {/* Slow lane / Outcome bar */}
                  <text x="10" y="74" fill="#fbbf24" fontSize="10" fontFamily="monospace">
                    {fig2Mode === "ad-plane"
                      ? `USER FATIGUE REDUCTION & RELEVANCE LIFT`
                      : `INTERSECTION QUEUE CLEARANCE EFFICIENCY`}
                  </text>
                  <rect x="10" y="82" width="440" height="14" rx="7" fill="#071524" stroke="#1e293b" />
                  <rect
                    x="10"
                    y="82"
                    width={Math.round(440 * (0.25 + (fig2Participation / 100) * 0.7))}
                    height="14"
                    rx="7"
                    fill="#10b981"
                  />
                </svg>

                <p className="text-sm font-semibold text-white">
                  {fig2Stats.headline}
                </p>
                <p className="text-xs text-sky-200/90 leading-relaxed">
                  {fig2Stats.subline}
                </p>
              </div>
            </div>
          </figure>

          {/* Act 02 Essays Shelf */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Essays &amp; Architecture Notes in This Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NARRATIVE_THEMES[1].essayUrls.map((url) => {
                const entry = BOOK_ESSAYS_BY_URL[url];
                const writing = WRITINGS_DATA.find((w) => w.localUrl === url);
                if (!entry) return null;
                return (
                  <article
                    key={url}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEssayReader(url)}
                    onKeyDown={(e) => handleCardKeyDown(e, url)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{entry.date}</span>
                        <span className="text-[#2980b9] group-hover:translate-x-0.5 transition">
                          Read essay &rarr;
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
                      <span className="truncate">{entry.venue}</span>
                      <a
                        href={entry.url}
                        className="font-mono text-[#0369a1] hover:underline shrink-0"
                      >
                        Full page ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            03 · HUMAN AGENCY (PALO ALTO SENIORS, PLAY & LOCAL AI)
           ===================================================================== */}
        <section
          id="human-agency"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                {NARRATIVE_THEMES[2].kicker}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                {NARRATIVE_THEMES[2].title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                {NARRATIVE_THEMES[2].subtitle}
              </p>

              <div className="space-y-3.5 text-slate-700 font-serif text-[17px] leading-[1.78]">
                <p>
                  In late 2024 I stepped outside pure software loops to start <em>Kin Domi</em> in Palo Alto—spending afternoons in living rooms, community centers, and passenger seats with older adults. Watching seniors use Tesla’s Full Self-Driving (FSD) showed me something no benchmark captures: older drivers have the most to gain from autonomous mobility, yet cockpit alerts are built for thirty-year-old engineers. Sudden takeover chimes and tiny icons create panic at the exact moment calm reassurance is needed.
                </p>
                <p>
                  When I wrote <em>Reclaiming Play as a Life Skill</em>, several older readers gently told me they disliked the word “play” because it sounded childish. That conversation reshaped how I build: what people want at every age is <strong>dignified self-reliance, low-stakes curiosity, and a partner that respects their judgment</strong>—whether in <code className="text-sm font-mono text-[#0369a1]">Open Learning Lab</code>, <code className="text-sm font-mono text-[#0369a1]">baby-AI</code>, or <code className="text-sm font-mono text-[#0369a1]">iMessage AI Router</code>.
                </p>
              </div>
            </div>

            {/* Right Column: Visual Branching Agency Diagram SVG */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                    Shortcut AI vs. Sparring Partner AI
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Retention &amp; Dignity
                  </span>
                </div>

                <svg
                  viewBox="0 0 400 220"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Comparison between passive shortcut AI that causes skill atrophy and the 5-stage sparring partner loop that builds durable human agency"
                >
                  {/* Top Path: Shortcut Loop */}
                  <rect x="12" y="14" width="376" height="68" rx="12" fill="#fff1f2" stroke="#fda4af" strokeWidth="1.2" />
                  <text x="26" y="34" fill="#be123c" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    PATH A · PASSIVE SHORTCUT (ANSWER-FIRST AUTOMATION)
                  </text>
                  <text x="26" y="56" fill="#881337" fontSize="11" fontWeight="bold">
                    Prompt → Instant Answer → Copy-Paste → Skill Atrophy
                  </text>
                  <text x="26" y="71" fill="#9f1239" fontSize="9.5" fontFamily="monospace">
                    Illusion of competence · Sudden cockpit takeover panic
                  </text>

                  {/* Bottom Path: Agency Loop */}
                  <rect x="12" y="96" width="376" height="112" rx="12" fill="#0b2034" stroke="#1DAEDF" strokeWidth="1.5" />
                  <text x="26" y="117" fill="#7dd3fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    PATH B · AGENCY-PRESERVING SPARRING LOOP (JUDGMENT-FIRST)
                  </text>

                  {[
                    { x: 48, lbl: "1. Frame" },
                    { x: 124, lbl: "2. Try" },
                    { x: 200, lbl: "3. Spar" },
                    { x: 276, lbl: "4. Revise" },
                    { x: 352, lbl: "5. Own" },
                  ].map((node, i) => (
                    <g
                      key={i}
                      transform={`translate(${node.x}, 152)`}
                      onClick={() => setFig3StageIndex(i)}
                      className="cursor-pointer"
                    >
                      {i < 4 && (
                        <line x1="26" y1="0" x2="50" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
                      )}
                      <circle
                        r="23"
                        fill={fig3StageIndex === i ? "#f59e0b" : "#102a45"}
                        stroke={fig3StageIndex === i ? "#ffffff" : "#38bdf8"}
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={fig3StageIndex === i ? "#081827" : "#ffffff"}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {node.lbl}
                      </text>
                    </g>
                  ))}

                  <text x="200" y="196" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                    Click any stage (1–5) to compare below
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Interactive 5-Stage Agency Comparison */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Interactive 5-Stage Walkthrough
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  How We Keep Humans in the Loop—In Learning and in Mobility
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
                    {idx + 1} · {s.shortTitle}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  Answer-First Shortcut
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
                  Open Learning Lab (Sparring Loop)
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
                  Palo Alto Senior Parallel (Kin Domi)
                </span>
                <h4 className="text-sm font-bold text-white">
                  Dignified Independence
                </h4>
                <p className="text-xs text-sky-200/90 leading-relaxed">
                  {fig3Stages[fig3StageIndex].seniorParallel}
                </p>
              </div>
            </div>
          </figure>

          {/* Act 03 Essays Shelf */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Essays, Field Notes &amp; Local AI Designs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NARRATIVE_THEMES[2].essayUrls.map((url) => {
                const entry = BOOK_ESSAYS_BY_URL[url];
                const writing = WRITINGS_DATA.find((w) => w.localUrl === url);
                if (!entry) return null;
                return (
                  <article
                    key={url}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEssayReader(url)}
                    onKeyDown={(e) => handleCardKeyDown(e, url)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{entry.date}</span>
                        <span className="text-[#2980b9] group-hover:translate-x-0.5 transition">
                          Read essay &rarr;
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
                      <span className="truncate">{entry.venue}</span>
                      <a
                        href={entry.url}
                        className="font-mono text-[#0369a1] hover:underline shrink-0"
                      >
                        Full page ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            04 · WORKING TOGETHER (GCD × LCM, INSTITUTIONS & INTENTIONAL RHYTHM)
           ===================================================================== */}
        <section
          id="working-together"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                {NARRATIVE_THEMES[3].kicker}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
                {NARRATIVE_THEMES[3].title}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-serif italic">
                {NARRATIVE_THEMES[3].subtitle}
              </p>

              <div className="space-y-3.5 text-slate-700 font-serif text-[17px] leading-[1.78]">
                <p>
                  Why do some teams compound curiosity into generational breakthroughs while others with ten times the capital stall? Whether comparing <em>Boeing and SpaceX</em>, studying <em>eVTOL</em> airworthiness across the US and China, or reflecting on our own responsibilities as builders, the bottleneck is rarely raw IQ. It is whether incentives reward first-principles honesty over short-term optics.
                </p>
                <p>
                  In my Substack essays and the civic notebook <code className="text-sm font-mono text-[#0369a1]">LibertyEarth</code>, I use a simple mathematical picture for healthy collaboration: treat <strong>shared ethical values as the Greatest Common Divisor (GCD)</strong> that keeps baseline trust high, and treat <strong>complementary human + AI skills as the Least Common Multiple (LCM)</strong> that expands what we can build together—anchored day to day by my 8th-iteration color-coded weekly rhythm.
                </p>
              </div>
            </div>

            {/* Right Column: Visual 7-Day Color-Coded Rhythm Strip (v8) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                    Intentional Weekly Rhythm (Iteration v8)
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    A Colorful Year Ahead
                  </span>
                </div>

                <svg
                  viewBox="0 0 400 215"
                  className="w-full h-auto"
                  role="img"
                  aria-label="8th-iteration color-coded weekly calendar rhythm balancing deep build blocks, community connection, physical play, and weekly reflection"
                >
                  <rect x="8" y="8" width="384" height="198" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dIdx) => {
                    const x = 20 + dIdx * 52;
                    return (
                      <g key={day} transform={`translate(${x}, 20)`}>
                        <text x="21" y="12" textAnchor="middle" fill="#334155" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                          {day}
                        </text>
                        {/* Morning block */}
                        <rect
                          x="2"
                          y="20"
                          width="38"
                          height="42"
                          rx="6"
                          fill={dIdx < 5 ? "#0284c7" : "#10b981"}
                        />
                        {/* Midday block */}
                        <rect
                          x="2"
                          y="68"
                          width="38"
                          height="36"
                          rx="6"
                          fill={dIdx === 2 || dIdx === 4 ? "#f59e0b" : dIdx < 5 ? "#38bdf8" : "#f59e0b"}
                        />
                        {/* Evening block */}
                        <rect
                          x="2"
                          y="110"
                          width="38"
                          height="34"
                          rx="6"
                          fill={dIdx === 6 ? "#8b5cf6" : "#10b981"}
                          fillOpacity="0.85"
                        />
                      </g>
                    );
                  })}

                  {/* Legend */}
                  <g transform="translate(22, 182)">
                    <circle cx="6" cy="4" r="4.5" fill="#0284c7" />
                    <text x="15" y="7" fill="#334155" fontSize="8.5" fontFamily="monospace">Deep Build</text>

                    <circle cx="92" cy="4" r="4.5" fill="#f59e0b" />
                    <text x="101" y="7" fill="#334155" fontSize="8.5" fontFamily="monospace">Community</text>

                    <circle cx="180" cy="4" r="4.5" fill="#10b981" />
                    <text x="189" y="7" fill="#334155" fontSize="8.5" fontFamily="monospace">Body &amp; Family</text>

                    <circle cx="282" cy="4" r="4.5" fill="#8b5cf6" />
                    <text x="291" y="7" fill="#334155" fontSize="8.5" fontFamily="monospace">Sunday Reflection</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Interactive GCD × LCM Geometric Collaboration Diagram */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Interactive Visual Model · GCD × LCM
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  Shared Values (Inner Core) × Complementary Skills (Outer Frontier)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-[#0369a1]">
                {fig4Synthesis.archetype}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>GCD · Shared Values &amp; Intellectual Honesty</span>
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
                    <span>LCM · Complementary Human + AI Capabilities</span>
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

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#0369a1]">
                      {fig4Synthesis.trustIndex}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      Baseline Trust
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#2980b9]">
                      {fig4Synthesis.creativeReach}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      Frontier Reach
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-amber-700">
                      {fig4Synthesis.frictionRisk}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      Drift Risk
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Geometric SVG of GCD Inner Overlap & LCM Outer Envelope */}
              <div className="lg:col-span-7">
                <svg
                  viewBox="0 0 460 190"
                  className="w-full h-auto rounded-xl bg-[#0b2034] border border-sky-900/70 p-3"
                  role="img"
                  aria-label="Live geometric diagram showing the inner GCD shared-values overlap and outer LCM capability envelope"
                >
                  <g transform="translate(150, 95)">
                    {/* Outer LCM capability polygon */}
                    {(() => {
                      const rOuter = 38 + (fig4Lcm / 100) * 44;
                      const pts = [0, 1, 2, 3, 4, 5]
                        .map((k) => {
                          const ang = (k * Math.PI) / 3 - Math.PI / 6;
                          return `${(rOuter * Math.cos(ang)).toFixed(1)},${(
                            rOuter * Math.sin(ang)
                          ).toFixed(1)}`;
                        })
                        .join(" ");
                      return (
                        <polygon
                          points={pts}
                          fill="#1DAEDF"
                          fillOpacity="0.14"
                          stroke="#38bdf8"
                          strokeWidth="1.6"
                          strokeDasharray="4,3"
                        />
                      );
                    })()}

                    {/* Overlapping member circles whose intersection grows with GCD */}
                    {(() => {
                      const spread = Math.max(6, 34 - (fig4Gcd / 100) * 26);
                      return (
                        <>
                          <circle cx={-spread} cy="-6" r="28" fill="#0284c7" fillOpacity="0.35" stroke="#7dd3fc" strokeWidth="1.2" />
                          <circle cx={spread} cy="-6" r="28" fill="#0ea5e9" fillOpacity="0.35" stroke="#7dd3fc" strokeWidth="1.2" />
                          <circle cx="0" cy={spread * 0.85} r="28" fill="#f59e0b" fillOpacity="0.3" stroke="#fbbf24" strokeWidth="1.2" />
                        </>
                      );
                    })()}

                    {/* Central GCD Core */}
                    <circle
                      r={10 + (fig4Gcd / 100) * 14}
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text x="0" y="3" textAnchor="middle" fill="#081827" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                      GCD
                    </text>
                  </g>

                  <g transform="translate(275, 42)">
                    <text x="0" y="0" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      INNER CORE (GCD = {fig4Gcd}%)
                    </text>
                    <text x="0" y="16" fill="#e2e8f0" fontSize="10">
                      Shared ethics, mutual respect,
                    </text>
                    <text x="0" y="30" fill="#e2e8f0" fontSize="10">
                      and honest feedback lower friction.
                    </text>

                    <text x="0" y="68" fill="#7dd3fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      OUTER FRONTIER (LCM = {fig4Lcm}%)
                    </text>
                    <text x="0" y="84" fill="#e2e8f0" fontSize="10">
                      Complementary human + AI skills
                    </text>
                    <text x="0" y="98" fill="#e2e8f0" fontSize="10">
                      expand the collective horizon.
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </figure>

          {/* Act 04 Essays Shelf */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Essays on Leadership, Culture, and Possible Futures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NARRATIVE_THEMES[3].essayUrls.map((url) => {
                const entry = BOOK_ESSAYS_BY_URL[url];
                const writing = WRITINGS_DATA.find((w) => w.localUrl === url);
                if (!entry) return null;
                return (
                  <article
                    key={url}
                    role="button"
                    tabIndex={0}
                    onClick={() => openEssayReader(url)}
                    onKeyDown={(e) => handleCardKeyDown(e, url)}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>{entry.date}</span>
                        <span className="text-[#2980b9] group-hover:translate-x-0.5 transition">
                          Read essay &rarr;
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
                      <span className="truncate">{entry.venue}</span>
                      <a
                        href={entry.url}
                        className="font-mono text-[#0369a1] hover:underline shrink-0"
                      >
                        Full page ↗
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================================
            IDEA CONSTELLATION: INTERACTIVE MAP OF THEMES, SYSTEMS & ESSAYS
           ===================================================================== */}
        <section
          id="constellation"
          className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                <span>Interactive Idea Constellation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
                How Seven Questions Connect Across 6 Systems and 28 Essays
              </h2>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Click any question sphere, system cube, or essay node in the constellation to see how ideas from stellar dynamics, decision intelligence, and Palo Alto fieldwork connect—and open any essay right on the page.
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
                  3D Map
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
                onOpenEssay={openEssayReader}
              />
            </div>

            {mobileMapView === "list" && (
              <div className="lg:hidden col-span-1 space-y-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#2980b9] font-medium">
                    Seven Recurring Questions
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
                    {activePillarObj ? "Selected Question" : "Constellation Guide"}
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
                      Explore Connected Ideas
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Select any theme sphere, project cube, or essay node in the map to inspect its key takeaway and read the full text.
                    </p>
                  </>
                )}
              </div>

              {selectedWriting && (
                <div className="p-6 rounded-2xl bg-white border-2 border-[#1DAEDF]/50 shadow-md space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-sky-50 text-[11px] font-mono text-[#0369a1] font-medium border border-sky-100">
                      {getThemeLabelForUrl(selectedWriting.localUrl)} · {selectedWriting.date}
                    </span>
                    <button
                      onClick={() => openEssayReader(selectedWriting.localUrl)}
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
                      Key Takeaway
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedWriting.keyInsight}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => openEssayReader(selectedWriting.localUrl)}
                      className="text-[#2980b9] font-medium hover:underline cursor-pointer"
                    >
                      Open in reader &rarr;
                    </button>
                    <a
                      href={selectedWriting.localUrl}
                      className="text-slate-500 hover:text-[#2980b9] font-mono"
                    >
                      Standalone page ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================================
            ALL WRITING: SEARCHABLE ARCHIVE OF ALL 28 SELF-HOSTED ESSAYS
           ===================================================================== */}
        <section
          id="writings"
          className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                Complete Self-Hosted Archive · 28 Essays
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
                All Writing &amp; System Notes
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl">
                Every essay is hosted here in full with visual SVG diagrams. Click any card to read right on this page, or open its standalone URL.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 28 essays…"
                aria-label="Search essays by title or topic"
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1DAEDF] w-full sm:w-56"
              />
              <a
                href="/articles/"
                className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs font-mono text-[#0369a1] hover:bg-sky-100 transition text-center shrink-0"
              >
                Visual Archive (/articles/) &rarr;
              </a>
            </div>
          </div>

          {/* Theme Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {themeTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setThemeFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer border ${
                  themeFilter === tab
                    ? "bg-slate-900 border-slate-900 text-white font-semibold"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#1DAEDF] hover:text-[#2980b9]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWritings.map((w) => {
              const pillar = INTELLECTUAL_PILLARS.find((p) => p.id === w.pillar);
              const bookEntry = BOOK_ESSAYS_BY_URL[w.localUrl];
              const themeTag = getThemeLabelForUrl(w.localUrl);

              return (
                <article
                  key={w.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openEssayReader(w.localUrl)}
                  onKeyDown={(e) => handleCardKeyDown(e, w.localUrl)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#1DAEDF] focus:outline-none focus:ring-2 focus:ring-[#1DAEDF] transition flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-100 font-mono text-[#0369a1] text-[11px] font-medium">
                          {themeTag}
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
                        Takeaway:
                      </span>
                      {w.keyInsight}
                    </div>
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-slate-400">
                        Originally on{" "}
                        <a
                          href={bookEntry?.originalUrl || w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-[#2980b9] underline underline-offset-2"
                        >
                          {bookEntry?.venue || w.source}
                        </a>
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <button
                          onClick={() => openEssayReader(w.localUrl)}
                          className="text-[#2980b9] hover:text-[#1DAEDF] font-medium cursor-pointer"
                        >
                          Read essay &rarr;
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
            SAY HELLO & CONNECT
           ===================================================================== */}
        <section
          id="inquiries"
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 space-y-6 scroll-mt-24"
        >
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
              Keep the Conversation Going
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-tight">
              Compare Notes or Say Hello
            </h2>
            <p className="text-base sm:text-lg text-slate-700 font-serif leading-relaxed">
              I love connecting with curious minds working on decision systems, human-centered AI, elder independence, or community learning.
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
                Domi’s Mind Waves (Substack) ↗
              </a>
              <a
                href="/articles/"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#2980b9] text-sm font-medium transition"
              >
                All 28 Self-Hosted Essays
              </a>
              <a
                href="https://github.com/domijin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-[#2980b9] text-sm font-medium transition"
              >
                GitHub (@domijin) ↗
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
                2018 Classic Site
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
            <em>Domi’s Mind Waves — Essays, Visuals &amp; Systems</em>.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/articles/" className="hover:text-[#2980b9] transition">
              All 28 Essays
            </a>
            <span>·</span>
            <a href="/pages/about-me.html?env=blue" className="hover:text-[#2980b9] transition">
              2018 Classic Site
            </a>
            <span>·</span>
            <a href={SELF_HREF} className="text-[#2980b9] font-medium">
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
