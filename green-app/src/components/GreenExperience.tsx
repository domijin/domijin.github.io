"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  PERSONA_DATA,
  INTELLECTUAL_PILLARS,
  WRITINGS_DATA,
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
      "Reverse-engineering a traffic-light countdown, writing down an ad-serving path that keeps its tail latency down without shrinking the model, and asking what the Growth Trap does to the people on the other side of the screen.",
    period: "2018 – 2026 · Recommendation Systems, Marketplace Pricing & Ad Infrastructure",
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
    title: "Collective Competence: One Mission, Every Person Whole",
    subtitle:
      "From human capital in an ‘organized farm’ to organizing intelligence with empowered individuals — and a proposed measure of a resilient, capable team: collective competence with mission alignment, holding diversity and individuality at once.",
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

  // Act 02 Interactive State — the traffic-light cycle estimator described in
  // "From Traffic Lights to Life's Direction" (Medium, October 2023).
  const [tlReporters, setTlReporters] = useState<number>(36);
  const [tlSignal, setTlSignal] = useState<number>(92);
  const [tlCrowd, setTlCrowd] = useState<number>(6);
  const [tlHistory, setTlHistory] = useState<number>(95);

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

  /**
   * The traffic-light cycle estimator, built the way "From Traffic Lights to
   * Life's Direction" describes it: devices report whether they stopped or
   * passed at the light, a crowd reports the state directly, and the estimator
   * fits a (period, phase) square wave to those observations. Confidence follows
   * the essay's own definition — the share of data points aligned with the
   * estimated state, discounted by the historical accuracy of past estimates.
   *
   * The intersection is synthetic and the ground truth is fixed, so the reader
   * can see how much of it the estimator actually recovers.
   */
  const tlEstimate = useMemo(() => {
    // Ground truth: a 108 s cycle (45 green / 3 yellow / 60 red), read 30 s in.
    const CYCLE = 108;
    const GREEN = 45;
    const YELLOW = 3;
    const NOW = 30;
    // The window is historical data, not one cycle: the essay estimates the
    // static pattern "by just looking at how frequently users stop or pass".
    const WINDOW = 360;
    const FRAC_GREEN = GREEN / CYCLE;
    const FRAC_YELLOW = YELLOW / CYCLE;

    const stateAtU = (u: number) =>
      u < FRAC_GREEN ? "green" : u < FRAC_GREEN + FRAC_YELLOW ? "yellow" : "red";

    // A device stops at a red and hesitates in the yellow dilemma zone; a
    // mis-read flips the observation.
    const stopProbability = (u: number) =>
      u < FRAC_GREEN ? 0.05 : u < FRAC_GREEN + FRAC_YELLOW ? 0.5 : 0.95;

    // Deterministic PRNG: the same settings must always give the same readout,
    // or a number on the page cannot be checked.
    let seed = 0x9e3779b9;
    const rnd = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const quality = tlSignal / 100;
    const observations: { t: number; u: number; stopped: boolean }[] = [];
    for (let i = 0; i < tlReporters; i++) {
      const jitter = (i + rnd()) / tlReporters;
      const t = NOW - WINDOW * jitter;
      const u = (((t % CYCLE) + CYCLE) % CYCLE) / CYCLE;
      const stopped = rnd() < stopProbability(u);
      const flipped = rnd() > quality;
      observations.push({ t, u, stopped: flipped ? !stopped : stopped });
    }

    // Crowd reports: direct observations of the state *now*.
    const crowdVotes: string[] = [];
    for (let i = 0; i < tlCrowd; i++) {
      const trueState = stateAtU((((NOW % CYCLE) + CYCLE) % CYCLE) / CYCLE);
      const wrong = rnd() > quality;
      const others = ["green", "yellow", "red"].filter((s) => s !== trueState);
      crowdVotes.push(wrong ? others[Math.floor(rnd() * others.length)] : trueState);
    }
    const crowdCounts = crowdVotes.reduce<Record<string, number>>(
      (acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }),
      {}
    );
    const crowdState =
      tlCrowd > 0
        ? (["green", "yellow", "red"] as const).reduce((a, b) =>
            (crowdCounts[b] ?? 0) > (crowdCounts[a] ?? 0) ? b : a
          )
        : null;

    // Fit (period, phase): maximise the log-likelihood of the observed
    // stop/pass pattern under a square wave of that period and phase.
    let best = { ll: -Infinity, period: CYCLE, phaseNow: (NOW % CYCLE) };
    for (let period = 60; period <= 180; period += 2) {
      const phaseSteps = 48;
      for (let s = 0; s < phaseSteps; s++) {
        const phaseNow = (s * period) / phaseSteps;
        let ll = 0;
        for (const ob of observations) {
          const phase = (((phaseNow + (ob.t - NOW)) % period) + period) % period;
          const p = stopProbability(phase / period);
          ll += ob.stopped ? Math.log(Math.max(p, 1e-6)) : Math.log(Math.max(1 - p, 1e-6));
        }
        if (ll > best.ll) best = { ll, period, phaseNow };
      }
    }

    const fittedU = (best.phaseNow % best.period) / best.period;
    const fittedState = stateAtU(fittedU);
    const trueState = stateAtU((((NOW % CYCLE) + CYCLE) % CYCLE) / CYCLE);

    // Time to the next change, from the fitted cycle.
    const b1 = FRAC_GREEN * best.period;
    const b2 = (FRAC_GREEN + FRAC_YELLOW) * best.period;
    const p = best.phaseNow % best.period;
    const nextChange =
      p < b1 ? b1 - p : p < b2 ? b2 - p : best.period - p;

    // How many observations agree with the fitted model — the essay's first
    // ingredient for a confidence score.
    const aligned = observations.filter((ob) => {
      const phase = (((best.phaseNow + (ob.t - NOW)) % best.period) + best.period) % best.period;
      const pStop = stopProbability(phase / best.period);
      return ob.stopped ? pStop >= 0.5 : pStop < 0.5;
    }).length;

    // The essay's two ingredients for a confidence score: how many data points
    // align with the estimate, and how accurate past estimates have been.
    // A third term keeps the score honest about thin evidence — with two
    // devices almost any cycle fits, so almost nothing is aligned in a way
    // that means anything.
    const alignment = (aligned + 1) / (observations.length + 2);
    const sorted = [...observations].sort((a, b) => a.t - b.t);
    let transitions = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].stopped !== sorted[i - 1].stopped) transitions += 1;
    }
    const evidence = Math.min(1, transitions / 3);

    const crowdAgrees = crowdState === null || crowdState === fittedState;
    const confidence = Math.round(
      100 * alignment * evidence * (tlHistory / 100) * (crowdAgrees ? 1 : 0.8)
    );

    return {
      observations,
      ticks: observations.map((ob) => ({
        frac: ((((best.phaseNow + (ob.t - NOW)) % best.period) + best.period) % best.period) / best.period,
        stopped: ob.stopped,
      })),
      period: best.period,
      fittedState,
      trueState,
      fittedNow: best.phaseNow % best.period,
      trueNow: NOW,
      nextChange: Math.round(nextChange),
      confidence: Math.max(0, Math.min(99, confidence)),
      aligned,
      total: observations.length,
      crowdState,
      crowdAgrees,
      trueNextChange:
        NOW < GREEN ? GREEN - NOW : NOW < GREEN + YELLOW ? GREEN + YELLOW - NOW : CYCLE - NOW,
    };
  }, [tlReporters, tlSignal, tlCrowd, tlHistory]);

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
                04 · Working Together (Collective Competence)
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
                {activeReaderEssay.url === "/articles/research/astrophysics-bbh-dissertation.html" && (
                  <a
                    href="/pdfs/main.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-xl bg-[#2980b9] px-4 py-2 text-sm font-medium text-white hover:bg-[#20638f] transition"
                  >
                    Read the full 2018 dissertation PDF ↗
                  </a>
                )}
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
                  Ten years ago at the University of Texas at Arlington, I spent my days watching a million virtual stars tug on one another inside supercomputer simulations, waiting billions of years of model time for two black holes to spiral together. Since then, my work has moved closer and closer to everyday human life—from recommendation engines that read mobility data, and marketplace pricing that had to survive contact with real demand, to sitting in passenger seats with older drivers in Palo Alto testing self-driving cars.
                </p>
                <p>
                  Across every change of scale, the habit that works best has stayed the same: <strong>sketch a clear picture of how the system works, test it in the real world, and listen honestly when human experience pushes back</strong>.
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
                      Real-time systems
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
            02 · 50ms DECISIONS (TRAFFIC LIGHTS, MARKETPLACES & AD SYSTEMS)
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
                  Sitting at a red light at an empty intersection one morning, I found myself doing the math: why do cities still run intersections on blind, fixed timers when approaching cars already carry GPS sensors? Even if only a fraction of vehicles share telemetry, pairing that sparse data with physical conservation laws (like Stephen Wolfram&rsquo;s symbolic-neural hybrids) lets a system infer queue lengths and clear traffic dynamically.
                </p>
                <p>
                  The same structural puzzle came back in advertising. A serving path has to answer inside the latency budget the platform allows, and the trade-off is stated bluntly in <em>Rethinking Digital Advertising</em>: real-time ad platforms cannot tolerate the latency that AppLovin&rsquo;s models can, and that headroom is exactly what buys larger models and better personalisation. So I wrote the system down instead of the slogan &mdash; a real-time ingestion pipeline and feature store feeding a labelling and profile service, which feeds a dynamic ad-serving path with in-session creative switching, backed by distilled user profiles so candidate generation stays cheap.
                </p>
                <p>
                  The rest of the argument matters more than the plumbing. If you optimise only for immediate clicks, you exhaust the audience: that is the Growth Trap, where <strong>consumer fatigue, regulatory risk and competitive erosion</strong> meet. A system that serves a decision in milliseconds still has to answer the slower question underneath it &mdash; whether the decision is worth making at all.
                </p>
              </div>
            </div>

            {/* Right Column: the ad-serving architecture written up in
                "Rethinking Digital Advertising" (Medium, October 2024). */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
                    Ad Serving Architecture
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Four stages
                  </span>
                </div>

                <svg
                  viewBox="0 0 400 250"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Four-stage ad serving architecture: data pipeline, labelling and profile service, dynamic ad serving, and profile distillation with efficient candidate models"
                >
                  <defs>
                    <marker id="arrow-ad-arch" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7" />
                    </marker>
                  </defs>
                  <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
                    <rect x="6" y="6" width="356" height="46" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                    <text x="20" y="24" fill="#0369a1" fontSize="9.5" fontWeight="bold">01 · DATA PIPELINE</text>
                    <text x="20" y="41" fill="#475569" fontSize="8.5">Real-time ingestion · session + long-term feature store</text>
                    <path d="M 184 54 L 184 64" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-ad-arch)" />

                    <rect x="6" y="66" width="356" height="46" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                    <text x="20" y="84" fill="#0369a1" fontSize="9.5" fontWeight="bold">02 · LABELLING &amp; PROFILE SERVICE</text>
                    <text x="20" y="101" fill="#475569" fontSize="8.5">Funnel-stage state mapping · profile aggregation</text>
                    <path d="M 184 114 L 184 124" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-ad-arch)" />

                    <rect x="6" y="126" width="356" height="46" rx="8" fill="#f0f9ff" stroke="#38bdf8" />
                    <text x="20" y="144" fill="#0369a1" fontSize="9.5" fontWeight="bold">03 · DYNAMIC AD SERVING</text>
                    <text x="20" y="161" fill="#475569" fontSize="8.5">In-session creative switching · GenAI creative engine</text>
                    <path d="M 184 174 L 184 184" stroke="#0284c7" strokeWidth="1.5" markerEnd="url(#arrow-ad-arch)" />

                    <rect x="6" y="186" width="356" height="46" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                    <text x="20" y="204" fill="#0369a1" fontSize="9.5" fontWeight="bold">04 · PROFILE DISTILLATION</text>
                    <text x="20" y="221" fill="#475569" fontSize="8.5">Compact embeddings · multi-stage candidate models</text>

                    {/* distilled profiles feed candidate generation in the serving path */}
                    <path d="M 366 209 L 376 209 L 376 149 L 368 149" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3,2" />
                    <circle cx="376" cy="149" r="2.5" fill="#f59e0b" />
                  </g>
                </svg>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The pipeline as specified in <em>Rethinking Digital Advertising: From Guesswork to User
                  Engagement</em> &mdash; the two middle stages are the ones that decide whether a
                  fast decision is also a good one. The dashed line is the loop the essay keeps
                  closing: distilled profiles feed candidate generation back into the serving path.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive: the traffic-light cycle estimator described in
              "From Traffic Lights to Life's Direction" (Medium, October 2023). */}
          <figure className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
                  Interactive System Sandbox
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mt-0.5">
                  Traffic-Light Cycle Estimator
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
                  The estimator designed in <em>From Traffic Lights to Life&rsquo;s Direction</em> (Medium,
                  2023): devices report whether they stopped or passed, a crowd reports the state
                  directly, and a square wave is fitted to those observations. This is a re-implementation
                  of that design against a synthetic intersection with a known ground truth &mdash; not a
                  measurement of a deployed system.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>Devices Reporting</span>
                    <span className="text-[#2980b9] font-semibold">{tlReporters}</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={48}
                    value={tlReporters}
                    onChange={(e) => setTlReporters(Number(e.target.value))}
                    aria-label="Number of devices reporting approach observations"
                    className="w-full accent-[#2980b9] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>Observation Quality</span>
                    <span className="text-[#2980b9] font-semibold">{tlSignal}%</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={tlSignal}
                    onChange={(e) => setTlSignal(Number(e.target.value))}
                    aria-label="Share of observations that are read cleanly"
                    className="w-full accent-[#2980b9] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>Crowd State Reports</span>
                    <span className="text-[#2980b9] font-semibold">{tlCrowd}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={tlCrowd}
                    onChange={(e) => setTlCrowd(Number(e.target.value))}
                    aria-label="Number of crowd-sourced state reports"
                    className="w-full accent-[#2980b9] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                    <span>Historical Accuracy of Past Estimates</span>
                    <span className="text-[#2980b9] font-semibold">{tlHistory}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={99}
                    value={tlHistory}
                    onChange={(e) => setTlHistory(Number(e.target.value))}
                    aria-label="Historical accuracy of previous cycle estimates"
                    className="w-full accent-[#2980b9] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#0369a1] uppercase">
                      {tlEstimate.fittedState}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Estimated state now</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#2980b9]">
                      {tlEstimate.nextChange}s
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Until next change</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-emerald-700">
                      {tlEstimate.period}s
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Recovered cycle</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 text-center">
                    <div className="text-base font-bold font-mono text-[#0369a1]">
                      {tlEstimate.confidence}%
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Confidence</div>
                  </div>
                </div>
              </div>

              {/* Cycle readout */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-[#0b2034] text-sky-100 space-y-3">
                <svg
                  viewBox="0 0 460 136"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Estimated traffic light cycle compared with the ground truth cycle, with device observations marked along the estimated cycle"
                >
                  <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
                    <text x="10" y="13" fill="#7dd3fc" fontSize="9.5" fontWeight="bold">
                      ESTIMATED CYCLE · {tlEstimate.period}s PERIOD
                    </text>
                    <rect x="10" y="21" width="440" height="22" rx="4" fill="#16a34a" />
                    <rect x="10" y="21" width={440 * 0.4167} height="22" fill="#22c55e" />
                    <rect x={10 + 440 * 0.4167} y="21" width={440 * 0.0278} height="22" fill="#eab308" />
                    <rect x={10 + 440 * 0.4445} y="21" width={440 * 0.5555} height="22" fill="#b91c1c" />
                    <text x={10 + 440 * 0.21} y="36" textAnchor="middle" fill="#052e16" fontSize="8.5" fontWeight="bold">GREEN</text>
                    <text x={10 + 440 * 0.72} y="36" textAnchor="middle" fill="#7f1d1d" fontSize="8.5" fontWeight="bold">RED</text>

                    {/* where the estimator places "now" inside its own cycle */}
                    <line
                      x1={10 + 440 * (tlEstimate.fittedNow / tlEstimate.period)}
                      y1="19"
                      x2={10 + 440 * (tlEstimate.fittedNow / tlEstimate.period)}
                      y2="43"
                      stroke="#ffffff"
                      strokeWidth="1.6"
                    />
                    <text
                      x={10 + 440 * (tlEstimate.fittedNow / tlEstimate.period)}
                      y="66"
                      fill="#ffffff"
                      fontSize="8"
                      textAnchor="middle"
                    >
                      NOW
                    </text>

                    {tlEstimate.ticks.map((tick, i) => (
                      <rect
                        key={i}
                        x={10 + 440 * tick.frac}
                        y="44"
                        width="2"
                        height="10"
                        fill={tick.stopped ? "#fbbf24" : "#38bdf8"}
                        opacity="0.9"
                      />
                    ))}

                    <text x="10" y="80" fill="#94a3b8" fontSize="9.5" fontWeight="bold">
                      GROUND TRUTH · 108s CYCLE
                    </text>
                    <rect x="10" y="86" width="440" height="16" rx="4" fill="#b91c1c" />
                    <rect x="10" y="86" width={440 * 0.4167} height="16" fill="#22c55e" />
                    <rect x={10 + 440 * 0.4167} y="86" width={440 * 0.0278} height="16" fill="#eab308" />

                    <line
                      x1={10 + 440 * (30 / 108)}
                      y1="84"
                      x2={10 + 440 * (30 / 108)}
                      y2="106"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                    />
                    <text x={10 + 440 * (30 / 108)} y="118" fill="#fbbf24" fontSize="8" textAnchor="middle">NOW</text>

                    <text x="10" y="131" fill="#64748b" fontSize="8">
                      <tspan fill="#38bdf8">|</tspan> device passed
                      <tspan dx="10" fill="#fbbf24">|</tspan> device stopped
                    </text>
                  </g>
                </svg>

                <p className="text-sm font-semibold text-white">
                  Estimated {tlEstimate.fittedState.toUpperCase()} · changes in {tlEstimate.nextChange}s
                  {" · "}
                  {tlEstimate.confidence}% confidence
                </p>
                <p className="text-xs text-sky-200/90 leading-relaxed">
                  The truth is {tlEstimate.trueState.toUpperCase()} changing in {tlEstimate.trueNextChange}s
                  {" · "}
                  {tlEstimate.aligned} of {tlEstimate.total} observations align with the fitted cycle
                  {tlEstimate.crowdState
                    ? ` · crowd reports ${tlEstimate.crowdState.toUpperCase()}`
                    : " · no crowd reports"}
                  {tlEstimate.crowdState && !tlEstimate.crowdAgrees
                    ? " — the crowd disagrees with the fit, so confidence is discounted"
                    : ""}
                  . Confidence follows the essay&rsquo;s definition: the share of aligned data points,
                  discounted by the historical accuracy of previous estimates.
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
            HOW THE MODEL WORKS — FROM "ALL ABOUT CHATGPT"
           ===================================================================== */}
        <section
          id="how-the-model-works"
          className="space-y-6 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2980b9] font-semibold block">
              Model Scale · 2023 – Present
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight">
              How I Think a Language Model Works
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-serif italic">
              Still a sketch, and probably wrong in places. This is the model I keep
              redrawing — a language model as correlated memories, one of them conditioned
              at a time — with the two ways out I keep thinking about. I would rather hear
              where it breaks than defend it.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="font-mono uppercase tracking-widest text-[#2980b9] font-semibold">
              The Sketch &amp; Its Redrawing
            </span>
            <a
              href={`${BASE_PATH === "" ? "" : BASE_PATH}/knowledge/`}
              className="font-mono text-[#0369a1] hover:text-[#2980b9] underline underline-offset-4 whitespace-nowrap"
            >
              Try the 3D model &rarr;
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            <figure className="lg:col-span-7 rounded-2xl border border-slate-200 bg-[#0b2034] p-3 sm:p-5 shadow-sm space-y-4">
              <img
                src="/images/knowledge-growth.gif"
                alt="An animation: the dashed spiky outline is collective human knowledge, one spike per domain at very different depths. A model starts with a small boundary in the middle. Experts work frontiers; breakthroughs extend the spikes; each result becomes training data and the model's boundary grows toward it. By the end the boundary reaches close to the spike tips in AlphaGo, AlphaFold and mathematics, and passes outside the human outline in a few thin fields."
                className="w-full h-auto rounded-xl block"
                loading="lazy"
                width={1000}
                height={760}
              />
              <figcaption className="text-xs text-slate-400 leading-relaxed px-1">
                <span className="text-slate-300 font-semibold">How a model&apos;s knowledge boundary grows.</span>{" "}
                The dashed outline is collective human knowledge, each spike one domain&apos;s depth — deep in
                some fields, thin in others. An expert works a frontier, a breakthrough moves it out, and
                the result becomes training data, so the boundary moves. In the deep fields it ends up close
                to the frontier; in the thin ones it crosses the human graph. That last case is the one
                worth being careful about, because the graph underneath is thinnest there. It is my
                sketch, not a measurement.
              </figcaption>
            </figure>

            <figure className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <img
                src="/images/all-about-chatgpt-sketch.png"
                alt="The original hand-drawn sketch: an irregular black outline labelled collective human knowledge, ringed by a blue dashed circle labelled the potential new frontier of collective knowledge, with green memory nodes inside connected by dotted lines, an advanced field with deep domain knowledge overlapping the edge, and two routes beyond it written in red — a new data modality that guesses to query the real world, and symbolic learning."
                className="w-full h-auto rounded-lg border border-slate-100 block bg-white"
                loading="lazy"
              />
              <figcaption className="text-xs text-slate-500 leading-relaxed">
                <span className="text-slate-700 font-semibold">The original.</span>{" "}
                A page I drew by hand for{" "}
                <button
                  onClick={() => openEssayReader("/articles/blog/all-about-chatgpt.html")}
                  className="text-[#0369a1] hover:underline font-mono"
                >
                  All About ChatGPT
                </button>{" "}
                (2023) — the black outline is collective human knowledge, the green{" "}
                <span className="font-mono text-[#0369a1]">mem</span> nodes are what a model can recall,
                and the blue dashed circle is the frontier I thought was still open. The animation on the
                left is the same picture, redrawn and set in motion.
              </figcaption>

              <div className="border-t border-slate-100 pt-3">
                <div className="font-mono uppercase tracking-widest text-[10px] text-slate-400 font-semibold mb-2">
                  What the animation shows
                </div>
                <ol className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                  <li>
                    <span className="font-mono text-[#0369a1] mr-1.5">01</span>
                    The human shape. One spike per field, and they are not the same length.
                  </li>
                  <li>
                    <span className="font-mono text-[#0369a1] mr-1.5">02</span>
                    The model starts small. Its edge is the edge of what it can recall.
                  </li>
                  <li>
                    <span className="font-mono text-[#0369a1] mr-1.5">03</span>
                    An expert works a frontier. A breakthrough moves it out, and the result
                    becomes training data, so the edge moves too.
                  </li>
                  <li>
                    <span className="font-mono text-[#0369a1] mr-1.5">04</span>
                    It reaches the deep fields — and in the thin ones it goes past the human
                    graph, which is the part worth being careful about.
                  </li>
                </ol>
              </div>
            </figure>
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
            04 · WORKING TOGETHER (COLLECTIVE COMPETENCE, GCD × LCM & RHYTHM)
           ===================================================================== */}
        <section
          id="working-together"
          className="space-y-10 scroll-mt-24 pt-8 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
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
                  In my Substack essays and the civic notebook <code className="text-sm font-mono text-[#0369a1]">LibertyEarth</code>, I use a simple mathematical picture for healthy collaboration: treat <strong>shared ethical values as the Greatest Common Divisor (GCD)</strong> that keeps baseline trust high, and treat <strong>complementary human + AI skills as the Least Common Multiple (LCM)</strong> that expands what we can build together—anchored day to day by the eighth revision of the work model I keep in my founder's log.
                </p>
                <p>
                  Shared values and complementary skills are the mechanism; what they are <em>for</em> is collective competence. The institutions I have worked in still organize people the way an <strong>organized farm</strong> organizes capital: interchangeable units, measured by output, replaceable when the season turns. That shape does not survive the move to <strong>organizing intelligence with empowered individuals</strong>. So I am trying to measure a resilient, capable team instead: <strong>collective competence</strong> — what the group can do that none of its members could do alone, held together by <strong>one mission</strong>, and sustained by leaving <strong>every person's difference intact</strong>. All three have to hold at once. Take the mission away and the team is a queue; take the individuality away and it is a crowd. The Avengers are the reference case — nobody interchangeable, everybody committed to the same thing.
                </p>
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
            <a href={`${BASE_PATH === "" ? "" : BASE_PATH}/knowledge/`} className="hover:text-[#2980b9] transition">
              Knowledge Boundary
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
