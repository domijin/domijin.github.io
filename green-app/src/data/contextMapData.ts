export interface IntellectualPillar {
  id: string;
  title: string;
  shortTitle: string;
  question: string;
  color: string;
  position: [number, number, number];
  synthesis: string;
}

export interface WritingNode {
  id: string;
  title: string;
  date: string;
  source: "Substack" | "Medium" | "GitHub" | "Blog" | "Research";
  url: string;
  localUrl: string;
  localMarkdownUrl: string;
  pillar: string;
  secondaryPillars: string[];
  summary: string;
  keyInsight: string;
  position: [number, number, number];
  featured?: boolean;
}

export interface OpenProject {
  id: string;
  name: string;
  tagline: string;
  category: string;
  url: string;
  localMirrorUrl?: string;
  repoUrl?: string;
  pillar: string;
  description: string;
  verificationArtifact: string;
  metrics: string[];
}

export interface LocalizedBBHSiren {
  id: string;
  pgc: string;
  distanceMpc: number;
  m1Solar: number;
  m2Solar: number;
  chirpMassSolar: number;
  separationAU: number;
  eccentricity: number;
  fOrbitalMhz: number;
  fGwMhz: number;
  snr2Yr: number;
  errorVolumeMpc3: number;
  note: string;
}

export const GC_RESEARCH_FINDINGS = {
  dissertationTitle:
    "Prospective Detection of Binary Black Holes in the Local Universe with Gravitational Waves",
  author: "Dongming Jin, Ph.D. (University of Texas at Arlington, 2018)",
  advisor: "Prof. Matthew J. Benacquista",
  dissertationPdfUrl: "/pdfs/main.pdf",
  localArchiveUrl: "/articles/research/astrophysics-bbh-dissertation.html",
  localUniverseVolumeMpc: 30,
  galaxiesCatalogued: 8946,
  globularClustersPopulated: 662772,
  maxGCsSingleGalaxy: {
    name: "ESO093-003",
    distanceMpc: 20.797,
    gcCount: 11560,
  },
  moccaLibrary: {
    totalSimulations: 3240,
    baseModels: 324,
    realizationsPerModel: 10,
    computeFootprint: ">100 TB storage · ~25,000 node-hours on TACC superclusters",
    hubbleTimeGyr: 13.5,
  },
  bbhDatabase: {
    inspirallingPresentDay: 17883760,
    hubbleTimeMergers: 86939,
    lowerBoundMergerRateGpc3Yr: 587,
    preLigoReferenceRate: "~100 Gpc⁻³ yr⁻¹ (Rodriguez et al., 2015)",
    earlyLigoO1ReferenceRate: "9–240 Gpc⁻³ yr⁻¹ (Abbott et al., 2016a)",
    lisaLocalizedStandardSirens: 17,
    localizationThresholdMpc3: 1.0,
    lisaObservationYears: 2.0,
    lisaBandHz: [3e-4, 1e-1],
  },
  timescales: {
    crossingTimeMyr: 1.0,
    thermalKelvinHelmholtzMyr: 30.0,
    massiveStarCollapseMyr: 8.0,
    halfMassRelaxationMyr: 800.0,
    massSegregationRatio: 0.05,
    coreCollapseRatio: 2.2,
    hubbleTimeRatio: 16.875,
    spitzerFormula:
      "τ_rh = v³ / (8π G² ⟨m⟩² n ln(γN)) ≈ [2×10¹² yr / ln(γN)] (v / 10 km s⁻¹)³ (⟨m⟩ / M_☉)⁻² (n / 1 pc⁻³)⁻¹",
    petersFormula:
      "df/dt = k₀ f¹¹/³,  k₀ = (96/5)(2π)⁸/³ (G⁵/³ / c⁵) 𝓜⁵/³ ≈ 3.68×10⁻⁶ 𝓜⁵/³",
    rateFormula:
      "η = N (8 k₀ / 3) f_min⁸/³ (30 Mpc / 1 Gpc)⁻³ (13.5 Gyr / 1 yr)⁻¹ ≃ 587 Gpc⁻³ yr⁻¹",
  },
  sampleSystems: [
    {
      id: "gc-284-1-ref",
      pgc: "Model 284-1 (Table 6-1)",
      distanceMpc: 25.351,
      m1Solar: 19.714,
      m2Solar: 19.324,
      chirpMassSolar: 16.991,
      separationAU: 0.0542,
      eccentricity: 0.6307,
      fOrbitalMhz: 0.0157,
      fGwMhz: 0.125,
      snr2Yr: 14.8,
      errorVolumeMpc3: 2.4,
      note: "Benchmark eccentric BBH from Table 6-1 (ejected at t_ej = 0.3134 Gyr, host GC age 9.48 Gyr).",
    },
    {
      id: "pgc-1628-imbh",
      pgc: "PGC 1628 #7 (Table 6-2)",
      distanceMpc: 0.787,
      m1Solar: 20.632,
      m2Solar: 137.73,
      chirpMassSolar: 44.31,
      separationAU: 0.1783,
      eccentricity: 0.4779,
      fOrbitalMhz: 0.0332,
      fGwMhz: 0.21,
      snr2Yr: 86.4,
      errorVolumeMpc3: 0.04,
      note: "Intermediate-mass hierarchical BBH (20.6 M_☉ + 137.7 M_☉) localized to ΔV ≤ 1 Mpc³ as a LISA standard siren.",
    },
    {
      id: "pgc-1628-heavy",
      pgc: "PGC 1628 #9 (Table 6-2)",
      distanceMpc: 0.787,
      m1Solar: 28.433,
      m2Solar: 26.503,
      chirpMassSolar: 23.91,
      separationAU: 0.1751,
      eccentricity: 0.8133,
      fOrbitalMhz: 0.0203,
      fGwMhz: 0.34,
      snr2Yr: 62.1,
      errorVolumeMpc3: 0.09,
      note: "High-eccentricity (e = 0.813) dynamical exchange binary emitting multi-harmonic LISA bursts near periapsis.",
    },
    {
      id: "pgc-1628-ecc",
      pgc: "PGC 1628 #8 (Table 6-2)",
      distanceMpc: 0.787,
      m1Solar: 21.425,
      m2Solar: 25.616,
      chirpMassSolar: 20.38,
      separationAU: 0.1652,
      eccentricity: 0.7509,
      fOrbitalMhz: 0.0202,
      fGwMhz: 0.28,
      snr2Yr: 51.4,
      errorVolumeMpc3: 0.14,
      note: "Dynamically hardened core binary (e = 0.751) with clear annual Doppler and amplitude modulation.",
    },
    {
      id: "pgc-616-circ",
      pgc: "PGC 616 #3 (Table 6-2)",
      distanceMpc: 2.188,
      m1Solar: 3.158,
      m2Solar: 10.25,
      chirpMassSolar: 4.91,
      separationAU: 0.807,
      eccentricity: 0.0,
      fOrbitalMhz: 0.0162,
      fGwMhz: 0.32,
      snr2Yr: 22.5,
      errorVolumeMpc3: 0.68,
      note: "Circularised standard-siren binary at 2.19 Mpc with unique host galaxy identification.",
    },
  ] as LocalizedBBHSiren[],
};

