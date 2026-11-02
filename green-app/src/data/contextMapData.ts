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
  repoUrl?: string;
  pillar: string;
  description: string;
  verificationArtifact: string;
  metrics: string[];
}

export const PERSONA_DATA = {
  name: "Domi Jin",
  legalName: "Dongming Jin",
  roles: ["Scientist.", "Builder.", "Founder."],
  tagline: "A sci-fi mind. An engineer’s hands.",
  mission:
    "Exploring how technology can expand human potential and empower people to achieve more together.",
  centralQuestion:
    "How can we use technology to help individuals become more capable and enable people to collaborate more effectively?",
  background: [
    {
      id: "science",
      stage: "01 // Fundamental Science",
      title: "Computational Astrophysics & Multi-Body Dynamics",
      period: "Ph.D. Physics (2013–2018) · LSST Data Science Fellow",
      narrative:
        "My journey began with fundamental science, studying the universe through computational astrophysics, numerical simulations, and statistical modeling.",
      proofPoints: [
        "3,140 supercomputer numerical simulations (>100 TB, 25k node-hours on TACC) modeling 1-million-body globular clusters.",
        "Combined O(N³) N-body and O(N log N) Monte Carlo methods to extract 17M × 14 binary black hole evolutions and gravitational wave detection prospects for space-borne detectors (LISA).",
        "LSST Data Science Fellowship Program (Caltech, UW, JHU, Northwestern, Arizona, Pitt): statistical modeling, image processing, and reproducible open research workflows."
      ]
    },
    {
      id: "applied-ml",
      stage: "02 // Applied Machine Learning",
      title: "Decision Systems at Consumer, Marketplace & Ad-Tech Scale",
      period: "Applied ML & Decision Intelligence (2018–2024)",
      narrative:
        "I subsequently moved into applied machine learning, building decision systems for consumer products, marketplaces, and advertising technology.",
      proofPoints: [
        "Consumer Products: Extracted real-time behavioral and contextual representations from high-frequency mobility telemetry to power personalized recommendation engines.",
        "Two-Sided Marketplaces: Designed algorithmic pricing strategies, generative AI request workflows, and structured knowledge-bridging systems to improve marketplace liquidity and trust.",
        "Advertising Technology: Led research-science product analytics, deep-learning model evaluation, causal attribution, and multi-agent control plane architecture for sub-50ms real-time bidding."
      ]
    },
    {
      id: "entrepreneurship",
      stage: "03 // Entrepreneurship & Human-Centered AI",
      title: "Zero-to-One Systems, Edge Agents & Collective Agency",
      period: "Founder & Open-Protocol Builder (2018–Present)",
      narrative:
        "Entrepreneurship brought a different perspective: understanding what people actually need, how they make decisions, and why technically promising solutions sometimes fail in the real world.",
      proofPoints: [
        "Founder of Kin Domi, Inc.: Field-first human-centered AI and community systems empowering senior independence, dignity, and intergenerational wisdom.",
        "Creator of Open Learning Lab & baby-AI: Preregistered, receipt-verified open research protocols for durable human learning and privacy-preserving edge household agents.",
        "Author of Domi’s Mind Waves (Substack) & technical essays synthesizing scaling laws, organizational alignment (GCD/LCM), and human-AI collaboration."
      ]
    }
  ],
  philosophy: [
    {
      title: "Collaboration & Complementary Agency",
      body: "I believe humanity’s greatest achievements emerge through collaboration. Intelligence matters, but so do communication, trust, complementary capabilities, incentives, and the freedom to make meaningful choices."
    },
    {
      title: "Technology as a Means, Not an End",
      body: "Technology is a means rather than an end. Its value should ultimately be measured by how it improves people’s opportunities, autonomy, relationships, and quality of life."
    },
    {
      title: "Scientific Curiosity × Practical Experimentation",
      body: "My approach combines scientific curiosity with practical experimentation: challenge assumptions, build working systems, measure outcomes, learn from failure, and revise our understanding."
    }
  ],
  epistemicDisclaimer:
    "These are continuing intellectual interests, not claims of completed research or established scientific findings.",
  lookingFor: {
    intro:
      "I enjoy working with intellectually curious people who combine ambitious questions with rigorous thinking and practical execution.",
    detail:
      "I’m particularly interested in connecting with researchers, AI teams, builders, and early-stage investors who value interdisciplinary thinking, experimentation, human-centered technology, and long-term impact.",
    tracks: [
      {
        audience: "Lead AI Teams & Research Labs",
        focus: "Human–AI Collaboration, Agentic Control Planes, Personal/Edge Memory, Evaluation Harnesses & Post-Training",
        valueProp: "First-principles physics rigor + high-scale production ML judgment + end-to-end builder velocity."
      },
      {
        audience: "Founder-Centric Investors & Visionaries",
        focus: "Long-Horizon Ventures, Human-Centered AI, Collective Intelligence & AgeTech/EdTech Infrastructure",
        valueProp: "Disciplined hypothesis testing, zero-to-one customer empathy, and receipt-backed technical execution."
      },
      {
        audience: "Interdisciplinary Researchers & Builders",
        focus: "Open Learning Lab, baby-AI Edge Specs, Complex Adaptive Systems & Organizational Design",
        valueProp: "Open-source protocols, falsifiable benchmarks, and transparent asynchronous collaboration."
      }
    ]
  }
};

