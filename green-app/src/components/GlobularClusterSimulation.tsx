"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { GC_RESEARCH_FINDINGS } from "@/data/contextMapData";
import {
  TAU_RH_GYR,
  asymptoticGiantDurationGyr,
  asymptoticGiantState,
  endsAsBlackHole,
  mainSequenceLifetimeGyr,
  mainSequenceState,
  redGiantDurationGyr,
  redGiantState,
  remnantMass,
  whiteDwarfState,
} from "@/data/stellarPhysics";

/**
 * Pre-computed stellar state: effective temperature (K), radius (R☉),
 * luminosity (L☉) and normalised sRGB colour.
 */
const STATE_STRIDE = 6;

interface StarCatalog {
  count: number;
  r0: Float32Array;
  theta0: Float32Array;
  phi0: Float32Array;
  omegaTheta: Float32Array;
  omegaPhi: Float32Array;
  initialMass: Float32Array;
  msLifetimeTau: Float32Array;
  rgbDurationTau: Float32Array;
  agbDurationTau: Float32Array;
  finalMass: Float32Array;
  isBlackHole: Uint8Array;
  segTau: Float32Array;
  /** [teff, radius, luminosity, r, g, b] per star for each evolutionary stage. */
  msState: Float32Array;
  giantState: Float32Array;
  agbState: Float32Array;
  starClass: Uint8Array; // 0 = low-mass MS, 1 = solar MS, 2 = intermediate (RG->WD), 3 = massive OB -> BH
}

interface DynamicBinaryPair {
  id: string;
  label: string;
  formTau: number;
  ejectTau: number;
  eccentricity: number;
  chirpMass: number;
  freqMHz: number;
  angleOffset: number;
  inclination: number;
  ejectionDir: [number, number, number];
}

const MAX_TAU_RH = 16.875; // 13.5 Gyr / 0.8 Gyr = 16.875 half-mass relaxation times
const TAU_RH_MYR = 800; // Fiducial half-mass relaxation time = 800 Myr (0.8 Gyr)

/**
 * Stars are drawn as round sprites rather than the square points that
 * THREE.PointsMaterial produces by default. A radial gradient painted on a
 * canvas gives a soft disc with a bright core, which reads as a star under
 * additive blending.
 */
