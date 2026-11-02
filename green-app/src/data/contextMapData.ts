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
        "Numerical simulations of globular clusters using N-body and Monte Carlo methods.",
        "Analysis of binary black hole evolution and gravitational-wave detection prospects for LISA.",
        "LSST Data Science Fellowship: statistical modelling, image processing and reproducible research workflows."
      ]
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
        "Advertising analytics, model evaluation and causal attribution; published architecture notes on real-time bidding and multi-agent control."
      ]
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
        "Essays on learning, team coordination and human–AI collaboration in Domi’s Mind Waves and elsewhere."
      ]
    }
  ],
  philosophy: [
    {
      title: "Working together",
      body: "Good work depends on more than individual ability. Shared context, trust, complementary skills and sensible incentives matter, as does room for people to exercise their own judgement."
    },
    {
      title: "Usefulness",
      body: "I judge technology by what it helps people do: understand a problem, make a choice, learn a skill or spend their time better. Technical elegance is valuable when it serves that purpose."
    },
    {
      title: "Testing the idea",
      body: "I try to make assumptions explicit, build something that can be tested and pay attention to the result. Revising an explanation is part of the work."
    }
  ],
  epistemicDisclaimer:
    "These are ongoing questions. The linked work distinguishes observations, proposals and research findings.",
  correspondence: {
    intro:
      "If you are working on a related question, I would be glad to compare notes.",
    detail:
      "Questions, useful references and considered disagreements are welcome."
  }
};

export const INTELLECTUAL_PILLARS: IntellectualPillar[] = [
  {
    id: "collective-intelligence",
    title: "Collective Intelligence",
    shortTitle: "Collective Intel",
    question: "How do individual capabilities combine to produce collective outcomes?",
    color: "#1DAEDF", // Domi's signature cyan
    position: [0, 2.3, 0],
    synthesis:
      "I am interested in how shared knowledge, communication and trust help groups make use of what their members know."
  },
  {
    id: "human-ai-collaboration",
    title: "Human–AI Collaboration",
    shortTitle: "Human–AI Collab",
    question: "How can intelligent systems support human judgement and agency?",
    color: "#2980b9", // Pelican primary blue
    position: [2.1, 1.1, 0.7],
    synthesis:
      "Current projects explore personal memory, voice and messaging interfaces, and local processing, with attention to privacy and human judgement."
  },
  {
    id: "organizational-intelligence",
    title: "Organisational Intelligence",
    shortTitle: "Org Intelligence",
    question: "How do communication, coordination, trust, and incentives shape collaboration?",
    color: "#0284c7", // Sky blue
    position: [1.8, -1.3, -0.6],
    synthesis:
      "My writing considers shared values, complementary skills, incentives and the practical costs of coordination."
  },
  {
    id: "complex-adaptive-systems",
    title: "Complex Adaptive Systems",
    shortTitle: "Complex Systems",
    question: "How do interactions among individuals give rise to emergent social and organisational behaviour?",
    color: "#0369a1", // Deep ocean blue
    position: [0, -2.3, 0.8],
    synthesis:
      "Stellar dynamics, traffic and marketplaces raise related questions about interactions and feedback. I use these comparisons as starting points, with care about where the analogy stops."
  },
  {
    id: "decision-intelligence",
    title: "Decision Intelligence",
    shortTitle: "Decision Intel",
    question: "How can information, feedback, and experimentation improve decisions?",
    color: "#0ea5e9", // Bright azure
    position: [-1.9, -1.2, -0.5],
    synthesis:
      "Work on causal inference, experimentation and decision systems has made me interested in what we measure, and whether it reflects the outcome we care about."
  },
  {
    id: "human-potential",
    title: "Human Potential",
    shortTitle: "Human Potential",
    question: "How can technology make learning, opportunity, and meaningful participation more accessible?",
    color: "#0284c7", // Electric cyan-blue
    position: [-2.1, 1.1, 0.6],
    synthesis:
      "Open Learning Lab asks whether learning with AI leads to understanding that lasts and can be used independently. Other writing considers play and learning throughout life."
  },
  {
    id: "ai-and-society",
    title: "AI and Society",
    shortTitle: "AI & Society",
    question: "How might increasingly capable intelligence change the ways we work, cooperate, and live?",
    color: "#328cc7", // Pelican hover blue
    position: [0.2, 0.1, 2.2],
    synthesis:
      "Essays consider accessibility, autonomy and the incentives behind AI systems, including observations from work with older adults."
  }
];