export const PERSONA_DATA = {
  name: "Domi Jin",
  legalName: "Dongming Jin",
  roles: ["Scientist.", "Builder.", "Founder."],
  tagline: "A sci-fi mind. An engineer’s hands.",
  mission:
    "I work on machine learning and decision systems. My background is in computational astrophysics; my current interests are learning, human judgement and how people work together.",
  centralQuestion:
    "What helps people make better decisions, learn well and work together?",
  background: [
    {
      id: "science",
      stage: "01 / Research",
      title: "Computational astrophysics",
      period: "Ph.D. Physics (2013–2018) · LSST Data Science Fellow",
      narrative:
        "I began in computational astrophysics, studying stellar dynamics and binary black holes through numerical simulation and statistical modelling.",
      proofPoints: [
        "3,240 MOCCA globular cluster simulations (>100 TB, 25k node-hours on TACC) modelling 662,772 clusters within 30 Mpc.",
        "Extracted 17.88M inspiralling binary black holes and 86,939 mergers; derived a lower-bound merger rate of 587 Gpc⁻³ yr⁻¹ and 17 LISA standard sirens.",
        "LSST Data Science Fellowship: statistical modelling, image processing and reproducible research workflows.",
      ],
    },
    {
      id: "applied-ml",
      stage: "02 / Applied machine learning",
      title: "Decision systems",
      period: "Applied ML & Decision Intelligence (2018–2024)",
      narrative:
        "I then worked on machine learning for consumer products, marketplaces and advertising, where a model has to be useful within the constraints of a working system.",
      proofPoints: [
        "Recommendation systems using behavioural and contextual signals from mobility data.",
        "Marketplace pricing, generative AI request workflows and information exchange between users.",
        "Advertising analytics, model evaluation and causal attribution; published architecture notes on real-time bidding and multi-agent control.",
      ],
    },
    {
      id: "entrepreneurship",
      stage: "03 / Building",
      title: "Learning and human–AI collaboration",
      period: "Independent projects & ventures (2018–present)",
      narrative:
        "Building a company brought me closer to the people using the technology. It made me more attentive to what they need, and to the gap between a promising idea and something useful.",
      proofPoints: [
        "Kin Domi, Inc.: AI and community projects concerned with older adults’ independence and access to technology.",
        "Open Learning Lab and baby-AI: open research into learning, and specifications for a household agent that runs on local hardware.",
        "Essays on learning, team coordination and human–AI collaboration in Domi’s Mind Waves and elsewhere, mirrored in full in this repository.",
      ],
    },
  ],
  philosophy: [
    {
      title: "Working together",
      body: "Good work depends on more than individual ability. Shared context, trust, complementary skills and sensible incentives matter, as does room for people to exercise their own judgement.",
    },
    {
      title: "Usefulness",
      body: "I judge technology by what it helps people do: understand a problem, make a choice, learn a skill or spend their time better. Technical elegance is valuable when it serves that purpose.",
    },
    {
      title: "Testing the idea",
      body: "I try to make assumptions explicit, build something that can be tested and pay attention to the result. Revising an explanation is part of the work.",
    },
  ],
  epistemicDisclaimer:
    "These are ongoing questions. The linked work distinguishes observations, proposals and research findings.",
  correspondence: {
    intro:
      "If you are working on a related question, I would be glad to compare notes.",
    detail:
      "Questions, useful references and considered disagreements are welcome.",
  },
};

