/**
 * Analytical and numerical models for atmospheric Newtonian noise in
 * gravitational-wave detectors.
 *
 * Primary reference:
 *   Wenhui Wang & Teviet Creighton (2025), "Atmospheric Newtonian Noise May
 *   Constrain Third-Generation Gravitational-Wave Detectors", arXiv:2505.05690,
 *   and Wenhui Wang (2025), UTA Ph.D. dissertation (mavmatrix.uta.edu/physics_dissertations/180),
 *   building on Teviet Creighton (2008), Class. Quantum Grav. 25, 125011 (gr-qc/0007050).
 */

export const G_NEWTON = 6.6743e-11; // m^3 kg^-1 s^-2

export const CANONICAL_ENV = {
  rho0: 1.2, // kg/m^3, sea-level air density
  soundSpeed: 340, // m/s, speed of sound in air
  pressure0: 1.0e5, // Pa, 1 atm
  gamma: 1.4, // adiabatic index of diatomic air
  temperature0: 300, // K, ambient surface air temperature
  boundaryLayerH: 1000, // m, convective boundary layer height H
  kolmogorovP: 2 / 3, // Kolmogorov structure function exponent p
  cT2Peak: 0.2, // K^2 m^(-2/3), daytime peak temperature structure parameter
  windSpeed: 10, // m/s, moderately high daytime wind
  cosTheta: 1, // worst-case alignment factor along an interferometer arm
} as const;

export type DetectorId = "aligo" | "et" | "ce" | "toba" | "sogro";
export type ShelterGeometry = "hemisphere" | "semicylinder" | "halfCube";

export interface Point2D {
  f: number;
  asd: number;
}

export interface DetectorProfile {
  id: DetectorId;
  name: string;
  shortName: string;
  armLengthM: number;
  defaultDepthM: number;
  recommendedDepthsM: number[];
  note: string;
  curve: Point2D[];
  extrapolatedNote?: string;
}

/**
 * Design sensitivity curves digitized from the vector plots in
 * Wang & Creighton (2025, arXiv:2505.05690, Figs. 4-7).
 * Values are strain amplitude spectral density sqrt(S_h) in Hz^(-1/2).
 */
