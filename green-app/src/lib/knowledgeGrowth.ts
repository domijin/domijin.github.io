/**
 * The growth model from scripts/make-knowledge-growth-gif.py, in TypeScript,
 * so the interactive scene and the GIF are the same picture.
 *
 * Collective human knowledge is a spiky closed outline; the model grows as a
 * smoother, lagging copy of the same silhouette. A breakthrough grows the
 * human spike and, separately, grows the model's reach toward that field. At
 * the end the model is inside the human outline almost everywhere, close to
 * the edge in mathematics, and past it in the two sharpest fields.
 */

export interface GrowthDomain {
  /** degrees, clockwise from straight up */
  angle: number;
  /** how far this field pushes the human outline out */
  amp: number;
  /** how much further the frontier moves at a breakthrough */
  gain: number;
  /** how close the model gets to the human outline here, at the end */
  reach: number;
  label: string | null;
  /** the frame at which this field has its breakthrough */
  t: number | null;
}

export const GROWTH_DOMAINS: GrowthDomain[] = [
  { angle: -90, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: -64, amp: 0.05, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: -38, amp: 0.3, gain: 0.15, reach: 1.045, label: "AlphaGo", t: 17 },
  { angle: -15, amp: 0.07, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 8, amp: 0.28, gain: 0.13, reach: 1.035, label: "AlphaFold", t: 22 },
  { angle: 31, amp: 0.05, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 53, amp: 0.26, gain: 0.12, reach: 0.965, label: "mathematics", t: 27 },
  { angle: 75, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 96, amp: 0.1, gain: 0.07, reach: 0.88, label: "LLM alignment", t: 31 },
  { angle: 118, amp: 0.05, gain: 0.05, reach: 0.88, label: "wet-lab protocol", t: null },
  { angle: 140, amp: 0.11, gain: 0.06, reach: 0.88, label: "ad auctions", t: null },
  { angle: 162, amp: 0.04, gain: 0.05, reach: 0.88, label: "traffic control", t: 20 },
  { angle: 184, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 206, amp: 0.04, gain: 0.04, reach: 0.88, label: "airworthiness", t: 25 },
  { angle: 228, amp: 0.05, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 250, amp: 0.05, gain: 0.05, reach: 0.88, label: "cluster dynamics", t: 29 },
  { angle: 272, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
];

export const GROWTH_FRAMES = 40;
export const GROWTH_R_BASE = 112;
const SIG_HUMAN = 0.085;
const SIG_MODEL = 0.17;
const SIG_MODEL_BASE = 0.16;

export const GROWTH_ANNOTATIONS: { at: number; text: string }[] = [
  { at: 0, text: "A sketch: how a model's knowledge boundary grows" },
  { at: 4, text: "collective human knowledge — anisotropic: deep in some fields, thin in others" },
  { at: 10, text: "a model starts small — the boundary is the edge of what it can recall" },
  { at: 14, text: "an expert works a frontier" },
  { at: 17, text: "a breakthrough moves the frontier out" },
  { at: 20, text: "the result becomes training data — and the boundary moves" },
  { at: 26, text: "and again — in fields where the graph is thin, one good result is worth a lot" },
  { at: 32, text: "the singularity moment is not consciousness" },
  { at: 35, text: "it is the boundary reaching the frontier" },
  { at: 37, text: "and where the frontier is sharpest, it goes past" },
];

function ease(t: number) {
  return t * t * (3 - 2 * t);
}

export function angleOf(d: GrowthDomain) {
  return ((d.angle - 90) * Math.PI) / 180;
}

function gauss(theta: number, centre: number, sigma: number) {
  let delta = (theta - centre + Math.PI) % (2 * Math.PI) - Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;
  return Math.exp(-(delta * delta) / (2 * sigma * sigma));
}

export function ampNow(d: GrowthDomain, frame: number) {
  if (d.t === null || frame < d.t) return d.amp;
  const grow = Math.min(1, (frame - d.t) / 4);
  return d.amp + d.gain * ease(grow);
}

export function reachNow(d: GrowthDomain, frame: number) {
  if (d.t === null || frame < d.t) return 0;
  const grow = Math.min(1, (frame - d.t) / 9);
  return d.reach * ease(grow);
}

export function fillLevel(frame: number) {
  const t = Math.max(0, Math.min(1, (frame - 10) / (GROWTH_FRAMES - 12)));
  return 0.84 * ease(t);
}

export function humanRadius(theta: number, frame: number) {
  let r = GROWTH_R_BASE;
  for (const d of GROWTH_DOMAINS) {
    r += GROWTH_R_BASE * ampNow(d, frame) * gauss(theta, angleOf(d), SIG_HUMAN);
  }
  return r;
}

export function modelRadius(theta: number, frame: number) {
  let body = GROWTH_R_BASE;
  for (const d of GROWTH_DOMAINS) {
    body += GROWTH_R_BASE * ampNow(d, frame) * 0.72 * gauss(theta, angleOf(d), SIG_MODEL_BASE);
  }
  let r = fillLevel(frame) * body;

  for (const d of GROWTH_DOMAINS) {
    if (d.t === null) continue;
    const reach = reachNow(d, frame);
    if (reach <= 0) continue;
    const w = gauss(theta, angleOf(d), SIG_MODEL);
    if (w < 0.02) continue;
    const target = reach * humanRadius(theta, frame);
    r += w * Math.max(0, target - r);
  }
  return r;
}

/** The annotation that applies at a frame. */
export function annotationAt(frame: number) {
  let text = GROWTH_ANNOTATIONS[0].text;
  for (const a of GROWTH_ANNOTATIONS) if (frame >= a.at) text = a.text;
  return text;
}

/** True at the frame each domain has its breakthrough. */
export function breakthroughAt(frame: number) {
  return GROWTH_DOMAINS.filter((d) => d.t !== null && frame === d.t);
}

/** The domains the model has already passed the human graph in. */
export function crossingDomains(frame: number) {
  return GROWTH_DOMAINS.filter((d) => {
    if (d.t === null) return false;
    const a = angleOf(d);
    return modelRadius(a, frame) > humanRadius(a, frame) + 0.6;
  });
}

/** The closed curve, as a list of points in the XZ plane. */
export function curve(
  frame: number,
  fn: (theta: number, frame: number) => number,
  points = 200
): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < points; i++) {
    const theta = (2 * Math.PI * i) / points;
    const r = fn(theta, frame);
    out.push([r * Math.cos(theta), 0, r * Math.sin(theta)]);
  }
  return out;
}
