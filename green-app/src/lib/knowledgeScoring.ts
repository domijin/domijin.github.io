import { NODE_EMBEDDINGS } from "@/data/nodeEmbeddings";
import NODES_JSON from "@/data/knowledgeNodes.json";

export interface KnowledgeNode {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  x: number;
  y: number;
  deep?: boolean;
}

export const NODES = NODES_JSON as KnowledgeNode[];

export interface NodeScore {
  id: string;
  label: string;
  /** 0..1 — how much this node lights up. */
  weight: number;
  /** The model's own cosine similarity, 0 when no model is loaded. */
  semantic: number;
  /** 0..1 — how many of the node's own words the prompt used. */
  lexical: number;
}

const STOPWORDS = new Set([
  "the", "and", "for", "with", "this", "that", "are", "was", "you", "your", "can", "does", "did",
  "not", "but", "from", "have", "has", "how", "what", "when", "why", "who", "will", "would",
  "there", "their", "them", "then", "than", "they", "into", "about", "over", "under", "each",
  "some", "such", "only", "also", "just", "like", "any", "all", "one", "two", "its", "our",
]);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) ?? []).filter(
    (t) => t.length >= 2 && !STOPWORDS.has(t)
  );
}

/**
 * Light stemming. "certify" and "certification" are the same idea; without
 * this the keyword half of the score misses them and the embedding half
 * decides alone, which is not always right.
 */
function stems(text: string): string[] {
  return tokenize(text).map((t) =>
    t.replace(/(ations|ation|ising|izing|ing|ed|es|s|y)$/, (m) => (t.length - m.length >= 4 ? "" : m))
  );
}

/** True when two words are the same word, allowing for inflection. */
function sameWord(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 5 && long.startsWith(short);
}

function cosine(a: ArrayLike<number>, b: number[]): number {
  let sum = 0;
  for (let i = 0; i < b.length; i++) sum += a[i] * b[i];
  return sum; // both vectors are already L2-normalised
}

/**
 * Score every node against a prompt.
 *
 * Two signals, blended:
 *
 *   semantic — the cosine similarity between the prompt's embedding and the
 *              node's precomputed embedding. This is the model's own opinion,
 *              and it is the one that catches a prompt that never used the
 *              node's vocabulary.
 *   lexical  — how many of the node's own words the prompt used. Cheaper and
 *              blunter, but it is what catches an exact term the embedding
 *              model ranked below something else.
 *
 * The keyword matcher alone always works; the embedding only ever re-ranks.
 */
export function scoreNodes(prompt: string, embedding?: ArrayLike<number> | null): NodeScore[] {
  const promptStems = stems(prompt);
  const lexical = NODES.map((n) => {
    const own = [...stems(n.label), ...n.keywords];
    let hits = 0;
    for (const t of own) {
      if (promptStems.some((p) => sameWord(p, t))) hits += 1;
    }
    return Math.min(1, hits / 2);
  });

  const semantic = NODES.map((n) => {
    const vec = NODE_EMBEDDINGS[n.id];
    if (!embedding || !vec) return 0;
    return cosine(embedding, vec);
  });

  // The cosine is mapped through an absolute floor rather than divided by
  // the best score. Normalising by the maximum would make a prompt that
  // matches nothing at all look like a perfect match, because the weakest
  // cosine in the set would be rescaled to 1.
  const FLOOR = 0.12;
  const SPAN = 0.38;

  const combined = NODES.map((n, i) => {
    const sem = Math.max(0, Math.min(1, (semantic[i] - FLOOR) / SPAN));
    const weight = sem > 0 || lexical[i] > 0 ? 0.68 * sem + 0.32 * lexical[i] : 0;
    return {
      id: n.id,
      label: n.label,
      weight: Math.max(0, Math.min(1, weight)),
      semantic: semantic[i],
      lexical: lexical[i],
    };
  });

  // strongest first
  return combined.sort((a, b) => b.weight - a.weight);
}

/**
 * The node a prompt conditions on: the strongest score, if there is a real
 * signal. A cosine below the floor and no keyword hit means the model would
 * have nothing to condition on, and it would be guessing.
 */
export function topNode(scores: NodeScore[]): NodeScore | null {
  if (!scores.length) return null;
  const best = scores[0];
  const realSignal = best.semantic > 0.12 || best.lexical > 0.3;
  return best.weight > 0.06 && realSignal ? best : null;
}