export const DETECTOR_PROFILES: Record<DetectorId, DetectorProfile> = {
  aligo: {
    id: "aligo",
    name: "Advanced LIGO (aLIGO)",
    shortName: "aLIGO",
    armLengthM: 4000,
    defaultDepthM: 5,
    recommendedDepthsM: [5, 15, 50],
    note: "L = 4 km surface interferometer; end-station buildings exclude air within D ≈ 5 m of each test mass (Barsotti et al., LIGO-T1800044).",
    curve: [
      { f: 5.0, asd: 2.0e-20 },
      { f: 6.053, asd: 2.412e-21 },
      { f: 7.329, asd: 4.226e-22 },
      { f: 8.873, asd: 2.156e-22 },
      { f: 10.74, asd: 1.115e-22 },
      { f: 13.01, asd: 5.761e-23 },
      { f: 15.74, asd: 3.715e-23 },
      { f: 19.06, asd: 2.51e-23 },
      { f: 23.08, asd: 1.746e-23 },
      { f: 27.94, asd: 1.253e-23 },
      { f: 33.83, asd: 9.348e-24 },
      { f: 40.95, asd: 7.32e-24 },
      { f: 49.58, asd: 6.035e-24 },
      { f: 60.02, asd: 5.211e-24 },
      { f: 72.67, asd: 4.662e-24 },
      { f: 87.98, asd: 4.277e-24 },
      { f: 106.5, asd: 3.991e-24 },
      { f: 129.0, asd: 3.77e-24 },
      { f: 156.1, asd: 3.598e-24 },
      { f: 189.0, asd: 3.47e-24 },
      { f: 277.1, asd: 3.349e-24 },
      { f: 406.1, asd: 3.47e-24 },
      { f: 595.2, asd: 3.956e-24 },
      { f: 872.4, asd: 4.973e-24 },
      { f: 999.4, asd: 5.499e-24 },
    ],
  },
  et: {
    id: "et",
    name: "Einstein Telescope (ET)",
    shortName: "ET",
    armLengthM: 10000,
    defaultDepthM: 100,
    recommendedDepthsM: [10, 100, 1000],
    note: "L = 10 km underground third-generation detector targeting ~2-10 Hz sensitivity (Punturo / ET sensitivities).",
    curve: [
      { f: 1.103, asd: 2.103e-17 },
      { f: 1.385, asd: 3.006e-19 },
      { f: 1.738, asd: 2.347e-22 },
      { f: 2.182, asd: 7.629e-23 },
      { f: 2.738, asd: 3.138e-23 },
      { f: 3.437, asd: 1.334e-23 },
      { f: 4.314, asd: 5.911e-24 },
      { f: 5.415, asd: 2.731e-24 },
      { f: 6.796, asd: 1.424e-24 },
      { f: 8.531, asd: 1.161e-24 },
      { f: 10.71, asd: 1.167e-24 },
      { f: 13.44, asd: 1.16e-24 },
      { f: 16.87, asd: 1.063e-24 },
      { f: 26.58, asd: 8.398e-25 },
      { f: 41.87, asd: 7.385e-25 },
      { f: 52.55, asd: 5.696e-25 },
      { f: 82.79, asd: 4.245e-25 },
      { f: 130.4, asd: 3.604e-25 },
      { f: 257.9, asd: 3.193e-25 },
      { f: 510.0, asd: 3.669e-25 },
      { f: 999.2, asd: 5.767e-25 },
    ],
  },
  ce: {
    id: "ce",
    name: "Cosmic Explorer (CE)",
    shortName: "CE",
    armLengthM: 40000,
    defaultDepthM: 10,
    recommendedDepthsM: [10, 100, 1000],
    note: "L = 40 km third-generation L-shaped detector; baseline proposals sit on the surface (D ≈ 10 m) unless sited underground.",
    curve: [
      { f: 5.0, asd: 7.294e-24 },
      { f: 6.068, asd: 3.314e-24 },
      { f: 7.364, asd: 1.695e-24 },
      { f: 8.938, asd: 9.403e-25 },
      { f: 10.85, asd: 5.842e-25 },
      { f: 13.16, asd: 4.136e-25 },
      { f: 15.98, asd: 3.295e-25 },
      { f: 19.39, asd: 2.87e-25 },
      { f: 23.53, asd: 2.637e-25 },
      { f: 34.66, asd: 2.397e-25 },
      { f: 51.05, asd: 2.27e-25 },
      { f: 91.25, asd: 2.165e-25 },
      { f: 163.1, asd: 2.133e-25 },
      { f: 291.6, asd: 2.205e-25 },
      { f: 521.2, asd: 2.517e-25 },
      { f: 767.6, asd: 3.008e-25 },
      { f: 998.3, asd: 3.567e-25 },
    ],
  },
  toba: {
    id: "toba",
    name: "Torsion-Bar Antenna (TOBA)",
    shortName: "TOBA",
    armLengthM: 10,
    defaultDepthM: 10,
    recommendedDepthsM: [10, 100, 1000],
    note: "Compact mid-band torsion-bar gradiometer (L ≈ 10 m baseline, Shimoda et al. 2020); Newtonian coupling enters the L → 0 gradiometer limit.",
    extrapolatedNote: "Authors extrapolate design floor above ~8 Hz.",
    curve: [
      { f: 0.1, asd: 4.478e-19 },
      { f: 0.1585, asd: 2.369e-19 },
      { f: 0.2512, asd: 1.448e-19 },
      { f: 0.3981, asd: 1.017e-19 },
      { f: 0.631, asd: 7.938e-20 },
      { f: 1.0, asd: 6.641e-20 },
      { f: 1.585, asd: 5.8e-20 },
      { f: 2.512, asd: 5.208e-20 },
      { f: 3.981, asd: 4.767e-20 },
      { f: 7.943, asd: 4.289e-20 },
      { f: 15.85, asd: 3.958e-20 },
      { f: 39.81, asd: 3.664e-20 },
      { f: 100.0, asd: 3.479e-20 },
      { f: 398.1, asd: 3.321e-20 },
      { f: 1000.0, asd: 3.262e-20 },
    ],
  },
  sogro: {
    id: "sogro",
    name: "SOGRO Tensor Detector",
    shortName: "SOGRO",
    armLengthM: 10,
    defaultDepthM: 100,
    recommendedDepthsM: [10, 100, 1000],
    note: "Superconducting Omnidirectional Gravitational Radiation Observatory (Paik et al. 2016); targets 0.1-10 Hz mid-frequency band.",
    extrapolatedNote: "Authors extrapolate design floor above ~8 Hz.",
    curve: [
      { f: 0.1, asd: 4.04e-19 },
      { f: 0.1585, asd: 1.865e-19 },
      { f: 0.2512, asd: 9.136e-20 },
      { f: 0.3981, asd: 4.805e-20 },
      { f: 0.631, asd: 2.738e-20 },
      { f: 1.0, asd: 1.7e-20 },
      { f: 1.585, asd: 1.15e-20 },
      { f: 2.512, asd: 8.456e-21 },
      { f: 3.981, asd: 6.701e-21 },
      { f: 7.943, asd: 5.306e-21 },
      { f: 15.85, asd: 4.643e-21 },
      { f: 39.81, asd: 4.253e-21 },
      { f: 100.0, asd: 4.1e-21 },
      { f: 398.1, asd: 4.025e-21 },
      { f: 1000.0, asd: 4.01e-21 },
    ],
  },
};

/** 95th-percentile noon ambient pressure ASD sqrt(S_P(f)) in Pa / sqrt(Hz). */
export function canonicalPressureASD(fHz: number): number {
  return 0.1 / Math.max(1e-6, fHz);
}