export const INTELLECTUAL_PILLARS: IntellectualPillar[] = [
  {
    id: "collective-intelligence",
    title: "Collective Intelligence",
    shortTitle: "Collective Intel",
    question: "How do individual capabilities combine to produce collective outcomes?",
    color: "#1DAEDF",
    position: [0, 2.3, 0],
    synthesis:
      "I am interested in how shared knowledge, communication and trust help groups make use of what their members know.",
  },
  {
    id: "human-ai-collaboration",
    title: "Human–AI Collaboration",
    shortTitle: "Human–AI Collab",
    question: "How can intelligent systems support human judgement and agency?",
    color: "#2980b9",
    position: [2.1, 1.1, 0.7],
    synthesis:
      "Current projects explore personal memory, voice and messaging interfaces, and local processing, with attention to privacy and human judgement.",
  },
  {
    id: "organizational-intelligence",
    title: "Organisational Intelligence",
    shortTitle: "Org Intelligence",
    question: "How do communication, coordination, trust, and incentives shape collaboration?",
    color: "#0284c7",
    position: [1.8, -1.3, -0.6],
    synthesis:
      "My writing considers shared values, complementary skills, incentives and the practical costs of coordination.",
  },
  {
    id: "complex-adaptive-systems",
    title: "Complex Adaptive Systems",
    shortTitle: "Complex Systems",
    question: "How do interactions among individuals give rise to emergent social and organisational behaviour?",
    color: "#0369a1",
    position: [0, -2.3, 0.8],
    synthesis:
      "Stellar dynamics, traffic and marketplaces raise related questions about interactions and feedback. I use these comparisons as starting points, with care about where the analogy stops.",
  },
  {
    id: "decision-intelligence",
    title: "Decision Intelligence",
    shortTitle: "Decision Intel",
    question: "How can information, feedback, and experimentation improve decisions?",
    color: "#0ea5e9",
    position: [-1.9, -1.2, -0.5],
    synthesis:
      "Work on causal inference, experimentation and decision systems has made me interested in what we measure, and whether it reflects the outcome we care about.",
  },
  {
    id: "human-potential",
    title: "Human Potential",
    shortTitle: "Human Potential",
    question: "How can technology make learning, opportunity, and meaningful participation more accessible?",
    color: "#0284c7",
    position: [-2.1, 1.1, 0.6],
    synthesis:
      "Open Learning Lab asks whether learning with AI leads to understanding that lasts and can be used independently. Other writing considers play and learning throughout life.",
  },
  {
    id: "ai-and-society",
    title: "AI and Society",
    shortTitle: "AI & Society",
    question: "How might increasingly capable intelligence change the ways we work, cooperate, and live?",
    color: "#328cc7",
    position: [0.2, 0.1, 2.2],
    synthesis:
      "Essays consider accessibility, autonomy and the incentives behind AI systems, including observations from work with older adults.",
  },
];

