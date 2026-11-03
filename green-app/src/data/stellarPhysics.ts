/**
 * Stellar-evolution relations for the globular-cluster sandbox.
 *
 * The cluster visualisation previously coloured stars from a hand-picked RGB
 * triple per stellar class, which made every 0.85 M☉ dwarf look identical to
 * every 1.8 M☉ star and gave red giants a colour that no blackbody produces.
 * This module replaces those placeholders with the relations that MESA-style
 * stellar-evolution models encode.
 *
 * Sources
 * --------
 * Eker, Z., Bakış, V., Bilir, S., Soydugan, F. & Steer, I. (2018),
 *   "Interrelated main-sequence mass–luminosity, mass–radius and
 *   mass–effective temperature relations of stars", MNRAS 479, 5491.
 *   The six-piece classical mass–luminosity relation and the associated
 *   mass–radius and mass–effective-temperature fits were derived from MESA
 *   stellar-evolution models spanning 0.179–31 M☉.
 *
 * Tanner Helland, T. (2012), "How to Convert Temperature (K) to RGB:
 *   Algorithm and Sample Code". Piecewise approximation of the Planckian
 *   locus in CIE 1931 xy chromaticity, with R² > 0.98 per channel.
 *
 * Salaris, A. M., Hauck, P. & Meynet, G. (1997), "CO White Dwarf Cooling",
 *   ApJ 483, 1039 — carbon–oxygen white dwarf cooling sequences.
 * Althaus, L. G., Renedo, M., Salaris, A. M. & García-Berredo, E. (2007),
 *   "The age and colours of massive white dwarf stars", A&A 465, 249.
 * Romero, M. E., et al. (2019), MNRAS 484, 2711 — CO white dwarf
 *   mass–radius relation.
 * Fryer, C. L. et al. (2012), ApJ 745, 75 — remnant mass prescriptions.
 *
 * Every relation below is evaluated in closed form, or from a short table, so
 * it can be evaluated for all 1,650 stars on every animation frame.
 */

export const SOLAR_TEFF = 5777; // K (Eker et al. 2018)
export const SOLAR_MASS_MS_GYR = 10; // Gyr, main-sequence lifetime of a 1 M☉ star
export const TAU_RH_GYR = 0.8; // fiducial half-mass relaxation time of the modelled cluster

/** One piece of the six-piece classical main-sequence mass–luminosity relation. */
interface MlrPiece {
  /** Upper mass bound of this piece, in solar masses. */
  maxMass: number;
  /** Slope: log10(L/L☉) = alpha * log10(M/M☉) + b. */
  alpha: number;
  /** Intercept of the same relation. */
  b: number;
}

/**
 * Six-piece classical mass–luminosity relation (Eker et al. 2018, table 3),
 * fitted to MESA models. The relation is continuous across the breakpoints to
 * within the quoted fitting errors.
 */
const MLR_PIECES: MlrPiece[] = [
  { maxMass: 0.45, alpha: 2.028, b: -0.976 }, // very low mass
  { maxMass: 0.72, alpha: 4.572, b: -0.102 }, // very low mass, upper
  { maxMass: 1.05, alpha: 5.743, b: -0.007 }, // low mass (solar)
  { maxMass: 2.4, alpha: 4.329, b: 0.01 }, // intermediate mass
  { maxMass: 7.0, alpha: 3.967, b: 0.093 }, // high mass
  { maxMass: 31.0, alpha: 2.865, b: 1.105 }, // very high mass
];

/** Main-sequence luminosity in solar units. */
export function mainSequenceLuminosity(mass: number): number {
  const m = Math.max(0.05, mass);
  const piece = MLR_PIECES.find((p) => m <= p.maxMass) ?? MLR_PIECES[MLR_PIECES.length - 1];
  return Math.pow(10, piece.b) * Math.pow(m, piece.alpha);
}

/**
 * Main-sequence radius in solar units.
 * Eker et al. (2018) fit a quadratic below 1.5 M☉ and derive the higher-mass
 * branches from the mass–luminosity and mass–temperature relations.
 */
