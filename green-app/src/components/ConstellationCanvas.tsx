"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Float, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  INTELLECTUAL_PILLARS,
  WRITINGS_DATA,
  OPEN_PROJECTS,
  IntellectualPillar,
  WritingNode,
} from "@/data/contextMapData";

interface ConstellationProps {
  selectedPillar: string | null;
  onSelectPillar: (id: string | null) => void;
  selectedWriting: WritingNode | null;
  onSelectWriting: (node: WritingNode | null) => void;
  onOpenEssay?: (url: string) => void;
}

const PROJECT_POSITIONS: [number, number, number][] = [
  [1.1, 0.9, 0.8],
  [-1.2, 0.85, 0.7],
  [0.2, -1.15, 0.95],
  [-1.1, -0.8, -0.75],
  [1.25, -0.65, -0.8],
  [-0.25, 1.15, -0.9],
];

const PROJECT_PILLAR_MAP: Record<string, string> = {
  "open-learning-lab": "human-potential",
  "baby-ai": "human-ai-collaboration",
  "imessage-router": "human-ai-collaboration",
  "kin-domi": "ai-and-society",
  "agent-ad-systems": "decision-intelligence",
  "libertyearth-future": "collective-intelligence",
};

function SiteMapGraph({
  selectedPillar,
  onSelectPillar,
  selectedWriting,
  onSelectWriting,
  onOpenEssay,
}: ConstellationProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !selectedPillar && !selectedWriting) {
      groupRef.current.rotation.y += delta * 0.035;
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

    // Core to 7 Topic Pillars & Topic Ring
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

    // Topic Pillars to 20 Writings
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
      // Cross-topic secondary links
      w.secondaryPillars.forEach((secId) => {
        const secPillar = pillarMap.get(secId);
        if (secPillar) {
          list.push({
            start: secPillar.position,
            end: w.position,
            color: secPillar.color,
            pillarId: secPillar.id,
            isSecondary: true,
          });
        }
      });
    });

    // Topic Pillars to 6 Open Projects
    OPEN_PROJECTS.forEach((proj, idx) => {
      const pId = PROJECT_PILLAR_MAP[proj.id] || "human-ai-collaboration";
      const p = pillarMap.get(pId);
      const pos = PROJECT_POSITIONS[idx % PROJECT_POSITIONS.length];
      if (p) {
        list.push({
          start: p.position,
          end: pos,
          color: p.color,
          pillarId: p.id,
        });
      }
    });

    return list;
  }, [pillarMap]);

  return (
    <group ref={groupRef}>
      {/* Subtle Reference Coordinate Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.95, 1.97, 64]} />
        <meshBasicMaterial
          color="#1DAEDF"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.85, 2.87, 64]} />
        <meshBasicMaterial
          color="#2980b9"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central Site Map Hub */}
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.2}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectPillar(null);
            onSelectWriting(null);
          }}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#1DAEDF"
            emissiveIntensity={1.6}
            roughness={0.15}
          />
          <Html distanceFactor={10} position={[0, 0.36, 0]} center>
            <button
              onClick={() => {
                onSelectPillar(null);
                onSelectWriting(null);
              }}
              className="px-2.5 py-1 rounded-full bg-[#0d2238]/95 border border-[#1DAEDF]/60 text-[10px] font-mono tracking-wider text-white whitespace-nowrap shadow-md backdrop-blur-md cursor-pointer hover:bg-[#2980b9] transition"
            >
              All Topics, Works &amp; Writings
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
            lineWidth={isHighlighted ? (edge.isSecondary ? 0.75 : 1.5) : 0.25}
            transparent
            opacity={isHighlighted ? (edge.isSecondary ? 0.24 : 0.6) : 0.06}
          />
        );
      })}

      {/* 7 Intellectual Topic Pillars */}
      {INTELLECTUAL_PILLARS.map((pillar) => {
        const isSelected = selectedPillar === pillar.id;
        const isDimmed = selectedPillar && !isSelected;

        return (
          <group key={pillar.id} position={pillar.position}>
            <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
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
                      : "bg-[#0d2238]/90 border-[#328cc7]/60 text-slate-100 hover:border-[#1DAEDF] hover:text-white"
                  }`}
                >
                  {pillar.shortTitle}
                </button>
              </Html>
            </Float>
          </group>
        );
      })}

      {/* 6 Open Project / System Nodes (Cubes) */}
      {OPEN_PROJECTS.map((proj, idx) => {
        const pos = PROJECT_POSITIONS[idx % PROJECT_POSITIONS.length];
        const pillarId =
          PROJECT_PILLAR_MAP[proj.id] || "human-ai-collaboration";
        const isPillarMatch = !selectedPillar || selectedPillar === pillarId;

        return (
          <group key={proj.id} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectPillar(pillarId);
                const matchingWriting = WRITINGS_DATA.find(
                  (w) => w.url === proj.url || w.pillar === pillarId
                );
                if (matchingWriting) onSelectWriting(matchingWriting);
              }}
            >
              <boxGeometry args={[0.13, 0.13, 0.13]} />
              <meshStandardMaterial
                color={isPillarMatch ? "#38bdf8" : "#475569"}
                emissive="#1DAEDF"
                emissiveIntensity={isPillarMatch ? 1.4 : 0.2}
              />
            </mesh>
            {isPillarMatch && (
              <Html distanceFactor={10} position={[0, -0.22, 0]} center>
                {proj.localMirrorUrl && onOpenEssay ? (
                  <button
                    onClick={() => onOpenEssay(proj.localMirrorUrl!)}
                    className="px-1.5 py-0.5 rounded bg-[#0c2138]/90 border border-sky-500/40 text-[8.5px] font-mono text-sky-200 whitespace-nowrap hover:border-white transition cursor-pointer"
                  >
                    Project: {proj.name.split(" (")[0]}
                  </button>
                ) : (
                  <a
                    href={proj.localMirrorUrl || proj.url}
                    className="px-1.5 py-0.5 rounded bg-[#0c2138]/90 border border-sky-500/40 text-[8.5px] font-mono text-sky-200 whitespace-nowrap hover:border-white transition"
                  >
                    Project: {proj.name.split(" (")[0]}
                  </a>
                )}
              </Html>
            )}
          </group>
        );
      })}

      {/* 28 Writing Nodes (Octahedrons) */}
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
              <octahedronGeometry args={[isSelected ? 0.135 : 0.088, 0]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : color}
                emissive={color}
                emissiveIntensity={isSelected ? 2.6 : isPillarMatch ? 1.25 : 0.15}
                wireframe={!isPillarMatch}
              />
            </mesh>
            {(isSelected || (selectedPillar === w.pillar && w.featured)) && (
              <Html distanceFactor={10} position={[0, 0.2, 0]} center>
                <button
                  onClick={() => onSelectWriting(w)}
                  className="px-2 py-0.5 rounded bg-[#102a45]/95 border border-[#1DAEDF]/50 text-[9px] text-[#e0f2fe] max-w-[165px] truncate shadow-md cursor-pointer"
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
    <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-2xl overflow-hidden border border-[#b9d9eb] bg-gradient-to-b from-[#0b2034] via-[#102b45] to-[#081827] shadow-xl touch-manipulation">
      <Canvas
        camera={{ position: [0, 0.8, 6.2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[6, 6, 6]} intensity={1.6} color="#1DAEDF" />
        <pointLight position={[-6, -4, -4]} intensity={1.2} color="#2980b9" />
        <SiteMapGraph {...props} />
        <OrbitControls
          enablePan={false}
          minDistance={3.0}
          maxDistance={9.5}
          autoRotate={!props.selectedPillar && !props.selectedWriting}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Top HUD */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
        <span className="px-2.5 py-1 rounded-full bg-[#0a1a2b]/85 border border-[#1DAEDF]/40 text-[10px] sm:text-[11px] font-mono text-[#7dd3fc] backdrop-blur-md">
          INTERACTIVE SITE MAP // 7 TOPICS · 6 WORKS · 28 WRITINGS
        </span>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#0a1a2b]/80 border border-slate-700 text-[11px] text-slate-300 backdrop-blur-md">
          Drag to orbit · Scroll to zoom · Select any topic, project or essay
        </span>
      </div>

      {/* Bottom Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-300">
        <div className="px-2.5 py-1 rounded-lg bg-[#0a1a2b]/85 border border-sky-900/70 flex flex-wrap items-center gap-3 backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1DAEDF]" /> Topic Pillars (7)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#38bdf8]" /> Works &amp; Systems (6)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-white border border-[#1DAEDF]" /> Essays &amp; Notes (28)
          </span>
        </div>
      </div>
    </div>
  );
}