export const INTELLECTUAL_PILLARS: IntellectualPillar[] = [
  {
    id: "collective-intelligence",
    title: "Collective Intelligence",
    shortTitle: "Collective Intel",
    question: "How do individual capabilities combine to produce collective outcomes?",
    color: "#38bdf8",
    position: [0, 2.3, 0],
    synthesis:
      "Bridging fixed biological I/O (~39 bits/sec) and exploding network complexity through shared knowledge graphs, open protocols, and high-trust social contracts."
  },
  {
    id: "human-ai-collaboration",
    title: "Human–AI Collaboration",
    shortTitle: "Human–AI Collab",
    question: "How can intelligent systems augment human judgment and agency?",
    color: "#818cf8",
    position: [2.1, 1.1, 0.7],
    synthesis:
      "Moving beyond generic chatbots toward ambient, privacy-preserving personal memory, low-bandwidth resilient harnesses (iMessage/voice), and receipt-verified edge agents."
  },
  {
    id: "organizational-intelligence",
    title: "Organizational Intelligence",
    shortTitle: "Org Intelligence",
    question: "How do communication, coordination, trust, and incentives shape collaboration?",
    color: "#c084fc",
    position: [1.8, -1.3, -0.6],
    synthesis:
      "Designing teams that maximize both their Greatest Common Divisor (shared values that reduce friction) and Least Common Multiple (complementary skills), putting incentives before expectations."
  },
  {
    id: "complex-adaptive-systems",
    title: "Complex Adaptive Systems",
    shortTitle: "Complex Systems",
    question: "How do interactions among individuals give rise to emergent social and organizational behavior?",
    color: "#f472b6",
    position: [0, -2.3, 0.8],
    synthesis:
      "Applying multi-body physics intuition—from 1M-star globular clusters to urban traffic probes and digital marketplaces—to understand emergence, scaling laws, and feedback loops."
  },
  {
    id: "decision-intelligence",
    title: "Decision Intelligence",
    shortTitle: "Decision Intel",
    question: "How can information, feedback, and experimentation improve decisions?",
    color: "#fb923c",
    position: [-1.9, -1.2, -0.5],
    synthesis:
      "Combining causal inference, multi-stage latent demand mining, structured A/B experimentation, and multi-agent control planes to optimize long-term value over short-term clicks."
  },
  {
    id: "human-potential",
    title: "Human Potential",
    shortTitle: "Human Potential",
    question: "How can technology make learning, opportunity, and meaningful participation more accessible?",
    color: "#34d399",
    position: [-2.1, 1.1, 0.6],
    synthesis:
      "Validating learning policies that produce durable, transferable capability outside the tutoring session, and embracing gameful agency across every stage of life."
  },
  {
    id: "ai-and-society",
    title: "AI and Society",
    shortTitle: "AI & Society",
    question: "How might increasingly capable intelligence change the ways we work, cooperate, and live?",
    color: "#facc15",
    position: [0.2, 0.1, 2.2],
    synthesis:
      "Steering technical progress away from surveillance/inception capitalism toward human autonomy, accessible safety (from senior mobility to public alignment), and creative abundance."
  }
];

