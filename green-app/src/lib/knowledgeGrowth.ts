/**
 * The growth model, in three dimensions.
 *
 * Collective human knowledge is a spiky ball; the model grows as a smoother,
 * lagging copy of the same shape. A breakthrough grows the human spike and,
 * separately, grows the model's reach toward that field. At the end the model
 * is inside the human ball almost everywhere, close to the edge in
 * mathematics, and past it in the two sharpest fields.
 *
 * This started as the two-dimensional model in
 * scripts/make-knowledge-growth-gif.py, which is still what the front page's
 * animation shows. What changed is the shape of the knowledge: a circle has
 * a ring of fields around it and a clear "inside", while a ball has fields
 * all over its surface and no privileged side. The story the model tells is
 * the same either way, but the second one is the honest one — human
 * knowledge does not have a flat side.
 *
 * The numbers are unchanged: the same domain table, the same amplitudes and
 * reaches, the same 40 frames, the same annotations.
 */

export interface GrowthDomain {
  /** the field's bearing in degrees, clockwise from straight up */
  angle: number;
  /** how far this field pushes the human boundary out */
  amp: number;
  /** how much further the frontier moves at a breakthrough */
  gain: number;
  /** how close the model gets to the human boundary here, at the end */
  reach: number;
  label: string | null;
  /** the frame at which this field has its breakthrough */
  t: number | null;
}

export const GROWTH_DOMAINS: GrowthDomain[] = [
  { angle: -90, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: -64, amp: 0.05, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: -38, amp: 0.42, gain: 0.18, reach: 1.045, label: "AlphaGo", t: 17 },
  { angle: -15, amp: 0.07, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 8, amp: 0.4, gain: 0.17, reach: 1.035, label: "AlphaFold", t: 22 },
  { angle: 31, amp: 0.05, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 53, amp: 0.36, gain: 0.15, reach: 0.965, label: "mathematics", t: 27 },
  { angle: 75, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 96, amp: 0.16, gain: 0.09, reach: 0.88, label: "LLM alignment", t: 31 },
  { angle: 118, amp: 0.05, gain: 0.05, reach: 0.88, label: "wet-lab protocol", t: null },
  { angle: 140, amp: 0.16, gain: 0.08, reach: 0.88, label: "ad auctions", t: null },
  { angle: 162, amp: 0.04, gain: 0.05, reach: 0.88, label: "traffic control", t: 20 },
  { angle: 184, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 206, amp: 0.04, gain: 0.04, reach: 0.88, label: "airworthiness", t: 25 },
  { angle: 228, amp: 0.05, gain: 0.0, reach: 0.84, label: null, t: null },
  { angle: 250, amp: 0.05, gain: 0.05, reach: 0.88, label: "cluster dynamics", t: 29 },
  { angle: 272, amp: 0.06, gain: 0.0, reach: 0.84, label: null, t: null },
];

export const GROWTH_FRAMES = 40;
export const GROWTH_R_BASE = 112;

/**
 * Angular width of a field's bump on the ball, in radians.
 *
 * This is the same width the two-dimensional animation uses, so the sphere
 * reads like the GIF on the front page and not like a rounder version of
 * it: narrow enough that each field is a spike with a point, not a lobe.
 * The fields end up about 33 degrees apart at their closest, so a bump well
 * under half that stays a separate spike instead of merging into its
 * neighbour — and a thin field, whose amplitude is a fifth of a deep one's,
 * shows almost no bump at all. That contrast is the anisotropy.
 */
const SIG_HUMAN = 0.075;
/** The model's reach toward a frontier is broader than the human spike. */
const SIG_MODEL = 0.3;
/** The model's body is smoother than the human one — that is the whole point. */
const SIG_MODEL_BASE = 0.34;

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

/**
 * Where each field sits on the ball.
 *
 * The bearing is the field's own azimuth, so the sphere is the old circle
 * lifted onto a ball: a field still points the same way it used to. The
 * latitude comes from an equal-area spread, assigned in a golden stride so
 * that fields whose bearings are close end up far apart in latitude —
 * without that, two fields land on top of each other and their spikes merge
 * into one lump.
 */
export const DOMAIN_DIRECTIONS: [number, number, number][] = (() => {
  const n = GROWTH_DOMAINS.length;
  const stride = 7; // coprime with 17, so this is a permutation
  const z = new Array<number>(n);
  for (let rank = 0; rank < n; rank++) {
    z[(rank * stride) % n] = 1 - (2 * (rank + 0.5)) / n;
  }
  return GROWTH_DOMAINS.map((d, i) => {
    const lat = Math.asin(z[i]);
    const lon = (d.angle * Math.PI) / 180;
    const cl = Math.cos(lat);
    return [cl * Math.cos(lon), Math.sin(lat), cl * Math.sin(lon)];
  });
})();

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

/** A bump of angular width `sigma` between two unit vectors. */
function bump(dot: number, sigma: number) {
  const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
  return Math.exp(-(angle * angle) / (2 * sigma * sigma));
}

function dot(a: [number, number, number], b: [number, number, number]) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** The radius of the human knowledge boundary along a direction. */
export function humanRadius(dir: [number, number, number], frame: number) {
  let r = GROWTH_R_BASE;
  for (let i = 0; i < GROWTH_DOMAINS.length; i++) {
    const w = bump(dot(dir, DOMAIN_DIRECTIONS[i]), SIG_HUMAN);
    if (w < 0.004) continue;
    r += GROWTH_R_BASE * ampNow(GROWTH_DOMAINS[i], frame) * w;
  }
  return r;
}

