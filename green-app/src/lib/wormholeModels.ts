/** Teaching and numerical models for the Euclidean wormholes & observer page.
 *  Geodesic integrators solve the stated metric ODEs via 4th-order Runge-Kutta;
 *  no function here solves the full Einstein equations or a gravitational path integral. */

export function saddleWeight(deltaAction: number) {
  return Math.exp(-deltaAction);
}

/** Non-rotating BTZ; hbar = k_B = 1, E = M ell, c_L = c_R = c. */
export function cardyBTZ(c: number, energyOverC: number) {
  const energy = c * energyOverC;
  const radiusOverAdS = Math.sqrt(12 * energyOverC);
  const newtonOverAdS = 3 / (2 * c);
  return {
    energy,
    radiusOverAdS,
    cardy: 2 * Math.PI * Math.sqrt((c * energy) / 3),
    bekensteinHawking: (2 * Math.PI * radiusOverAdS) / (4 * newtonOverAdS),
  };
}

/** Three equally likely two-level systems, E = {0, 1 + alpha}. */
export function ensembleExample(spread: number, betaA: number, betaB: number) {
  const rows = [-1, 0, 1].map((sector) => {
    const alpha = sector * spread;
    const gap = 1 + alpha;
    const a = 1 + Math.exp(-betaA * gap);
    const b = 1 + Math.exp(-betaB * gap);
    return { alpha, gap, a, b, product: a * b };
  });
  const meanA = rows.reduce((sum, row) => sum + row.a, 0) / rows.length;
  const meanB = rows.reduce((sum, row) => sum + row.b, 0) / rows.length;
  const meanProduct = rows.reduce((sum, row) => sum + row.product, 0) / rows.length;
  return {
    rows,
    meanA,
    meanB,
    meanProduct,
    productOfMeans: meanA * meanB,
    covariance: meanProduct - meanA * meanB,
  };
}

/** Smooth Morris-Thorne / DNEG wormhole circumferential radius r(ell)
 *  following James, von Tunzelmann, Franklin & Thorne (2015, arXiv:1502.03809).
 *  All lengths are in arbitrary units (e.g. throat radius rho = 1). */
export function dnegRadius(
  ell: number,
  rho: number,
  throatHalfLen: number,
  lensingWidth: number
) {
  const absEll = Math.abs(ell);
  if (absEll <= throatHalfLen) return rho;
  const M = Math.max(lensingWidth / 1.42953, 1e-4);
  const x = (2 * (absEll - throatHalfLen)) / (Math.PI * M);
  return rho + M * (x * Math.atan(x) - 0.5 * Math.log(1 + x * x));
}

/** Exact analytic derivative dr/d(ell) of the smooth DNEG radial profile. */
export function dnegRadiusDerivative(
  ell: number,
  throatHalfLen: number,
  lensingWidth: number
) {
  const absEll = Math.abs(ell);
  if (absEll <= throatHalfLen) return 0;
  const M = Math.max(lensingWidth / 1.42953, 1e-4);
  const x = (2 * (absEll - throatHalfLen)) / (Math.PI * M);
  return Math.sign(ell) * (2 / Math.PI) * Math.atan(x);
}

/** Isometric Flamm-style Euclidean embedding axial height z(ell) satisfying
 *  dz^2 + dr^2 = d(ell)^2 (possible everywhere since |dr/d(ell)| <= 2/pi < 1). */
export function dnegEmbeddingZ(
  ell: number,
  throatHalfLen: number,
  lensingWidth: number,
  intervals = 24
) {
  if (Math.abs(ell) < 1e-7) return 0;
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const h = ell / n;
  const integrand = (s: number) => {
    const dr = dnegRadiusDerivative(s, throatHalfLen, lensingWidth);
    return Math.sqrt(Math.max(0, 1 - dr * dr));
  };
  let sum = integrand(0) + integrand(ell);
  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * integrand(i * h);
  }
  return (h / 3) * sum;
}

/** Exact local camera ray direction matching the GLSL observer shader's
 *  rotY(yaw) * rotX(pitch) * normalize(vec3(ndcX, ndcY, -focal)).
 *  pEll = component along +ell (wHat = (0,0,1)), pPhi = horizontal, pTheta = vertical. */
export function shaderRayDirection(
  yaw: number,
  pitch: number,
  ndcX = 0,
  ndcY = 0,
  focal = 1.45
) {
  const invLen = 1 / Math.hypot(ndcX, ndcY, focal);
  const cx = ndcX * invLen;
  const cy = ndcY * invLen;
  const cz = -focal * invLen;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const vx = cx;
  const vy = cp * cy + sp * cz;
  const vz = -sp * cy + cp * cz;

  const cyaw = Math.cos(yaw);
  const syaw = Math.sin(yaw);
  const pPhi = cyaw * vx - syaw * vz;
  const pTheta = vy;
  const pEll = syaw * vx + cyaw * vz;

  return { pPhi, pTheta, pEll };
}

