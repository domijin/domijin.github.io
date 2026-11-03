"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  GROWTH_DOMAINS,
  GROWTH_R_BASE,
  ampNow,
  annotationAt,
  angleOf,
  crossingDomains,
  curve,
  humanRadius,
  modelRadius,
} from "@/lib/knowledgeGrowth";
import { NODES } from "@/lib/knowledgeScoring";

/**
 * The interactive version of the growth story.
 *
 * The same picture as the GIF, as geometry: the spiky outline of collective
 * human knowledge on the ground, the model's boundary growing inside it, the
 * expert's breakthroughs sitting on the spikes, and the crossings marked where
 * the model has passed the human graph. Above it floats the cloud of concept
 * nodes, sized and lit by how much weight a prompt gave them.
 */

/** Where each concept node floats in the scene. */
const NODE_POS: Record<string, [number, number, number]> = {
  embedding: [-24, 92, -16],
  meme: [-9, 112, -28],
  mocca: [6, 86, -18],
  bbh: [23, 120, -5],
  siren: [31, 144, -22],
  auction: [-21, 76, 3],
  demand: [-4, 68, 15],
  signal: [-29, 98, 17],
  reglag: [9, 104, 5],
  calib: [-25, 62, 27],
  retrieval: [11, 80, 31],
};

const NODE_EDGES: [string, string][] = [
  ["embedding", "meme"],
  ["embedding", "calib"],
  ["meme", "mocca"],
  ["meme", "reglag"],
  ["meme", "calib"],
  ["mocca", "bbh"],
  ["bbh", "siren"],
  ["siren", "reglag"],
  ["auction", "demand"],
  ["auction", "signal"],
  ["demand", "reglag"],
  ["signal", "calib"],
  ["calib", "retrieval"],
  ["retrieval", "reglag"],
];

const HUMAN = "#1DAEDF";
const MODEL = "#7dd3fc";
const EXPERT = "#fbbf24";
const CROSS = "#f472b6";

export interface GeneratedNode {
  id: string;
  name: string;
  gloss: string;
  /** how close it sits to the node it was placed near */
  similarity: number;
  parent: string;
}

function shapeFrom(pts: [number, number, number][]) {
  const shape = new THREE.Shape();
  pts.forEach(([x, , z], i) => {
    if (i === 0) shape.moveTo(x, z);
    else shape.lineTo(x, z);
  });
  shape.closePath();
  return shape;
}