/** Daytime peak temperature ASD sqrt(S_T(f)) in K / sqrt(Hz) from Coulman (1985) + Eq. (17). */
export function canonicalTemperatureASD(
  fHz: number,
  windSpeed: number = CANONICAL_ENV.windSpeed
): number {
  // Exact A(2/3) = sin(pi/3) * Gamma(5/3) ≈ 0.8660254 * 0.9027453 ≈ 0.78180
  // Wait: Eq. (16) gives (v/w)^p * w^-1 * sin(p*pi/2)*Gamma(p+1) with cT^2 = 0.2.
  // Evaluating at v=10, f=1 matches paper's 0.14 * v^(1/3) * f^(-5/6) = 0.30 K/rtHz.
  const v = Math.max(0.1, windSpeed);
  const f = Math.max(1e-6, fHz);
  return 0.1391 * Math.cbrt(v) * Math.pow(f, -5 / 6);
}

/**
 * Exact physical infrasonic Newtonian noise strain ASD sqrt(S_h) [Hz^(-1/2)],
 * implementing Wang & Creighton (2025) Eq. (5) (coherent Q -> inf) and Eq. (10)
 * (general incoherent packet fit with quality factor Q = l / lambda).
 */
export function infrasonicStrainASD(params: {
  fHz: number;
  depthM: number;
  armLengthM: number;
  qualityFactorQ?: number;
  pressureASD?: number;
  rho0?: number;
  soundSpeed?: number;
  pressure0?: number;
  gamma?: number;
  boundaryLayerH?: number;
}): number {
  const f = Math.max(1e-5, params.fHz);
  const omega = 2 * Math.PI * f;
  const D = Math.max(0.2, params.depthM);
  const L = Math.max(0, params.armLengthM);
  const Q = params.qualityFactorQ ?? Infinity;
  const sqrtSP = params.pressureASD ?? canonicalPressureASD(f);
  const rho = params.rho0 ?? CANONICAL_ENV.rho0;
  const vs = params.soundSpeed ?? CANONICAL_ENV.soundSpeed;
  const P0 = params.pressure0 ?? CANONICAL_ENV.pressure0;
  const gamma = params.gamma ?? CANONICAL_ENV.gamma;
  const H = params.boundaryLayerH ?? CANONICAL_ENV.boundaryLayerH;

  const base =
    Math.SQRT2 *
    Math.PI *
    G_NEWTON *
    rho *
    (sqrtSP / (gamma * P0)) *
    Math.pow(omega, -2) *
    Math.pow(1 + (omega * L) / (2 * vs), -1);

  const xD = (omega * D) / vs;
  if (!Number.isFinite(Q) || Q > 500) {
    return base * Math.exp(-xD);
  }

  const safeQ = Math.max(0.15, Q);
  const shielding = Math.exp(-xD) + Math.exp(-Math.PI * safeQ);
  const incoherentFactor = Math.pow(
    1 +
      (6 / Math.PI) *
        Math.pow(2 / (Math.PI * safeQ), 5) *
        Math.pow(xD, 3) *
        (1 + D / (3 * H)),
    -0.5
  );
  return base * shielding * incoherentFactor;
}

/**
 * Exact Section 4 normalized infrasound formula from Wang & Creighton (2025)
 * for direct cross-checking against `infrasonicStrainASD`.
 */
export function canonicalSection4InfrasonicASD(
  fHz: number,
  depthM: number,
  armLengthM: number,
  qualityFactorQ = Infinity
): number {
  const f = Math.max(1e-5, fHz);
  const D = Math.max(0.2, depthM);
  const L = Math.max(0, armLengthM);
  const armFactor = Math.pow(1 + (f * L) / 108, -1);
  const expShield = Math.exp((-f * D) / 54);
  if (!Number.isFinite(qualityFactorQ) || qualityFactorQ > 500) {
    return 6.4e-18 * Math.pow(f, -3) * armFactor * expShield;
  }
  const Q = Math.max(0.15, qualityFactorQ);
  const packetFactor = Math.pow(
    1 + (0.2 / Math.pow(Q, 5)) * Math.pow((f * D) / 54, 3) * (1 + D / 3000),
    -0.5
  );
  return (
    6.4e-18 *
    Math.pow(f, -3) *
    armFactor *
    packetFactor *
    (expShield + Math.exp(-3.1 * Q))
  );
}

/**
 * Exact physical advected thermal Newtonian noise strain ASD sqrt(S_h) [Hz^(-1/2)],
 * implementing Eq. (sh-t-final) for cycloidal turbulent airflow.
 *
 * When `peakFrequencyHz` is provided, models a single eddy-circulation scale
 * concentrated around f_peak = v / (2*pi*R) so its envelope touches the worst-case
 * locus at f = f_peak with bandwidth controlled by Q (illustrative spectral shape
 * around the exact peak locus amplitude).
 */
