"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  INTELLECTUAL_PILLARS,
  WRITINGS_DATA,
  GC_RESEARCH_FINDINGS,
  IntellectualPillar,
  WritingNode,
} from "@/data/contextMapData";

interface ConstellationProps {
  selectedPillar: string | null;
  onSelectPillar: (id: string | null) => void;
  selectedWriting: WritingNode | null;
  onSelectWriting: (node: WritingNode | null) => void;
}

interface StarCatalog {
  count: number;
  r0: Float32Array;
  theta0: Float32Array;
  phi0: Float32Array;
  omegaTheta: Float32Array;
  omegaPhi: Float32Array;
  initialMass: Float32Array;
  msLifetimeTau: Float32Array;
  segTau: Float32Array;
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

const DYNAMIC_BINARIES: DynamicBinaryPair[] = [
  {
    id: "model-284-1",
    label: "Model 284-1 (e=0.63, M_c=17.0 M☉)",
    formTau: 0.18,
    ejectTau: 19.0, // Retained in cluster core to present day
    eccentricity: 0.6307,
    chirpMass: 16.991,
    freqMHz: 0.24,
    angleOffset: 0.0,
    inclination: 0.35,
    ejectionDir: [0.6, 0.5, 0.62],
  },
  {
    id: "pgc-1628-siren",
    label: "PGC 1628 Siren (ΔV=0.015 Mpc³)",
    formTau: 0.35,
    ejectTau: 19.0,
    eccentricity: 0.12,
    chirpMass: 15.65,
    freqMHz: 2.38,
    angleOffset: 1.57,
    inclination: -0.42,
    ejectionDir: [-0.7, 0.4, 0.58],
  },
  {
    id: "pgc-616-siren",
    label: "PGC 616 Siren (ΔV=0.044 Mpc³)",
    formTau: 0.55,
    ejectTau: 2.8, // Dynamically ejected after core hardening recoil kick
    eccentricity: 0.08,
    chirpMass: 18.88,
    freqMHz: 3.12,
    angleOffset: 3.14,
    inclination: 0.68,
    ejectionDir: [0.74, -0.45, 0.5],
  },
  {
    id: "ngc-4472-siren",
    label: "NGC 4472 / M49 (M_c=23.5 M☉)",
    formTau: 0.9,
    ejectTau: 6.4, // Ejected at 6.4 tau_rh into galactic halo
    eccentricity: 0.19,
    chirpMass: 23.48,
    freqMHz: 1.85,
    angleOffset: 4.4,
    inclination: -0.55,
    ejectionDir: [-0.62, -0.58, 0.52],
  },
];

function GlobularClusterEvolution({
  tauRef,
  statsCallback,
}: {
  tauRef: React.MutableRefObject<number>;
  statsCallback?: (stats: {
    bhCount: number;
    wdCount: number;
    rgCount: number;
    coreRadiusPc: number;
    halfMassRadiusPc: number;
    activeBbhCount: number;
  }) => void;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const bbhGroupRef = useRef<THREE.Group>(null);
  const lastReportRef = useRef<number>(-1);

  const catalog = useMemo<StarCatalog>(() => {
    const count = 1500;
    const r0 = new Float32Array(count);
    const theta0 = new Float32Array(count);
    const phi0 = new Float32Array(count);
    const omegaTheta = new Float32Array(count);
    const omegaPhi = new Float32Array(count);
    const initialMass = new Float32Array(count);
    const msLifetimeTau = new Float32Array(count);
    const segTau = new Float32Array(count);
    const starClass = new Uint8Array(count);

    // Deterministic pseudo-random generator for reproducible Kroupa IMF & Plummer sphere
    let seed = 20180512;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      // Plummer sphere initial radial distribution: r = a / sqrt(u^(-2/3) - 1)
      const u = Math.max(0.002, rand());
      const rawR = 0.68 * Math.pow(Math.pow(u, -2 / 3) - 1, -0.5);
      const clampedR = Math.min(rawR, 3.6);
      r0[i] = clampedR;
      theta0[i] = Math.acos(2 * rand() - 1);
      phi0[i] = 2 * Math.PI * rand();

      // Crossing-time orbital angular velocity (Keplerian/Plummer scaling: omega ~ (r^2 + a^2)^(-3/4))
      const dynRate = 0.38 / Math.pow(clampedR * clampedR + 0.45, 0.75);
      omegaPhi[i] = dynRate * (rand() > 0.15 ? 1 : -1);
      omegaTheta[i] = dynRate * 0.35 * (rand() - 0.5);

      // Sample Kroupa Initial Mass Function (enriched tail for visual clarity of remnants)
      const q = rand();
      let m = 0.4;
      let cls = 0;
      let tMsTau = 25.0; // > Hubble time for low-mass stars

      if (q > 0.945) {
        // Massive OB stars (20 - 65 M_sun): evolve to stellar-mass BHs in 5 - 15 Myr (~0.006 - 0.02 tau_rh)
        m = 20 + rand() * 45;
        cls = 3;
        tMsTau = 0.005 + 0.014 * Math.pow(20 / m, 1.4);
      } else if (q > 0.78) {
        // Intermediate-mass stars (1.8 - 8 M_sun): evolve through Red Giant -> White Dwarf in 0.08 - 2.2 tau_rh
        m = 1.8 + rand() * 6.2;
        cls = 2;
        tMsTau = 0.06 + 1.9 * Math.pow(2.0 / m, 2.3);
      } else if (q > 0.42) {
        // Solar-type stars (0.85 - 1.8 M_sun): turn off around 3 - 15 tau_rh
        m = 0.85 + rand() * 0.95;
        cls = 1;
        tMsTau = 2.4 + 11.5 * Math.pow(1.0 / m, 2.5);
      } else {
        // Low-mass main-sequence stars (0.15 - 0.85 M_sun)
        m = 0.15 + rand() * 0.7;
        cls = 0;
        tMsTau = 30.0;
      }

      initialMass[i] = m;
      starClass[i] = cls;
      msLifetimeTau[i] = tMsTau;
      // Mass segregation timescale: t_seg ~ (<m> / M_remnant) * tau_rh (Spitzer 1987, Chapter 3 Sec 3.3.1)
      const remnantMass = cls === 3 ? Math.min(28, 0.38 * m) : cls === 2 ? 0.75 : m;
      segTau[i] = Math.max(0.045, (0.65 / remnantMass) * 1.1);
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
      starClass,
    };
  }, []);

  const { positions, colors } = useMemo(() => {
    return {
      positions: new Float32Array(catalog.count * 3),
      colors: new Float32Array(catalog.count * 3),
    };
  }, [catalog.count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = geom.getAttribute("color") as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;

    const tau = tauRef.current;
    const clock = state.clock.elapsedTime;

    let bhCount = 0;
    let wdCount = 0;
    let rgCount = 0;

    for (let i = 0; i < catalog.count; i++) {
      const cls = catalog.starClass[i];
      const tMs = catalog.msLifetimeTau[i];
      const rInit = catalog.r0[i];
      let rCurrent = rInit;

      // Color RGB components
      let cr = 0.18;
      let cg = 0.68;
      let cb = 0.88;

      if (cls === 3) {
        if (tau < tMs) {
          // Luminous Blue OB Main-Sequence Star (tau < 0.02 tau_rh)
          cr = 0.62;
          cg = 0.85;
          cb = 1.0;
          rCurrent = rInit;
        } else {
          // Stellar-Mass Black Hole Remnant (sinks to cluster core via dynamical friction on t_seg ~ 0.05-0.15 tau_rh)
          bhCount++;
          const dtAfterCollapse = tau - tMs;
          const sinkFactor = Math.exp(-dtAfterCollapse / catalog.segTau[i]);
          // Segregated BH core subsystem radius ~ 0.08 - 0.24
          const coreTarget = 0.06 + (i % 19) * 0.009;
          rCurrent = coreTarget + (rInit - coreTarget) * sinkFactor;

          // Accretion / gravitational-lensing amber-gold signature around dark remnant
          const pulse = 0.78 + 0.22 * Math.sin(clock * 4.5 + i);
          cr = 0.98 * pulse;
          cg = 0.68 * pulse;
          cb = 0.16 * pulse;
        }
      } else if (cls === 2) {
        if (tau < tMs) {
          // Blue-white A/F main sequence star
          cr = 0.52;
          cg = 0.82;
          cb = 0.98;
          rCurrent = rInit * (1 + 0.012 * Math.log(1 + tau));
        } else if (tau < tMs + 0.18) {
          // Red Giant / Asymptotic Giant Branch phase
          rgCount++;
          cr = 0.98;
          cg = 0.48;
          cb = 0.22;
          rCurrent = rInit * (1 + 0.02 * Math.log(1 + tau));
        } else {
          // White Dwarf remnant (gradually settles toward intermediate-inner halo)
          wdCount++;
          cr = 0.88;
          cg = 0.95;
          cb = 1.0;
          const settle = Math.exp(-(tau - tMs) / (catalog.segTau[i] * 2.5));
          rCurrent = rInit * (0.68 + 0.32 * settle);
        }
      } else if (cls === 1) {
        if (tau > tMs && tau < tMs + 0.45) {
          // Subgiant / Red Giant turnoff for solar-mass stars at late times
          rgCount++;
          cr = 0.96;
          cg = 0.56;
          cb = 0.26;
        } else if (tau >= tMs + 0.45) {
          wdCount++;
          cr = 0.85;
          cg = 0.92;
          cb = 0.98;
        } else {
          // Warm yellow-white F/G main-sequence star
          cr = 0.95;
          cg = 0.88;
          cb = 0.65;
        }
        // Two-body relaxation slowly expands the half-mass halo (r_h ~ (1 + tau / 8)^(1/3))
        rCurrent = rInit * Math.pow(1 + tau * 0.06, 0.28);
      } else {
        // Low-mass main-sequence star (Pelican signature cyan/blue palette)
        const mix = Math.min(rInit / 3.0, 1.0);
        cr = 0.11 + 0.05 * mix;
        cg = 0.68 - 0.18 * mix;
        cb = 0.87 - 0.14 * mix;
        // Energy equipartition pushes low-mass stars outward over multiple relaxation times
        rCurrent = rInit * Math.pow(1 + tau * 0.09, 0.34);
      }

      const phi = catalog.phi0[i] + clock * catalog.omegaPhi[i];
      const theta =
        catalog.theta0[i] + 0.18 * Math.sin(clock * catalog.omegaTheta[i] + i);

      const sinT = Math.sin(theta);
      posArr[i * 3] = rCurrent * sinT * Math.cos(phi);
      posArr[i * 3 + 1] = rCurrent * sinT * Math.sin(phi);
      posArr[i * 3 + 2] = rCurrent * Math.cos(theta);

      colArr[i * 3] = cr;
      colArr[i * 3 + 1] = cg;
      colArr[i * 3 + 2] = cb;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    pointsRef.current.rotation.y += delta * 0.025;

    if (statsCallback && Math.abs(tau - lastReportRef.current) > 0.04) {
      lastReportRef.current = tau;
      // Core contraction during mass segregation followed by BH heating core bounce
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
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.042}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Dynamically Formed Compact Binary Black Holes (BBHs) in the Core & Halo */}
      <group ref={bbhGroupRef}>
        {DYNAMIC_BINARIES.map((bbh) => (
          <CompactBinaryPairMesh key={bbh.id} bbh={bbh} tauRef={tauRef} />
        ))}
      </group>
    </group>
  );
}

function CompactBinaryPairMesh({
  bbh,
  tauRef,
}: {
  bbh: DynamicBinaryPair;
  tauRef: React.MutableRefObject<number>;
}) {
  const pairGroupRef = useRef<THREE.Group>(null);
  const bh1Ref = useRef<THREE.Mesh>(null);
  const bh2Ref = useRef<THREE.Mesh>(null);
  const waveRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const tau = tauRef.current;
    if (!pairGroupRef.current) return;

    if (tau < bbh.formTau) {
      pairGroupRef.current.visible = false;
      return;
    }
    pairGroupRef.current.visible = true;

    const tClock = state.clock.elapsedTime;
    // If tau exceeds ejectTau, the binary receives a dynamical 3-body recoil kick and travels outward
    let cx = 0;
    let cy = 0;
    let cz = 0;
    if (tau > bbh.ejectTau) {
      const dist = Math.min(3.1, (tau - bbh.ejectTau) * 0.42);
      cx = bbh.ejectionDir[0] * dist;
      cy = bbh.ejectionDir[1] * dist;
      cz = bbh.ejectionDir[2] * dist;
    } else {
      // Orbiting deep inside the mass-segregated cluster core (r < r_c)
      const coreOrbitR = 0.14;
      cx = coreOrbitR * Math.cos(tClock * 0.4 + bbh.angleOffset);
      cy = coreOrbitR * Math.sin(tClock * 0.4 + bbh.angleOffset) * 0.6;
      cz = coreOrbitR * Math.sin(tClock * 0.3 + bbh.angleOffset);
    }

    pairGroupRef.current.position.set(cx, cy, cz);

    // Keplerian eccentric orbit visualization hardened by 3-body encounters & Peters (1964) GW decay
    const hardening = Math.max(0.45, 1 - 0.03 * (tau - bbh.formTau));
    const aSemi = 0.085 * hardening;
    const ecc = bbh.eccentricity;
    const meanAnomaly = tClock * (3.2 + bbh.freqMHz * 0.8) + bbh.angleOffset;
    const eccAnomaly = meanAnomaly + ecc * Math.sin(meanAnomaly);
    const xOrb = aSemi * (Math.cos(eccAnomaly) - ecc);
    const yOrb = aSemi * Math.sqrt(1 - ecc * ecc) * Math.sin(eccAnomaly);

    if (bh1Ref.current && bh2Ref.current) {
      bh1Ref.current.position.set(xOrb, yOrb, 0);
      bh2Ref.current.position.set(-xOrb, -yOrb, 0);
    }

    if (waveRingRef.current) {
      const wavePhase = (tClock * 1.4 + bbh.angleOffset) % 1;
      const scale = 0.6 + wavePhase * 2.4;
      waveRingRef.current.scale.set(scale, scale, 1);
      const mat = waveRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (1 - wavePhase) * 0.55;
    }
  });