/** Apparent angular radius (in radians) of the wormhole throat b = rho as seen
 *  by a static observer at proper radial distance ell0. */
export function wormholeApparentAngle(
  ell0: number,
  rho: number,
  throatHalfLen: number,
  lensingWidth: number
) {
  const r0 = dnegRadius(ell0, rho, throatHalfLen, lensingWidth);
  const ratio = Math.min(1, Math.max(0, rho / Math.max(r0, 1e-6)));
  return Math.asin(ratio);
}

export interface GeodesicPoint {
  ell: number;
  r: number;
  phi: number;
  x: number;
  y: number;
}

export interface WormholeGeodesicResult {
  crossed: boolean;
  finalEll: number;
  deltaPhi: number;
  windings: number;
  impactParameter: number;
  criticalImpact: number;
  minAbsEll: number;
  invariantError: number;
  points: GeodesicPoint[];
}

/** RK4 integrator for null geodesics in ds^2 = -dt^2 + d(ell)^2 + r(ell)^2 dOmega^2.
 *  angleFromPlusEll = pi aims directly at the throat from ell0 > 0. */
export function traceWormholeGeodesic({
  ell0,
  angleFromPlusEll,
  rho = 1,
  throatHalfLen = 0.25,
  lensingWidth = 0.7,
  maxSteps = 450,
  stepSize = 0.08,
  skyRadius = 18,
  phiSign = 1,
}: {
  ell0: number;
  angleFromPlusEll: number;
  rho?: number;
  throatHalfLen?: number;
  lensingWidth?: number;
  maxSteps?: number;
  stepSize?: number;
  skyRadius?: number;
  phiSign?: number;
}): WormholeGeodesicResult {
  const r0 = dnegRadius(ell0, rho, throatHalfLen, lensingWidth);
  let ell = ell0;
  let pEll = Math.cos(angleFromPlusEll);
  const b = r0 * Math.abs(Math.sin(angleFromPlusEll));
  const dirSign = phiSign >= 0 ? 1 : -1;
  let phi = 0;

  const deriv = (curEll: number, curPEll: number) => {
    const r = dnegRadius(curEll, rho, throatHalfLen, lensingWidth);
    const dr = dnegRadiusDerivative(curEll, throatHalfLen, lensingWidth);
    const dEll = curPEll;
    const dPEll = (b * b * dr) / (r * r * r);
    const dPhi = (dirSign * b) / (r * r);
    return { dEll, dPEll, dPhi };
  };

  let minAbsEll = Math.abs(ell);
  const points: GeodesicPoint[] = [
    { ell, r: r0, phi, x: r0 * Math.cos(phi), y: r0 * Math.sin(phi) },
  ];

  const escapeBound = Math.max(skyRadius, Math.abs(ell0) + 10);

  for (let step = 0; step < maxSteps; step++) {
    const h = stepSize;
    const k1 = deriv(ell, pEll);
    const k2 = deriv(ell + 0.5 * h * k1.dEll, pEll + 0.5 * h * k1.dPEll);
    const k3 = deriv(ell + 0.5 * h * k2.dEll, pEll + 0.5 * h * k2.dPEll);
    const k4 = deriv(ell + h * k3.dEll, pEll + h * k3.dPEll);

    ell += (h / 6) * (k1.dEll + 2 * k2.dEll + 2 * k3.dEll + k4.dEll);
    pEll += (h / 6) * (k1.dPEll + 2 * k2.dPEll + 2 * k3.dPEll + k4.dPEll);
    phi += (h / 6) * (k1.dPhi + 2 * k2.dPhi + 2 * k3.dPhi + k4.dPhi);

    minAbsEll = Math.min(minAbsEll, Math.abs(ell));
    const r = dnegRadius(ell, rho, throatHalfLen, lensingWidth);
    if (step % 2 === 0 || Math.abs(ell) >= escapeBound) {
      points.push({ ell, r, phi, x: r * Math.cos(phi), y: r * Math.sin(phi) });
    }

    if (Math.abs(ell) >= escapeBound && ell * pEll > 0) {
      break;
    }
  }

  const rEnd = dnegRadius(ell, rho, throatHalfLen, lensingWidth);
  const invariant = pEll * pEll + (b * b) / (rEnd * rEnd);
  const crossed =
    ell0 === 0 ? ell < 0 : Math.sign(ell) !== Math.sign(ell0);

  return {
    crossed,
    finalEll: ell,
    deltaPhi: phi,
    windings: phi / (2 * Math.PI),
    impactParameter: b,
    criticalImpact: rho,
    minAbsEll,
    invariantError: Math.abs(invariant - 1),
    points,
  };
}

