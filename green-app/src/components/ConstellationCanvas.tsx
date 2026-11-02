"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  INTELLECTUAL_PILLARS,
  WRITINGS_DATA,
  IntellectualPillar,
  WritingNode,
} from "@/data/contextMapData";

interface ConstellationProps {
  selectedPillar: string | null;
  onSelectPillar: (id: string | null) => void;
  selectedWriting: WritingNode | null;
  onSelectWriting: (node: WritingNode | null) => void;
}

function GlobularClusterCore() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorCore = new THREE.Color("#38bdf8");
    const colorOuter = new THREE.Color("#818cf8");

    for (let i = 0; i < count; i++) {
      // Plummer-like spherical density profile inspired by globular cluster astrophysics
      const u = Math.random();
      const r = 0.55 * Math.pow(Math.pow(u, -2 / 3) - 1, -0.5);
      const clampedR = Math.min(r, 3.8);
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();

      pos[i * 3] = clampedR * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = clampedR * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = clampedR * Math.cos(theta);

      const mixRatio = Math.min(clampedR / 3.0, 1);
      const c = colorCore.clone().lerp(colorOuter, mixRatio);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ConstellationGraph({
  selectedPillar,
  onSelectPillar,
  selectedWriting,
  onSelectWriting,
}: ConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !selectedPillar && !selectedWriting) {
      groupRef.current.rotation.y += delta * 0.055;
    }
  });

  const pillarMap = useMemo(() => {
    const map = new Map<string, IntellectualPillar>();
    INTELLECTUAL_PILLARS.forEach((p) => map.set(p.id, p));
    return map;
  }, []);

  // Build edges between center and pillars, pillars to pillars, and pillars to writings
  const edges = useMemo(() => {
    const list: {
      start: [number, number, number];
      end: [number, number, number];
      color: string;
      pillarId: string;
      isSecondary?: boolean;
    }[] = [];

    // Ring connections between pillars
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

    // Connections from writings to their primary pillar
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

  return (
    <group ref={groupRef}>
      {/* Central Singularity / Core Question Node */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectPillar(null);
            onSelectWriting(null);
          }}
        >
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#38bdf8"
            emissiveIntensity={1.6}
            roughness={0.1}
          />
          <Html distanceFactor={10} position={[0, 0.42, 0]} center>
            <button
              onClick={() => {
                onSelectPillar(null);
                onSelectWriting(null);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-950/85 border border-sky-400/50 text-[10px] font-mono tracking-wider uppercase text-sky-200 whitespace-nowrap shadow-lg backdrop-blur-md hover:bg-sky-950/90 transition cursor-pointer"
            >
              Core: Human + Collective Agency
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
            lineWidth={isHighlighted ? (edge.isSecondary ? 0.8 : 1.4) : 0.4}
            transparent
            opacity={isHighlighted ? (edge.isSecondary ? 0.25 : 0.5) : 0.08}
          />
        );
      })}

      {/* 7 Intellectual Interest Pillar Nodes */}
      {INTELLECTUAL_PILLARS.map((pillar) => {
        const isSelected = selectedPillar === pillar.id;
        const isDimmed = selectedPillar && !isSelected;

        return (
          <group key={pillar.id} position={pillar.position}>
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPillar(isSelected ? null : pillar.id);
                  onSelectWriting(null);
                }}
              >
                <sphereGeometry args={[isSelected ? 0.22 : 0.16, 28, 28]} />
                <meshStandardMaterial
                  color={pillar.color}
                  emissive={pillar.color}
                  emissiveIntensity={isSelected ? 2.2 : isDimmed ? 0.3 : 1.2}
                />
              </mesh>
              <Html distanceFactor={10} position={[0, 0.3, 0]} center>
                <button
                  onClick={() => {
                    onSelectPillar(isSelected ? null : pillar.id);
                    onSelectWriting(null);
                  }}
                  style={{
                    borderColor: isSelected ? pillar.color : "rgba(148,163,184,0.3)",
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition backdrop-blur-md cursor-pointer border ${
                    isSelected
                      ? "bg-slate-900/95 text-white shadow-lg scale-105"
                      : isDimmed
                      ? "bg-slate-950/50 text-slate-500"
                      : "bg-slate-950/80 text-slate-200 hover:text-white"
                  }`}
                >
                  {pillar.shortTitle}
                </button>
              </Html>
            </Float>
          </group>
        );
      })}

      {/* 20 Writing & Artifact Satellite Nodes */}
      {WRITINGS_DATA.map((w) => {
        const pillar = pillarMap.get(w.pillar);
        const color = pillar?.color || "#94a3b8";
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
              <octahedronGeometry args={[isSelected ? 0.13 : 0.085, 0]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : color}
                emissive={color}
                emissiveIntensity={isSelected ? 2.5 : isPillarMatch ? 1.1 : 0.15}
                wireframe={!isPillarMatch}
              />
            </mesh>
            {(isSelected || (selectedPillar === w.pillar && w.featured)) && (
              <Html distanceFactor={10} position={[0, 0.2, 0]} center>
                <button
                  onClick={() => onSelectWriting(w)}
                  className="px-2 py-0.5 rounded bg-slate-900/95 border border-white/25 text-[9px] text-sky-100 max-w-[170px] truncate shadow-md cursor-pointer"
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
  return (
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-[#050814] via-[#070b1c] to-[#04060e] shadow-2xl">
      <Canvas
        camera={{ position: [0, 0.8, 6.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 6]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-6, -4, -4]} intensity={1.0} color="#c084fc" />
        <Stars
          radius={60}
          depth={40}
          count={2200}
          factor={3}
          saturation={0.4}
          fade
          speed={0.8}
        />
        <GlobularClusterCore />
        <ConstellationGraph {...props} />
        <OrbitControls
          enablePan={false}
          minDistance={3.4}
          maxDistance={9.5}
          autoRotate={!props.selectedPillar && !props.selectedWriting}
          autoRotateSpeed={0.35}
        />
      </Canvas>

      {/* Subtle HUD Overlay */}
      <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-sky-400 backdrop-blur-md">
          THREE.JS // N-BODY &amp; CONTEXT GRAPH SIMULATION
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-950/75 border border-slate-800/80 text-[11px] text-slate-400 backdrop-blur-md">
          Drag to orbit · Scroll to zoom · Click nodes to inspect
        </span>
      </div>
    </div>
  );
}