export const OPEN_PROJECTS: OpenProject[] = [
  {
    id: "open-learning-lab",
    name: "Open Learning Lab",
    tagline: "Studying what people retain after learning with AI.",
    category: "Learning research",
    url: "https://github.com/domijin/open-learning-lab",
    localMirrorUrl: "/articles/github/open-learning-lab.html",
    repoUrl: "https://github.com/domijin/open-learning-lab",
    pillar: "human-potential",
    description:
      "An open research ledger comparing approaches to learning with language models. The focus is on what learners retain and can apply independently, relative to the effort involved.",
    verificationArtifact: "goal → hypothesis → experiment → observation/evidence → finding → decision",
    metrics: ["Delayed recall", "Transfer of learning", "Open research ledger"],
  },
  {
    id: "baby-ai",
    name: "baby-AI",
    tagline: "Specifications for a household agent that learns from spoken feedback.",
    category: "Local AI · Design specifications",
    url: "https://github.com/domijin/baby-AI",
    localMirrorUrl: "/articles/github/baby-ai.html",
    repoUrl: "https://github.com/domijin/baby-AI",
    pillar: "human-ai-collaboration",
    description:
      "Five subsystem specifications covering perception, speech recognition, memory, adaptation and evaluation. The design targets local hardware costing under $200, with signed evaluation records.",
    verificationArtifact: "Evaluation contract specifying SSH-signed JSON records and SHA-256 benchmark identifiers",
    metrics: ["Hardware target: <$200", "Five subsystem specifications", "On-device processing by design"],
  },
  {
    id: "imessage-router",
    name: "Life Hack: iMessage AI Router",
    tagline: "Access to AI tools through an ordinary message.",
    category: "Messaging interface · Beta",
    url: "https://domij.info/beta/",
    localMirrorUrl: "/articles/blog/imessage-ai-router.html",
    pillar: "human-ai-collaboration",
    description:
      "An experiment in using iMessage to reach internet-connected agents when normal browsing is limited. It explores how a familiar, asynchronous interface can work with constrained connections.",
    verificationArtifact: "English and Chinese beta pages with access details",
    metrics: ["iMessage interface", "Limited-connectivity use cases", "Field beta"],
  },
  {
    id: "kin-domi",
    name: "Kin Domi, Inc.",
    tagline: "Technology and community projects with older adults.",
    category: "Venture · Accessibility",
    url: "https://kindomi.net/",
    localMirrorUrl: "/articles/substack/starting-a-new-venture.html",
    repoUrl: "https://github.com/domijin/kindomi.net",
    pillar: "ai-and-society",
    description:
      "Work on AI companions, accessible interfaces and community activities in Palo Alto, informed by older adults’ experiences of technology, mobility and learning.",
    verificationArtifact: "Incorporated Dec 2024 · Moon Creative Lab & Beta University · WRMSDC Certified",
    metrics: ["Palo Alto fieldwork", "Voice interfaces", "Community learning"],
  },
  {
    id: "agent-ad-systems",
    name: "Advertising decision systems",
    tagline: "A serving path that keeps its latency down without shrinking the model.",
    category: "Systems architecture · Design notes",
    url: "https://github.com/domijin/observations_in_advertising",
    localMirrorUrl: "/articles/github/observations-in-advertising.html",
    repoUrl: "https://github.com/domijin/observations_in_advertising",
    pillar: "decision-intelligence",
    description:
      "A four-stage ad-serving architecture — real-time ingestion and feature store, labelling and profile service, dynamic ad serving with in-session creative switching, and profile distillation for efficient candidate generation. Written up alongside notes on advertising economics and the growth trap.",
    verificationArtifact:
      "Published essays: “Trace of AppLovin’s 7x Annual Hypergrowth” and “Rethinking Digital Advertising”",
    metrics: ["Four serving stages", "In-session creative switching", "Distilled user profiles"],
  },
  {
    id: "libertyearth-future",
    name: "LibertyEarth & The Future Project",
    tagline: "Notes on governance, cooperation and possible futures.",
    category: "Open writing · Governance",
    url: "https://github.com/domijin/LibertyEarth",
    localMirrorUrl: "/articles/github/libertyearth-and-future.html",
    repoUrl: "https://github.com/domijin/future",
    pillar: "collective-intelligence",
    description:
      "An evolving collection of proposals about social contracts, liquid democracy, local manufacturing and ways of turning ideas into practical experiments.",
    verificationArtifact: "Public essays, proposals and project notes",
    metrics: ["Governance proposals", "Project archive", "Open discussion"],
  },
];

