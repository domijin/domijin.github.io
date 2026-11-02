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
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorCore = new THREE.Color("#1DAEDF"); // Domi's signature cyan
    const colorOuter = new THREE.Color("#2980b9"); // Pelican primary blue

    for (let i = 0; i < count; i++) {
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
      pointsRef.current.rotation.y += delta * 0.035;
      pointsRef.current.rotation.x += delta * 0.012;
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
        size={0.035}
        vertexColors
        transparent
        opacity={0.65}
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
      groupRef.current.rotation.y += delta * 0.05;
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

    // Core to pillars & pillar ring
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

    // Pillar to writings
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
      {/* Central Singularity Node */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectPillar(null);
            onSelectWriting(null);
          }}
        >
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#1DAEDF"
            emissiveIntensity={1.8}
            roughness={0.1}
          />
          <Html distanceFactor={10} position={[0, 0.38, 0]} center>
            <button
              onClick={() => {
                onSelectPillar(null);
                onSelectWriting(null);
              }}
              className="px-2.5 py-1 rounded-full bg-[#1b3a57]/90 border border-[#1DAEDF]/60 text-[10px] font-mono tracking-wider text-white whitespace-nowrap shadow-md backdrop-blur-md cursor-pointer hover:bg-[#2980b9] transition"
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
            lineWidth={isHighlighted ? (edge.isSecondary ? 0.9 : 1.5) : 0.3}
            transparent
            opacity={isHighlighted ? (edge.isSecondary ? 0.35 : 0.6) : 0.08}
          />
        );
      })}

      {/* 7 Intellectual Interest Pillars */}
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
                  emissiveIntensity={isSelected ? 2.4 : isDimmed ? 0.3 : 1.3}
                />
              </mesh>
              <Html distanceFactor={10} position={[0, 0.3, 0]} center>
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
              <octahedronGeometry args={[isSelected ? 0.13 : 0.085, 0]} />
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
  return (
    <div className="relative w-full h-[340px] sm:h-[460px] lg:h-[580px] rounded-2xl overflow-hidden border border-[#b9d9eb] bg-gradient-to-b from-[#0b2034] via-[#102b45] to-[#081827] shadow-xl touch-manipulation">
      <Canvas
        camera={{ position: [0, 0.8, 6.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[6, 6, 6]} intensity={1.6} color="#1DAEDF" />
        <pointLight position={[-6, -4, -4]} intensity={1.2} color="#2980b9" />
        <Stars
          radius={60}
          depth={40}
          count={1800}
          factor={3}
          saturation={0.3}
          fade
          speed={0.7}
        />
        <GlobularClusterCore />
        <ConstellationGraph {...props} />
        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={9.5}
          autoRotate={!props.selectedPillar && !props.selectedWriting}
          autoRotateSpeed={0.35}
        />
      </Canvas>

      {/* Responsive HUD */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
        <span className="px-2.5 py-1 rounded-full bg-[#0a1a2b]/85 border border-[#1DAEDF]/40 text-[10px] sm:text-[11px] font-mono text-[#7dd3fc] backdrop-blur-md">
          THREE.JS // N-BODY DYNAMICS &amp; CONTEXT GRAPH
        </span>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#0a1a2b]/80 border border-slate-700 text-[11px] text-slate-300 backdrop-blur-md">
          Drag to orbit · Pinch to zoom · Tap nodes
        </span>
      </div>
    </div>
  );
}