export const OPEN_PROJECTS: OpenProject[] = [
  {
    id: "open-learning-lab",
    name: "Open Learning Lab",
    tagline: "Studying what people retain after learning with AI.",
    category: "Learning research",
    url: "https://github.com/domijin/open-learning-lab",
    repoUrl: "https://github.com/domijin/open-learning-lab",
    pillar: "human-potential",
    description:
      "An open research ledger comparing approaches to learning with language models. The focus is on what learners retain and can apply independently, relative to the effort involved.",
    verificationArtifact: "goal → hypothesis → experiment → observation/evidence → finding → decision",
    metrics: ["Delayed recall", "Transfer of learning", "Open research ledger"]
  },
  {
    id: "baby-ai",
    name: "baby-AI",
    tagline: "Specifications for a household agent that learns from spoken feedback.",
    category: "Local AI · Design specifications",
    url: "https://github.com/domijin/baby-AI",
    repoUrl: "https://github.com/domijin/baby-AI",
    pillar: "human-ai-collaboration",
    description:
      "Five subsystem specifications covering perception, speech recognition, memory, adaptation and evaluation. The design targets local hardware costing under $200, with signed evaluation records.",
    verificationArtifact: "Evaluation contract specifying SSH-signed JSON records and SHA-256 benchmark identifiers",
    metrics: ["Hardware target: <$200", "Five subsystem specifications", "On-device processing by design"]
  },
  {
    id: "imessage-router",
    name: "Life Hack: iMessage AI Router",
    tagline: "Access to AI tools through an ordinary message.",
    category: "Messaging interface · Beta",
    url: "https://domij.info/beta/",
    pillar: "human-ai-collaboration",
    description:
      "An experiment in using iMessage to reach internet-connected agents when normal browsing is limited. It explores how a familiar, asynchronous interface can work with constrained connections.",
    verificationArtifact: "English and Chinese beta pages with access details",
    metrics: ["iMessage interface", "Limited-connectivity use cases", "Field beta"]
  },
  {
    id: "kin-domi",
    name: "Kin Domi, Inc.",
    tagline: "Technology and community projects with older adults.",
    category: "Venture · Accessibility",
    url: "https://kindomi.net/",
    repoUrl: "https://github.com/domijin/kindomi.net",
    pillar: "ai-and-society",
    description:
      "Work on AI companions, accessible interfaces and community activities in Palo Alto, informed by older adults’ experiences of technology, mobility and learning.",
    verificationArtifact: "Incorporated Dec 2024 · Moon Creative Lab & Beta University · WRMSDC Certified",
    metrics: ["Palo Alto fieldwork", "Voice interfaces", "Community learning"]
  },
  {
    id: "agent-ad-systems",
    name: "Advertising decision systems",
    tagline: "Separating real-time inference from asynchronous optimisation.",
    category: "Systems architecture · Design notes",
    url: "https://github.com/domijin/observations_in_advertising",
    repoUrl: "https://github.com/domijin/observations_in_advertising",
    pillar: "decision-intelligence",
    description:
      "An architecture proposal for an eight-agent control plane alongside a latency-sensitive serving path. Accompanying notes consider advertising economics, experimentation and causal measurement.",
    verificationArtifact: "System architecture specification and GrowthBook experimentation prototype",
    metrics: ["Design target: <50ms p99", "Eight control agents", "Causal measurement"]
  },
  {
    id: "libertyearth-future",
    name: "LibertyEarth & The Future Project",
    tagline: "Notes on governance, cooperation and possible futures.",
    category: "Open writing · Governance",
    url: "https://github.com/domijin/LibertyEarth",
    repoUrl: "https://github.com/domijin/future",
    pillar: "collective-intelligence",
    description:
      "An evolving collection of proposals about social contracts, liquid democracy, local manufacturing and ways of turning ideas into practical experiments.",
    verificationArtifact: "Public essays, proposals and project notes",
    metrics: ["Governance proposals", "Project archive", "Open discussion"]
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
      "The study asks whether making a design judgement before seeing an expert solution improves later recall and transfer compared with explanation-first tutoring.",
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
      "Five subsystem specifications for perception, speech, memory, adaptation and evaluation, with a hardware cost target below $200.",
    keyInsight:
      "The design uses signed evaluation records to make claims about on-device learning and privacy inspectable.",
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
      "An experiment in using messaging to reach internet-connected agents over limited connections, including in-flight Wi-Fi and satellite text.",
    keyInsight:
      "Messaging offers a familiar, asynchronous interface for asking an agent to do something without keeping a browser session open.",
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
      "The essay considers what clear goals, feedback and voluntary participation can contribute to learning throughout life.",
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
      "Observations from work with older adults at Kin Domi, alongside six proposals for more accessible driving-assistance interfaces.",
    keyInsight:
      "The article proposes changes to alert timing, pre-drive checks and voice controls, based on difficulties observed with older users.",
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
      "A reflection on team alignment, complementary skills and sustainable working habits.",
    keyInsight:
      "The essay uses greatest common divisors and least common multiples as metaphors for shared values and complementary skills, and considers the role of incentives.",
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
      "Notes on the eighth revision of a working model built around shared calendars, asynchronous collaboration and weekly reflection.",
    keyInsight:
      "The working model explores whether shared calendars and asynchronous contributions can make coordination easier.",
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
      "An architecture proposal for an eight-agent control plane and an ad-serving path targeting latency below 50ms at p99, with notes on performance advertising economics.",
    keyInsight:
      "The proposal separates latency-sensitive inference from slower optimisation and experimentation in an asynchronous control plane.",
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
      "A personal reflection on connections between astrophysics, Confucian ethics and work across disciplines.",
    keyInsight:
      "The essay considers how ideas from physics, machine learning and human–computer interaction can inform one another.",
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
      "Notes on customer research, community outreach and forming the team behind Kin Domi, Inc.",
    keyInsight:
      "Conversations about difficulties with technology often led to broader questions about independence, dignity and relationships.",
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
      "The reflection considers how honesty and shared context affect the usefulness of coaching.",
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
      "An architectural discussion of personal AI memory, local voice processing, privacy in query rewriting and browser context.",
    keyInsight:
      "The discussion explores how local processing and selective use of cloud services might balance personal context, privacy and cost.",
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
      "The essay asks how product teams can account for longer-term effects alongside the immediate feedback from feature releases.",
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
      "An analysis of behavioural data, scaling and latency constraints in advertising, with questions about the costs of continued growth.",
    keyInsight:
      "The analysis asks where additional behavioural data stops adding useful value, and who bears the costs of the resulting systems.",
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
      "Proposes richer intent models, compact user profiles and interfaces that let users request different advertisements.",
    keyInsight:
      "Letting users request different advertisements is proposed as a way to collect more deliberate preference feedback.",
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
      "Explores how traffic-light timing might be inferred from crowdsourced trajectories, alongside reflections from Wolfram Summer School.",
    keyInsight:
      "The piece considers what can be inferred from movement data, and where symbolic computation might complement language models.",
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
      "An exploration of documentation bottlenecks, the bandwidth of speech and writing, and institutional information barriers.",
    keyInsight:
      "The essay asks whether voice interfaces could reduce the effort of recording information at its source.",
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
      "A 2023 essay on language models, search economics, symbolic computation and the limitations of feedback used for alignment.",
    keyInsight:
      "The essay asks how statistical prediction relates to reasoning, and who should participate in decisions about model behaviour.",
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
      "Explores information asymmetry, resource coordination and proposals for liquid democracy.",
    keyInsight:
      "The proposal considers how individual ownership and collective decision-making might be reconciled.",
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
      "Doctoral work on globular clusters and binary black holes, alongside notes on reproducible computational research.",
    keyInsight:
      "Numerical simulation, statistical analysis and reproducible workflows provided the methodological basis for my later work.",
    position: [0.1, -3.2, 0.3],
    featured: true
  }
];