  return (
    <group ref={pairGroupRef} rotation={[bbh.inclination, bbh.angleOffset, 0]}>
      <mesh ref={bh1Ref}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh ref={bh2Ref}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#1DAEDF"
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh ref={waveRingRef}>
        <ringGeometry args={[0.07, 0.082, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function ConstellationGraph({
  selectedPillar,
  onSelectPillar,
  selectedWriting,
  onSelectWriting,
  visible,
}: ConstellationProps & { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !selectedPillar && !selectedWriting) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  const pillarMap = useMemo(() => {
    const map = new Map<string, IntellectualPillar>();
    INTELLECTUAL_PILLARS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  const edges = useMemo(() => {
    const list: {
      start: [number, number, number];
      end: [number, number, number];
      color: string;
      pillarId: string;
      isSecondary?: boolean;
    }[] = [];

    for (let i = 0; i < INTELLECTUAL_PILLARS.length; i++) {
      const current = INTELLECTUAL_PILLARS[i];
      const next = INTELLECTUAL_PILLARS[(i + 1) % INTELLECTUAL_PILLARS.length];
      list.push({
        start: [0, 0, 0],
        end: current.position,
        color: current.color,
        pillarId: current.id,
      });
      list.push({
        start: current.position,
        end: next.position,
        color: current.color,
        pillarId: current.id,
        isSecondary: true,
      });
    }

    WRITINGS_DATA.forEach((w) => {
      const p = pillarMap.get(w.pillar);
      if (p) {
        list.push({
          start: p.position,
          end: w.position,
          color: p.color,
          pillarId: p.id,
        });
      }
    });

    return list;
  }, [pillarMap]);

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* Central Core Node */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.25}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectPillar(null);
            onSelectWriting(null);
          }}
        >
          <sphereGeometry args={[0.19, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#1DAEDF"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
          <Html distanceFactor={10} position={[0, 0.36, 0]} center>
            <button
              onClick={() => {
                onSelectPillar(null);
                onSelectWriting(null);
              }}
              className="px-2.5 py-0.5 rounded-full bg-[#0d2238]/90 border border-[#1DAEDF]/60 text-[10px] font-mono tracking-wider text-white whitespace-nowrap shadow-md backdrop-blur-md cursor-pointer hover:bg-[#2980b9] transition"
            >
              Core: GC Core + Context Graph
            </button>
          </Html>
        </mesh>
      </Float>

      {/* Network Edges */}
      {edges.map((edge, idx) => {
        const isHighlighted =
          !selectedPillar || edge.pillarId === selectedPillar;
        return (
          <Line
            key={idx}
            points={[edge.start, edge.end]}
            color={edge.color}
            lineWidth={isHighlighted ? (edge.isSecondary ? 0.8 : 1.35) : 0.25}
            transparent
            opacity={isHighlighted ? (edge.isSecondary ? 0.3 : 0.52) : 0.07}
          />
        );
      })}

      {/* 7 Intellectual Interest Pillars */}
      {INTELLECTUAL_PILLARS.map((pillar) => {
        const isSelected = selectedPillar === pillar.id;
        const isDimmed = selectedPillar && !isSelected;

        return (
          <group key={pillar.id} position={pillar.position}>
            <Float speed={2} rotationIntensity={0.25} floatIntensity={0.35}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPillar(isSelected ? null : pillar.id);
                  onSelectWriting(null);
                }}
              >
                <sphereGeometry args={[isSelected ? 0.21 : 0.15, 28, 28]} />
                <meshStandardMaterial
                  color={pillar.color}
                  emissive={pillar.color}
                  emissiveIntensity={isSelected ? 2.4 : isDimmed ? 0.3 : 1.3}
                />
              </mesh>
              <Html distanceFactor={10} position={[0, 0.28, 0]} center>
                <button
                  onClick={() => {
                    onSelectPillar(isSelected ? null : pillar.id);
                    onSelectWriting(null);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap transition backdrop-blur-md cursor-pointer border ${
                    isSelected
                      ? "bg-[#2980b9] border-white text-white shadow-lg scale-105"
                      : isDimmed
                      ? "bg-[#0d2238]/60 border-[#2980b9]/30 text-slate-400"
                      : "bg-[#0d2238]/85 border-[#328cc7]/60 text-slate-100 hover:border-[#1DAEDF] hover:text-white"
                  }`}
                >
                  {pillar.shortTitle}
                </button>
              </Html>
            </Float>
          </group>
        );
      })}

      {/* 20 Writing Artifact Nodes */}
      {WRITINGS_DATA.map((w) => {
        const pillar = pillarMap.get(w.pillar);
        const color = pillar?.color || "#1DAEDF";
        const isPillarMatch =
          !selectedPillar ||
          w.pillar === selectedPillar ||
          w.secondaryPillars.includes(selectedPillar);
        const isSelected = selectedWriting?.id === w.id;

        return (
          <group key={w.id} position={w.position}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectWriting(isSelected ? null : w);
                if (!selectedPillar) {
                  onSelectPillar(w.pillar);
                }
              }}
            >
              <octahedronGeometry args={[isSelected ? 0.125 : 0.08, 0]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : color}
                emissive={color}
                emissiveIntensity={isSelected ? 2.6 : isPillarMatch ? 1.2 : 0.15}
                wireframe={!isPillarMatch}
              />
            </mesh>
            {(isSelected || (selectedPillar === w.pillar && w.featured)) && (
              <Html distanceFactor={10} position={[0, 0.2, 0]} center>
                <button
                  onClick={() => onSelectWriting(w)}
                  className="px-2 py-0.5 rounded bg-[#102a45]/95 border border-[#1DAEDF]/50 text-[9px] text-[#e0f2fe] max-w-[160px] truncate shadow-md cursor-pointer"
                >
                  {w.source}: {w.title}
                </button>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function ConstellationCanvas(props: ConstellationProps) {
  // Default simulation time starts at present day (16.875 tau_rh = 13.5 Gyr) or cycles cleanly when playing
  const [tauRh, setTauRh] = useState<number>(1.25);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showGraphOverlay, setShowGraphOverlay] = useState<boolean>(true);
  const [selectedSystemIdx, setSelectedSystemIdx] = useState<number>(0);
  const [wavePhaseOffset, setWavePhaseOffset] = useState<number>(0);

  const [clusterStats, setClusterStats] = useState({
    bhCount: 82,
    wdCount: 195,
    rgCount: 28,
    coreRadiusPc: 0.58,
    halfMassRadiusPc: 3.32,
    activeBbhCount: 4,
  });

  const tauRef = useRef<number>(tauRh);
  tauRef.current = tauRh;

  // Advance cluster evolutionary time (in units of half-mass relaxation time tau_rh) and LISA waveform phase
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTauRh((prev) => {
        // Non-linear step so early stellar evolution (0 - 0.25 tau_rh) is clearly observable
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
      return "Epoch I (t < 0.02 τ_rh · ~5–15 Myr): Massive OB stars (M > 20 M☉) undergo core-collapse supernovae into stellar-mass BHs.";
    }
    if (tauRh < 0.25) {
      return "Epoch II (t ~ t_seg ≈ 0.05–0.20 τ_rh · ~40–160 Myr): Dynamical friction drives BH remnants into the dense core (mass segregation).";
    }
    if (tauRh < 2.5) {
      return "Epoch III (t ~ 0.25–2.5 τ_rh · ~0.2–2 Gyr): Core 3-body & 4-body (Fewbody) interactions dynamically pair & harden compact BBHs.";
    }
    return "Epoch IV (t ~ 2.5–16.9 τ_rh · up to 13.5 Gyr): Relativistic GW inspiral (ḟ = k₀ f¹¹/³) & LISA multi-harmonic detection.";
  }, [tauRh]);

  const activeSystem =
    GC_RESEARCH_FINDINGS.sampleSystems[selectedSystemIdx] ||
    GC_RESEARCH_FINDINGS.sampleSystems[0];

  // Generate LISA N2A5 sensitivity curve sqrt(S_n(f)) and characteristic strain tracks in SVG coordinates
  const lisaPlotData = useMemo(() => {
    // Log-log plot bounds: f in [1e-4, 1e-1] Hz (log10 f in [-4, -1]), strain in [1e-22, 1e-17] (log10 h in [-22, -17])
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

    // LISA N2A5 noise curve (Cornish & Larson / Robson et al. + Galactic WD confusion foreground)
    const curvePoints: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const logF = -4.0 + (i / 60) * 3.0;
      const f = Math.pow(10, logF);
      // Effective characteristic noise strain h_n(f) = sqrt(f * S_n(f))
      const lowFreqAccel = 2.4e-19 * Math.pow(1e-3 / f, 1.85);
      const midFloor = 3.2e-21 * (1 + 0.45 * Math.exp(-Math.pow((logF + 2.75) / 0.28, 2)));
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

    // Peters (1964) relativistic frequency evolution track for inspiralling GC BBHs: h_c(f) ~ M_c^(5/6) f^(-1/6) / D
    const systemPoints = GC_RESEARCH_FINDINGS.sampleSystems.map((sys, idx) => {
      const logF0 = Math.log10(sys.fGwMhz * 1e-3);
      // Characteristic strain h_c over 2-yr LISA observation: h_c ~ h_0 * sqrt(f * T_obs)
      const baseLogH =
        -20.35 +
        (5 / 6) * Math.log10(sys.chirpMassSolar / 15) -
        Math.log10(sys.distanceMpc / 20) +
        0.22 * Math.log10(sys.fGwMhz / 0.2);

      // Harmonics for eccentric systems (n = 1..5 for eccentric binaries, n = 2 dominant for circular)
      const harmonics: { x: number; y: number; n: number }[] = [];
      const maxHarmonic = sys.eccentricity > 0.3 ? 5 : 1;
      for (let h = 1; h <= maxHarmonic; h++) {
        const lf = Math.min(-1.05, Math.max(-3.95, logF0 + Math.log10(h * 0.85)));
        const lh = Math.min(
          -17.2,
          Math.max(-21.8, baseLogH + (sys.eccentricity > 0.3 ? 0.18 * (3 - Math.abs(h - 3)) : 0))
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

  // Generate 2-year LISA time-domain strain response h_alpha(t) = (sqrt(3)/2) A_alpha(t) cos(2pi f_0 t + psi_p + psi_D(t))
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
      const u = i / 140; // u in [0, 1] -> t in [0, 2 yr]
      const tYr = u * 2.0;
      const x = padL + u * plotW;

      // Annual LISA orbital antenna beam-pattern modulation A_alpha(t) (Eq. 6.4-6.9, 60-deg arms, sqrt(3)/2 factor)
      const annualAngle = 2 * Math.PI * tYr + selectedSystemIdx * 0.9;
      const beamEnv =
        0.58 +
        0.34 * Math.cos(annualAngle) +
        0.08 * Math.sin(2 * annualAngle);

      // 1 AU orbital Doppler phase modulation psi_D(t) = (2pi f R / c) sin(theta_s) cos(phi(t) - phi_s) (Eq. 6.13)
      const dopplerPhase =
        1.85 * Math.sin(annualAngle - 0.4) * (0.6 + 1.2 * activeSystem.fGwMhz);

      // Eccentric harmonic enrichment + carrier phase
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
    <div className="rounded-2xl overflow-hidden border border-[#b9d9eb] bg-gradient-to-b from-[#0b2034] via-[#0e263f] to-[#081827] shadow-xl">
      {/* Top Simulation Control & Timescale Bar */}
      <div className="px-4 py-3 border-b border-sky-900/70 bg-[#081827]/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-full bg-[#0d2642] border border-[#1DAEDF]/50 text-[10px] sm:text-[11px] font-mono text-[#7dd3fc] font-semibold">
            MOCCA GLOBULAR CLUSTER &amp; LISA GW SIMULATION
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            t = <strong className="text-white">{tauRh.toFixed(2)} τ_rh</strong>{" "}
            <span className="text-sky-300/80">({timeGyr} Gyr)</span>
          </span>
          <span className="hidden md:inline text-[11px] font-mono text-slate-400">
            · τ_rh ≈ 800 Myr · t_seg ≈ 0.08 τ_rh
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded-lg bg-[#2980b9] hover:bg-[#1DAEDF] text-white text-[11px] font-mono font-medium transition cursor-pointer"
          >
            {isPlaying ? "Pause ❚❚" : "Evolve ▶"}
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

          <button
            onClick={() => setShowGraphOverlay(!showGraphOverlay)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer border ${
              showGraphOverlay
                ? "bg-[#12314f] border-[#1DAEDF]/60 text-sky-200"
                : "bg-[#0a1b2e] border-slate-700 text-slate-400"
            }`}
          >
            {showGraphOverlay ? "Context Nodes: ON" : "Context Nodes: OFF"}
          </button>
        </div>
      </div>

      {/* Interactive Relaxation-Time Scrubber & Preset Epochs */}
      <div className="px-4 py-2.5 border-b border-sky-900/60 bg-[#0a1d31]/90 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="gc-tau-slider"
            className="text-[11px] font-mono text-sky-200 shrink-0"
          >
            Cluster Age (t / τ_rh):
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
              { label: "0.01 τ_rh (OB→BH)", val: 0.01 },
              { label: "0.12 τ_rh (Segregation)", val: 0.12 },
              { label: "1.0 τ_rh (Core BBHs)", val: 1.0 },
              { label: "16.9 τ_rh (13.5 Gyr)", val: 16.875 },
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
              <span className="w-2 h-2 rounded-full bg-[#93c5fd]" /> OB Stars
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#fb923c]" /> Red Giants
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#e2e8f0]" /> White Dwarfs ({clusterStats.wdCount})
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Segregated BHs ({clusterStats.bhCount})
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Window: Left = 3D Globular Cluster N-Body & Stellar Evolution | Right = LISA GW Side Window */}
      <div className="grid grid-cols-1 xl:grid-cols-12">
        {/* Left 7 Columns: 3D Globular Cluster + Context Graph Canvas */}
        <div className="xl:col-span-7 relative h-[360px] sm:h-[460px] xl:h-[540px] border-b xl:border-b-0 xl:border-r border-sky-900/60 touch-manipulation">
          <Canvas
            camera={{ position: [0, 0.7, 5.8], fov: 50 }}
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
              speed={0.6}
            />
            <GlobularClusterEvolution
              tauRef={tauRef}
              statsCallback={setClusterStats}
            />
            <ConstellationGraph {...props} visible={showGraphOverlay} />
            <OrbitControls
              enablePan={false}
              minDistance={2.6}
              maxDistance={9.5}
              autoRotate={!props.selectedPillar && !props.selectedWriting}
              autoRotateSpeed={0.32}
            />
          </Canvas>

          {/* Bottom-left live dynamical diagnostics overlay */}
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
            <div className="px-2.5 py-1.5 rounded-lg bg-[#071524]/85 border border-sky-800/70 text-[10px] font-mono text-slate-200 backdrop-blur-md flex flex-wrap items-center gap-3">
              <span>
                r_c: <strong className="text-[#7dd3fc]">{clusterStats.coreRadiusPc} pc</strong>
              </span>
              <span>
                r_h: <strong className="text-[#7dd3fc]">{clusterStats.halfMassRadiusPc} pc</strong>
              </span>
              <span>
                Core BHs: <strong className="text-amber-300">{clusterStats.bhCount}</strong>
              </span>
              <span>
                Dynamic BBHs: <strong className="text-sky-300">{clusterStats.activeBbhCount}</strong>
              </span>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#071524]/80 border border-slate-700 text-[10px] font-mono text-slate-300 backdrop-blur-md">
              Spitzer τ_rh scaling · Fewbody core exchange
            </span>
          </div>
        </div>

        {/* Right 5 Columns: LISA Gravitational-Wave Detector Side Window */}
        <div className="xl:col-span-5 bg-[#071524]/95 p-4 sm:p-5 flex flex-col justify-between space-y-4 text-slate-100">
          {/* Header & Event Rate Badge from Doctoral Dissertation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DAEDF] font-semibold">
                LISA Space Interferometer Side Window
              </span>
              <a
                href="/articles/research/astrophysics-bbh-dissertation.html"
                className="text-[10px] font-mono text-sky-300 hover:text-white underline underline-offset-4"
              >
                Dissertation (2018) ↗
              </a>
            </div>

            <div className="p-3 rounded-xl bg-[#0c2138] border border-sky-800/80 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-300">
                  Local Universe Lower-Bound BBH Merger Rate:
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-amber-300">
                  η ≃ 587 Gpc⁻³ yr⁻¹
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Derived from{" "}
                <strong className="text-white">662,772 globular clusters</strong>{" "}
                across <strong className="text-white">8,946 galaxies</strong>{" "}
                within D ≤ 30 Mpc (3,240 MOCCA models; 17,883,760 inspiralling
                BBHs; 86,939 mergers vs. ~100 Gpc⁻³ yr⁻¹ pre-LIGO &amp; 9–240
                Gpc⁻³ yr⁻¹ early LIGO O1).
              </p>
            </div>
          </div>

          {/* Plot 1: LISA Frequency-Domain Characteristic Strain & Harmonics */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>LISA Sensitivity √(f·S_n(f)) &amp; Peters Inspiral (ḟ = k₀ f¹¹/³)</span>
              <span className="text-sky-300">0.1 mHz – 0.1 Hz</span>
            </div>

            <div className="rounded-xl bg-[#040d17] border border-sky-900/80 p-2">
              <svg
                viewBox={`0 0 ${lisaPlotData.width} ${lisaPlotData.height}`}
                className="w-full h-auto overflow-visible"
                role="img"
                aria-label="LISA sensitivity curve and globular cluster compact binary strain spectrum"
              >
                {/* Grid lines */}
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

                {/* LISA N2A5 Sensitivity Curve */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  points={lisaPlotData.curvePath}
                />

                {/* Background population cloud of inspiralling GC BBHs */}
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

                {/* Highlighted Dissertation Table 6-1 & Table 6-2 BBH Systems */}
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
                            <circle
                              cx={h.x}
                              cy={h.y}
                              r={3}
                              fill="#fbbf24"
                            />
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

          {/* Plot 2: 2-Year LISA Time-Domain Strain h_alpha(t) with Orbital Doppler & Amplitude Modulation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>
                Detector Strain h_α(t) = (√3/2) A_α(t) cos[2πf₀t + ψ_p + ψ_D(t)]
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
                {/* Annual AM envelope */}
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
                {/* Modulated GW strain h_alpha(t) */}
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
                  0.0 yr (1 AU Orbit, 20° behind Earth)
                </text>
                <text
                  x={timeWaveform.width - timeWaveform.padR}
                  y={timeWaveform.height - 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  2.0 yr (ΔV ≤ 1 Mpc³ Siren)
                </text>
              </svg>
            </div>
          </div>

          {/* Selectable Compact Binary Catalog (Table 6-1 & Table 6-2 Standard Sirens) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>Select Dissertation Compact Binary System:</span>
              <span className="text-sky-300">
                17 Systems Localized to ΔV ≤ 1 Mpc³
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
                <span>𝓜_c={activeSystem.chirpMassSolar} M☉</span>
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
    </div>
  );
}