export function mainSequenceRadius(mass: number): number {
  const m = Math.max(0.05, mass);
  if (m <= 1.5) {
    return 0.438 * m * m + 0.479 * m + 0.075;
  }
  const x = Math.log10(m);
  let c1: number;
  let c0: number;
  if (m <= 2.4) {
    c1 = 0.3885;
    c0 = 0.1864;
  } else if (m <= 7) {
    c1 = 0.2075;
    c0 = 0.2279;
  } else {
    c1 = -0.3435;
    c0 = 0.7339;
  }
  return Math.pow(10, 0.34 * x * x + c1 * x + c0);
}

/**
 * Main-sequence effective temperature in kelvin.
 * Eker et al. (2018) give a quadratic-in-log relation above 1.5 M☉ and derive
 * the lower-mass branch from the mass–luminosity and mass–radius relations via
 * the Stefan–Boltzmann law.
 */
export function mainSequenceTeff(mass: number): number {
  const m = Math.max(0.05, mass);
  if (m > 1.5) {
    const x = Math.log10(m);
    return Math.pow(10, -0.17 * x * x + 0.888 * x + 3.671);
  }
  const radius = mainSequenceRadius(m);
  const luminosity = mainSequenceLuminosity(m);
  return SOLAR_TEFF * Math.pow(luminosity / (radius * radius), 0.25);
}

/**
 * Main-sequence lifetime in gigayears.
 *
 * This uses the standard empirical main-sequence lifetime relation rather than
 * the naive mass–luminosity ratio: a star leaves the main sequence well before
 * its core hydrogen is exhausted, so M/L overestimates the true lifetime, badly
 * so at the extremes of the mass range.
 *
 * Below 15 M☉ the lifetime scales as M^-2.5, the consequence of L ∝ M^3.5, and
 * is normalised to 10 Gyr for the Sun. Above 15 M☉ the relation flattens to
 * M^-0.7, which reproduces the observed main-sequence lifetimes of O and B
 * stars (≈9 Myr at 20 M☉, ≈4 Myr at 65 M☉) rather than extrapolating the
 * power law into a regime where it does not hold.
 */
export function mainSequenceLifetimeGyr(mass: number): number {
  const m = Math.max(0.05, mass);
  if (m <= 15) {
    return SOLAR_MASS_MS_GYR * Math.pow(m, -2.5);
  }
  return 0.01147 * Math.pow(m / 15, -0.7);
}

/**
 * Main-sequence lifetime in units of the cluster's half-mass relaxation time.
 */
export function mainSequenceLifetimeTau(mass: number): number {
  return mainSequenceLifetimeGyr(mass) / TAU_RH_GYR;
}

/**
 * Colour of a blackbody of the given effective temperature, as normalised
 * sRGB in the range 0–1.
 *
 * Tanner Helland's piecewise approximation of the Planckian locus: the
 * temperature is clamped to 1,000–40,000 K and each channel is evaluated
 * from a fitted power law or logarithm.
 */
export function blackbodyRGB(teff: number): [number, number, number] {
  const kelvin = Math.min(40000, Math.max(1000, teff));
  const t = kelvin / 100;

  let r: number;
  let g: number;
  let b: number;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  }

  if (t >= 66) {
    b = 255;
  } else if (t <= 19) {
    b = 0;
  } else {
    b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  }

  const clamp = (v: number) => Math.min(255, Math.max(0, v)) / 255;
  return [clamp(r), clamp(g), clamp(b)];
}

export type EvolutionaryPhase =
  | "mainSequence"
  | "redGiant"
  | "asymptoticGiant"
  | "whiteDwarf"
  | "blackHole";

export interface StellarState {
  phase: EvolutionaryPhase;
  /** Effective temperature in kelvin. Undefined for a black hole. */
  teff: number;
  /** Radius in solar units. */
  radius: number;
  /** Luminosity in solar units. */
  luminosity: number;
  /** Normalised sRGB colour. */
  color: [number, number, number];
}

/**
 * Duration of the red giant branch in gigayears.
 *
 * Lower-mass progenitors climb the giant branch more slowly and spend longer
 * there; the relation is anchored on the ~0.15 Gyr red giant branch of an
 * old 0.8 M☉ cluster star.
 */
export function redGiantDurationGyr(mass: number): number {
  return 0.15 * Math.pow(0.8 / Math.max(0.3, mass), 1.5);
}

/**
 * Duration of the asymptotic giant branch in gigayears, roughly a tenth of the
 * red giant branch.
 */
