"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  DOMAIN_DIRECTIONS,
  GROWTH_DOMAINS,
  GROWTH_R_BASE,
  ampNow,
  annotationAt,
  crossingFields,
  gridLines,
  humanRadius,
  modelRadius,
  surface,
} from "@/lib/knowledgeGrowth";
import { NODES } from "@/lib/knowledgeScoring";

/**
 * The interactive version of the growth story.
 *
 * Collective human knowledge is a spiky ball; a language model grows as a
 * smoother, lagging copy inside it. The experts' breakthroughs sit on the
 * spikes, and where the model has passed the human graph the overshoot is
 * marked. Beside the ball floats the cloud of concept nodes, sized and lit
 * by how much weight a prompt gave them.
 *
 * The numbers come from @/lib/knowledgeGrowth, which is the same model the
 * front page's animation draws in two dimensions.
 */

/** Scene units per model unit. The ball has to share the frame with the
 *  concept cloud beside it. */
const SCALE = 0.6;

/** How far a field's label sits outside the spike it names, and how far it
 *  is lifted so it clears the marker even when the spike points at the
 *  camera and the radial offset has no room on screen. */
const LABEL_OFFSET = 10;
const LABEL_LIFT = 6;

/** Where each concept node floats in the scene. */
const NODE_POS: Record<string, [number, number, number]> = {
  embedding: [88, 56, -16],
  meme: [110, 76, -27],
  mocca: [136, 30, -18],
  bbh: [164, 62, -5],
  siren: [186, 92, -23],
  auction: [80, 4, 4],
  demand: [106, -22, 16],
  signal: [70, 38, 18],
  reglag: [142, 84, 5],
  calib: [94, -32, 29],
  retrieval: [134, 36, 32],
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

/** The globe grid for one of the two boundaries. */
function useGrid(
  frame: number,
  fn: (dir: [number, number, number], frame: number) => number
) {
  return useMemo(() => {
    const positions = gridLines(frame, fn);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.scale(SCALE, SCALE, SCALE);
    return g;
  }, [frame, fn]);
}

/** The filled shell for one of the two boundaries. */
function useShell(
  frame: number,
  fn: (dir: [number, number, number], frame: number) => number
) {
  return useMemo(() => {
    const s = surface(frame, fn, 144, 72);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(s.positions, 3));
    g.setIndex(new THREE.BufferAttribute(s.indices, 1));
    g.scale(SCALE, SCALE, SCALE);
    g.computeVertexNormals();
    return g;
  }, [frame, fn]);
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
  const markers = useRef<(THREE.Group | null)[]>([]);

  const humanGrid = useGrid(frame, humanRadius);
  const modelGrid = useGrid(frame, modelRadius);
  const humanShell = useShell(frame, humanRadius);
  const modelShell = useShell(frame, modelRadius);

  useFrame((state, delta) => {
    if (group.current && spinning) group.current.rotation.y += delta * 0.06;

    // Hide what is on the far side of the ball. The shells are translucent,
    // so without this the back of the ball shows through the front and the
    // picture stops making sense.
    const cam = state.camera.position;
    const len = Math.hypot(cam.x, cam.y, cam.z) || 1;
    for (let i = 0; i < DOMAIN_DIRECTIONS.length; i++) {
      const m = markers.current[i];
      if (!m) continue;
      const d = DOMAIN_DIRECTIONS[i];
      m.visible = (d[0] * cam.x + d[1] * cam.y + d[2] * cam.z) / len > 0.05;
    }
  });

  /** The fields the model has already passed the human graph in. */
  const crossings = useMemo(() => {
    const out = new Map<
      number,
      {
        dir: [number, number, number];
        /** the human boundary and the model's, in model units */
        from: number;
        to: number;
        /** the radius of the human spike tip, in model units */
        tip: number;
        quat: THREE.Quaternion;
        /** the needle's midpoint radius, in model units */
        mid: number;
        /** the needle's length, in scene units */
        length: number;
      }
    >();
    crossingFields(frame).forEach(({ index: i, domain: d }) => {
      const dir = DOMAIN_DIRECTIONS[i];
      const from = humanRadius(dir, frame);
      const to = modelRadius(dir, frame);
      if (to <= from) return;
      const length = (to + 9 - from) * SCALE;
      const mid = (from + to + 9) / 2;
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(dir[0], dir[1], dir[2])
      );
      out.set(i, {
        dir,
        from,
        to,
        tip: GROWTH_R_BASE * (1 + ampNow(d, frame)),
        quat,
        mid,
        length,
      });
    });
    return out;
  }, [frame]);

  return (
    <>
      <group ref={group}>
        {/* collective human knowledge: a faint shell and a globe grid that
            deforms over the deep fields */}
        <mesh geometry={humanShell}>
          <meshBasicMaterial
            color={HUMAN}
            side={THREE.DoubleSide}
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={humanGrid}>
          <lineBasicMaterial color={HUMAN} transparent opacity={0.45} depthWrite={false} />
        </lineSegments>

        {/* What the model can recall: a solid core inside the human shell.
            Opaque on purpose — it hides the far side of the human ball, so
            the two read as one inside the other instead of as two grids
            drawn over each other. */}
        <mesh geometry={modelShell}>
          <meshBasicMaterial color="#0d2f52" side={THREE.FrontSide} />
        </mesh>
        <lineSegments geometry={modelGrid}>
          <lineBasicMaterial color={MODEL} transparent opacity={0.6} depthWrite={false} />
        </lineSegments>

        {/* the experts' breakthroughs, on the tips of the spikes */}
        {GROWTH_DOMAINS.map((d, i) => {
          const dir = DOMAIN_DIRECTIONS[i];
          const tip = GROWTH_R_BASE * (1 + ampNow(d, frame)) * SCALE;
          const isBreak = d.t !== null && frame >= d.t;
          const cross = crossings.get(i);
          return (
            <group
              key={i}
              position={[dir[0] * tip, dir[1] * tip, dir[2] * tip]}
              ref={(el) => {
                markers.current[i] = el;
              }}
            >
              {isBreak && (
                <mesh>
                  <sphereGeometry args={[3.1, 16, 16]} />
                  {/* No depth test: by the end the model's boundary has
                      grown past this spike, so the marker saying an expert
                      broke the frontier here would be buried inside the
                      model. */}
                  <meshBasicMaterial color={EXPERT} depthTest={false} />
                </mesh>
              )}

              {/* Where the model has passed the human graph. The overshoot is
                  only a few per cent of the radius, so it is marked rather
                  than left to be found. */}
              {cross && (() => {
                // This group already sits at the tip, so the marker offsets
                // are measured from the tip, not from the centre.
                const dir = cross.dir;
                const at = (r: number): [number, number, number] => {
                  const d = (r - cross.tip) * SCALE;
                  return [dir[0] * d, dir[1] * d, dir[2] * d];
                };
                return (
                  <group>
                    <mesh position={at(cross.mid)} quaternion={cross.quat}>
                      <cylinderGeometry args={[1.3, 1.3, cross.length, 8]} />
                      <meshBasicMaterial color={CROSS} depthTest={false} />
                    </mesh>
                    <mesh position={at(cross.to)}>
                      <sphereGeometry args={[3.6, 16, 16]} />
                      <meshBasicMaterial color={CROSS} depthTest={false} />
                    </mesh>
                  </group>
                );
              })()}

              {d.label && (
                <group
                  position={[
                    dir[0] * LABEL_OFFSET,
                    dir[1] * LABEL_OFFSET + LABEL_LIFT,
                    dir[2] * LABEL_OFFSET,
                  ]}
                >
                  <Billboard>
                    <Text
                      position={[0, 0, 0]}
                      fontSize={4.6}
                      color="#cbd5e1"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {d.label}
                    </Text>
                  </Billboard>
                </group>
              )}
            </group>
          );
        })}
      </group>

      {/* the concept nodes, floating beside the ball — these hold still, so
          the reader can find a node again after the ball has turned */}
      {NODES.map((n) => {
        const w = weights[n.id] ?? 0;
        const pos = NODE_POS[n.id] ?? [120, 40, 0];
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
        const parent = NODE_POS[g.parent] ?? [120, 40, 0];
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
      camera={{ position: [0, 110, 430], fov: 46 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor("#081827")}
    >
      <Scene {...props} />
      <OrbitControls
        enablePan={false}
        minDistance={150}
        maxDistance={700}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

export { annotationAt };
