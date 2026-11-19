import { BOOK_ESSAYS_BY_URL } from "@/data/bookContentData";

export type ReaderPathId = "back-an-idea" | "build-together" | "learn-and-teach";

export interface CuratedEssay {
  url: string;
  title: string;
  date: string;
  venue: string;
  status: string;
}

export interface ReaderPathStep { url: string; label: string; reason: string; }

export interface ReaderPathSpec {
  id: ReaderPathId;
  label: string;
  summary: string;
  steps: [ReaderPathStep, ReaderPathStep];
  companionLink?: { url: string; label: string };
}

export interface ResolvedRecommendation {
  mode: "explicit" | "essay";
  basisLabel: string;
  recommended: CuratedEssay;
  connection: string;
  companionLink?: { url: string; label: string };
}

export function withBasePath(href: string, basePath: string): string {
  if (!href || /^(https?:\/\/|#|mailto:)/.test(href) || href.startsWith("/articles/")) return href;
  const base = basePath.replace(/\/+$/, "");
  if (!base) return href.startsWith("/") ? href : `/${href}`;
  if (href === "/") return `${base}/`;
  return href.startsWith("/") ? `${base}${href}` : `${base}/${href}`;
}

export function stripBasePath(url: string, basePath: string): string {
  const base = basePath.replace(/\/+$/, "");
  return base && url.startsWith(`${base}/`) ? url.slice(base.length) : url;
}

const VENTURE_URL = "/articles/substack/starting-a-new-venture.html";
const TESLA_URL = "/articles/substack/tesla-seniors-love-your-self-drivingnow.html";
const BABY_AI_URL = "/articles/github/baby-ai.html";
const OPEN_LEARNING_URL = "/articles/blog/open-learning.html";
const OPEN_LEARNING_LAB_URL = "/articles/github/open-learning-lab.html";
const SHARED_KNOWLEDGE = { url: "/shared-knowledge/", label: "Two people, a wider horizon (interactive essay)" };

const CURATED_STATUS: Record<string, string> = {
  [VENTURE_URL]: "Published essay",
  [TESLA_URL]: "Published field notes",
  [BABY_AI_URL]: "Open technical specification",
  [OPEN_LEARNING_URL]: "Working draft",
  [OPEN_LEARNING_LAB_URL]: "Open design & study protocol",
};

export function getCuratedEssay(url: string): CuratedEssay | null {
  const status = CURATED_STATUS[url];
  const entry = BOOK_ESSAYS_BY_URL[url];
  if (!status || !entry) return null;
  return { url: entry.url, title: entry.title, date: entry.date, venue: entry.venue, status };
}

export const READER_PATHS: ReaderPathSpec[] = [
  {
    id: "back-an-idea",
    label: "Back an idea",
    summary: "Start with a founder’s account of the need, then examine the work behind it.",
    steps: [
      { url: VENTURE_URL, label: "1 · Founder’s account", reason: "How a conversation with a neighbour led me to start Kin Domi for older adults." },
      { url: TESLA_URL, label: "2 · Field notes", reason: "What older drivers told me about using self-driving, and the changes I proposed after listening to them." },
    ],
  },
  {
    id: "build-together",
    label: "Build together",
    summary: "How much control does someone have over a tool they depend on?",
    steps: [
      { url: BABY_AI_URL, label: "1 · Technical specification", reason: "A design for a household agent that learns through conversation. What should it be allowed to remember or do on its own?" },
      { url: TESLA_URL, label: "2 · Field notes", reason: "Notes from older drivers on how sudden alerts and touchscreens get in the way, and why calmer feedback and voice control matter." },
    ],
  },
  {
    id: "learn-and-teach",
    label: "Learn and teach",
    summary: "What can I still do for myself after I close the chat?",
    steps: [
      { url: OPEN_LEARNING_URL, label: "1 · Working draft", reason: "A working hypothesis on following curiosity to the frontier, with four proposed capability courses yet to be tested." },
      { url: OPEN_LEARNING_LAB_URL, label: "2 · Study protocol", reason: "An earlier protocol for testing whether making a design decision myself helps me remember how to make the next one." },
    ],
    companionLink: SHARED_KNOWLEDGE,
  },
];

const CURATED_BRIDGE: Record<string, string> = {
  [`${VENTURE_URL}->${TESLA_URL}`]: "After writing about why I started Kin Domi, I wrote about what older drivers told me and what I thought could change.",
  [`${TESLA_URL}->${VENTURE_URL}`]: "For the background behind Kin Domi, this earlier note records the neighbour conversation that started the work.",
  [`${BABY_AI_URL}->${TESLA_URL}`]: "Both pieces ask how calm, voice-first interfaces and clear safety boundaries can help people stay in control—seen here in feedback from older drivers.",
  [`${TESLA_URL}->${BABY_AI_URL}`]: "The same question comes up at home. When I give an agent a spoken instruction, how can I check what it understood?",
  [`${OPEN_LEARNING_URL}->${OPEN_LEARNING_LAB_URL}`]: "In an earlier study protocol, I set out a way to test what someone can still do after a tutoring session.",
  [`${OPEN_LEARNING_LAB_URL}->${OPEN_LEARNING_URL}`]: "This later working draft asks what a learner might choose to investigate once they can work independently.",
};

export function resolvePathRecommendation({
  selectedPathId,
  currentEssayUrl,
  engagedEssayUrls,
}: {
  selectedPathId: ReaderPathId | null;
  currentEssayUrl: string | null;
  engagedEssayUrls: string[];
}): ResolvedRecommendation | null {
  const anchorUrl = currentEssayUrl ?? (engagedEssayUrls.length > 0 ? engagedEssayUrls[engagedEssayUrls.length - 1] : null);

  if (selectedPathId) {
    const path = READER_PATHS.find((p) => p.id === selectedPathId);
    if (!path) return null;
    const onPath = anchorUrl ? path.steps.find((s) => s.url === anchorUrl) : undefined;
    const step = onPath
      ? path.steps.find((s) => s.url !== anchorUrl) ?? path.steps[0]
      : path.steps.find((s) => s.url !== currentEssayUrl && !engagedEssayUrls.includes(s.url)) ??
        path.steps.find((s) => s.url !== currentEssayUrl) ?? path.steps[0];
    const recommended = getCuratedEssay(step.url);
    if (!recommended) return null;
    return {
      mode: "explicit",
      basisLabel: `Selected path: ${path.label}`,
      recommended,
      connection: (anchorUrl && CURATED_BRIDGE[`${anchorUrl}->${step.url}`]) || step.reason,
      companionLink: path.companionLink,
    };
  }

  if (!anchorUrl) return null;
  const anchor = getCuratedEssay(anchorUrl);
  if (!anchor) return null;

  let nextUrl: string | null = null;
  if (anchorUrl === VENTURE_URL || anchorUrl === BABY_AI_URL) nextUrl = TESLA_URL;
  else if (anchorUrl === OPEN_LEARNING_URL) nextUrl = OPEN_LEARNING_LAB_URL;
  else if (anchorUrl === OPEN_LEARNING_LAB_URL) nextUrl = OPEN_LEARNING_URL;
  else if (anchorUrl === TESLA_URL) {
    nextUrl = engagedEssayUrls.includes(VENTURE_URL) && !engagedEssayUrls.includes(BABY_AI_URL) ? BABY_AI_URL : VENTURE_URL;
  }

  const recommended = nextUrl ? getCuratedEssay(nextUrl) : null;
  if (!recommended || recommended.url === anchorUrl) return null;
  const isLearning = anchorUrl === OPEN_LEARNING_URL || anchorUrl === OPEN_LEARNING_LAB_URL;
  return {
    mode: "essay",
    basisLabel: `Related to “${anchor.title}”`,
    recommended,
    connection: CURATED_BRIDGE[`${anchorUrl}->${recommended.url}`] ?? "",
    companionLink: isLearning ? SHARED_KNOWLEDGE : undefined,
  };
}