export const WRITINGS_DATA: WritingNode[] = [
  {
    id: "open-learning-lab-protocol",
    title: "Open Learning Lab: Evidence-Driven Personalized Learning Policies",
    date: "2026-08",
    source: "GitHub",
    url: "https://github.com/domijin/open-learning-lab",
    localUrl: "/articles/github/open-learning-lab.html",
    localMarkdownUrl: "/articles/github/open-learning-lab.md",
    pillar: "human-potential",
    secondaryPillars: ["human-ai-collaboration", "decision-intelligence"],
    summary:
      "An open research ledger testing which LLM-mediated learning policies produce durable, transferable capability per unit of learner effort outside the tutoring session.",
    keyInsight:
      "The study asks whether making a design judgement before seeing an expert solution improves later recall and transfer compared with explanation-first tutoring.",
    position: [-2.8, 1.7, 1.1],
    featured: true,
  },
  {
    id: "baby-ai-edge-specs",
    title: "baby-AI: Receipt-Verified Edge Household Agent Architecture",
    date: "2026-05",
    source: "GitHub",
    url: "https://github.com/domijin/baby-AI",
    localUrl: "/articles/github/baby-ai.html",
    localMarkdownUrl: "/articles/github/baby-ai.md",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["decision-intelligence", "ai-and-society"],
    summary:
      "Five subsystem specifications for perception, speech, memory, adaptation and evaluation, with a hardware cost target below $200.",
    keyInsight:
      "The design uses signed evaluation records to make claims about on-device learning and privacy inspectable.",
    position: [2.9, 1.6, 1.2],
    featured: true,
  },
  {
    id: "imessage-ai-router",
    title: "Life Hack: iMessage as a Low-Bandwidth Router to the Internet",
    date: "2026-04",
    source: "Blog",
    url: "https://domij.info/beta/",
    localUrl: "/articles/blog/imessage-ai-router.html",
    localMarkdownUrl: "/articles/blog/imessage-ai-router.md",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["human-potential"],
    summary:
      "An experiment in using messaging to reach internet-connected agents over limited connections, including in-flight Wi-Fi and satellite text.",
    keyInsight:
      "Messaging offers a familiar, asynchronous interface for asking an agent to do something without keeping a browser session open.",
    position: [2.6, 0.6, 1.6],
    featured: true,
  },
  {
    id: "reclaiming-play",
    title: "Reclaiming Play as a Life Skill",
    date: "2025-03",
    source: "Substack",
    url: "https://domijin.substack.com/p/reclaiming-play-as-a-life-skill",
    localUrl: "/articles/substack/reclaiming-play-as-a-life-skill.html",
    localMarkdownUrl: "/articles/substack/reclaiming-play-as-a-life-skill.md",
    pillar: "human-potential",
    secondaryPillars: ["complex-adaptive-systems", "ai-and-society"],
    summary:
      "Examines Jane McGonigal's game mechanics (goals, rules, feedback systems, voluntary participation) through conversations with senior learners and retirees.",
    keyInsight:
      "The essay considers what clear goals, feedback and voluntary participation can contribute to learning throughout life.",
    position: [-2.7, 0.5, 1.4],
    featured: true,
  },
  {
    id: "tesla-seniors-safety",
    title: "Tesla, Seniors Love Your Self-Driving—Now Let’s Make It Safer for Them",
    date: "2025-02",
    source: "Substack",
    url: "https://domijin.substack.com/p/tesla-seniors-love-your-self-drivingnow",
    localUrl: "/articles/substack/tesla-seniors-love-your-self-drivingnow.html",
    localMarkdownUrl: "/articles/substack/tesla-seniors-love-your-self-drivingnow.md",
    pillar: "ai-and-society",
    secondaryPillars: ["human-ai-collaboration", "decision-intelligence"],
    summary:
      "Observations from work with older adults at Kin Domi, alongside six proposals for more accessible driving-assistance interfaces.",
    keyInsight:
      "The article proposes changes to alert timing, pre-drive checks and voice controls, based on difficulties observed with older users.",
    position: [0.8, 0.7, 2.9],
    featured: true,
  },
  {
    id: "overachievers-responsibility",
    title: "Overachiever’s Responsibility: Leadership, Alignment, and Sustainable Growth",
    date: "2025-02",
    source: "Substack",
    url: "https://domijin.substack.com/p/overachievers-responsibility-reflection",
    localUrl: "/articles/substack/overachievers-responsibility-reflection.html",
    localMarkdownUrl: "/articles/substack/overachievers-responsibility-reflection.md",
    pillar: "organizational-intelligence",
    secondaryPillars: ["collective-intelligence"],
    summary:
      "A reflection on team alignment, complementary skills and sustainable working habits.",
    keyInsight:
      "The essay uses greatest common divisors and least common multiples as metaphors for shared values and complementary skills, and considers the role of incentives.",
    position: [2.6, -1.6, -1.1],
    featured: true,
  },
  {
    id: "colorful-year-rhythm",
    title: "A Colorful Year Ahead: Milestones & Momentum from Intentional Rhythm",
    date: "2025-01",
    source: "Substack",
    url: "https://domijin.substack.com/p/a-colorful-year-ahead",
    localUrl: "/articles/substack/a-colorful-year-ahead.html",
    localMarkdownUrl: "/articles/substack/a-colorful-year-ahead.md",
    pillar: "organizational-intelligence",
    secondaryPillars: ["decision-intelligence"],
    summary:
      "Notes on the eighth revision of a working model built around shared calendars, asynchronous collaboration and weekly reflection.",
    keyInsight:
      "The working model explores whether shared calendars and asynchronous contributions can make coordination easier.",
    position: [2.1, -2.1, -0.2],
  },
  {
    id: "applovin-hypergrowth-repository",
    title: "Trace of AppLovin’s 7x Annual Hypergrowth (repository edition)",
    date: "2024-11",
    source: "GitHub",
    url: "https://github.com/domijin/observations_in_advertising",
    localUrl: "/articles/github/observations-in-advertising.html",
    localMarkdownUrl: "/articles/github/observations-in-advertising.md",
    pillar: "decision-intelligence",
    secondaryPillars: ["complex-adaptive-systems", "ai-and-society"],
    summary:
      "The living repository edition of the AppLovin essay: the four growth drivers, the four areas where the paradigm is shifting, the growth trap, and the author’s own account of where the work came from.",
    keyInsight:
      "Growth that depends on scaling data collection carries an economic, ethical and social cost that the scaling law alone does not price in.",
    position: [-2.6, -1.8, -1.0],
    featured: true,
  },
  {
    id: "serendipity-and-highlands",
    title: "Serendipity: Where It Sparks & Dedication: Where It Is Channeled",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/serendipity-where-it-sparks",
    localUrl: "/articles/substack/serendipity-where-it-sparks.html",
    localMarkdownUrl: "/articles/substack/serendipity-where-it-sparks.md",
    pillar: "collective-intelligence",
    secondaryPillars: ["human-potential"],
    summary:
      "A personal reflection on connections between astrophysics, Confucian ethics and work across disciplines.",
    keyInsight:
      "The essay considers how ideas from physics, machine learning and human–computer interaction can inform one another.",
    position: [-0.8, 3.0, 0.5],
    featured: true,
  },
  {
    id: "starting-new-venture-kindomi",
    title: "Starting a New Venture & Momentum in Human-Centered Elder AI",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/starting-a-new-venture",
    localUrl: "/articles/substack/starting-a-new-venture.html",
    localMarkdownUrl: "/articles/substack/starting-a-new-venture.md",
    pillar: "human-potential",
    secondaryPillars: ["ai-and-society", "organizational-intelligence"],
    summary:
      "Notes on customer research, community outreach and forming the team behind Kin Domi, Inc.",
    keyInsight:
      "Conversations about difficulties with technology often led to broader questions about independence, dignity and relationships.",
    position: [-3.0, 1.1, -0.3],
  },
  {
    id: "coach-seeking-reflection",
    title: "Reflections from a Coach-Seeking Impulse",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/reflections-from-coach-seeking-impulse",
    localUrl: "/articles/substack/reflections-from-coach-seeking-impulse.html",
    localMarkdownUrl: "/articles/substack/reflections-from-coach-seeking-impulse.md",
    pillar: "human-potential",
    secondaryPillars: ["organizational-intelligence"],
    summary:
      "Examines the mechanics of coaching, intellectual honesty, and why shared context determines the effectiveness of feedback.",
    keyInsight:
      "The reflection considers how honesty and shared context affect the usefulness of coaching.",
    position: [-2.3, 1.9, -0.7],
  },
  {
    id: "third-ear-twinmind-ama",
    title: "Building Proactive Personal AI Memory (Third Ear / TwinMind AMA)",
    date: "2024-11",
    source: "Medium",
    url: "https://medium.com/@domijin/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285",
    localUrl: "/articles/medium/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285.html",
    localMarkdownUrl: "/articles/medium/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285.md",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["human-potential"],
    summary:
      "An architectural discussion of personal AI memory, local voice processing, privacy in query rewriting and browser context.",
    keyInsight:
      "The discussion explores how local processing and selective use of cloud services might balance personal context, privacy and cost.",
    position: [3.1, 0.9, -0.4],
  },
  {
    id: "dark-mode-decision-workflow",
    title: "Is Dark Mode Doing More Harm Than Good? A Deeper Look at Our Choices",
    date: "2024-11",
    source: "Medium",
    url: "https://medium.com/@domijin/is-dark-mode-doing-more-harm-than-good-a-deeper-look-at-our-choices-a9685daad170",
    localUrl: "/articles/medium/is-dark-mode-doing-more-harm-than-good-a-deeper-look-at-our-choices-a9685daad170.html",
    localMarkdownUrl: "/articles/medium/is-dark-mode-doing-more-harm-than-good-a-deeper-look-at-our-choices-a9685daad170.md",
    pillar: "decision-intelligence",
    secondaryPillars: ["ai-and-society", "organizational-intelligence"],
    summary:
      "Uses the visual ergonomics of dark mode as a case study to critique short-term agile feature shipping versus long-term user welfare.",
    keyInsight:
      "The essay asks how product teams can account for longer-term effects alongside the immediate feedback from feature releases.",
    position: [-2.8, -0.9, -1.2],
  },
  {
    id: "applovin-hypergrowth-trace",
    title: "Trace of AppLovin’s 7x Annual Hypergrowth & The Growth Trap",
    date: "2024-11",
    source: "Medium",
    url: "https://medium.com/@domijin/trace-of-applovins-7x-annual-hypergrowth-39dcb154f5d0",
    localUrl: "/articles/medium/trace-of-applovins-7x-annual-hypergrowth-39dcb154f5d0.html",
    localMarkdownUrl: "/articles/medium/trace-of-applovins-7x-annual-hypergrowth-39dcb154f5d0.md",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["decision-intelligence", "ai-and-society"],
    summary:
      "An analysis of behavioural data, scaling and latency constraints in advertising, with questions about the costs of continued growth.",
    keyInsight:
      "The analysis asks where additional behavioural data stops adding useful value, and who bears the costs of the resulting systems.",
    position: [-0.9, -3.0, 1.1],
    featured: true,
  },
  {
    id: "rethinking-digital-advertising",
    title: "Rethinking Digital Advertising: Demand Mining & Dynamic Personalization",
    date: "2024-10",
    source: "Medium",
    url: "https://domijin.medium.com/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced",
    localUrl: "/articles/medium/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced.html",
    localMarkdownUrl: "/articles/medium/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced.md",
    pillar: "decision-intelligence",
    secondaryPillars: ["human-ai-collaboration"],
    summary:
      "Proposes richer intent models, compact user profiles and interfaces that let users request different advertisements.",
    keyInsight:
      "Letting users request different advertisements is proposed as a way to collect more deliberate preference feedback.",
    position: [-2.1, -1.9, 0.5],
  },
  {
    id: "traffic-lights-to-life-direction",
    title: "From Traffic Lights to Life’s Direction: Crowdsourced Inference & Symbolic AI",
    date: "2023-10",
    source: "Medium",
    url: "https://domijin.medium.com/from-traffic-lights-to-lifes-direction-57176d5d7a06",
    localUrl: "/articles/medium/from-traffic-lights-to-lifes-direction-57176d5d7a06.html",
    localMarkdownUrl: "/articles/medium/from-traffic-lights-to-lifes-direction-57176d5d7a06.md",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["human-ai-collaboration", "decision-intelligence"],
    summary:
      "Explores how traffic-light timing might be inferred from crowdsourced trajectories, alongside reflections from Wolfram Summer School.",
    keyInsight:
      "The piece considers what can be inferred from movement data, and where symbolic computation might complement language models.",
    position: [0.9, -2.9, 1.2],
    featured: true,
  },
  {
    id: "illegible-handwriting-bandwidth",
    title: "Why Is Some Professional Handwriting Illegible? Information Bandwidth & HCI",
    date: "2023-10",
    source: "Medium",
    url: "https://medium.com/@domijin/why-is-some-professional-handwriting-illegible-d07bd8acb818",
    localUrl: "/articles/medium/why-is-some-professional-handwriting-illegible-d07bd8acb818.html",
    localMarkdownUrl: "/articles/medium/why-is-some-professional-handwriting-illegible-d07bd8acb818.md",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["organizational-intelligence"],
    summary:
      "An exploration of documentation bottlenecks, the bandwidth of speech and writing, and institutional information barriers.",
    keyInsight:
      "The essay asks whether voice interfaces could reduce the effort of recording information at its source.",
    position: [2.7, 1.8, -0.5],
  },
  {
    id: "all-about-chatgpt",
    title: "All About ChatGPT: Flat Correlation, Unit Economics & Alignment",
    date: "2023-02",
    source: "Blog",
    url: "https://domij.info/all-about-chatgpt.html",
    localUrl: "/articles/blog/all-about-chatgpt.html",
    localMarkdownUrl: "/articles/blog/all-about-chatgpt.md",
    pillar: "ai-and-society",
    secondaryPillars: ["collective-intelligence", "human-ai-collaboration"],
    summary:
      "A 2023 essay on language models, search economics, symbolic computation and the limitations of feedback used for alignment.",
    keyInsight:
      "The essay asks how statistical prediction relates to reasoning, and who should participate in decisions about model behaviour.",
    position: [-0.6, -0.4, 3.0],
    featured: true,
  },
  {
    id: "free-market-possibility-universe",
    title: "Free Market in a Possibility Universe & The Collaborative Manifesto",
    date: "2019-09",
    source: "Blog",
    url: "https://domij.info/free-market-in-a-possibility-universe.html",
    localUrl: "/articles/blog/free-market-in-a-possibility-universe.html",
    localMarkdownUrl: "/articles/blog/free-market-in-a-possibility-universe.md",
    pillar: "collective-intelligence",
    secondaryPillars: ["complex-adaptive-systems", "organizational-intelligence"],
    summary:
      "Explores information asymmetry, resource coordination and proposals for liquid democracy.",
    keyInsight:
      "The proposal considers how individual ownership and collective decision-making might be reconciled.",
    position: [0.8, 2.9, -0.6],
  },
  {
    id: "future-of-advertising-demand-profiling",
    title: "The Future of Advertising: Moving Beyond Relevance to Demand Profiling and Dynamic Personalization",
    date: "2024-10",
    source: "Medium",
    url: "https://medium.com/@domijin/the-future-of-advertising-moving-beyond-relevance-to-demand-profiling-and-dynamic-personalization-5f4ccc03697c",
    localUrl: "/articles/medium/the-future-of-advertising-moving-beyond-relevance-to-demand-profiling-and-dynamic-personalization-5f4ccc03697c.html",
    localMarkdownUrl: "/articles/medium/the-future-of-advertising-moving-beyond-relevance-to-demand-profiling-and-dynamic-personalization-5f4ccc03697c.md",
    pillar: "decision-intelligence",
    secondaryPillars: ["human-ai-collaboration", "complex-adaptive-systems"],
    summary:
      "Examines how advertising systems can move from static demographic targeting to dynamic demand profiling and explicit user preference loops.",
    keyInsight:
      "Treating every interaction as a data point in an ongoing narrative lets the ad experience move from branding toward use-case specificity as a user’s demand clarifies.",
    position: [-2.4, -1.4, 0.9],
  },
  {
    id: "building-context-for-reading",
    title: "Building the Context for Reading Expectations",
    date: "2024-11",
    source: "Substack",
    url: "https://domijin.substack.com/p/building-the-context-for-reading",
    localUrl: "/articles/substack/building-the-context-for-reading.html",
    localMarkdownUrl: "/articles/substack/building-the-context-for-reading.md",
    pillar: "human-potential",
    secondaryPillars: ["human-ai-collaboration", "collective-intelligence"],
    summary:
      "Notes on how shared reading context, explicit expectations and active reflection improve comprehension across languages and disciplines.",
    keyInsight:
      "Reading is a dialogue between the author’s constraints and the reader’s active questions.",
    position: [-2.1, 1.3, 1.5],
  },
  {
    id: "hello-world-substack",
    title: "Hello World! Reflections on Intellectual Honesty and Collective Effort",
    date: "2024-11",
    source: "Substack",
    url: "https://domijin.substack.com/p/hello-world",
    localUrl: "/articles/substack/hello-world.html",
    localMarkdownUrl: "/articles/substack/hello-world.md",
    pillar: "collective-intelligence",
    secondaryPillars: ["human-potential", "ai-and-society"],
    summary:
      "Opening essay on writing transparently, learning from practical execution and empowering collaborative solutions to social challenges.",
    keyInsight:
      "Ideas are inexpensive; durable insight comes from testing ideas in practice and reflecting honestly on what happened.",
    position: [-0.3, 2.8, 1.1],
  },
  {
    id: "momentum-momentum-momentum",
    title: "Momentum, Momentum, Momentum!",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/momentum-momentum-momentum",
    localUrl: "/articles/substack/momentum-momentum-momentum.html",
    localMarkdownUrl: "/articles/substack/momentum-momentum-momentum.md",
    pillar: "organizational-intelligence",
    secondaryPillars: ["human-potential", "decision-intelligence"],
    summary:
      "Reflections on sustaining execution cadence, small compounding wins and community discovery during early venture building.",
    keyInsight:
      "Consistent rhythm and honest feedback loops matter more than sporadic bursts of intensity.",
    position: [1.9, -1.8, -0.8],
  },
  {
    id: "libertyearth-and-future-spec",
    title: "LibertyEarth & The Future Project: Civic & Cooperative Architecture",
    date: "2025-01",
    source: "GitHub",
    url: "https://github.com/domijin/LibertyEarth",
    localUrl: "/articles/github/libertyearth-and-future.html",
    localMarkdownUrl: "/articles/github/libertyearth-and-future.md",
    pillar: "collective-intelligence",
    secondaryPillars: ["organizational-intelligence", "ai-and-society"],
    summary:
      "Long-horizon notes and specifications on collaborative knowledge graphs, liquid democracy and resource coordination.",
    keyInsight:
      "Explores how transparent governance protocols and shared knowledge bases can support voluntary cooperation.",
    position: [0.5, 2.6, -1.2],
  },
  {
    id: "boeing-vs-spacex-challenge",
    title: "Boeing’s Future at Stake: The Growing Challenge from SpaceX",
    date: "2024-05",
    source: "Medium",
    url: "https://medium.com/@domijin/boeings-future-at-stake-the-growing-challenge-from-spacex-177b63b10882",
    localUrl: "/articles/medium/boeings-future-at-stake-the-growing-challenge-from-spacex-177b63b10882.html",
    localMarkdownUrl: "/articles/medium/boeings-future-at-stake-the-growing-challenge-from-spacex-177b63b10882.md",
    pillar: "organizational-intelligence",
    secondaryPillars: ["complex-adaptive-systems", "decision-intelligence"],
    summary:
      "Compares iterative hardware-software integration at SpaceX with legacy aerospace contracting and governance incentives at Boeing.",
    keyInsight:
      "When institutional incentives drift from engineering first principles toward short-term financial optics, technical reliability erodes.",
    position: [2.3, -1.4, 0.7],
  },
  {
    id: "evtol-dilemma-cultural-difference",
    title: "Observation: The Dilemma and Cultural Difference Behind the eVTOL Field",
    date: "2024-06",
    source: "Medium",
    url: "https://medium.com/@domijin/observation-the-dilemma-and-cultural-difference-behind-the-evtol-field-df42e91af109",
    localUrl: "/articles/medium/observation-the-dilemma-and-cultural-difference-behind-the-evtol-field-df42e91af109.html",
    localMarkdownUrl: "/articles/medium/observation-the-dilemma-and-cultural-difference-behind-the-evtol-field-df42e91af109.md",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["organizational-intelligence", "ai-and-society"],
    summary:
      "Analyses airworthiness certification, battery energy density constraints and regulatory differences across US and Chinese eVTOL ecosystems.",
    keyInsight:
      "Emerging transport technologies succeed when regulatory sandboxes match physical engineering constraints.",
    position: [-1.4, -2.5, 1.4],
  },
  {
    id: "why-tiktok-is-so-popular",
    title: "Why TikTok Is So Popular: Algorithmic Feedback & Attention Loops",
    date: "2020-02",
    source: "Medium",
    url: "https://medium.com/@domijin/why-tiktok-is-so-popular-6fcc7b678bc7",
    localUrl: "/articles/medium/why-tiktok-is-so-popular-6fcc7b678bc7.html",
    localMarkdownUrl: "/articles/medium/why-tiktok-is-so-popular-6fcc7b678bc7.md",
    pillar: "ai-and-society",
    secondaryPillars: ["decision-intelligence", "complex-adaptive-systems"],
    summary:
      "An early look at how low-friction creation tools and rapid interest-graph feedback loops reshaped short-form media consumption.",
    keyInsight:
      "Tightening the feedback loop between viewer behaviour and content distribution amplifies engagement but raises questions about deliberate human attention.",
    position: [0.4, -0.8, 2.8],
  },
  {
    id: "astrophysics-bbh-research",
    title: "Gravitational Waves from Binary Black Holes in Globular Clusters & Open Research",
    date: "2018-07",
    source: "Research",
    url: "https://domij.info/pages/research.html",
    localUrl: "/articles/research/astrophysics-bbh-dissertation.html",
    localMarkdownUrl: "/articles/research/astrophysics-bbh-dissertation.md",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["decision-intelligence", "collective-intelligence"],
    summary:
      "Doctoral work on 662,772 globular clusters and 17.88M binary black holes within 30 Mpc, deriving a lower-bound merger rate of 587 Gpc⁻³ yr⁻¹ and 17 LISA standard sirens.",
    keyInsight:
      "Numerical simulation, statistical analysis and reproducible workflows provided the methodological basis for my later work.",
    position: [0.1, -3.2, 0.3],
    featured: true,
  },
];