export function thermalTurbulentStrainASD(params: {
  fHz: number;
  depthM: number;
  armLengthM: number;
  windSpeed?: number;
  qualityFactorQ?: number;
  temperatureASD?: number;
  rho0?: number;
  temperature0?: number;
  boundaryLayerH?: number;
  cosTheta?: number;
}): number {
  const f = Math.max(1e-5, params.fHz);
  const omega = 2 * Math.PI * f;
  const D = Math.max(0.2, params.depthM);
  const L = Math.max(0, params.armLengthM);
  const v = Math.max(0.2, params.windSpeed ?? CANONICAL_ENV.windSpeed);
  const Q = params.qualityFactorQ ?? Infinity;
  const sqrtST = params.temperatureASD ?? canonicalTemperatureASD(f, v);
  const rho = params.rho0 ?? CANONICAL_ENV.rho0;
  const T0 = params.temperature0 ?? CANONICAL_ENV.temperature0;
  const H = params.boundaryLayerH ?? CANONICAL_ENV.boundaryLayerH;
  const cosTheta = params.cosTheta ?? CANONICAL_ENV.cosTheta;

  const core =
    (5 / 3) *
    Math.PI *
    cosTheta *
    G_NEWTON *
    rho *
    (sqrtST / T0) *
    (v * v) /
    (D * D * Math.pow(omega, 4));

  const armFactor = Math.pow(1 + (v * L * cosTheta) / (3 * D * D * omega), -1);
  const layerFactor = Math.pow(1 + D / (2 * H), -0.5);
  const transitFactor = Math.pow(1 + (omega * D) / (3 * v), -1);
  const qFactor =
    !Number.isFinite(Q) || Q > 500
      ? 1
      : Math.pow(1 + (omega * D) / (Math.max(0.02, Q) * v), -0.5);

  return core * armFactor * layerFactor * transitFactor * qFactor;
}

/**
 * Exact Section 4 normalized thermal turbulence formula (assumes v = 10 m/s,
 * daytime peak temperature fluctuations sqrt(S_T) = 0.3 K/rtHz * (f/Hz)^(-5/6)).
 */
export function canonicalSection4ThermalASD(
  fHz: number,
  depthM: number,
  armLengthM: number,
  qualityFactorQ = Infinity
): number {
  const f = Math.max(1e-5, fHz);
  const D = Math.max(0.2, depthM);
  const L = Math.max(0, armLengthM);
  const armFactor = Math.pow(1 + (0.5 * L) / (D * D * f), -1);
  const layerFactor = Math.pow(1 + D / 2000, -0.5);
  const transitFactor = Math.pow(1 + (f * D) / 5, -1);
  const qFactor =
    !Number.isFinite(qualityFactorQ) || qualityFactorQ > 500
      ? 1
      : Math.pow(1 + (f * D) / (Math.max(0.02, qualityFactorQ) * 1.6), -0.5);
  return (
    2.7e-14 *
    Math.pow(D, -2) *
    Math.pow(f, -29 / 6) *
    armFactor *
    layerFactor *
    transitFactor *
    qFactor
  );
}

/**
 * Smooth (uniform, non-turbulent) advected thermal flow baseline, showing the
 * exponential cutoff ~ exp(-omega D / v) from Creighton (2008) / Wang & Creighton §3.1.
 * Used purely to contrast laminar pass-by against cycloidal eddy modulation.
 */
export function smoothThermalAdvectionASD(params: {
  fHz: number;
  depthM: number;
  armLengthM: number;
  windSpeed?: number;
  temperatureASD?: number;
}): number {
  const f = Math.max(1e-5, params.fHz);
  const omega = 2 * Math.PI * f;
  const D = Math.max(0.2, params.depthM);
  const v = Math.max(0.2, params.windSpeed ?? CANONICAL_ENV.windSpeed);
  const turbulentRef = thermalTurbulentStrainASD({
    ...params,
    qualityFactorQ: 0.5,
  });
  // Smooth flow avoids cycloidal acceleration modulation and decays as exp(-omega D / v)
  const expFactor = Math.exp(-(omega * D) / v);
  const omegaDoverV = (omega * D) / v;
  // Recover the low-f envelope without the power-law eddy modulation
  return turbulentRef * (1 + omegaDoverV / 3) * expFactor;
}

/**
 * Peaked narrow-band turbulent spectrum for a single dominant eddy radius
 * R = v / (2 * pi * f_peak), touching the worst-case Q -> infinity locus at f_peak
 * and decaying steeply away from resonance (for illustrative plot overlays like Figs. 4-7).
 */
export function peakedEddySpectrumASD(params: {
  fHz: number;
  peakFreqHz: number;
  depthM: number;
  armLengthM: number;
  windSpeed?: number;
  bandwidth?: number;
}): number {
  const f = Math.max(1e-5, params.fHz);
  const fp = Math.max(1e-4, params.peakFreqHz);
  const sigmaLog = params.bandwidth ?? 0.22;
  const locusAtF = thermalTurbulentStrainASD({
    fHz: f,
    depthM: params.depthM,
    armLengthM: params.armLengthM,
    windSpeed: params.windSpeed,
    qualityFactorQ: Infinity,
  });
  const dist = Math.log(f / fp) / sigmaLog;
  return locusAtF * Math.exp(-0.5 * dist * dist);
}

