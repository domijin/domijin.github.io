"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
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
        <Html distanceFactor={10} position={[0, 0.24, 0]} center>
          <button
            onClick={onSelect}
            className="px-2 py-0.5 rounded bg-[#0c2138]/95 border border-amber-400/70 text-[9px] font-mono text-amber-200 whitespace-nowrap shadow-md cursor-pointer"
          >
            {bbh.label}
          </button>
        </Html>
      )}
    </group>
  );
}

export default function GlobularClusterSimulation({
  onOpenEssay,
  fill = false,
}: {
  onOpenEssay?: (url: string) => void;
  /** Fill the available height instead of using fixed panel heights. */
  fill?: boolean;
} = {}) {
  const [tauRh, setTauRh] = useState<number>(1.25);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedSystemIdx, setSelectedSystemIdx] = useState<number>(0);
  const [wavePhaseOffset, setWavePhaseOffset] = useState<number>(0);

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

  const lisaPlotData = useMemo(() => {
    const width = 380;
    const height = 148;
    const padL = 36;
    const padR = 12;
    const padT = 14;
    const padB = 24;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const xFromLogF = (logF: number) =>
      padL + ((logF - -4.0) / (-1.0 - -4.0)) * plotW;
    const yFromLogH = (logH: number) =>
      padT + plotH - ((logH - -22.0) / (-17.0 - -22.0)) * plotH;

    const curvePoints: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const logF = -4.0 + (i / 60) * 3.0;
      const f = Math.pow(10, logF);
      const lowFreqAccel = 2.4e-19 * Math.pow(1e-3 / f, 1.85);
      const midFloor =
        3.2e-21 *
        (1 + 0.45 * Math.exp(-Math.pow((logF + 2.75) / 0.28, 2)));
      const highFreqShot = 1.1e-20 * Math.pow(f / 1e-2, 1.15);
      const hn = Math.sqrt(
        lowFreqAccel * lowFreqAccel +
          midFloor * midFloor +
          highFreqShot * highFreqShot
      );
      const logH = Math.max(-22.0, Math.min(-17.0, Math.log10(hn)));
      curvePoints.push(
        `${xFromLogF(logF).toFixed(1)},${yFromLogH(logH).toFixed(1)}`
      );
    }

    const systemPoints = GC_RESEARCH_FINDINGS.sampleSystems.map((sys, idx) => {
      const logF0 = Math.log10(sys.fGwMhz * 1e-3);
      const baseLogH =
        -20.35 +
        (5 / 6) * Math.log10(sys.chirpMassSolar / 15) -
        Math.log10(sys.distanceMpc / 20) +
        0.22 * Math.log10(sys.fGwMhz / 0.2);

      const harmonics: { x: number; y: number; n: number }[] = [];
      const maxHarmonic = sys.eccentricity > 0.3 ? 5 : 1;
      for (let h = 1; h <= maxHarmonic; h++) {
        const lf = Math.min(
          -1.05,
          Math.max(-3.95, logF0 + Math.log10(h * 0.85))
        );
        const lh = Math.min(
          -17.2,
          Math.max(
            -21.8,
            baseLogH +
              (sys.eccentricity > 0.3 ? 0.18 * (3 - Math.abs(h - 3)) : 0)
          )
        );
        harmonics.push({
          x: xFromLogF(lf),
          y: yFromLogH(lh),
          n: h + 1,
        });
      }

      return {
        sys,
        idx,
        x: xFromLogF(Math.min(-1.05, Math.max(-3.95, logF0))),
        y: yFromLogH(Math.min(-17.2, Math.max(-21.8, baseLogH))),
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
      curvePath: curvePoints.join(" "),
      systemPoints,
      xFromLogF,
      yFromLogH,
    };
  }, []);

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
          className={`xl:col-span-7 relative border-b xl:border-b-0 xl:border-r border-sky-900/60 touch-manipulation ${
            fill
              ? "h-[46vh] min-h-[280px] xl:h-full xl:min-h-0"
              : "h-[360px] sm:h-[460px] xl:h-[540px]"
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
          className={`xl:col-span-5 bg-[#071524]/95 p-4 sm:p-5 flex flex-col space-y-4 text-slate-100 ${
            fill
              ? "justify-start xl:overflow-y-auto xl:min-h-0 xl:scroll-slim"
              : "justify-between"
          }`}
        >
          {/* Header & Event Rate Badge from Doctoral Dissertation */}
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
                  η ≃ 587 Gpc⁻³ yr⁻¹
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

          {/* Plot 1: LISA Frequency-Domain Characteristic Strain & Harmonics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>
                LISA Sensitivity Curve &amp; Multi-Harmonic Chirp
              </span>
              <span className="text-sky-300">0.1 mHz – 0.1 Hz</span>
            </div>

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
                        y={lisaPlotData.height - 6}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        10^{lf} Hz
                      </text>
                    </g>
                  );
                })}
                {[-21, -19, -17].map((lh) => {
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
                        10^{lh}
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

                {[
                  [-3.55, -20.6],
                  [-3.35, -20.4],
                  [-3.18, -20.1],
                  [-2.95, -19.85],
                  [-2.82, -20.05],
                  [-2.68, -19.65],
                  [-2.52, -19.45],
                  [-2.38, -19.72],
                  [-2.22, -19.35],
                  [-2.05, -19.2],
                  [-1.88, -19.4],
                  [-1.72, -19.15],
                ].map(([lf, lh], idx) => (
                  <circle
                    key={idx}
                    cx={lisaPlotData.xFromLogF(lf)}
                    cy={lisaPlotData.yFromLogH(lh)}
                    r={2.1}
                    fill="#64748b"
                    opacity={0.55}
                  />
                ))}

                {lisaPlotData.systemPoints.map((pt) => {
                  const isSelected = pt.idx === selectedSystemIdx;
                  return (
                    <g
                      key={pt.sys.id}
                      onClick={() => setSelectedSystemIdx(pt.idx)}
                      className="cursor-pointer"
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
                        r={isSelected ? 5.2 : 3.6}
                        fill={isSelected ? "#f59e0b" : "#1DAEDF"}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 1.5 : 0.6}
                      />
                    </g>
                  );
                })}
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