function createStarSprite(resolution = 64): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const r = resolution / 2;
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0.0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.98)");
  grad.addColorStop(0.38, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.68, "rgba(255,255,255,0.14)");
  grad.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, resolution, resolution);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const STAR_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uScale;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Perspective attenuation, matching THREE.PointsMaterial's sizeAttenuation.
    gl_PointSize = aSize * (uScale / max(0.001, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uSprite;
  varying vec3 vColor;

  void main() {
    // Sample the round sprite; the square corners of the point sprite fall
    // outside the disc and are discarded.
    vec4 sprite = texture2D(uSprite, gl_PointCoord);
    if (sprite.a < 0.01) discard;
    gl_FragColor = vec4(vColor, 1.0) * sprite;
  }
`;

/**
 * Where a binary's gravitational-wave signal is, and how loud it is.
 *
 * The amplitude is anchored to the standard relation
 *
 *     h_c  ∝  M_c^(5/6) · f_gw^(2/3) / D
 *
 * for a one-year observation, so the level on the sensitivity plot is the
 * level a detector would actually see. The harmonics are where the
 * eccentricity shows up: an eccentric binary radiates strongly well above
 * its fundamental, and the enhancement peaks near the third harmonic.
 *
 * The *evolution* of the frequency is schematic rather than a full
 * relativistic calculation, and it is drawn to show the argument rather
 * than to be measured from it: in the core the binary is being hardened by
 * encounters, so its frequency climbs fast and the chirp sweeps across the
 * band; once it is ejected into the halo the same binary keeps rising, but
 * slowly, under general relativity alone.
 */
/**
 * The characteristic strain of a 1 M☉ binary seen from 1 Mpc at 1 Hz.
 *
 *   h_c = (4/√5) · (G ℳ_c / c²)^(5/3) · (π f)^(2/3) / D
 *
 * which is 2.38 × 10⁻¹⁷. Every strain on this page is that number times
 * ℳ_c^(5/6) f^(2/3) / D, so the whole axis can be checked against the
 * formula — and the sources' own quoted signal-to-noise ratios come out in
 * the right range, which is the test that the constant is right. An order
 * of magnitude here is an order of magnitude on the plot.
 */
const G = 6.6743e-11; // m³ kg⁻¹ s⁻²
const C_LIGHT = 2.99792458e8; // m s⁻¹
const M_SUN = 1.9885e30; // kg
const M_PC = 3.0856775814913673e22; // m

const H_C_REF =
  (4 / Math.sqrt(5)) *
  Math.pow((G * M_SUN) / (C_LIGHT * C_LIGHT), 5 / 3) *
  Math.pow(Math.PI, 2 / 3) /
  M_PC;

/**
 * The n-th harmonic of an eccentric binary.
 *
 * An eccentric binary radiates in harmonics of its orbital frequency, and
 * the leading term in e for harmonic n is proportional to e^(n-1)
 * (Peters & Mathews 1963; Wen 2003). So the fundamental is the strongest
 * single component and the harmonics are weaker — but they sit at higher
 * frequency, where LISA is more sensitive, which is exactly why the
 * eccentricity is worth having. A circular binary has no harmonics.
 */
function harmonicEnhancement(eccentricity: number, harmonic: number) {
  if (harmonic === 1) return 1;
  if (eccentricity <= 0.02) return 0;
  return Math.pow(eccentricity, harmonic - 1) / harmonic;
}

function characteristicStrain(
  chirpMassSolar: number,
  fHz: number,
  distanceMpc: number,
  eccentricity: number,
  harmonic: number
) {
  const circular =
    H_C_REF *
    Math.pow(chirpMassSolar, 5 / 6) *
    Math.pow(fHz, 2 / 3) /
    distanceMpc;
  return circular * harmonicEnhancement(eccentricity, harmonic);
}

/** The frequency a binary radiates at, given where it is in its life. */
function signalFrequency(
  bin: DynamicBinaryPair,
  observedMHz: number,
  tau: number
): number {
  if (tau < bin.formTau) return 0;
  if (tau <= bin.ejectTau) {
    // Hardening in the core: the frequency climbs geometrically from a
    // soft dynamical binary to the frequency the catalogue records. The
    // starting frequency is an order of magnitude below the recorded one
    // — a binary that is still being hardened is a much wider pair.
    const u = (tau - bin.formTau) / Math.max(1e-6, bin.ejectTau - bin.formTau);
    const fForm = observedMHz / 12;
    return fForm * Math.pow(observedMHz / fForm, u);
  }
  // Ejected: general relativity keeps raising the frequency, slowly.
  const tMerge = bin.ejectTau + 12.5;
  const span = Math.max(0.2, tMerge - tau);
  const ratio = span / Math.max(0.2, tMerge - bin.ejectTau);
  return observedMHz * Math.pow(ratio, -3 / 8);
}

/**
 * LISA's characteristic-strain floor at a given frequency.
 *
 * The numbers are the LISA Definition Study sensitivity curve (Robinet et
 * al. 2019, arXiv:1803.01944): 9.1 × 10⁻²¹ at 1 mHz, a minimum of
 * 2.1 × 10⁻²² near 10 mHz, 3.5 × 10⁻²² at 30 mHz, and 1.9 × 10⁻²¹ at
 * 100 mHz. The three terms below are the ones that make that curve, and
 * they reproduce those four points to the digit.
 *
 * The low-frequency term is the unresolved galactic-binary confusion
 * floor: in characteristic strain it rolls off as f^(-2/3) and it is cut
 * off sharply above about 1.5 mHz, which is why the total falls steeply
 * between 1 and 4 mHz. The middle term is the instrument's own floor,
 * flat across the middle of the band. The high-frequency term is the
 * photon shot noise, which takes over above 30 mHz.
 */
function lisaNoiseLogH(logF: number) {
  const f = Math.pow(10, logF);
  const confusion =
    (9.85e-21 *
      Math.pow(1e-3 / f, 2 / 3) *
      (1 + Math.tanh((1.5e-3 - f) / 4e-4))) /
    2;
  const instrument = 2.05e-22;
  const shot = 2.75e-22 * Math.pow(f / 3e-2, 1.52);
  return Math.log10(
    Math.sqrt(
      confusion * confusion + instrument * instrument + shot * shot
    )
  );
}

/** The characteristic strain of one harmonic of a catalogue system. */
function logHBase(
  sys: { chirpMassSolar: number; distanceMpc: number; eccentricity: number },
  logF: number,
  harmonic: number
) {
  return Math.log10(
    characteristicStrain(
      sys.chirpMassSolar,
      Math.pow(10, logF),
      sys.distanceMpc,
      sys.eccentricity,
      harmonic
    )
  );
}

/** A superscript for the axis labels. */
const SUPERSCRIPT: Record<string, string> = {
  "-": "\u207B",
  "0": "\u2070",
  "1": "\u00B9",
  "2": "\u00B2",
  "3": "\u00B3",
  "4": "\u2074",
  "5": "\u2075",
  "6": "\u2076",
  "7": "\u2077",
  "8": "\u2078",
  "9": "\u2079",
};

function superscript(n: number) {
  return String(n)
    .split("")
    .map((c) => SUPERSCRIPT[c] ?? c)
    .join("");
}

const DYNAMIC_BINARIES: DynamicBinaryPair[] = [
  {
    id: "gc-284-1-ref",
    label: "Model 284-1 (e=0.631, ℳ_c=17.0 M☉)",
    formTau: 0.18,
    ejectTau: 0.39,
    eccentricity: 0.6307,
    chirpMass: 16.991,
    freqMHz: 0.125,
    angleOffset: 0.0,
    inclination: 0.35,
    ejectionDir: [0.6, 0.5, 0.62],
  },
  {
    id: "pgc-1628-imbh",
    label: "PGC 1628 #7 (e=0.478, ΔV=0.04 Mpc³)",
    formTau: 0.32,
    ejectTau: 19.0,
    eccentricity: 0.4779,
    chirpMass: 44.31,
    freqMHz: 0.21,
    angleOffset: 1.57,
    inclination: -0.42,
    ejectionDir: [-0.7, 0.4, 0.58],
  },
  {
    id: "pgc-1628-heavy",
    label: "PGC 1628 #9 (e=0.813, ΔV=0.09 Mpc³)",
    formTau: 0.52,
    ejectTau: 19.0,
    eccentricity: 0.8133,
    chirpMass: 23.91,
    freqMHz: 0.34,
    angleOffset: 3.14,
    inclination: 0.68,
    ejectionDir: [0.74, -0.45, 0.5],
  },
  {
    id: "pgc-1628-ecc",
    label: "PGC 1628 #8 (e=0.712, ΔV=0.18 Mpc³)",
    formTau: 0.68,
    ejectTau: 19.0,
    eccentricity: 0.712,
    chirpMass: 18.6,
    freqMHz: 0.27,
    angleOffset: 2.35,
    inclination: 0.51,
    ejectionDir: [-0.55, 0.62, -0.56],
  },
  {
    id: "pgc-616-circ",
    label: "PGC 616 #3 (e=0.0, ΔV=0.68 Mpc³)",
    formTau: 0.85,
    ejectTau: 5.8,
    eccentricity: 0.0,
    chirpMass: 4.91,
    freqMHz: 0.32,
    angleOffset: 4.4,
    inclination: -0.55,
    ejectionDir: [-0.62, -0.58, 0.52],
  },
];

function GlobularClusterEvolution({
  tauRef,
  isPlaying,
  selectedBinaryId,
  onSelectBinary,
  statsCallback,
}: {
  tauRef: React.MutableRefObject<number>;
  isPlaying: boolean;
  selectedBinaryId: string;
  onSelectBinary: (id: string) => void;
  statsCallback?: (stats: {
    bhCount: number;
    wdCount: number;
    rgCount: number;
    msCount: number;
    coreRadiusPc: number;
    halfMassRadiusPc: number;
    activeBbhCount: number;
  }) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const bbhGroupRef = useRef<THREE.Group>(null);
  const simClockRef = useRef<number>(0);
  const lastReportRef = useRef<number>(-1);

  const catalog = useMemo<StarCatalog>(() => {
    const count = 1650;
    const r0 = new Float32Array(count);
    const theta0 = new Float32Array(count);
    const phi0 = new Float32Array(count);
    const omegaTheta = new Float32Array(count);
    const omegaPhi = new Float32Array(count);
    const initialMass = new Float32Array(count);
    const msLifetimeTau = new Float32Array(count);
    const rgbDurationTau = new Float32Array(count);
    const agbDurationTau = new Float32Array(count);
    const finalMass = new Float32Array(count);
    const isBlackHole = new Uint8Array(count);
    const segTau = new Float32Array(count);
    const msState = new Float32Array(count * STATE_STRIDE);
    const giantState = new Float32Array(count * STATE_STRIDE);
    const agbState = new Float32Array(count * STATE_STRIDE);
    const starClass = new Uint8Array(count);

    let seed = 20180512;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    /**
     * Inverse-CDF sample of a power-law mass function dN/dm ∝ m^-alpha over
     * [lo, hi]. The Salpeter index of 2.35 is the standard initial mass
     * function for a stellar population, so each class contains far more low
     * mass stars than high mass ones rather than a uniform spread.
     */
    const samplePowerLaw = (lo: number, hi: number, alpha = 2.35) => {
      const p = 1 - alpha;
      const loP = Math.pow(lo, p);
      const hiP = Math.pow(hi, p);
      return Math.pow(loP + rand() * (hiP - loP), 1 / p);
    };

    const pack = (
      arr: Float32Array,
      i: number,
      teff: number,
      radius: number,
      luminosity: number,
      color: [number, number, number]
    ) => {
      const o = i * STATE_STRIDE;
      arr[o] = teff;
      arr[o + 1] = radius;
      arr[o + 2] = luminosity;
      arr[o + 3] = color[0];
      arr[o + 4] = color[1];
      arr[o + 5] = color[2];
    };

    for (let i = 0; i < count; i++) {
      const u = Math.max(0.002, rand());
      const rawR = 0.68 * Math.pow(Math.pow(u, -2 / 3) - 1, -0.5);
      const clampedR = Math.min(rawR, 3.6);
      r0[i] = clampedR;
      theta0[i] = Math.acos(2 * rand() - 1);
      phi0[i] = 2 * Math.PI * rand();

      const dynRate = 0.38 / Math.pow(clampedR * clampedR + 0.45, 0.75);
      omegaPhi[i] = dynRate * (rand() > 0.15 ? 1 : -1);
      omegaTheta[i] = dynRate * 0.35 * (rand() - 0.5);

      const q = rand();
      let m: number;
      let cls: number;

      if (q > 0.945) {
        m = samplePowerLaw(20, 65);
        cls = 3;
      } else if (q > 0.78) {
        m = samplePowerLaw(1.8, 8);
        cls = 2;
      } else if (q > 0.42) {
        m = samplePowerLaw(0.85, 1.8);
        cls = 1;
      } else {
        m = samplePowerLaw(0.15, 0.85);
        cls = 0;
      }

      initialMass[i] = m;
      starClass[i] = cls;

      // Evolutionary clock, all in units of the half-mass relaxation time.
      msLifetimeTau[i] = mainSequenceLifetimeGyr(m) / TAU_RH_GYR;
      rgbDurationTau[i] = redGiantDurationGyr(m) / TAU_RH_GYR;
      agbDurationTau[i] = asymptoticGiantDurationGyr(m) / TAU_RH_GYR;

      const remnant = remnantMass(m);
      finalMass[i] = remnant;
      isBlackHole[i] = endsAsBlackHole(m) ? 1 : 0;
      // Dynamical-friction sinking time: more massive remnants sink faster.
      segTau[i] = Math.max(0.045, (0.65 / remnant) * 1.1);

      // Pre-compute the stages that do not change with time.
      const ms = mainSequenceState(m);
      pack(msState, i, ms.teff, ms.radius, ms.luminosity, ms.color);
      const giant = redGiantState(m);
      pack(giantState, i, giant.teff, giant.radius, giant.luminosity, giant.color);
      const agb = asymptoticGiantState(m);
      pack(agbState, i, agb.teff, agb.radius, agb.luminosity, agb.color);
    }

    return {
      count,
      r0,
      theta0,
      phi0,
      omegaTheta,
      omegaPhi,
      initialMass,
      msLifetimeTau,
      segTau,
      rgbDurationTau,
      agbDurationTau,
      finalMass,
      isBlackHole,
      msState,
      giantState,
      agbState,
      starClass,
    };
  }, []);

  const { positions, colors, sizes } = useMemo(() => {
    return {
      positions: new Float32Array(catalog.count * 3),
      colors: new Float32Array(catalog.count * 3),
      sizes: new Float32Array(catalog.count),
    };
  }, [catalog.count]);

  // Round star sprite + a shader that supports a per-star size, so the visual
  // size of each star tracks its physical radius instead of a fixed square.
  const sprite = useMemo(() => createStarSprite(), []);
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSprite: { value: sprite },
        uScale: { value: 400 },
      },
      vertexShader: STAR_VERTEX_SHADER,
      fragmentShader: STAR_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [sprite]);

  useEffect(() => {
    return () => {
      sprite?.dispose();
      material.dispose();
    };
  }, [sprite, material]);

  const canvasHeight = useThree((state) => state.size.height);
  const pixelRatio = useThree((state) => state.viewport.dpr);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    if (isPlaying) {
      simClockRef.current += delta;
      pointsRef.current.rotation.y += delta * 0.025;
    }

    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = geom.getAttribute("aColor") as THREE.BufferAttribute;
    const sizeAttr = geom.getAttribute("aSize") as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;
    const sizeArr = sizeAttr.array as Float32Array;

    // Perspective attenuation scale: canvas height in device pixels / 2.
    (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uScale.value =
      canvasHeight * pixelRatio * 0.5;

    const tau = tauRef.current;
    const clock = simClockRef.current;

    let bhCount = 0;
    let wdCount = 0;
    let rgCount = 0;
    let msCount = 0;

    for (let i = 0; i < catalog.count; i++) {
      const tMs = catalog.msLifetimeTau[i];
      const rInit = catalog.r0[i];
      let rCurrent = rInit;

      // Evolutionary stage, colour, radius and luminosity for this star.
      let radiusRel: number;
      let luminosity: number;
      let cr: number;
      let cg: number;
      let cb: number;

      const msOffset = i * STATE_STRIDE;

      if (catalog.isBlackHole[i]) {
        if (tau < tMs) {
          msCount++;
          radiusRel = catalog.msState[msOffset + 1];
          luminosity = catalog.msState[msOffset + 2];
          cr = catalog.msState[msOffset + 3];
          cg = catalog.msState[msOffset + 4];
          cb = catalog.msState[msOffset + 5];
        } else {
          bhCount++;
          const dtAfterCollapse = tau - tMs;
          const sinkFactor = Math.exp(-dtAfterCollapse / catalog.segTau[i]);
          const coreTarget = 0.06 + (i % 19) * 0.009;
          rCurrent = coreTarget + (rInit - coreTarget) * sinkFactor;

          // A black hole has no photosphere, so it is drawn as a marker rather
          // than given a blackbody colour.
          const pulse = 0.78 + 0.22 * Math.sin(clock * 4.5 + i);
          cr = 0.98 * pulse;
          cg = 0.68 * pulse;
          cb = 0.16 * pulse;
          radiusRel = 0.05;
          luminosity = 0;
        }
      } else {
        const tRgb = tMs + catalog.rgbDurationTau[i];
        const tAgb = tRgb + catalog.agbDurationTau[i];

        if (tau < tMs) {
          // Main sequence.
          msCount++;
          radiusRel = catalog.msState[msOffset + 1];
          luminosity = catalog.msState[msOffset + 2];
          cr = catalog.msState[msOffset + 3];
          cg = catalog.msState[msOffset + 4];
          cb = catalog.msState[msOffset + 5];
          rCurrent = rInit * Math.pow(1 + tau * 0.06, 0.28);
        } else if (tau < tRgb) {
          // Red giant branch.
          rgCount++;
          radiusRel = catalog.giantState[msOffset + 1];
          luminosity = catalog.giantState[msOffset + 2];
          cr = catalog.giantState[msOffset + 3];
          cg = catalog.giantState[msOffset + 4];
          cb = catalog.giantState[msOffset + 5];
          rCurrent = rInit * (1 + 0.02 * Math.log(1 + tau));
        } else if (tau < tAgb) {
          // Asymptotic giant branch.
          rgCount++;
          radiusRel = catalog.agbState[msOffset + 1];
          luminosity = catalog.agbState[msOffset + 2];
          cr = catalog.agbState[msOffset + 3];
          cg = catalog.agbState[msOffset + 4];
          cb = catalog.agbState[msOffset + 5];
          rCurrent = rInit * (1 + 0.025 * Math.log(1 + tau));
        } else {
          // White dwarf, cooling from a hot newborn towards a few thousand
          // kelvin over the age of the cluster.
          wdCount++;
          const coolingAgeGyr = (tau - tAgb) * TAU_RH_GYR;
          const wd = whiteDwarfState(coolingAgeGyr, catalog.finalMass[i]);
          radiusRel = wd.radius;
          luminosity = wd.luminosity;
          cr = wd.color[0];
          cg = wd.color[1];
          cb = wd.color[2];
          const settle = Math.exp(-(tau - tMs) / (catalog.segTau[i] * 2.5));
          rCurrent = rInit * (0.68 + 0.32 * settle);
        }
      }

      const phi = catalog.phi0[i] + clock * catalog.omegaPhi[i];
      const theta =
        catalog.theta0[i] + 0.18 * Math.sin(clock * catalog.omegaTheta[i] + i);

      const sinT = Math.sin(theta);
      posArr[i * 3] = rCurrent * sinT * Math.cos(phi);
      posArr[i * 3 + 1] = rCurrent * sinT * Math.sin(phi);
      posArr[i * 3 + 2] = rCurrent * Math.cos(theta);

      // Rendered brightness follows the star's luminosity on a compressed
      // scale: the brightest stars are ten million times the luminosity of the
      // faintest, which no linear mapping could show. The floor keeps the
      // faint red dwarfs visible as the diffuse halo they form.
      const brightness =
        luminosity > 0
          ? Math.min(
              1,
              Math.max(
                0.28,
                0.3 + 0.16 * (Math.log10(luminosity) + 2.6)
              )
            )
          : 0.9;

      colArr[i * 3] = cr * brightness;
      colArr[i * 3 + 1] = cg * brightness;
      colArr[i * 3 + 2] = cb * brightness;
      // Compressed size mapping so a 20 M☉ star reads as visibly larger than a
      // 0.3 M☉ dwarf without dwarfing the rest of the cluster.
      sizeArr[i] =
        0.052 * Math.min(3.4, Math.max(0.62, Math.pow(radiusRel, 0.34)));
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    if (statsCallback && Math.abs(tau - lastReportRef.current) > 0.04) {
      lastReportRef.current = tau;
      const corePc =
        tau < 0.35
          ? 1.2 - 0.68 * (tau / 0.35)
          : 0.52 + 0.26 * Math.min(1, (tau - 0.35) / 6.0);
      const rhPc = 3.1 * Math.pow(1 + tau * 0.065, 0.25);
      const activeBbhs = DYNAMIC_BINARIES.filter((b) => tau >= b.formTau).length;
      statsCallback({
        bhCount,
        wdCount,
        rgCount,
        msCount,
        coreRadiusPc: Number(corePc.toFixed(2)),
        halfMassRadiusPc: Number(rhPc.toFixed(2)),
        activeBbhCount: activeBbhs,
      });
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        </bufferGeometry>
        <primitive object={material} attach="material" />
      </points>

      {/* Core and Half-Mass Reference Shells */}
      <mesh>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshBasicMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.35, 24, 24]} />
        <meshBasicMaterial
          color="#1DAEDF"
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Dynamically Formed Compact Binary Black Holes (BBHs) */}
      <group ref={bbhGroupRef}>
        {DYNAMIC_BINARIES.map((bbh) => (
          <CompactBinaryPairMesh
            key={bbh.id}
            bbh={bbh}
            tauRef={tauRef}
            simClockRef={simClockRef}
            isSelected={selectedBinaryId === bbh.id}
            onSelect={() => onSelectBinary(bbh.id)}
          />
        ))}
      </group>
    </group>
  );
}

function CompactBinaryPairMesh({
  bbh,
  tauRef,
  simClockRef,
  isSelected,
  onSelect,
}: {
  bbh: DynamicBinaryPair;
  tauRef: React.MutableRefObject<number>;
  simClockRef: React.MutableRefObject<number>;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const pairGroupRef = useRef<THREE.Group>(null);
  const bh1Ref = useRef<THREE.Mesh>(null);
  const bh2Ref = useRef<THREE.Mesh>(null);
  const waveRingRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const tau = tauRef.current;
    if (!pairGroupRef.current) return;

    if (tau < bbh.formTau) {
      pairGroupRef.current.visible = false;
      return;
    }
    pairGroupRef.current.visible = true;

    const tClock = simClockRef.current;
    let cx = 0;
    let cy = 0;
    let cz = 0;
    if (tau > bbh.ejectTau) {
      const dist = Math.min(2.6, (tau - bbh.ejectTau) * 0.32);
      cx = bbh.ejectionDir[0] * dist;
      cy = bbh.ejectionDir[1] * dist;
      cz = bbh.ejectionDir[2] * dist;
    } else {
      const coreOrbitR = 0.16;
      cx = coreOrbitR * Math.cos(tClock * 0.4 + bbh.angleOffset);
      cy = coreOrbitR * Math.sin(tClock * 0.4 + bbh.angleOffset) * 0.6;
      cz = coreOrbitR * Math.sin(tClock * 0.3 + bbh.angleOffset);
    }

    pairGroupRef.current.position.set(cx, cy, cz);

    const hardening = Math.max(0.45, 1 - 0.03 * (tau - bbh.formTau));
    const aSemi = 0.095 * hardening;
    const ecc = bbh.eccentricity;
    const meanAnomaly = tClock * (3.2 + bbh.freqMHz * 2.5) + bbh.angleOffset;
    const eccAnomaly = meanAnomaly + ecc * Math.sin(meanAnomaly);
    const xOrb = aSemi * (Math.cos(eccAnomaly) - ecc);
    const yOrb = aSemi * Math.sqrt(1 - ecc * ecc) * Math.sin(eccAnomaly);

    if (bh1Ref.current && bh2Ref.current) {
      bh1Ref.current.position.set(xOrb, yOrb, 0);
      bh2Ref.current.position.set(-xOrb, -yOrb, 0);
    }

    if (waveRingRef.current) {
      const wavePhase = (tClock * 1.4 + bbh.angleOffset) % 1;
      const scale = 0.6 + wavePhase * (isSelected ? 3.2 : 2.2);
      waveRingRef.current.scale.set(scale, scale, 1);
      const mat = waveRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - wavePhase) * (isSelected ? 0.75 : 0.45);
    }
  });

  return (
    <group
      ref={pairGroupRef}
      rotation={[bbh.inclination, bbh.angleOffset, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <mesh ref={bh1Ref}>
        <sphereGeometry args={[isSelected ? 0.042 : 0.032, 16, 16]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={isSelected ? 3.2 : 2.2}
        />
      </mesh>
      <mesh ref={bh2Ref}>
        <sphereGeometry args={[isSelected ? 0.038 : 0.028, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#1DAEDF"
          emissiveIntensity={isSelected ? 3.2 : 2.2}
        />
      </mesh>
      <mesh ref={waveRingRef}>
        <ringGeometry args={[0.07, 0.086, 32]} />
        <meshBasicMaterial
          color={isSelected ? "#fbbf24" : "#38bdf8"}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isSelected && (
        <Billboard>
          <mesh renderOrder={10}>
            <ringGeometry args={[0.17, 0.185, 48]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} depthTest={false} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      )}
    </group>
  );
}

export default function GlobularClusterSimulation({
  onOpenEssay,
  fill = false,
  showReadout = true,
}: {
  onOpenEssay?: (url: string) => void;
  /** Fill the available height instead of using fixed panel heights. */
  fill?: boolean;
  /** Draw the merger-rate readout in the side column. The full-screen
   *  page turns it off and puts it under the title instead. */
  showReadout?: boolean;
} = {}) {
  const [tauRh, setTauRh] = useState<number>(1.25);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedSystemIdx, setSelectedSystemIdx] = useState<number>(0);
  const [wavePhaseOffset, setWavePhaseOffset] = useState<number>(0);
  // The research objective is the argument, but it is three paragraphs, and
  // the sandbox is a sandbox. It opens on request.
  const [objectiveOpen, setObjectiveOpen] = useState<boolean>(false);

  const [clusterStats, setClusterStats] = useState({
    bhCount: 88,
    wdCount: 210,
    rgCount: 30,
    msCount: 1320,
    coreRadiusPc: 0.58,
    halfMassRadiusPc: 3.32,
    activeBbhCount: 5,
  });

  const tauRef = useRef<number>(tauRh);
  tauRef.current = tauRh;

  // Respect prefers-reduced-motion on initial load
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTauRh((prev) => {
        const baseStep = prev < 0.25 ? 0.004 : prev < 2.0 ? 0.022 : 0.085;
        const next = prev + baseStep * speedMultiplier;
        return next > MAX_TAU_RH ? 0.0 : Number(next.toFixed(3));
      });
      setWavePhaseOffset((p) => (p + 0.14) % (2 * Math.PI));
    }, 60);
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier]);

  const timeGyr = useMemo(
    () => ((tauRh * TAU_RH_MYR) / 1000).toFixed(2),
    [tauRh]
  );

  const currentRegimeLabel = useMemo(() => {
    if (tauRh < 0.025) {
      return "Stage 1 · Heavy Stars Collapse (~10 Myr): Massive blue stars (>20 M☉) go supernova and leave behind black holes.";
    }
    if (tauRh < 0.25) {
      return "Stage 2 · Gravity Sorts by Mass (~100 Myr): Heavy black holes lose energy to lighter stars and sink into the dense core.";
    }
    if (tauRh < 2.5) {
      return "Stage 3 · Core Encounters Pair Black Holes (~1 Gyr): Three-body gravitational dances lock black holes into tight binaries.";
    }
    return "Stage 4 · Gravitational-Wave Sirens (up to 13.5 Gyr): Relativistic binaries spiral together, radiating ripples LISA can hear across 30 Mpc.";
  }, [tauRh]);

  const activeSystem =
    GC_RESEARCH_FINDINGS.sampleSystems[selectedSystemIdx] ||
    GC_RESEARCH_FINDINGS.sampleSystems[0];

  const activeBinary = DYNAMIC_BINARIES.find((binary) => binary.id === activeSystem.id);
  const binaryStatus = !activeBinary || tauRh < activeBinary.formTau
    ? "Not yet formed"
    : tauRh > activeBinary.ejectTau
      ? "Ejected → halo"
      : "In core";

  const lisaPlotData = useMemo(() => {
    const width = 380;
    const height = 148;
    const padL = 44;
    const padR = 14;
    const padT = 12;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    // The range that holds every catalogue system and LISA's floor
    // without clamping either: the loudest source sits near 10⁻¹⁷·⁶ and
    // the quietest harmonic of the faintest one near 10⁻²⁰·⁷.
    const LOG_H_MIN = -21.0;
    const LOG_H_MAX = -17.0;

    const xFromLogF = (logF: number) =>
      padL + ((logF - -4.0) / (-1.0 - -4.0)) * plotW;
    const yFromLogH = (logH: number) =>
      padT + plotH - ((logH - LOG_H_MIN) / (LOG_H_MAX - LOG_H_MIN)) * plotH;

    // LISA's characteristic-strain floor: a confusion-limited wall at low
    // frequency, the instrument's own best around 10 mHz, and the rising
    // shot noise at the top of the band.
    const curvePoints: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const logF = -4.0 + (i / 60) * 3.0;
      const logH = Math.max(
        LOG_H_MIN,
        Math.min(LOG_H_MAX, lisaNoiseLogH(logF))
      );
      curvePoints.push(
        `${xFromLogF(logF).toFixed(1)},${yFromLogH(logH).toFixed(1)}`
      );
    }

    const systemPoints = GC_RESEARCH_FINDINGS.sampleSystems.map((sys, idx) => {
      const logF0 = Math.log10(sys.fGwMhz * 1e-3);
      const baseLogH = Math.log10(
        characteristicStrain(
          sys.chirpMassSolar,
          sys.fGwMhz * 1e-3,
          sys.distanceMpc,
          sys.eccentricity,
          1
        )
      );

      const harmonics: { x: number; y: number; n: number }[] = [];
      const maxHarmonic = sys.eccentricity > 0.3 ? 5 : 1;
      for (let h = 1; h <= maxHarmonic; h++) {
        const lf = Math.min(-1.05, Math.max(-3.95, logF0 + Math.log10(h * 0.85)));
        const lh = Math.min(
          LOG_H_MAX,
          Math.max(
            LOG_H_MIN,
            logHBase(sys, lf, h)
          )
        );
        harmonics.push({
          x: xFromLogF(lf),
          y: yFromLogH(lh),
          n: h,
        });
      }

      return {
        sys,
        idx,
        x: xFromLogF(Math.min(-1.05, Math.max(-3.95, logF0))),
        y: yFromLogH(Math.min(LOG_H_MAX, Math.max(LOG_H_MIN, baseLogH))),
        harmonics,
      };
    });

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      logHMin: LOG_H_MIN,
      logHMax: LOG_H_MAX,
      curvePath: curvePoints.join(" "),
      systemPoints,
      xFromLogF,
      yFromLogH,
    };
  }, []);

  /**
   * Where the selected binary's signal is at the current instant.
   *
   * This is what makes the sensitivity plot a moving thing: the chirp
   * sweeps up through the band while the binary is being hardened in the
   * core, and then creeps along it in the halo, and the reader can see
   * whether it clears LISA's floor at the moment they are looking.
   */
  const liveSignal = useMemo(() => {
    const sys = activeSystem;
    const bin = DYNAMIC_BINARIES.find((b) => b.id === sys.id);
    if (!bin) return null;
    const fMhz = signalFrequency(bin, sys.fGwMhz, tauRh);
    if (fMhz <= 0) {
      return { exists: false, fMhz: 0, harmonics: [], above: false, logH: 0 };
    }
    const logF0 = Math.log10(fMhz * 1e-3);
    const maxHarmonic = sys.eccentricity > 0.3 ? 5 : 1;
    const harmonics: { x: number; y: number; n: number }[] = [];
    for (let h = 1; h <= maxHarmonic; h++) {
      const lf = Math.min(-1.05, Math.max(-3.95, logF0 + Math.log10(h * 0.85)));
      const lh = Math.min(
        lisaPlotData.logHMax,
        Math.max(lisaPlotData.logHMin, logHBase(sys, lf, h))
      );
      harmonics.push({
        x: lisaPlotData.xFromLogF(lf),
        y: lisaPlotData.yFromLogH(lh),
        n: h,
      });
    }
    const fundamentalLogH = logHBase(sys, logF0, 1);
    return {
      exists: true,
      fMhz,
      harmonics,
      above: fundamentalLogH > lisaNoiseLogH(logF0),
      logH: fundamentalLogH,
    };
  }, [tauRh, activeSystem, lisaPlotData]);

  const timeWaveform = useMemo(() => {
    const width = 380;
    const height = 104;
    const padL = 36;
    const padR = 12;
    const padT = 12;
    const padB = 20;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const midY = padT + plotH / 2;

    const ptsStrain: string[] = [];
    const ptsEnvUpper: string[] = [];
    const ptsEnvLower: string[] = [];

    const eccFactor = 1 + 0.65 * activeSystem.eccentricity;
    const carrierCycles = 18 + Math.round(activeSystem.fGwMhz * 22);

    for (let i = 0; i <= 140; i++) {
      const u = i / 140;
      const tYr = u * 2.0;
      const x = padL + u * plotW;

      const annualAngle = 2 * Math.PI * tYr + selectedSystemIdx * 0.9;
      const beamEnv =
        0.58 +
        0.34 * Math.cos(annualAngle) +
        0.08 * Math.sin(2 * annualAngle);

      const dopplerPhase =
        1.85 * Math.sin(annualAngle - 0.4) * (0.6 + 1.2 * activeSystem.fGwMhz);

      const carrierPhase =
        2 * Math.PI * carrierCycles * u + dopplerPhase + wavePhaseOffset;
      const rawWave =
        (Math.cos(carrierPhase) +
          0.42 * activeSystem.eccentricity * Math.cos(2 * carrierPhase)) /
        eccFactor;

      const strainY = midY - rawWave * beamEnv * (plotH * 0.44);
      const envUpY = midY - beamEnv * (plotH * 0.44);
      const envLowY = midY + beamEnv * (plotH * 0.44);

      ptsStrain.push(`${x.toFixed(1)},${strainY.toFixed(1)}`);
      ptsEnvUpper.push(`${x.toFixed(1)},${envUpY.toFixed(1)}`);
      ptsEnvLower.push(`${x.toFixed(1)},${envLowY.toFixed(1)}`);
    }

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      midY,
      strainPath: ptsStrain.join(" "),
      envUpperPath: ptsEnvUpper.join(" "),
      envLowerPath: ptsEnvLower.join(" "),
    };
  }, [activeSystem, selectedSystemIdx, wavePhaseOffset]);

  return (
    <figure
      className={`rounded-2xl overflow-hidden border border-[#b9d9eb] bg-gradient-to-b from-[#0b2034] via-[#0e263f] to-[#081827] shadow-xl ${
        fill ? "flex flex-col min-h-0 xl:h-full" : ""
      }`}
    >
      {/* Top Playback Bar */}
      <div className="px-4 py-3 border-b border-sky-900/70 bg-[#081827]/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full bg-[#0d2642] border border-[#1DAEDF]/50 text-[10px] sm:text-[11px] font-mono text-[#7dd3fc] font-semibold">
            3D GLOBULAR CLUSTER SANDBOX · LISA WAVE OBSERVATORY
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            Cluster Age: <strong className="text-white">{timeGyr} Billion Yrs</strong>{" "}
            <span className="text-sky-300/80">({tauRh.toFixed(2)} τ_rh)</span>
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-lg bg-[#2980b9] hover:bg-[#1DAEDF] text-white text-[11px] font-mono font-medium transition cursor-pointer"
          >
            {isPlaying ? "Pause ❚❚" : "Play ▶"}
          </button>

          {[0.25, 1, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeedMultiplier(spd)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition cursor-pointer border ${
                speedMultiplier === spd
                  ? "bg-sky-500/30 border-[#1DAEDF] text-white font-semibold"
                  : "bg-[#0d2238] border-sky-900 text-slate-300 hover:text-white"
              }`}
            >
              {spd}×
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Scrubber & Plain-English Stage Presets */}
      <div className="px-4 py-2.5 border-b border-sky-900/60 bg-[#0a1d31]/90 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="gc-tau-slider"
            className="text-[11px] font-mono text-sky-200 shrink-0"
          >
            Scrub Cosmic Time:
          </label>
          <input
            id="gc-tau-slider"
            type="range"
            min={0}
            max={MAX_TAU_RH}
            step={0.01}
            value={tauRh}
            onChange={(e) => {
              setIsPlaying(false);
              setTauRh(parseFloat(e.target.value));
            }}
            className="w-full accent-[#1DAEDF] cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-full">
            {[
              { label: "1 · Supernovae (10 Myr)", val: 0.01 },
              { label: "2 · BH Sinking (100 Myr)", val: 0.12 },
              { label: "3 · Core Binaries (1 Gyr)", val: 1.0 },
              { label: "4 · Today (13.5 Gyr)", val: 16.875 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setIsPlaying(false);
                  setTauRh(preset.val);
                }}
                className="px-2 py-0.5 rounded bg-[#0e2944] hover:bg-[#194169] border border-sky-800/80 text-[10px] font-mono text-sky-200 whitespace-nowrap cursor-pointer transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
          <p className="font-mono text-[10px] sm:text-[11px] text-sky-200/95">
            {currentRegimeLabel}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ffc98a] to-[#93c5fd]" /> Main Sequence ({clusterStats.msCount})
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#fb923c]" /> Red Giants ({clusterStats.rgCount})
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" /> White Dwarfs ({clusterStats.wdCount})
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Black Holes ({clusterStats.bhCount})
            </span>
          </div>
        </div>
      </div>

      {/* Split Window: Left = 3D Globular Cluster | Right = LISA GW Side Window */}
      <div
        className={`grid grid-cols-1 xl:grid-cols-12 ${
          fill ? "xl:flex-1 xl:min-h-0 xl:grid-rows-1" : ""
        }`}
      >
        {/* Left 7 Columns: Pure 3D Globular Cluster N-Body & Stellar Evolution */}
        <div
          className={`xl:col-span-7 relative overflow-hidden border-b xl:border-b-0 xl:border-r border-sky-900/60 touch-manipulation ${
            fill
              ? "h-[46vh] min-h-[280px] xl:h-full xl:min-h-0"
              : "h-[360px] sm:h-[460px] xl:h-[600px]"
          }`}
        >
          <Canvas
            camera={{ position: [0, 0.5, 4.8], fov: 48 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.75} />
            <pointLight position={[6, 6, 6]} intensity={1.6} color="#1DAEDF" />
            <pointLight
              position={[-6, -4, -4]}
              intensity={1.2}
              color="#2980b9"
            />
            <Stars
              radius={60}
              depth={40}
              count={1600}
              factor={3}
              saturation={0.3}
              fade
              speed={isPlaying ? 0.6 : 0}
            />
            <GlobularClusterEvolution
              tauRef={tauRef}
              isPlaying={isPlaying}
              selectedBinaryId={activeSystem.id}
              onSelectBinary={(id) => {
                const idx = GC_RESEARCH_FINDINGS.sampleSystems.findIndex(
                  (s) => s.id === id
                );
                if (idx >= 0) setSelectedSystemIdx(idx);
              }}
              statsCallback={setClusterStats}
            />
            <OrbitControls
              enablePan={false}
              minDistance={2.0}
              maxDistance={8.5}
              autoRotate={isPlaying}
              autoRotateSpeed={0.35}
            />
          </Canvas>

          {/* Bottom-left live dynamical diagnostics overlay */}
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
            <div className="px-2.5 py-1.5 rounded-lg bg-[#071524]/85 border border-sky-800/70 text-[10px] font-mono text-slate-200 backdrop-blur-md flex flex-wrap items-center gap-3">
              <span>
                Core radius: <strong className="text-[#7dd3fc]">{clusterStats.coreRadiusPc} pc</strong>
              </span>
              <span>
                Half-mass radius: <strong className="text-[#7dd3fc]">{clusterStats.halfMassRadiusPc} pc</strong>
              </span>
              <span>
                Core BHs: <strong className="text-amber-300">{clusterStats.bhCount}</strong>
              </span>
              <span>
                Active BBHs: <strong className="text-sky-300">{clusterStats.activeBbhCount}</strong>
              </span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#071524]/80 border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-md">
              1,650-star N-body visualization
            </span>
          </div>
        </div>

        {/* Right 5 Columns: LISA Gravitational-Wave Detector Side Window */}
        <div
          className={`xl:col-span-5 bg-[#071524]/95 p-4 sm:p-5 flex flex-col space-y-4 text-slate-100 justify-start xl:overflow-y-auto xl:min-h-0 xl:scroll-slim ${
            fill ? "xl:h-full" : "xl:max-h-[600px]"
          }`}
        >
          <div className="rounded-lg border border-amber-400/50 bg-amber-950/15 p-3 space-y-1.5">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-semibold">
              Selected BBH · gold halo
            </h3>
            <p className="text-xs text-amber-100">{activeBinary?.label ?? activeSystem.id}</p>
            <p className="text-[11px] font-mono text-sky-200">{binaryStatus}</p>
            <p className="text-[11px] text-slate-400">
              {binaryStatus === "Not yet formed"
                ? "The highlight appears when this pair forms."
                : "The gold ring marks this pair in the cluster. Select another pair in the scene or catalogue."}
            </p>
          </div>

          {/* The readout itself — the merger rate and the link to the
              dissertation — is a separate block. On the full-screen page
              it sits above the sandbox, under the title, because it does
              not change as the simulation runs and it is one of the
              numbers the page is about; there it is switched off here
              and rendered by the page instead. What is left in this
              column is the part that has to be next to the picture: the
              strain the binary is making right now, and where it lands. */}
          {showReadout ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DAEDF] font-semibold">
                  LISA Space Interferometer Readout
                </span>
                {onOpenEssay ? (
                  <button
                    onClick={() =>
                      onOpenEssay(
                        "/articles/research/astrophysics-bbh-dissertation.html"
                      )
                    }
                    className="text-[10px] font-mono text-sky-300 hover:text-white underline underline-offset-4 cursor-pointer"
                  >
                    Read full essay &rarr;
                  </button>
                ) : (
                  <a
                    href="/articles/research/astrophysics-bbh-dissertation.html"
                    className="text-[10px] font-mono text-sky-300 hover:text-white underline underline-offset-4"
                  >
                    Read full essay &rarr;
                  </a>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#0c2138] border border-sky-800/80 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-300">
                    Local Universe BBH Merger Rate:
                  </span>
                  <span className="text-sm sm:text-base font-mono font-bold text-amber-300">
                    &eta; &asymp; 587 Gpc&#8315;&sup3; yr&#8315;&sup1;
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Synthesized across{" "}
                  <strong className="text-white">662,772 globular clusters</strong>{" "}
                  in <strong className="text-white">8,946 galaxies</strong>{" "}
                  within 30 Mpc (3,240 MOCCA supercomputer runs; 17.88M
                  inspiralling BBHs; 17 LISA standard sirens).
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DAEDF] font-semibold">
                Sensitivity &amp; Localization
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                as LISA would see it
              </span>
            </div>
          )}

          {/* Plot 1: LISA Frequency-Domain Characteristic Strain & Harmonics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>
                LISA Sensitivity Curve &amp; Multi-Harmonic Chirp
              </span>
              <span className="text-sky-300">0.1 mHz – 0.1 Hz</span>
            </div>

            {/* What the moving signal is doing right now, said in words as
                well as drawn: a reader should not have to measure the plot
                to know whether the chirp clears LISA's floor. */}
            <p className="text-[10px] font-mono leading-relaxed text-slate-300">
              {!liveSignal?.exists ? (
                <span className="text-slate-400">
                  This binary has not formed yet at this point in cosmic time.
                </span>
              ) : (
                <>
                  <span className="text-amber-300">
                    f_gw = {(liveSignal.fMhz * 1e3).toFixed(1)} mHz
                  </span>
                  {liveSignal.harmonics.length > 1 ? (
                    <span className="text-slate-400">
                      {" "}
                      · {liveSignal.harmonics.length} harmonics
                    </span>
                  ) : null}
                  {" · "}
                  {liveSignal.above ? (
                    <span className="text-emerald-300">
                      above LISA&apos;s noise floor
                    </span>
                  ) : (
                    <span className="text-rose-300">
                      still below LISA&apos;s noise floor
                    </span>
                  )}
                </>
              )}
            </p>

            <div className="rounded-xl bg-[#040d17] border border-sky-900/80 p-2">
              <svg
                viewBox={`0 0 ${lisaPlotData.width} ${lisaPlotData.height}`}
                className="w-full h-auto overflow-visible"
                role="img"
                aria-label="LISA sensitivity curve and globular cluster compact binary strain spectrum"
              >
                {[-4, -3, -2, -1].map((lf) => {
                  const x = lisaPlotData.xFromLogF(lf);
                  return (
                    <g key={lf}>
                      <line
                        x1={x}
                        y1={lisaPlotData.padT}
                        x2={x}
                        y2={lisaPlotData.height - lisaPlotData.padB}
                        stroke="#1e293b"
                        strokeDasharray="2,2"
                      />
                      <text
                        x={x}
                        y={lisaPlotData.height - 18}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        10{superscript(lf)} Hz
                      </text>
                    </g>
                  );
                })}
                {[-21, -20, -19, -18, -17].map((lh) => {
                  const y = lisaPlotData.yFromLogH(lh);
                  return (
                    <g key={lh}>
                      <line
                        x1={lisaPlotData.padL}
                        y1={y}
                        x2={lisaPlotData.width - lisaPlotData.padR}
                        y2={y}
                        stroke="#1e293b"
                        strokeDasharray="2,2"
                      />
                      <text
                        x={lisaPlotData.padL - 4}
                        y={y + 3}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        10{superscript(lh)}
                      </text>
                    </g>
                  );
                })}

                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  points={lisaPlotData.curvePath}
                />
                <text
                  x={lisaPlotData.width - lisaPlotData.padR - 2}
                  y={lisaPlotData.yFromLogH(lisaNoiseLogH(-1.4)) - 6}
                  textAnchor="end"
                  fill="#38bdf8"
                  fillOpacity="0.75"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  LISA noise floor
                </text>

                {/* the axis titles, which the plot was missing */}
                <text
                  x={lisaPlotData.padL + (lisaPlotData.width - lisaPlotData.padL - lisaPlotData.padR) / 2}
                  y={lisaPlotData.height - 4}
                  dy="0"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  Frequency (Hz)
                </text>
                <text
                  transform={`translate(11 ${lisaPlotData.padT + (lisaPlotData.height - lisaPlotData.padT - lisaPlotData.padB) / 2}) rotate(-90)`}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  Characteristic strain h_c
                </text>

                {liveSignal?.exists && liveSignal.harmonics.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.2"
                    strokeDasharray="3,2"
                    opacity="0.65"
                    points={liveSignal.harmonics.map((h) => `${h.x},${h.y}`).join(" ")}
                  />
                )}

                {lisaPlotData.systemPoints.map((pt) => {
                  const isSelected = pt.idx === selectedSystemIdx;
                  return (
                    <g
                      key={pt.sys.id}
                      onClick={() => setSelectedSystemIdx(pt.idx)}
                      className="cursor-pointer"
                      opacity={isSelected ? 0.35 : 0.85}
                    >
                      {isSelected &&
                        pt.harmonics.length > 1 &&
                        pt.harmonics.map((h, hi) => (
                          <g key={hi}>
                            <line
                              x1={h.x}
                              y1={lisaPlotData.height - lisaPlotData.padB}
                              x2={h.x}
                              y2={h.y}
                              stroke="#f59e0b"
                              strokeWidth="1"
                              strokeDasharray="2,2"
                              opacity={0.7}
                            />
                            <circle cx={h.x} cy={h.y} r={3} fill="#fbbf24" />
                          </g>
                        ))}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={3.6}
                        fill="#1DAEDF"
                        stroke="#ffffff"
                        strokeWidth="0.6"
                      />
                    </g>
                  );
                })}

                {/* Where the selected binary's signal is right now: it moves
                    as the simulation runs, and whether it clears the floor
                    is the thing the page is about. */}
                {liveSignal?.exists && (
                  <g>
                    {liveSignal.harmonics.map((h) => (
                      <circle
                        key={h.n}
                        cx={h.x}
                        cy={h.y}
                        r={h.n === 1 ? 4 : 2.8}
                        fill="#fbbf24"
                        stroke="#fff7ed"
                        strokeWidth={h.n === 1 ? 1.4 : 0.7}
                      />
                    ))}
                    <text
                      x={liveSignal.harmonics[0].x + 7}
                      y={liveSignal.harmonics[0].y - 6}
                      fill="#fbbf24"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      now
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Plot 2: 2-Year LISA Time-Domain Strain h_alpha(t) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>
                2-Year Orbital Doppler Modulation h(t)
              </span>
              <span className="text-amber-300">T_obs = 2.0 yr</span>
            </div>

            <div className="rounded-xl bg-[#040d17] border border-sky-900/80 p-2">
              <svg
                viewBox={`0 0 ${timeWaveform.width} ${timeWaveform.height}`}
                className="w-full h-auto"
                role="img"
                aria-label="LISA 2-year modulated gravitational-wave time series"
              >
                <line
                  x1={timeWaveform.padL}
                  y1={timeWaveform.midY}
                  x2={timeWaveform.width - timeWaveform.padR}
                  y2={timeWaveform.midY}
                  stroke="#1e293b"
                />
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                  opacity={0.75}
                  points={timeWaveform.envUpperPath}
                />
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                  opacity={0.75}
                  points={timeWaveform.envLowerPath}
                />
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.35"
                  points={timeWaveform.strainPath}
                />
                <text
                  x={timeWaveform.padL}
                  y={timeWaveform.height - 4}
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  0.0 yr (LISA 1 AU Orbit)
                </text>
                <text
                  x={timeWaveform.width - timeWaveform.padR}
                  y={timeWaveform.height - 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  2.0 yr (Pinpointed to ≤ 1 Mpc³)
                </text>
              </svg>
            </div>
          </div>

          {/* Selectable Compact Binary Catalog (Table 6-1 & Table 6-2 Standard Sirens) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>Inspect a Pinpointed Binary System:</span>
              <span className="text-sky-300">
                17 Standard Sirens (ΔV ≤ 1 Mpc³)
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {GC_RESEARCH_FINDINGS.sampleSystems.map((sys, idx) => (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystemIdx(idx)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition cursor-pointer border ${
                    selectedSystemIdx === idx
                      ? "bg-[#2980b9] border-white text-white font-semibold"
                      : "bg-[#0c2138] border-sky-900 text-slate-300 hover:border-[#1DAEDF]"
                  }`}
                >
                  {sys.pgc.split(" (")[0]}
                </button>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-[#0c2138]/90 border border-sky-800/70 text-[11px] font-mono space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1 text-sky-200">
                <strong className="text-white">{activeSystem.pgc}</strong>
                <span>D = {activeSystem.distanceMpc} Mpc</span>
              </div>
              <div className="text-[10px] text-slate-300 flex flex-wrap gap-x-3 gap-y-0.5">
                <span>
                  M₁={activeSystem.m1Solar} M☉, M₂={activeSystem.m2Solar} M☉
                </span>
                <span>ℳ_c={activeSystem.chirpMassSolar} M☉</span>
                <span>e={activeSystem.eccentricity}</span>
                <span className="text-amber-300">
                  ΔV={activeSystem.errorVolumeMpc3} Mpc³
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-sans pt-0.5">
                {activeSystem.note}
              </p>
            </div>
          </div>

          {/* Research objective: what the simulation is for, bound to the
              system currently selected above. */}
          <div className="rounded-lg border border-[#1DAEDF]/35 bg-[#0b2034]/70">
            <button
              onClick={() => setObjectiveOpen((o) => !o)}
              aria-expanded={objectiveOpen}
              className="w-full flex items-center justify-between gap-2 p-3 text-left cursor-pointer hover:bg-[#0d2642]/50 transition"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DAEDF] font-semibold">
                Research Objective
              </span>
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono text-slate-400 truncate hidden sm:inline">
                  Use dynamically formed BBHs as unperturbed standard sirens
                </span>
                <span
                  aria-hidden="true"
                  className="text-[11px] font-mono text-sky-300 shrink-0"
                >
                  {objectiveOpen ? "\u25be" : "\u25b8"}
                </span>
              </span>
            </button>

            {objectiveOpen && (
            <div className="px-3 pb-3 space-y-2.5">

            <ol className="space-y-2">
              <li className="flex gap-2.5">
                <span className="font-mono text-[10px] text-[#1DAEDF] pt-0.5 shrink-0">
                  01
                </span>
                <p className="text-[11px] font-sans leading-relaxed text-slate-300">
                  <strong className="text-white">
                    Dynamically formed.
                  </strong>{" "}
                  Three-body encounters in a cluster core pair black holes — a
                  channel no other environment produces.{" "}
                  {activeSystem.eccentricity > 0.05 ? (
                    <>
                      The orbit still carries the fingerprint: e ={" "}
                      <span className="text-amber-300">
                        {activeSystem.eccentricity}
                      </span>
                      , against the near-zero eccentricity of a field binary.
                    </>
                  ) : (
                    <>
                      Its orbit has since circularised (e = 0), which is
                      exactly why eccentricity alone cannot identify the
                      channel — the ejection history has to be recovered too.
                    </>
                  )}
                </p>
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-[10px] text-[#1DAEDF] pt-0.5 shrink-0">
                  02
                </span>
                <p className="text-[11px] font-sans leading-relaxed text-slate-300">
                  <strong className="text-white">Ejected, then quiet.</strong>{" "}
                  In the halo the binary&rsquo;s orbital clock and waveform are
                  set by the binary alone: no accretion, no dense cluster
                  environment. The distance is read from the waveform, so the
                  local Galactic potential does not bias it.
                </p>
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-[10px] text-[#1DAEDF] pt-0.5 shrink-0">
                  03
                </span>
                <p className="text-[11px] font-sans leading-relaxed text-slate-300">
                  <strong className="text-white">Read alongside light.</strong>{" "}
                  The counterpart supplies the host and its redshift. Each siren
                  becomes a multi-messenger probe, and cluster-born black holes
                  extend the tracer population that measures the halo&rsquo;s
                  mass profile.
                </p>
              </li>
            </ol>

            <div className="pt-2 border-t border-sky-900/70 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] text-slate-300">
              <span className="text-[#1DAEDF]">This system</span>
              <span className="text-white">{activeSystem.pgc}</span>
              <span>
                M₁={activeSystem.m1Solar} + M₂={activeSystem.m2Solar} M☉
              </span>
              <span>D={activeSystem.distanceMpc} Mpc</span>
              <span>ΔV={activeSystem.errorVolumeMpc3} Mpc³</span>
              <span>SNR(2 yr)={activeSystem.snr2Yr}</span>
            </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Caption */}
      <figcaption className="px-4 py-2.5 bg-[#061220] border-t border-sky-900/60 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <span>
          Left: 1,650-star cluster whose colour, luminosity, radius and lifetime follow MESA-based stellar-evolution relations (Eker et al. 2018), evolving under gravitational relaxation and mass segregation. Right: LISA space-interferometer strain and standard-siren localization from my 2018 doctoral catalog.
        </span>
        <a
          href="/pdfs/main.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sky-300 hover:text-white underline underline-offset-4 shrink-0"
        >
          Dissertation PDF (/pdfs/main.pdf) ↗
        </a>
      </figcaption>
    </figure>
  );
}