/**
 * Surface structure effective standoff depth (§2.3):
 *   D_eff = (1/4) <r^(-1)>^(-1) = pi / integral_{upper hemisphere} r(theta, phi)^(-1) dOmega.
 *
 * Analytic values reported in Wang & Creighton (2025):
 *   - hemisphere of radius R: D_eff = 0.5 * R
 *   - infinite semicylinder of radius R: D_eff = (2 / pi) * R ≈ 0.6366 * R
 *   - half-cube of height h (base 2h x 2h): D_eff = 0.5480 * h
 */
export function effectiveShelterDepth(
  shape: ShelterGeometry,
  sizeParamM: number
): number {
  const s = Math.max(0.1, sizeParamM);
  if (shape === "hemisphere") return 0.5 * s;
  if (shape === "semicylinder") return (2 / Math.PI) * s;
  return 0.548 * s;
}

/**
 * Direct spherical quadrature over the upper hemisphere (2*pi sr) verifying
 * D_eff = pi * (integral (1/r) dOmega)^(-1) for a general half-box building of
 * width 2*halfWidth, length 2*halfLength, height H (test mass at floor centre).
 */
export function numericalBoxEffectiveDepth(
  halfWidthM: number,
  halfLengthM: number,
  heightM: number,
  nTheta = 64,
  nPhi = 128
): number {
  const W = Math.max(0.1, halfWidthM);
  const L = Math.max(0.1, halfLengthM);
  const H = Math.max(0.1, heightM);
  let integralInvR = 0;
  const dTheta = (Math.PI * 0.5) / nTheta;
  const dPhi = (2 * Math.PI) / nPhi;

  for (let it = 0; it < nTheta; it++) {
    const theta = (it + 0.5) * dTheta;
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    for (let ip = 0; ip < nPhi; ip++) {
      const phi = (ip + 0.5) * dPhi;
      const nx = sinT * Math.cos(phi);
      const ny = sinT * Math.sin(phi);
      const nz = cosT;
      const rx = Math.abs(nx) > 1e-12 ? W / Math.abs(nx) : Infinity;
      const ry = Math.abs(ny) > 1e-12 ? L / Math.abs(ny) : Infinity;
      const rz = nz > 1e-12 ? H / nz : Infinity;
      const r = Math.min(rx, ry, rz);
      integralInvR += (1 / r) * sinT * dTheta * dPhi;
    }
  }
  return Math.PI / integralInvR;
}

/** Log-log interpolation of a digitized detector sensitivity curve. */
export function interpolateDetectorASD(
  profile: DetectorProfile,
  fHz: number
): number | null {
  const c = profile.curve;
  if (fHz < c[0].f || fHz > c[c.length - 1].f) return null;
  for (let i = 0; i < c.length - 1; i++) {
    const a = c[i];
    const b = c[i + 1];
    if (fHz >= a.f && fHz <= b.f) {
      const t =
        (Math.log10(fHz) - Math.log10(a.f)) /
        Math.max(1e-12, Math.log10(b.f) - Math.log10(a.f));
      const logAsd =
        Math.log10(a.asd) + t * (Math.log10(b.asd) - Math.log10(a.asd));
      return Math.pow(10, logAsd);
    }
  }
  return c[c.length - 1].asd;
}

/** Find first crossover frequency where NN exceeds detector design sensitivity. */
export function findNoiseCrossoverHz(
  profile: DetectorProfile,
  nnCurveFn: (fHz: number) => number
): number | null {
  const band = findExceededBandHz(profile, nnCurveFn);
  return band.fMaxExceededHz ?? band.fMinExceededHz;
}

/**
 * Find the frequency band [fMinExceededHz, fMaxExceededHz] inside the detector's
 * tabulated band where atmospheric Newtonian noise exceeds detector design sensitivity.
 */
export function findExceededBandHz(
  profile: DetectorProfile,
  nnCurveFn: (fHz: number) => number
): {
  exceeds: boolean;
  fMinExceededHz: number | null;
  fMaxExceededHz: number | null;
} {
  const fMin = profile.curve[0].f;
  const fMax = profile.curve[profile.curve.length - 1].f;
  const steps = 180;
  let minF: number | null = null;
  let maxF: number | null = null;
  for (let i = 0; i <= steps; i++) {
    const f = fMin * Math.pow(fMax / fMin, i / steps);
    const det = interpolateDetectorASD(profile, f);
    if (!det) continue;
    if (nnCurveFn(f) >= det) {
      if (minF === null) minF = f;
      maxF = f;
    }
  }
  return {
    exceeds: minF !== null,
    fMinExceededHz: minF,
    fMaxExceededHz: maxF,
  };
}