function Scene({
  frame,
  weights,
  selected,
  onSelect,
  generated,
  spinning,
}: {
  frame: number;
  weights: Record<string, number>;
  selected: string | null;
  onSelect: (id: string) => void;
  generated: GeneratedNode[];
  spinning: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current && spinning) group.current.rotation.y += delta * 0.06;
  });

  const human = useMemo(() => curve(frame, humanRadius), [frame]);
  const model = useMemo(() => curve(frame, modelRadius), [frame]);
  const modelShape = useMemo(() => shapeFrom(model), [model]);

  const crossings = useMemo(() => {
    const out: [number, number, number][][] = [];
    for (const d of crossingDomains(frame)) {
      const a = angleOf(d);
      const r = modelRadius(a, frame);
      out.push([
        [r * Math.cos(a), 0.4, r * Math.sin(a)],
        [(r + 9) * Math.cos(a), 0.4, (r + 9) * Math.sin(a)],
      ]);
    }
    return out;
  }, [frame]);

  const breakthroughs = useMemo(
    () =>
      GROWTH_DOMAINS.filter((d) => d.t !== null && frame >= d.t).map((d) => {
        const a = angleOf(d);
        const r = humanRadius(a, frame);
        return { a, r, label: d.label };
      }),
    [frame]
  );

  return (
    <>
      <group ref={group}>
      {/* the human outline */}
      <Line points={human} color={HUMAN} lineWidth={2} />

      {/* the model's boundary, filled */}
      <mesh position={[0, -0.4, 0]}>
        <shapeGeometry args={[modelShape]} />
        <meshBasicMaterial
          color="#0d2642"
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
      <Line points={model} color={MODEL} lineWidth={2.2} />

      {/* the spikes: one per domain, and the expert's result on top */}
      {GROWTH_DOMAINS.map((d, i) => {
        const a = angleOf(d);
        const len = GROWTH_R_BASE * ampNow(d, frame);
        const tip = GROWTH_R_BASE + len;
        const mid = GROWTH_R_BASE + len / 2;
        const isBreak = d.t !== null && frame >= d.t;
        return (
          <group key={i}>
            <mesh
              position={[mid * Math.cos(a), 0, mid * Math.sin(a)]}
              rotation={[0, -a + Math.PI / 2, 0]}
            >
              <coneGeometry args={[2.4, Math.max(2, len), 6]} />
              <meshBasicMaterial color={HUMAN} />
            </mesh>
            {d.label && (
              <Billboard>
                <Text
                  position={[(tip + 12) * Math.cos(a), 9, (tip + 12) * Math.sin(a)]}
                  fontSize={5.5}
                  color="#94a3b8"
                  anchorX="center"
                  anchorY="middle"
                >
                  {d.label}
                </Text>
              </Billboard>
            )}
            {isBreak && (
              <mesh position={[tip * Math.cos(a), 2.5, tip * Math.sin(a)]}>
                <sphereGeometry args={[3.2, 16, 16]} />
                <meshBasicMaterial color={EXPERT} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* where the model has passed the human graph */}
      {crossings.map((seg, i) => (
        <Line key={i} points={seg} color={CROSS} lineWidth={4} />
      ))}
      </group>

      {/* the concept nodes, floating above the ground — these hold still, so
          the reader can find a node again after the outline has rotated */}
      {NODES.map((n) => {
        const w = weights[n.id] ?? 0;
        const pos = NODE_POS[n.id] ?? [0, 40, 0];
        const isSel = selected === n.id;
        const r = 3 + w * 6.5;
        return (
          <group key={n.id} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelect(n.id);
              }}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "auto")}
            >
              <sphereGeometry args={[r, 24, 24]} />
              <meshBasicMaterial
                color={isSel ? "#38bdf8" : "#4ade80"}
                transparent
                opacity={0.25 + w * 0.75}
              />
            </mesh>
            {w > 0.04 && (
              <mesh>
                <sphereGeometry args={[r + 2.5, 20, 20]} />
                <meshBasicMaterial color="#4ade80" transparent opacity={0.06 + w * 0.12} />
              </mesh>
            )}
            {(isSel || w > 0.35) && (
              <Billboard>
                <Text
                  position={[0, r + 5, 0]}
                  fontSize={4.4}
                  color={isSel ? "#7dd3fc" : "#86efac"}
                  anchorX="center"
                  anchorY="middle"
                >
                  {n.label}
                </Text>
              </Billboard>
            )}
          </group>
        );
      })}

      {/* the edges between concepts */}
      {NODE_EDGES.map(([a, b], i) => {
        const pa = NODE_POS[a];
        const pb = NODE_POS[b];
        const w = Math.min(weights[a] ?? 0, weights[b] ?? 0);
        return (
          <Line
            key={i}
            points={[pa, pb]}
            color="#22c55e"
            lineWidth={1 + w * 3}
            transparent
            opacity={0.12 + w * 0.7}
          />
        );
      })}

      {/* nodes the local model proposed */}
      {generated.map((g) => {
        const parent = NODE_POS[g.parent] ?? [0, 40, 0];
        const a = (g.parent.length * 1.7) % (Math.PI * 2);
        const rad = 14 + (g.similarity % 1) * 8;
        const pos: [number, number, number] = [
          parent[0] + Math.cos(a) * rad,
          parent[1] + 10 + (g.similarity % 1) * 12,
          parent[2] + Math.sin(a) * rad,
        ];
        return (
          <group key={g.id} position={pos}>
            <mesh>
              <sphereGeometry args={[3.4, 20, 20]} />
              <meshBasicMaterial color="#fb7185" transparent opacity={0.85} />
            </mesh>
            <Billboard>
              <Text
                position={[0, 7, 0]}
                fontSize={4.2}
                color="#fda4af"
                anchorX="center"
                anchorY="middle"
              >
                {g.name}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}

export default function KnowledgeGrowth3D(props: {
  frame: number;
  weights: Record<string, number>;
  selected: string | null;
  onSelect: (id: string) => void;
  generated: GeneratedNode[];
  spinning: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 285, 470], fov: 46 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor("#081827")}
    >
      <Scene {...props} />
      <OrbitControls
        enablePan={false}
        minDistance={120}
        maxDistance={700}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 30, 0]}
      />
    </Canvas>
  );
}

export { annotationAt };