/** Numerical 1D WKB bounce integral S_E = int_{-q0}^{q0} sqrt(2 V0 (1 - (q/q0)^2)^2) dq
 *  via composite Simpson's rule for a schematic pinch-off barrier. */
export function solveEuclideanBounce(barrierHeight: number, width = 1.5, intervals = 64) {
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const a = -width;
  const b = width;
  const h = (b - a) / n;
  const integrand = (q: number) => {
    const u = q / width;
    const v = Math.max(0, barrierHeight * (1 - u * u) * (1 - u * u));
    return Math.sqrt(2 * v);
  };
  let sum = integrand(a) + integrand(b);
  for (let i = 1; i < n; i++) {
    const q = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * integrand(q);
  }
  const action = (h / 3) * sum;
  return {
    action,
    weight: Math.exp(-action),
    pinchFactor: 1 - Math.exp(-0.45 * action),
  };
}

export interface BtzGeodesicResult {
  captured: boolean;
  boundaryReflections: number;
  finalR: number;
  deltaPhi: number;
  impactParameter: number;
  escapeHalfAngleRad: number;
  points: { r: number; phi: number; x: number; y: number }[];
}

/** RK4 null geodesic integrator inside a reflective AdS3 / BTZ black-hole box
 *  with f(r) = r^2 - rPlus^2 (AdS radius ell_AdS = 1). */
export function traceBtzGeodesic({
  r0,
  thetaFromOutward,
  rPlus,
  boxRadius = 10,
  maxSteps = 420,
  stepSize = 0.04,
  phiSign = 1,
}: {
  r0: number;
  thetaFromOutward: number;
  rPlus: number;
  boxRadius?: number;
  maxSteps?: number;
  stepSize?: number;
  phiSign?: number;
}): BtzGeodesicResult {
  const safeR0 = Math.max(r0, rPlus + 0.08);
  const f0 = safeR0 * safeR0 - rPlus * rPlus;
  let r = safeR0;
  let pr = Math.cos(thetaFromOutward);
  const b = (safeR0 * Math.abs(Math.sin(thetaFromOutward))) / Math.sqrt(f0);
  const dirSign = phiSign >= 0 ? 1 : -1;
  let phi = 0;
  let captured = false;
  let boundaryReflections = 0;

  const deriv = (curR: number, curPr: number) => {
    const dr = curPr;
    const dpr = -(b * b * rPlus * rPlus) / Math.pow(Math.max(curR, 1e-4), 3);
    const dphi = (dirSign * b) / Math.pow(Math.max(curR, 1e-4), 2);
    return { dr, dpr, dphi };
  };

  const points: { r: number; phi: number; x: number; y: number }[] = [
    { r, phi, x: r * Math.cos(phi), y: r * Math.sin(phi) },
  ];

  for (let step = 0; step < maxSteps; step++) {
    const h = stepSize;
    const k1 = deriv(r, pr);
    const k2 = deriv(r + 0.5 * h * k1.dr, pr + 0.5 * h * k1.dpr);
    const k3 = deriv(r + 0.5 * h * k2.dr, pr + 0.5 * h * k2.dpr);
    const k4 = deriv(r + h * k3.dr, pr + h * k3.dpr);

    r += (h / 6) * (k1.dr + 2 * k2.dr + 2 * k3.dr + k4.dr);
    pr += (h / 6) * (k1.dpr + 2 * k2.dpr + 2 * k3.dpr + k4.dpr);
    phi += (h / 6) * (k1.dphi + 2 * k2.dphi + 2 * k3.dphi + k4.dphi);

    if (r <= rPlus * 1.005) {
      r = rPlus;
      captured = true;
      points.push({ r, phi, x: r * Math.cos(phi), y: r * Math.sin(phi) });
      break;
    }

    if (r >= boxRadius) {
      r = boxRadius;
      pr = -Math.abs(pr); // Reached reflective AdS conformal boundary box
      boundaryReflections += 1;
      points.push({ r, phi, x: r * Math.cos(phi), y: r * Math.sin(phi) });
      break;
    }

    if (step % 3 === 0) {
      points.push({ r, phi, x: r * Math.cos(phi), y: r * Math.sin(phi) });
    }
  }

  const escapeHalfAngleRad = Math.asin(Math.min(1, Math.sqrt(f0) / safeR0));

  return {
    captured,
    boundaryReflections,
    finalR: r,
    deltaPhi: phi,
    impactParameter: b,
    escapeHalfAngleRad,
    points,
  };
}

/** Illustrative large-c suppression scaling for high-energy OPE variance:
 *  shows small-but-nonzero statistical fluctuations that shrink rapidly with c. */
export function ensembleOpticalShift(spread: number, c: number, sectorIndex: number) {
  const alpha = (sectorIndex - 1) * spread;
  const suppression = Math.exp(-0.03 * Math.max(0, c - 30));
  return {
    alpha,
    suppression,
    effectiveShift: alpha * suppression,
  };
}