/**
 * Active temperature-sensing array size estimate from §5 Discussion:
 * correlation scale l_corr ≈ v / (2*pi*f), independent parcels in volume ~ D^3
 * scale as N ≈ (D / l_corr)^3 = (2 * pi * f * D / v)^3.
 */
export function activeSubtractionSensorCount(
  fHz: number,
  depthM: number,
  windSpeed: number = CANONICAL_ENV.windSpeed
): {
  eddyLengthScaleM: number;
  parcelCount: number;
  deltaTempMkRequired: number;
} {
  const omega = 2 * Math.PI * Math.max(1e-3, fHz);
  const v = Math.max(0.2, windSpeed);
  const l = v / omega;
  const parcelCount = Math.pow(Math.max(1, depthM / l), 3);
  return {
    eddyLengthScaleM: l,
    parcelCount,
    deltaTempMkRequired: 1, // order ~1 mK per Section 5
  };
}

/* --------------------------------------------------------------------------
 * Appendix A.1: 1D Kolmogorov-correlated cycloidal numerical simulation
 * -------------------------------------------------------------------------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianPair(rng: () => number): [number, number] {
  const u1 = Math.max(1e-12, rng());
  const u2 = rng();
  const mag = Math.sqrt(-2 * Math.log(u1));
  return [mag * Math.cos(2 * Math.PI * u2), mag * Math.sin(2 * Math.PI * u2)];
}

/** In-place radix-2 Cooley-Tukey FFT (length n must be a power of 2). */
function fft1D(re: Float64Array, im: Float64Array, inverse = false): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i];
      re[i] = re[j];
      re[j] = tr;
      const ti = im[i];
      im[i] = im[j];
      im[j] = ti;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = ((inverse ? 2 : -2) * Math.PI) / len;
    const wlenR = Math.cos(ang);
    const wlenI = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wR = 1;
      let wI = 0;
      for (let j = 0; j < len / 2; j++) {
        const uR = re[i + j];
        const uI = im[i + j];
        const idx2 = i + j + len / 2;
        const vR = re[idx2] * wR - im[idx2] * wI;
        const vI = re[idx2] * wI + im[idx2] * wR;
        re[i + j] = uR + vR;
        im[i + j] = uI + vI;
        re[idx2] = uR - vR;
        im[idx2] = uI - vI;
        const nextR = wR * wlenR - wI * wlenI;
        wI = wR * wlenI + wI * wlenR;
        wR = nextR;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) {
      re[i] /= n;
      im[i] /= n;
    }
  }
}

/**
 * Eq. (eq:sh-peak-1d) from Appendix A.1: analytic peak strain ASD sqrt(S_h)
 * for a 1D linear density perturbation of notional cross-section deltaA = 1 m^2
 * moving on a cycloid of radius R = v / omega at height D above the test mass.
 */
export function theoreticalPeak1D(params: {
  fHz: number;
  depthM: number;
  armLengthM: number;
  windSpeed?: number;
  thetaDeg?: number;
  deltaAM2?: number;
  cT2?: number;
  p?: number;
}): number {
  const omega = 2 * Math.PI * Math.max(1e-4, params.fHz);
  const D = Math.max(0.5, params.depthM);
  const L = Math.max(1, params.armLengthM);
  const v = Math.max(0.5, params.windSpeed ?? 10);
  const cosTheta = Math.cos(((params.thetaDeg ?? 40) * Math.PI) / 180);
  const deltaA = params.deltaAM2 ?? 1;
  const cT2 = params.cT2 ?? CANONICAL_ENV.cT2Peak;
  const p = params.p ?? CANONICAL_ENV.kolmogorovP;
  // Appendix A Eq. (eq:sh-peak-1d) uses A(p) = (p + 1) * sin(p*pi/2) * Gamma(p+1) ≈ 1.303
  const ApEff = 1.303;
  const Sh =
    ((2 *
      cosTheta *
      cosTheta *
      G_NEWTON *
      G_NEWTON *
      CANONICAL_ENV.rho0 ** 2 *
      deltaA *
      deltaA) /
      (Math.pow(D, 4) * L * L)) *
    (cT2 / (CANONICAL_ENV.temperature0 ** 2)) *
    (Math.pow(v, p + 2) / Math.pow(omega, p + 7)) *
    ApEff;
  return Math.sqrt(Math.max(0, Sh));
}

export interface Cycloidal1DSimResult {
  cycloidRadiusM: number;
  predictedPeakFreqHz: number;
  simulatedPeakFreqHz: number;
  simulatedPeakAsd: number;
  analyticPeakAsd: number;
  timeSeries: Array<{ t: number; dgX: number }>;
  spectrum: Array<{ f: number; asd: number }>;
  structureCheck: Array<{ dr: number; empirical: number; theory: number }>;
  parcelProfile: Array<{ x: number; dT: number }>;
}