export const OPEN_PROJECTS: OpenProject[] = [
  {
    id: "open-learning-lab",
    name: "Open Learning Lab",
    tagline: "Learn something real. Measure whether it lasts.",
    category: "Research Protocol · EdTech & LLM Policies",
    url: "https://github.com/domijin/open-learning-lab",
    repoUrl: "https://github.com/domijin/open-learning-lab",
    pillar: "human-potential",
    description:
      "An open experiment and append-only research ledger testing which LLM-mediated learning policies maximize durable, transferable capability per unit of learner effort outside the tutoring session.",
    verificationArtifact: "goal → hypothesis → experiment → observation/evidence → finding → decision",
    metrics: ["Active Study: Marin Project", "Delayed Retrieval & Transfer", "MIT + CC BY 4.0"]
  },
  {
    id: "baby-ai",
    name: "baby-AI",
    tagline: "Edge-deployed, verbally-trainable household agent backed by signed receipts.",
    category: "Edge AI Architecture · Verifiable Evaluation",
    url: "https://github.com/domijin/baby-AI",
    repoUrl: "https://github.com/domijin/baby-AI",
    pillar: "human-ai-collaboration",
    description:
      "Five composable subsystem specs (smart-moment perception, streaming ASR + DoA fusion, hybrid episodic-vector + KG memory, edge VLM verbal-feedback adapter, cryptographic receipt contract) running on <$200 hardware.",
    verificationArtifact: "SSH-signed JSON evaluation receipts on content-addressed SHA-256 benchmarks",
    metrics: ["<$200 BOM (Pi 5 + Hailo-8L)", "5 Falsifiable Specs", "Zero Off-Device Data Leak"]
  },
  {
    id: "imessage-router",
    name: "Life Hack: iMessage AI Router",
    tagline: "A low-bandwidth HCI harness for querying agents when normal internet is constrained.",
    category: "HCI Harness · Resilient Agent Interface",
    url: "https://domij.info/beta/",
    pillar: "human-ai-collaboration",
    description:
      "Treats the everyday messaging pipe as an asynchronous, interruptible command line for internet-connected reasoning agents—surviving on airplane Wi-Fi, satellite text, and constrained mobile links.",
    verificationArtifact: "Live bilingual (EN/ZH) invite-only field beta on domij.info/beta/",
    metrics: ["Plane & Satellite Edge Cases", "Bandwidth Transformer", "Live Field Demo"]
  },
  {
    id: "kin-domi",
    name: "Kin Domi, Inc.",
    tagline: "Human-centered AI and community systems for senior independence and dignity.",
    category: "Venture · Human-Centered AI & AgeTech",
    url: "https://kindomi.net/",
    repoUrl: "https://github.com/domijin/kindomi.net",
    pillar: "ai-and-society",
    description:
      "Building trusted AI companions, accessibility workflows, and community hubs in Palo Alto that help older adults navigate modern technology, autonomous mobility, and lifelong learning.",
    verificationArtifact: "Incorporated Dec 2024 · Moon Creative Lab & Beta University · WRMSDC Certified",
    metrics: ["Palo Alto Field Research", "Voice-First Accessibility", "Intergenerational Trust"]
  },
  {
    id: "agent-ad-systems",
    name: "Agentic Control Planes & Ad-Tech Economics",
    tagline: "Decoupling sub-50ms inference fast paths from multi-agent optimization.",
    category: "Decision Systems · Systems Architecture",
    url: "https://github.com/domijin/observations_in_advertising",
    repoUrl: "https://github.com/domijin/observations_in_advertising",
    pillar: "decision-intelligence",
    description:
      "Technical specification and economic analysis of scaling laws in performance advertising, introducing an 8-agent asynchronous control plane (Campaign, Creative, Pacing, Bidding, Supply, Retention, Safety, Experimentation).",
    verificationArtifact: "Full system architecture spec + GrowthBook A/B experimentation MVP",
    metrics: ["<50ms p99 Fast Path", "8 Specialized Control Agents", "Demand Mining & Causal Lift"]
  },
  {
    id: "libertyearth-future",
    name: "LibertyEarth & The Future Project",
    tagline: "Open-source living archives for collaborative governance and optimistic futures.",
    category: "Collective Intelligence · Systems Philosophy",
    url: "https://github.com/domijin/LibertyEarth",
    repoUrl: "https://github.com/domijin/future",
    pillar: "collective-intelligence",
    description:
      "Long-horizon explorations into social contracts, liquid democracy, decentralized credibility, on-demand local manufacturing, and transforming raw product ideas into minimum valuable strategies.",
    verificationArtifact: "Public manifesto, execution protocols, and HackerTube curated RSS feeds",
    metrics: ["Open Governance Specs", "Living Strategy Archive", "260+ Curated Tech Talks"]
  }
];

