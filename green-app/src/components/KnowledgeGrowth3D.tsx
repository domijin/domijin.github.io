"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
 * marked. Inside the ball sits the cloud of concept nodes, sized and lit
 * by how much weight a prompt gave them.
 *
 * The numbers come from @/lib/knowledgeGrowth, which is the same model the
 * front page's animation draws in two dimensions.
 */

/** Scene units per model unit. */
const SCALE = 0.85;

/** How far a field's label sits outside the spike it names, and how far it
 *  is lifted so it clears the marker even when the spike points at the
 *  camera and the radial offset has no room on screen. The lift is in world
 *  units, and the ball is about 190 across, so this is worth a good few
 *  pixels on screen — a label sitting on the timeline panel is a label the
 *  reader cannot read. */
const LABEL_OFFSET = 12;
const LABEL_LIFT = 16;

/** Where each concept node floats in the scene. */
const NODE_POS: Record<string, [number, number, number]> = {
  embedding: [-30, 18, 20],
  meme: [-8, 34, -18],
  mocca: [10, 30, -30],
  bbh: [30, 22, -8],
  siren: [42, -2, -26],
  auction: [-44, -14, 6],
  demand: [-16, -34, 20],
  signal: [-34, 6, 32],
  reglag: [18, -16, 34],
  calib: [-18, -30, -26],
  retrieval: [24, -30, 22],
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
const MODEL = "#bae6fd";
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
    // 128 steps per line, because the spikes are narrow: a meridian that
    // only sampled the surface coarsely would draw the spike as a kink
    // instead of a point.
    const positions = gridLines(frame, fn, 24, 13, 128);
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
    const s = surface(frame, fn, 192, 96);
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
  modality,
  symbolic,
}: {
  frame: number;
  weights: Record<string, number>;
  selected: string | null;
  onSelect: (id: string) => void;
  generated: GeneratedNode[];
  spinning: boolean;
  modality: boolean;
  symbolic: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const markers = useRef<(THREE.Group | null)[]>([]);
  const markerPosition = useMemo(() => new THREE.Vector3(), []);

  const humanGrid = useGrid(frame, humanRadius);
  const modelGrid = useGrid(frame, modelRadius);
  const humanShell = useShell(frame, humanRadius);
  const modelShell = useShell(frame, modelRadius);

  useEffect(() => () => {
    humanGrid.dispose();
    modelGrid.dispose();
    humanShell.dispose();
    modelShell.dispose();
  }, [humanGrid, modelGrid, humanShell, modelShell]);

  const labelledNodes = useMemo(() => new Set(
    Object.entries(weights).filter(([, w]) => w > 0.04).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id]) => id)
  ), [weights]);

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
      // Use the rotated position so the label follows the visible hemisphere.
      m.getWorldPosition(markerPosition).normalize();
      m.visible = markerPosition.dot(cam) / len > 0.05;
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
          <lineBasicMaterial color={HUMAN} transparent opacity={0.4} depthWrite={false} />
        </lineSegments>

        {/* What the model can recall: a smoother, translucent core inside
            the human shell. Translucent because the concept graph lives
            inside it and has to be visible through it. */}
        <mesh geometry={modelShell}>
          <meshBasicMaterial
            color="#0d2f52"
            side={THREE.DoubleSide}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
        <lineSegments geometry={modelGrid}>
          <lineBasicMaterial color={MODEL} transparent opacity={0.7} depthWrite={false} />
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
                      color="#e2e8f0"
                      anchorX="center"
                      anchorY="middle"
                      /* A spike pointing at the camera puts its label on top
                         of the ball, where the grid would eat it. The halo
                         keeps the name readable wherever it lands. */
                      outlineWidth={0.12}
                      outlineColor="#050d18"
                      outlineOpacity={1}
                    >
                      {d.label}
                    </Text>
                  </Billboard>
                </group>
              )}
            </group>
          );
        })}
      {/* The concept graph shares the sphere's transform and stays enclosed. */}
      {NODES.map((n) => {
        const w = weights[n.id] ?? 0;
        const pos = NODE_POS[n.id] ?? [0, 0, 0];
        const isSel = selected === n.id;
        const r = 3.6 + w * 7;
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
                opacity={isSel ? 1 : w > 0.04 ? 0.5 + w * 0.5 : 0.18}
                depthTest={false}
              />
            </mesh>
            {w > 0.04 && (
              <mesh>
                <sphereGeometry args={[r + 2.5, 20, 20]} />
                <meshBasicMaterial
                  color="#4ade80"
                  transparent
                  opacity={0.06 + w * 0.12}
                  depthTest={false}
                />
              </mesh>
            )}
            {(isSel || labelledNodes.has(n.id)) && (
              <Billboard>
                <Text
                  position={[0, r + 5, 0]}
                  fontSize={4.4}
                  color={isSel ? "#7dd3fc" : "#86efac"}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={60}
                  textAlign="center"
                  outlineWidth={0.15}
                  outlineColor="#081827"
                >
                  {`${n.label}\n${w.toFixed(2)}`}
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
      {generated.map((g, i) => {
        const parent = NODE_POS[g.parent] ?? [0, 0, 0];
        const a = i * 2.39996;
        const rad = 14 + (g.similarity % 1) * 8;
        const pos: [number, number, number] = [
          parent[0] + Math.cos(a) * rad,
          parent[1] + 10 + (g.similarity % 1) * 12,
          parent[2] + Math.sin(a) * rad,
        ];
        const distance = Math.hypot(...pos);
        if (distance > 80) {
          for (let axis = 0; axis < 3; axis++) pos[axis] *= 80 / distance;
        }
        return (
          <group key={g.id} position={pos}>
            <Line points={[[0, 0, 0], [parent[0] - pos[0], parent[1] - pos[1], parent[2] - pos[2]]]} color="#fb7185" transparent opacity={0.45} lineWidth={1} />
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
                maxWidth={50}
                textAlign="center"
              >
                {g.name}
              </Text>
            </Billboard>
          </group>
        );
      })}
      {/* The two extensions from the sketch attach to the selected concept. */}
      {[
        { enabled: modality, label: "Observe", position: [-56, -48, 10] as [number, number, number] },
        { enabled: symbolic, label: "Compute", position: [52, -48, 10] as [number, number, number] },
      ].filter((extension) => extension.enabled).map((extension) => (
        <group key={extension.label}>
          <Line points={[NODE_POS[selected ?? "meme"] ?? [0, 0, 0], extension.position]} color="#fb7185" lineWidth={2} dashed dashSize={3} gapSize={2} />
          <group position={extension.position}>
            <mesh><boxGeometry args={[7, 7, 7]} /><meshBasicMaterial color="#fb7185" /></mesh>
            <Billboard><Text position={[0, -8, 0]} fontSize={4.4} color="#fda4af" anchorX="center" outlineWidth={0.15} outlineColor="#081827">{extension.label}</Text></Billboard>
          </group>
        </group>
      ))}
      </group>
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
  modality: boolean;
  symbolic: boolean;
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