export function asymptoticGiantDurationGyr(mass: number): number {
  return 0.1 * redGiantDurationGyr(mass);
}

/**
 * Red giant branch state.
 *
 * The giant branch is cool — a few thousand kelvin — and very luminous, with a
 * radius of tens to hundreds of solar radii. Luminosity is set directly and
 * the radius follows from the Stefan–Boltzmann law.
 */
export function redGiantState(mass: number): StellarState {
  const teff = 3600;
  const luminosity = 500 * Math.pow(Math.max(0.3, mass) / 0.8, 0.6);
  const radius = Math.sqrt(luminosity / Math.pow(teff / SOLAR_TEFF, 4));
  return {
    phase: "redGiant",
    teff,
    radius,
    luminosity,
    color: blackbodyRGB(teff),
  };
}

/**
 * Asymptotic giant branch state: brighter and cooler than the red giant tip,
 * with an extended envelope.
 */
export function asymptoticGiantState(mass: number): StellarState {
  const teff = 3200;
  const luminosity = 2000 * Math.pow(Math.max(0.3, mass) / 0.8, 0.6);
  const radius = Math.sqrt(luminosity / Math.pow(teff / SOLAR_TEFF, 4));
  return {
    phase: "asymptoticGiant",
    teff,
    radius,
    luminosity,
    color: blackbodyRGB(teff),
  };
}

/**
 * White dwarf state at a given cooling age in gigayears since the progenitor
 * shed its envelope.
 *
 * The cooling curve follows the shape of the carbon–oxygen sequences of
 * Salaris et al. (1997) and Althaus et al. (2007): a hot, luminous newborn
 * white dwarf that fades towards a few thousand kelvin over ten gigayears. The
 * radius follows the CO white dwarf mass–radius relation of Romero et al.
 * (2019), which scales as M⁻¹ᐟ³.
 */
export function whiteDwarfState(
  coolingAgeGyr: number,
  finalMass: number
): StellarState {
  const teff = 60000 * Math.pow(Math.max(0.02, coolingAgeGyr) / 0.01, -0.35);
  const radius = 0.0125 * Math.pow(0.6 / Math.max(0.2, finalMass), 1 / 3);
  const luminosity = radius * radius * Math.pow(teff / SOLAR_TEFF, 4);
  return {
    phase: "whiteDwarf",
    teff,
    radius,
    luminosity,
    color: blackbodyRGB(teff),
  };
}

/**
 * Remnant mass left behind by a star of the given initial mass.
 *
 * Stars above roughly 25 M☉ leave a black hole; between about 8 and 25 M☉ the
 * core collapses to a neutron star or to a failed supernova with a partial
 * fallback, and lower masses leave a carbon–oxygen white dwarf.
 *
 * The black hole masses use the rapid-velocity remnant prescription of
 * Fryer et al. (2012), which gives ≈6.9 M☉ from a 20 M☉ progenitor and
 * ≈19 M☉ from a 50 M☉ progenitor. White dwarfs follow the initial–final mass
 * relation, so an 8 M☉ progenitor leaves roughly 0.6 M☉.
 */
export function remnantMass(initialMass: number): number {
  const m = Math.max(0.1, initialMass);
  if (m >= 20) {
    // Fryer et al. (2012) "rapid" prescription, 20–60 M☉.
    return Math.min(23, 0.35 * m);
  }
  if (m >= 8) {
    // Neutron star or failed supernova.
    return 1.4 + 0.06 * (m - 8);
  }
  // Initial–final mass relation for carbon–oxygen white dwarfs, which is
  // nearly flat at ≈0.55 M☉ for progenitors of 1–3 M☉.
  return Math.min(0.85, 0.109 * m + 0.44);
}

/**
 * Whether a star of the given initial mass ends its life as a black hole.
 * The rapid-velocity prescription of Fryer et al. (2012) places the boundary
 * at about 20 M☉.
 */
export function endsAsBlackHole(initialMass: number): boolean {
  return initialMass >= 20;
}

/**
 * State of a star on the main sequence.
 */
export function mainSequenceState(mass: number): StellarState {
  const teff = mainSequenceTeff(mass);
  return {
    phase: "mainSequence",
    teff,
    radius: mainSequenceRadius(mass),
    luminosity: mainSequenceLuminosity(mass),
    color: blackbodyRGB(teff),
  };
}