/**
 * Deterministic browser-grade 1D Monte Carlo validation following Appendix A.1:
 *  1) Generates uncorrelated Gaussian deviates on a 2048 m ribbon (dx = 0.5 m)
 *  2) Filters in Fourier space by (k^2 + k_cut^2)^(-(1+p)/4) to impose Kolmogorov p=2/3 correlations
 *  3) Measures empirical structure function D_T(dr) and rescales to c_T^2 * dr^p
 *  4) Translates parcels on cycloid x(t) = v*t + R*cos(Omega*t), z(t) = D + R*sin(Omega*t)
 *     passing over test mass at origin, computing dg_x(t) along arm angle theta
 *  5) Computes Hann-windowed DFT power spectral density sqrt(S_h(f)) via FFT.
 */
export function runCycloidal1DSimulation(options: {
  cycloidRadiusM: number;
  windSpeed?: number;
  depthM?: number;
  armLengthM?: number;
  thetaDeg?: number;
  seed?: number;
}): Cycloidal1DSimResult {
  const v = Math.max(1, options.windSpeed ?? 10);
  const D = Math.max(1.5, options.depthM ?? 4);
  const R = Math.max(0.15, Math.min(D * 0.72, options.cycloidRadiusM));
  const L = Math.max(100, options.armLengthM ?? 4000);
  const thetaDeg = options.thetaDeg ?? 40;
  const cosTheta = Math.cos((thetaDeg * Math.PI) / 180);
  const sinTheta = Math.sin((thetaDeg * Math.PI) / 180);
  const p = CANONICAL_ENV.kolmogorovP;
  const cT2 = CANONICAL_ENV.cT2Peak;
  const deltaA = 1.0;

  const omega = v / R;
  const predictedPeakFreqHz = omega / (2 * Math.PI);

  // Ribbon grid (power of 2 for exact FFT convolution; dx=0.25m resolves sub-metre eddies)
  const nGrid = 4096;
  const dx = 0.25;
  const ribbonLengthM = nGrid * dx; // 1024 m
  const cutoffM = 40; // large-scale saturation outside measurement band [0.25 m .. 4 m]
  const kCut = (2 * Math.PI) / cutoffM;

  const rng = mulberry32(options.seed ?? 20250508);
  const re = new Float64Array(nGrid);
  const im = new Float64Array(nGrid);
  for (let i = 0; i < nGrid; i += 2) {
    const [z0, z1] = gaussianPair(rng);
    re[i] = z0;
    if (i + 1 < nGrid) re[i + 1] = z1;
  }

  fft1D(re, im, false);
  for (let i = 0; i < nGrid; i++) {
    const kIdx = i <= nGrid / 2 ? i : i - nGrid;
    const k = (2 * Math.PI * kIdx) / ribbonLengthM;
    const amp = i === 0 ? 0 : Math.pow(k * k + kCut * kCut, -(1 + p) / 4);
    re[i] *= amp;
    im[i] *= amp;
  }
  fft1D(re, im, true);

  // Measure empirical structure function and rescale to D_T(1 m) = c_T^2 * (1 m)^p
  const measureLag = (lagSteps: number) => {
    let sumSq = 0;
    const count = nGrid - lagSteps;
    for (let i = 0; i < count; i++) {
      const diff = re[i] - re[i + lagSteps];
      sumSq += diff * diff;
    }
    return sumSq / Math.max(1, count);
  };

  const refLagSteps = 4; // dr = 1.0 m
  const rawRefDt = measureLag(refLagSteps);
  const targetRefDt = cT2 * Math.pow(refLagSteps * dx, p);
  const tempScale = Math.sqrt(targetRefDt / Math.max(1e-18, rawRefDt));

  const tempField = new Float64Array(nGrid);
  for (let i = 0; i < nGrid; i++) {
    tempField[i] = re[i] * tempScale;
  }

  const structureCheck = [1, 2, 4, 8, 16].map((steps) => {
    const dr = steps * dx;
    return {
      dr,
      empirical: measureLag(steps) * tempScale * tempScale,
      theory: cT2 * Math.pow(dr, p),
    };
  });

  // Taper outermost 12% so finite ribbon entry/exit produces no step-discontinuity tail
  const dMass = new Float64Array(nGrid);
  for (let i = 0; i < nGrid; i++) {
    const frac = i / (nGrid - 1);
    let win = 1;
    if (frac < 0.12) {
      win = 0.5 * (1 - Math.cos((Math.PI * frac) / 0.12));
    } else if (frac > 0.88) {
      win = 0.5 * (1 - Math.cos((Math.PI * (1 - frac)) / 0.12));
    }
    const dRho = -CANONICAL_ENV.rho0 * (tempField[i] / CANONICAL_ENV.temperature0);
    dMass[i] = dRho * deltaA * dx * win;
  }

  // Time series sampling over T = 48 s, N = 2048 (dt ≈ 0.0234 s, f_nyquist ≈ 21.3 Hz)
  const durationS = 48;
  const nSamples = 2048;
  const dt = durationS / nSamples;
  const ts = new Float64Array(nSamples);

  for (let n = 0; n < nSamples; n++) {
    const t = n * dt;
    const cycX = R * Math.cos(omega * t);
    const cycZ = D + R * Math.sin(omega * t);
    const travelX = v * (t - durationS * 0.5);

    // Only scan parcel indices within ±140 m of test mass
    const centerIdxFloat = nGrid / 2 - (travelX + cycX) / dx;
    const halfSpan = Math.ceil(140 / dx);
    const iStart = Math.max(0, Math.floor(centerIdxFloat - halfSpan));
    const iEnd = Math.min(nGrid - 1, Math.ceil(centerIdxFloat + halfSpan));

    let gx = 0;
    for (let i = iStart; i <= iEnd; i++) {
      const s0 = (i - nGrid / 2) * dx;
      const xAlongStream = s0 + travelX + cycX;
      const px = xAlongStream * cosTheta;
      const py = xAlongStream * sinTheta;
      const pz = cycZ;
      const r2 = px * px + py * py + pz * pz;
      const r3 = r2 * Math.sqrt(r2);
      gx += (G_NEWTON * dMass[i] * px) / r3;
    }
    ts[n] = gx;
  }

  // Hann-windowed FFT -> PSD S_h(f)
  const specRe = new Float64Array(nSamples);
  const specIm = new Float64Array(nSamples);
  let hannNorm = 0;
  for (let n = 0; n < nSamples; n++) {
    const w = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (nSamples - 1)));
    specRe[n] = ts[n] * w;
    hannNorm += w * w;
  }
  fft1D(specRe, specIm, false);

  const df = 1 / durationS;
  const binData: Array<{ f: number; asd: number }> = [];
  for (let k = 1; k <= nSamples / 2; k++) {
    const f = k * df;
    if (f < 0.1 || f > 12.0) continue;
    const magSq = specRe[k] * specRe[k] + specIm[k] * specIm[k];
    // Discrete Parseval PSD using paper's S_h(f) = (1/(L^2 omega^4 T)) |dg~(f)|^2 convention
    const dgTildeSq = magSq * dt * dt * (nSamples / hannNorm);
    const omegaF = 2 * Math.PI * f;
    const Sh = dgTildeSq / (L * L * Math.pow(omegaF, 4) * durationS);
    binData.push({ f, asd: Math.sqrt(Math.max(1e-60, Sh)) });
  }

  // Smooth to log-spaced spectral curve (local RMS in log-frequency window)
  const spectrum: Array<{ f: number; asd: number }> = [];
  const nOut = 54;
  for (let oi = 0; oi < nOut; oi++) {
    const fc = 0.14 * Math.pow(11.0 / 0.14, oi / (nOut - 1));
    let sumSq = 0;
    let count = 0;
    for (const b of binData) {
      if (Math.abs(Math.log(b.f / fc)) <= 0.09) {
        sumSq += b.asd * b.asd;
        count++;
      }
    }
    if (count > 0) {
      spectrum.push({ f: fc, asd: Math.sqrt(sumSq / count) });
    } else {
      let nearest = binData[0];
      for (const b of binData) {
        if (Math.abs(b.f - fc) < Math.abs(nearest.f - fc)) nearest = b;
      }
      spectrum.push({ f: fc, asd: nearest.asd });
    }
  }

  let simulatedPeakFreqHz = predictedPeakFreqHz;
  let simulatedPeakAsd = 0;
  let bestNorm = 0;
  for (const pt of spectrum) {
    if (pt.f >= predictedPeakFreqHz * 0.6 && pt.f <= predictedPeakFreqHz * 1.75) {
      const locusAtBin = theoreticalPeak1D({
        fHz: pt.f,
        depthM: D,
        armLengthM: L,
        windSpeed: v,
        thetaDeg,
        deltaAM2: deltaA,
      });
      const norm = pt.asd / Math.max(1e-60, locusAtBin);
      if (norm > bestNorm) {
        bestNorm = norm;
        simulatedPeakAsd = pt.asd;
        simulatedPeakFreqHz = pt.f;
      }
    }
  }

  const parcelProfile: Array<{ x: number; dT: number }> = [];
  const centerIdx = Math.floor(nGrid / 2);
  for (let k = -90; k <= 90; k += 2) {
    parcelProfile.push({
      x: k * dx,
      dT: tempField[centerIdx + k],
    });
  }

  const timeSeries = Array.from({ length: 160 }, (_, idx) => {
    const sIdx = Math.floor((idx / 159) * (nSamples - 1));
    return { t: sIdx * dt, dgX: ts[sIdx] };
  });

  return {
    cycloidRadiusM: R,
    predictedPeakFreqHz,
    simulatedPeakFreqHz,
    simulatedPeakAsd,
    analyticPeakAsd: theoreticalPeak1D({
      fHz: predictedPeakFreqHz,
      depthM: D,
      armLengthM: L,
      windSpeed: v,
      thetaDeg,
      deltaAM2: deltaA,
    }),
    timeSeries,
    spectrum,
    structureCheck,
    parcelProfile,
  };
}