export const WRITINGS_DATA: WritingNode[] = [
  {
    id: "open-learning-lab-protocol",
    title: "Open Learning Lab: Evidence-Driven Personalized Learning Policies",
    date: "2026-08",
    source: "GitHub",
    url: "https://github.com/domijin/open-learning-lab",
    pillar: "human-potential",
    secondaryPillars: ["human-ai-collaboration", "decision-intelligence"],
    summary:
      "An open research ledger testing which LLM-mediated learning policies produce durable, transferable capability per unit of learner effort outside the tutoring session.",
    keyInsight:
      "Asking a learner to make the underlying design judgment before revealing how an expert system solved the problem improves reconstruction and transfer compared with explanation-first tutoring.",
    position: [-2.8, 1.7, 1.1],
    featured: true
  },
  {
    id: "baby-ai-edge-specs",
    title: "baby-AI: Receipt-Verified Edge Household Agent Architecture",
    date: "2026-05",
    source: "GitHub",
    url: "https://github.com/domijin/baby-AI",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["decision-intelligence", "ai-and-society"],
    summary:
      "Five falsifiable subsystem specs (perception, streaming ASR + DoA, hybrid episodic-vector + KG memory, edge VLM verbal-feedback adapter, cryptographic eval receipts) on <$200 hardware.",
    keyInsight:
      "Code is the means; cryptographically signed evaluation receipts on named benchmarks are the trust contract—enabling privacy-preserving personal AI that learns verbally on-device.",
    position: [2.9, 1.6, 1.2],
    featured: true
  },
  {
    id: "imessage-ai-router",
    title: "Life Hack: iMessage as a Low-Bandwidth Router to the Internet",
    date: "2026-04",
    source: "Blog",
    url: "https://domij.info/beta/",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["human-potential"],
    summary:
      "A minimalist HCI harness turning constrained messaging pipes (in-flight Wi-Fi, satellite text) into a universal command line for internet-connected reasoning agents.",
    keyInsight:
      "Before neural links, the most resilient interface for everyday agents is the asynchronous, interruptible messaging pipe already in your pocket.",
    position: [2.6, 0.6, 1.6],
    featured: true
  },
  {
    id: "reclaiming-play",
    title: "Reclaiming Play as a Life Skill",
    date: "2025-03",
    source: "Substack",
    url: "https://domijin.substack.com/p/reclaiming-play-as-a-life-skill",
    pillar: "human-potential",
    secondaryPillars: ["complex-adaptive-systems", "ai-and-society"],
    summary:
      "Examines Jane McGonigal's game mechanics (goals, rules, feedback systems, voluntary participation) through conversations with senior learners and retirees.",
    keyInsight:
      "Lifelong learning, health management, and technological exploration are high-order 'social games'—embracing clarity, feedback, and voluntary challenge keeps people in flow across every stage of life.",
    position: [-2.7, 0.5, 1.4],
    featured: true
  },
  {
    id: "tesla-seniors-safety",
    title: "Tesla, Seniors Love Your Self-Driving—Now Let’s Make It Safer for Them",
    date: "2025-02",
    source: "Substack",
    url: "https://domijin.substack.com/p/tesla-seniors-love-your-self-drivingnow",
    pillar: "ai-and-society",
    secondaryPillars: ["human-ai-collaboration", "decision-intelligence"],
    summary:
      "Field observations from Kin Domi showing how autonomous driving restores senior independence, paired with 6 concrete HCI and safety engineering recommendations.",
    keyInsight:
      "Panic-inducing alerts and touchscreen menus degrade safety for older drivers; delaying non-urgent alerts, adding pre-drive diagnostics, and prioritizing voice control directly bridge the human-AI trust gap.",
    position: [0.8, 0.7, 2.9],
    featured: true
  },
  {
    id: "overachievers-responsibility",
    title: "Overachiever’s Responsibility: Leadership, Alignment, and Sustainable Growth",
    date: "2025-02",
    source: "Substack",
    url: "https://domijin.substack.com/p/overachievers-responsibility-reflection",
    pillar: "organizational-intelligence",
    secondaryPillars: ["collective-intelligence"],
    summary:
      "A mathematical and operational reflection on how founders can build enduring teams without operational burnout.",
    keyInsight:
      "High-performing teams maximize both their Greatest Common Divisor (shared values that minimize communication friction) and Least Common Multiple (complementary capabilities that expand collective reach), while putting incentives before expectations.",
    position: [2.6, -1.6, -1.1],
    featured: true
  },
  {
    id: "colorful-year-rhythm",
    title: "A Colorful Year Ahead: Milestones & Momentum from Intentional Rhythm",
    date: "2025-01",
    source: "Substack",
    url: "https://domijin.substack.com/p/a-colorful-year-ahead",
    pillar: "organizational-intelligence",
    secondaryPillars: ["decision-intelligence"],
    summary:
      "Open-sources an 8th-iteration operational work model combining shared calendar transparency, fractional asynchronous collaboration, and structured weekly reflection.",
    keyInsight:
      "Sharing calendars for inclusion and enabling fractional, asynchronous contributions reduces coordination overhead while respecting natural human rhythms.",
    position: [2.1, -2.1, -0.2]
  },
  {
    id: "agent-based-ad-tech-spec",
    title: "Agent-Based Advertising System & Observations in Performance Advertising",
    date: "2025-01",
    source: "GitHub",
    url: "https://github.com/domijin/observations_in_advertising",
    pillar: "decision-intelligence",
    secondaryPillars: ["complex-adaptive-systems", "ai-and-society"],
    summary:
      "Technical specification for an 8-agent control plane operating alongside a sub-50ms p99 SOTA ad serving fast path, paired with an economic analysis of scaling laws in performance advertising.",
    keyInsight:
      "Decoupling the sub-50ms inference fast path from an asynchronous multi-agent control plane shifts digital decision systems from reactive clicks to long-term demand realization.",
    position: [-2.6, -1.8, -1.0],
    featured: true
  },
  {
    id: "serendipity-and-highlands",
    title: "Serendipity: Where It Sparks & Dedication: Where It Is Channeled",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/serendipity-where-it-sparks",
    pillar: "collective-intelligence",
    secondaryPillars: ["human-potential"],
    summary:
      "Personal synthesis of how astrophysics timescales, Confucian ethics, and interdisciplinary exploration connect disparate domain peaks into a unified highland.",
    keyInsight:
      "Standing on the shoulders of giants is not enough; connecting the peaks across physics, machine learning, and human-computer interaction builds an intellectual highland from which new solutions emerge.",
    position: [-0.8, 3.0, 0.5],
    featured: true
  },
  {
    id: "starting-new-venture-kindomi",
    title: "Starting a New Venture & Momentum in Human-Centered Elder AI",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/starting-a-new-venture",
    pillar: "human-potential",
    secondaryPillars: ["ai-and-society", "organizational-intelligence"],
    summary:
      "Chronicles the zero-to-one customer discovery, ethical community outreach, and multidisciplinary team formation behind Kin Domi, Inc.",
    keyInsight:
      "Beneath technical barriers like smartphone dexterity lie deeper human needs for autonomy, dignity, and intergenerational connection—requiring field empathy before code.",
    position: [-3.0, 1.1, -0.3]
  },
  {
    id: "coach-seeking-reflection",
    title: "Reflections from a Coach-Seeking Impulse",
    date: "2024-12",
    source: "Substack",
    url: "https://domijin.substack.com/p/relections-from-coach-seeking-impulse",
    pillar: "human-potential",
    secondaryPillars: ["organizational-intelligence"],
    summary:
      "Examines the mechanics of coaching, intellectual honesty, and why shared context determines the effectiveness of feedback.",
    keyInsight:
      "Coaching is guided self-reflection; its effectiveness is bounded by intellectual honesty and the density of shared context between partners.",
    position: [-2.3, 1.9, -0.7]
  },
  {
    id: "third-ear-twinmind-ama",
    title: "Building Proactive Personal AI Memory (Third Ear / TwinMind AMA)",
    date: "2024-11",
    source: "Medium",
    url: "https://medium.com/@domijin/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["human-potential"],
    summary:
      "Architectural discussion on platform-agnostic personal AI memory combining edge voice processing, query-rewriting privacy, and visual browser context.",
    keyInsight:
      "Generic AI fails because it lacks personal context; hybrid edge-cloud memory with identifier stripping reduces API costs by 20x while preserving user privacy.",
    position: [3.1, 0.9, -0.4]
  },
  {
    id: "dark-mode-decision-workflow",
    title: "Is Dark Mode Doing More Harm Than Good? A Deeper Look at Our Choices",
    date: "2024-11",
    source: "Medium",
    url: "https://medium.com/@domijin/is-dark-mode-doing-more-harm-than-good-a-deeper-look-at-our-choices-a9685daad170",
    pillar: "decision-intelligence",
    secondaryPillars: ["ai-and-society", "organizational-intelligence"],
    summary:
      "Uses the visual ergonomics of dark mode as a case study to critique short-term agile feature shipping versus long-term user welfare.",
    keyInsight:
      "Agile iteration reduces launch risk but systematically underweights long-term externalities unless paired with first-principles research and adaptive user onboarding.",
    position: [-2.8, -0.9, -1.2]
  },
  {
    id: "applovin-hypergrowth-trace",
    title: "Trace of AppLovin’s 7x Annual Hypergrowth & The Growth Trap",
    date: "2024-11",
    source: "Medium",
    url: "https://medium.com/@domijin/trace-of-applovins-7x-annual-hypergrowth-39dcb154f5d0",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["decision-intelligence", "ai-and-society"],
    summary:
      "Dissects how cross-domain behavioral data, scaling laws, and latency tolerance drove hypergrowth in ad tech, and why surveillance capitalism hits diminishing returns.",
    keyInsight:
      "While scaling laws reward denser behavioral context, demand-driven markets inevitably face consumer fatigue and escalating social costs unless technology shifts toward user enlightenment.",
    position: [-0.9, -3.0, 1.1],
    featured: true
  },
  {
    id: "rethinking-digital-advertising",
    title: "Rethinking Digital Advertising: Demand Mining & Dynamic Personalization",
    date: "2024-10",
    source: "Medium",
    url: "https://domijin.medium.com/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced",
    pillar: "decision-intelligence",
    secondaryPillars: ["human-ai-collaboration"],
    summary:
      "Proposes replacing binary click optimization with multi-stage intent graphs, compact profile distillation, and user-controlled 'ad shuffling' UX.",
    keyInsight:
      "Giving users active agency (such as shuffling creatives in-slot) transforms passive impressions into high-signal preference feedback.",
    position: [-2.1, -1.9, 0.5]
  },
  {
    id: "traffic-lights-to-life-direction",
    title: "From Traffic Lights to Life’s Direction: Crowdsourced Inference & Symbolic AI",
    date: "2023-10",
    source: "Medium",
    url: "https://domijin.medium.com/from-traffic-lights-to-lifes-direction-57176d5d7a06",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["human-ai-collaboration", "decision-intelligence"],
    summary:
      "Reverse-engineers how navigation apps predict traffic light countdowns via crowdsourced probe trajectories rather than hardware sensors, alongside reflections from Wolfram Summer School.",
    keyInsight:
      "Emergent statistical inference over crowdsourced trajectories can replicate expensive physical infrastructure—while combining LLMs (memory) with symbolic computation (Wolfram) bridges correlation and causal reasoning.",
    position: [0.9, -2.9, 1.2],
    featured: true
  },
  {
    id: "illegible-handwriting-bandwidth",
    title: "Why Is Some Professional Handwriting Illegible? Information Bandwidth & HCI",
    date: "2023-10",
    source: "Medium",
    url: "https://medium.com/@domijin/why-is-some-professional-handwriting-illegible-d07bd8acb818",
    pillar: "human-ai-collaboration",
    secondaryPillars: ["organizational-intelligence"],
    summary:
      "First-principles exploration of medical documentation bottlenecks, human speech transmission rates (~39 bits/sec), and institutional information barriers.",
    keyInsight:
      "When human output bandwidth is constrained in high-stress environments, voice-first HCI and ambient capture solve the root bottleneck better than post-hoc OCR.",
    position: [2.7, 1.8, -0.5]
  },
  {
    id: "all-about-chatgpt",
    title: "All About ChatGPT: Flat Correlation, Unit Economics & Alignment",
    date: "2023-02",
    source: "Blog",
    url: "https://domij.info/all-about-chatgpt.html",
    pillar: "ai-and-society",
    secondaryPillars: ["collective-intelligence", "human-ai-collaboration"],
    summary:
      "Analyzes search engine margin disruption, feed-forward computational flatness vs. symbolic loops, RLHF selection bias, and collective knowledge graphs.",
    keyInsight:
      "Flat token correlation is the foundation of knowledge, not causality—and alignment is an ongoing organizational governance problem that cannot be solved behind closed doors.",
    position: [-0.6, -0.4, 3.0],
    featured: true
  },
  {
    id: "free-market-possibility-universe",
    title: "Free Market in a Possibility Universe & The Collaborative Manifesto",
    date: "2019-09",
    source: "Blog",
    url: "https://domij.info/free-market-in-a-possibility-universe.html",
    pillar: "collective-intelligence",
    secondaryPillars: ["complex-adaptive-systems", "organizational-intelligence"],
    summary:
      "Explores information asymmetry, resource coordination among autonomous agents, and liquid democracy in high-entropy social systems.",
    keyInsight:
      "Overcoming human biological limits in information I/O and processing requires new social contracts that align individual ownership with collective decision-making.",
    position: [0.8, 2.9, -0.6]
  },
  {
    id: "astrophysics-bbh-research",
    title: "Gravitational Waves from Binary Black Holes in Globular Clusters & Open Research",
    date: "2018-07",
    source: "Research",
    url: "https://domij.info/pages/research.html",
    pillar: "complex-adaptive-systems",
    secondaryPillars: ["decision-intelligence", "collective-intelligence"],
    summary:
      "Ph.D. dissertation modeling 1M-body globular clusters across 3,140 supercomputer simulations (100+ TB) and establishing reproducible Jupyter-based open science workflows.",
    keyInsight:
      "Simulating emergent multi-body dynamics from first principles—and making the entire computational pipeline reproducible—creates the methodological foundation for modeling complex human and AI systems.",
    position: [0.1, -3.2, 0.3],
    featured: true
  }
];