/** The radius of the model's boundary along a direction. */
export function modelRadius(dir: [number, number, number], frame: number) {
  let body = GROWTH_R_BASE;
  for (let i = 0; i < GROWTH_DOMAINS.length; i++) {
    const w = bump(dot(dir, DOMAIN_DIRECTIONS[i]), SIG_MODEL_BASE);
    if (w < 0.004) continue;
    body += GROWTH_R_BASE * ampNow(GROWTH_DOMAINS[i], frame) * 0.72 * w;
  }
  let r = fillLevel(frame) * body;

  const human = humanRadius(dir, frame);
  for (let i = 0; i < GROWTH_DOMAINS.length; i++) {
    const d = GROWTH_DOMAINS[i];
    if (d.t === null) continue;
    const reach = reachNow(d, frame);
    if (reach <= 0) continue;
    const w = bump(dot(dir, DOMAIN_DIRECTIONS[i]), SIG_MODEL);
    if (w < 0.02) continue;
    const target = reach * human;
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

/** The fields the model has already passed the human graph in. */
export function crossingDomains(frame: number) {
  return GROWTH_DOMAINS.filter((d, i) => {
    if (d.t === null) return false;
    const dir = DOMAIN_DIRECTIONS[i];
    return modelRadius(dir, frame) > humanRadius(dir, frame) + 0.6;
  });
}

/**
 * The same, but each crossing carries the field's own index.
 *
 * The index matters: a filtered array renumbers its elements, so indexing
 * back into DOMAIN_DIRECTIONS with a filter's index points at the wrong
 * field — and a crossing drawn on the wrong spike is a lie about where the
 * model went past.
 */
export function crossingFields(frame: number) {
  const out: { index: number; domain: GrowthDomain }[] = [];
  GROWTH_DOMAINS.forEach((d, i) => {
    if (d.t === null) return;
    const dir = DOMAIN_DIRECTIONS[i];
    if (modelRadius(dir, frame) > humanRadius(dir, frame) + 0.6) {
      out.push({ index: i, domain: d });
    }
  });
  return out;
}

/**
 * A globe grid: meridians and parallels drawn on the same radial surface.
 * The grid deforms where the fields are deep, which is a clearer way to see
 * the anisotropy than a solid shell — you can read how far each spike
 * pushes the surface out.
 */
export function gridLines(
  frame: number,
  fn: (dir: [number, number, number], frame: number) => number,
  meridians = 24,
  parallels = 13,
  steps = 64
): Float32Array {
  const out: number[] = [];
  const push = (a: [number, number, number], b: [number, number, number]) => {
    const ra = fn(a, frame);
    const rb = fn(b, frame);
    out.push(a[0] * ra, a[1] * ra, a[2] * ra, b[0] * rb, b[1] * rb, b[2] * rb);
  };

  for (let m = 0; m < meridians; m++) {
    const lon = (m / meridians) * Math.PI * 2;
    let prev: [number, number, number] | null = null;
    for (let j = 0; j <= steps; j++) {
      const phi = (j / steps) * Math.PI;
      const sp = Math.sin(phi);
      const dir: [number, number, number] = [
        sp * Math.cos(lon),
        Math.cos(phi),
        sp * Math.sin(lon),
      ];
      if (prev) push(prev, dir);
      prev = dir;
    }
  }

  for (let p = 1; p < parallels; p++) {
    const phi = (p / parallels) * Math.PI;
    const sp = Math.sin(phi);
    const cp = Math.cos(phi);
    let prev: [number, number, number] | null = null;
    for (let i = 0; i <= steps; i++) {
      const lon = (i / steps) * Math.PI * 2;
      const dir: [number, number, number] = [sp * Math.cos(lon), cp, sp * Math.sin(lon)];
      if (prev) push(prev, dir);
      prev = dir;
    }
  }

  return new Float32Array(out);
}

export interface Surface {
  positions: Float32Array;
  indices: Uint32Array;
}

/**
 * A radial surface: a lat/long grid whose every vertex sits at the radius
 * the model gives in that direction.
 */
export function surface(
  frame: number,
  fn: (dir: [number, number, number], frame: number) => number,
  segments = 96,
  rings = 48
): Surface {
  const positions = new Float32Array((segments + 1) * (rings + 1) * 3);
  const indices = new Uint32Array(segments * rings * 6);
  let p = 0;

  for (let j = 0; j <= rings; j++) {
    const phi = (j / rings) * Math.PI;
    const sp = Math.sin(phi);
    const cp = Math.cos(phi);
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const dir: [number, number, number] = [sp * Math.cos(theta), cp, sp * Math.sin(theta)];
      const r = fn(dir, frame);
      positions[p++] = dir[0] * r;
      positions[p++] = dir[1] * r;
      positions[p++] = dir[2] * r;
    }
  }

  let k = 0;
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segments; i++) {
      const a = j * (segments + 1) + i;
      const b = a + 1;
      const c = a + segments + 1;
      const d = c + 1;
      // Counter-clockwise seen from outside the ball, so a front-facing
      // material shows the near surface and not the far one.
      indices[k++] = a; indices[k++] = b; indices[k++] = c;
      indices[k++] = b; indices[k++] = d; indices[k++] = c;
    }
  }

  return { positions, indices };
}
