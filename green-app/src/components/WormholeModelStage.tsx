"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  dnegEmbeddingZ,
  dnegRadius,
  dnegRadiusDerivative,
  shaderRayDirection,
  traceBtzGeodesic,
  traceWormholeGeodesic,
} from "@/lib/wormholeModels";

export type ModelRegime = "lorentzian" | "euclidean" | "ads_btz" | "ensemble_ds";
type DiagramPreset = "isometric" | "top" | "side" | "behind";

export interface WormholeModelStageProps {
  regime: ModelRegime;
  ell0: number;
  rho: number;
  lensingWidth: number;
  yaw: number;
  pitch: number;
  pinchFactor: number;
  action: number;
  rPlus: number;
  centralCharge: number;
  fixed: boolean;
  effectiveShift: number;
  deSitterView: boolean;
  visible: boolean;
}

const FOCAL = 1.45;
const FOV_ASPECT = 1.28;

export default function WormholeModelStage(props: WormholeModelStageProps) {
  const {
    regime,
    ell0,
    rho,
    lensingWidth,
    yaw,
    pitch,
    pinchFactor,
    action,
    rPlus,
    centralCharge,
    fixed,
    effectiveShift,
    deSitterView,
    visible,
  } = props;

  const hostRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<() => void>(() => {});
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [preset, setPreset] = useState<DiagramPreset>("isometric");
  const [diagOrbit, setDiagOrbit] = useState({ az: 0.56, el: 0.46 });

  const dragRef = useRef<{ active: boolean; x: number; y: number; az0: number; el0: number }>({
    active: false,
    x: 0,
    y: 0,
    az0: 0.56,
    el0: 0.46,
  });

  // Compute live telemetry for the center optical ray so the user can directly
  // read what the crosshair pixel in the rendered view is hitting in the model.
  const telemetry = useMemo(() => {
    const center = shaderRayDirection(yaw, pitch, 0, 0, FOCAL);
    if (regime === "ads_btz") {
      const r0 = Math.max(rPlus + 1.9, 4.4);
      const thetaFromOutward = Math.acos(Math.max(-1, Math.min(1, center.pEll)));
      const trace = traceBtzGeodesic({
        r0,
        thetaFromOutward,
        rPlus,
        boxRadius: 9.5,
        phiSign: center.pPhi >= 0 ? 1 : -1,
      });
      return {
        label: trace.captured ? "Horizon shadow (captured)" : "Reflective AdS₃ CFT dome",
        accent: trace.captured ? "#f5b971" : "#65d9ed",
        detail: `r₀ = ${r0.toFixed(2)} · b = ${trace.impactParameter.toFixed(2)}`,
      };
    }

    if (regime === "ensemble_ds" && deSitterView) {
      return {
        label: "Cosmological horizon (r = ℓ_dS)",
        accent: "#b794f4",
        detail: `Observer at origin · yaw ${((yaw * 180) / Math.PI).toFixed(0)}°`,
      };
    }

    const effRho =
      regime === "euclidean" ? Math.max(0.24, rho * (1 - 0.76 * pinchFactor)) : rho;
    const effHalfLen = regime === "euclidean" ? 0.25 * (1 - pinchFactor) : 0.25;
    const effEll0 = regime === "euclidean" ? Math.max(ell0, 3.6) : ell0;
    const angleFromPlusEll = Math.acos(Math.max(-1, Math.min(1, center.pEll)));
    const trace = traceWormholeGeodesic({
      ell0: effEll0,
      angleFromPlusEll,
      rho: effRho,
      throatHalfLen: effHalfLen,
      lensingWidth,
      phiSign: center.pPhi >= 0 ? 1 : -1,
      skyRadius: 9.0,
      maxSteps: 260,
    });
    const destSide = trace.finalEll < 0 ? "Universe B (crossed)" : "Universe A";
    const crossed = trace.crossed;
    return {
      label: `Center ray → ${destSide}`,
      accent: trace.finalEll < 0 ? "#f5b971" : "#65d9ed",
      detail: `b = ${trace.impactParameter.toFixed(2)} ${crossed ? "<" : "≥"} ρ = ${effRho.toFixed(2)}`,
    };
  }, [regime, ell0, rho, lensingWidth, yaw, pitch, pinchFactor, rPlus, deSitterView]);

  const propsRef = useRef({
    ...props,
    preset,
    diagOrbit,
  });
  propsRef.current = {
    ...props,
    preset,
    diagOrbit,
  };

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      setStatus("fallback");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x040c16, 1);
    renderer.domElement.setAttribute(
      "aria-label",
      "Synchronized 3D abstracted geometric model showing the spacetime embedding, camera viewpoint, FOV frustum, and live RK4 geodesics; drag to orbit the diagram"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // Dynamic group rebuilt cleanly only when geometry/state changes
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);

    const clearGroup = (group: THREE.Group) => {
      while (group.children.length > 0) {
        const child = group.children[0];
        group.remove(child);
        if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    };

    const makeLine = (pts: THREE.Vector3[], color: number, opacity = 0.9) => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
      return new THREE.Line(geo, mat);
    };

    const addFrustumAndRig = (
      camPos: THREE.Vector3,
      ePhi: THREE.Vector3,
      eTheta: THREE.Vector3,
      eEll: THREE.Vector3,
      curYaw: number,
      curPitch: number,
      rayColorHex: number
    ) => {
      const toWorld = (ndcX: number, ndcY: number) => {
        const d = shaderRayDirection(curYaw, curPitch, ndcX, ndcY, FOCAL);
        return new THREE.Vector3()
          .addScaledVector(ePhi, d.pPhi)
          .addScaledVector(eTheta, d.pTheta)
          .addScaledVector(eEll, d.pEll)
          .normalize();
      };

      const frustumLen = 2.05;
      const corners = [
        toWorld(-FOV_ASPECT, 1),
        toWorld(FOV_ASPECT, 1),
        toWorld(FOV_ASPECT, -1),
        toWorld(-FOV_ASPECT, -1),
      ].map((d) => camPos.clone().addScaledVector(d, frustumLen));

      const frustumPts: THREE.Vector3[] = [];
      for (let i = 0; i < 4; i++) {
        frustumPts.push(camPos.clone(), corners[i]);
        frustumPts.push(corners[i], corners[(i + 1) % 4]);
      }
      const fGeo = new THREE.BufferGeometry().setFromPoints(frustumPts);
      const fMat = new THREE.LineBasicMaterial({ color: 0xe6f9ff, transparent: true, opacity: 0.72 });
      dynamicGroup.add(new THREE.LineSegments(fGeo, fMat));

      // Translucent frustum near-plane quad to make FOV cone legible at a glance
      const quadGeo = new THREE.BufferGeometry();
      const qVerts = new Float32Array([
        corners[0].x, corners[0].y, corners[0].z,
        corners[1].x, corners[1].y, corners[1].z,
        corners[2].x, corners[2].y, corners[2].z,
        corners[0].x, corners[0].y, corners[0].z,
        corners[2].x, corners[2].y, corners[2].z,
        corners[3].x, corners[3].y, corners[3].z,
      ]);
      quadGeo.setAttribute("position", new THREE.BufferAttribute(qVerts, 3));
      const quadMat = new THREE.MeshBasicMaterial({
        color: rayColorHex,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      dynamicGroup.add(new THREE.Mesh(quadGeo, quadMat));

      // Camera housing sphere + lens forward ring
      const camSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      camSphere.position.copy(camPos);
      dynamicGroup.add(camSphere);

      const centerDir = toWorld(0, 0);
      const lensEnd = camPos.clone().addScaledVector(centerDir, 0.55);
      dynamicGroup.add(makeLine([camPos, lensEnd], 0xffffff, 1));
    };

    const buildWormholeModel = (st: typeof propsRef.current, simTime: number) => {
      const fluc =
        st.regime === "ensemble_ds" && !st.deSitterView
          ? st.fixed
            ? st.effectiveShift
            : Math.sin(simTime * 3.1) * Math.abs(st.effectiveShift) * 0.85
          : 0;

      const effRho =
        st.regime === "euclidean"
          ? Math.max(0.24, st.rho * (1 - 0.76 * st.pinchFactor))
          : st.regime === "ensemble_ds"
          ? Math.max(0.55, st.rho + fluc * 0.35)
          : st.rho;
      const effHalfLen = st.regime === "euclidean" ? 0.25 * (1 - st.pinchFactor) : 0.25;
      const effEll0 = st.regime === "euclidean" ? Math.max(st.ell0, 3.6) : st.ell0;
      const maxEll = 7.8;

      // Isometric Flamm Funnel Mesh (Universe A top Y>0, throat Y=0, Universe B bottom Y<0)
      const ellSteps = 38;
      const phiSteps = 44;
      const positions: number[] = [];
      const colors: number[] = [];
      const indices: number[] = [];

      const cSideA = new THREE.Color(0x0c3450);
      const cThroat = new THREE.Color(0x41b7d9);
      const cSideB = new THREE.Color(0x3a2012);

      for (let i = 0; i <= ellSteps; i++) {
        const u = i / ellSteps;
        const ell = -maxEll + u * (2 * maxEll);
        const r = dnegRadius(ell, effRho, effHalfLen, st.lensingWidth);
        const y = dnegEmbeddingZ(ell, effHalfLen, st.lensingWidth, 18);

        const throatBlend = Math.exp(-Math.abs(ell) * 1.4);
        const baseColor = ell >= 0 ? cSideA : cSideB;
        const rowCol = baseColor.clone().lerp(cThroat, throatBlend * 0.7);

        for (let j = 0; j <= phiSteps; j++) {
          const phi = (j / phiSteps) * Math.PI * 2;
          positions.push(r * Math.sin(phi), y, r * Math.cos(phi));
          colors.push(rowCol.r, rowCol.g, rowCol.b);
        }
      }

      for (let i = 0; i < ellSteps; i++) {
        for (let j = 0; j < phiSteps; j++) {
          const a = i * (phiSteps + 1) + j;
          const b = (i + 1) * (phiSteps + 1) + j;
          const c = (i + 1) * (phiSteps + 1) + (j + 1);
          const d = i * (phiSteps + 1) + (j + 1);
          indices.push(a, b, d, b, c, d);
        }
      }

      const surfGeo = new THREE.BufferGeometry();
      surfGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      surfGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      surfGeo.setIndex(indices);
      const surfMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: st.regime === "euclidean" ? 0.34 : 0.42,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      dynamicGroup.add(new THREE.Mesh(surfGeo, surfMat));

      // Latitude wireframe rings & longitudinal meridians for crisp spatial reading
      const ringElls = [-7.2, -5.2, -3.2, -1.5, 0, 1.5, 3.2, 5.2, 7.2];
      for (const ell of ringElls) {
        const r = dnegRadius(ell, effRho, effHalfLen, st.lensingWidth);
        const y = dnegEmbeddingZ(ell, effHalfLen, st.lensingWidth, 16);
        const pts: THREE.Vector3[] = [];
        for (let k = 0; k <= 64; k++) {
          const p = (k / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(r * Math.sin(p), y, r * Math.cos(p)));
        }
        const col = ell === 0 ? 0xffffff : ell > 0 ? 0x65d9ed : 0xf5b971;
        const op = ell === 0 ? 0.92 : 0.32;
        dynamicGroup.add(makeLine(pts, col, op));
      }

      for (let m = 0; m < 12; m++) {
        const phi = (m / 12) * Math.PI * 2;
        const ptsA: THREE.Vector3[] = [];
        const ptsB: THREE.Vector3[] = [];
        for (let s = 0; s <= 18; s++) {
          const ellPos = (s / 18) * maxEll;
          const rA = dnegRadius(ellPos, effRho, effHalfLen, st.lensingWidth);
          const yA = dnegEmbeddingZ(ellPos, effHalfLen, st.lensingWidth, 12);
          ptsA.push(new THREE.Vector3(rA * Math.sin(phi), yA, rA * Math.cos(phi)));

          const ellNeg = -ellPos;
          const rB = dnegRadius(ellNeg, effRho, effHalfLen, st.lensingWidth);
          const yB = dnegEmbeddingZ(ellNeg, effHalfLen, st.lensingWidth, 12);
          ptsB.push(new THREE.Vector3(rB * Math.sin(phi), yB, rB * Math.cos(phi)));
        }
        dynamicGroup.add(makeLine(ptsA, 0x3b8bb0, 0.28));
        dynamicGroup.add(makeLine(ptsB, 0xa86c36, 0.26));
      }

      // Euclidean baby-universe nucleating bubble pinching off the neck
      if (st.regime === "euclidean") {
        const bubbleR = 0.42 + 0.48 * Math.exp(-0.22 * st.action);
        const bubbleSphere = new THREE.Mesh(
          new THREE.SphereGeometry(bubbleR, 20, 14),
          new THREE.MeshBasicMaterial({
            color: 0xf5b971,
            wireframe: true,
            transparent: true,
            opacity: 0.72,
          })
        );
        bubbleSphere.position.set(1.35 * st.pinchFactor + 0.55, -0.35 + 0.15 * Math.sin(simTime * 1.4), 0.2);
        dynamicGroup.add(bubbleSphere);
      }

      // Observer Camera Pos & Local Tangent Frame at (effEll0, phi = 0)
      const r0 = dnegRadius(effEll0, effRho, effHalfLen, st.lensingWidth);
      const y0 = dnegEmbeddingZ(effEll0, effHalfLen, st.lensingWidth, 24);
      const dr0 = dnegRadiusDerivative(effEll0, effHalfLen, st.lensingWidth);
      const dz0 = Math.sqrt(Math.max(0, 1 - dr0 * dr0));

      const camPos = new THREE.Vector3(0, y0, r0);
      const ePhi = new THREE.Vector3(1, 0, 0);
      const eEll = new THREE.Vector3(0, dz0, dr0).normalize();
      const eTheta = new THREE.Vector3(0, -dr0, dz0).normalize();

      // Geodesic bundle sweeping across camera horizontal FOV + exact center ray
      const ndcSamples = [-1.15, -0.82, -0.5, -0.22, 0.22, 0.5, 0.82, 1.15];
      for (const nx of ndcSamples) {
        const d = shaderRayDirection(st.yaw, 0, nx, 0, FOCAL);
        const ang = Math.acos(Math.max(-1, Math.min(1, d.pEll)));
        const tr = traceWormholeGeodesic({
          ell0: effEll0,
          angleFromPlusEll: ang,
          rho: effRho,
          throatHalfLen: effHalfLen,
          lensingWidth: st.lensingWidth,
          phiSign: d.pPhi >= 0 ? 1 : -1,
          skyRadius: maxEll + 0.3,
          stepSize: 0.08,
          maxSteps: 260,
        });
        const pts = tr.points.map((pt) => {
          const yy = dnegEmbeddingZ(pt.ell, effHalfLen, st.lensingWidth, 10);
          return new THREE.Vector3(pt.r * Math.sin(pt.phi), yy + 0.02, pt.r * Math.cos(pt.phi));
        });
        if (pts.length >= 2) {
          dynamicGroup.add(makeLine(pts, tr.finalEll < 0 ? 0xf5b971 : 0x5bd6ec, 0.72));
        }
      }

      // Highlighted Center Optical Ray (syncs to both yaw and pitch)
      const cDir = shaderRayDirection(st.yaw, st.pitch, 0, 0, FOCAL);
      const cAng = Math.acos(Math.max(-1, Math.min(1, cDir.pEll)));
      const cTrace = traceWormholeGeodesic({
        ell0: effEll0,
        angleFromPlusEll: cAng,
        rho: effRho,
        throatHalfLen: effHalfLen,
        lensingWidth: st.lensingWidth,
        phiSign: cDir.pPhi >= 0 ? 1 : -1,
        skyRadius: maxEll + 0.4,
        stepSize: 0.07,
        maxSteps: 280,
      });

      const cColor = cTrace.finalEll < 0 ? 0xfcd34d : 0x92e9ff;
      if (cTrace.points.length >= 2) {
        const cPts = cTrace.points.map((pt, idx) => {
          const yy = dnegEmbeddingZ(pt.ell, effHalfLen, st.lensingWidth, 12);
          // Slight out-of-surface vertical cue along eTheta when pitched so pitch angle is visible
          const pitchLift = Math.min(1, idx * 0.06) * cDir.pTheta * 0.9;
          return new THREE.Vector3(
            pt.r * Math.sin(pt.phi),
            yy + 0.04 + pitchLift,
            pt.r * Math.cos(pt.phi)
          );
        });
        dynamicGroup.add(makeLine(cPts, 0xffffff, 0.96));
        const endDot = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 12, 10),
          new THREE.MeshBasicMaterial({ color: cColor })
        );
        endDot.position.copy(cPts[cPts.length - 1]);
        dynamicGroup.add(endDot);
      }

      addFrustumAndRig(camPos, ePhi, eTheta, eEll, st.yaw, st.pitch, cColor);

      // Update orbital camera
      const centerTarget = new THREE.Vector3(0, 0, 0);
      return { camPos, ePhi, eTheta, eEll, centerTarget, camDist: 16.5 };
    };

    const buildBtzModel = (st: typeof propsRef.current) => {
      const boxR = 9.5;
      const r0 = Math.max(st.rPlus + 1.9, 4.4);

      // Outer Reflective AdS3 CFT Boundary Sphere (wireframe)
      const boxMesh = new THREE.Mesh(
        new THREE.SphereGeometry(boxR, 28, 18),
        new THREE.MeshBasicMaterial({
          color: 0x3b8bb0,
          wireframe: true,
          transparent: true,
          opacity: 0.24,
        })
      );
      dynamicGroup.add(boxMesh);

      // Equatorial CFT boundary ring
      const eqPts: THREE.Vector3[] = [];
      for (let k = 0; k <= 72; k++) {
        const p = (k / 72) * Math.PI * 2;
        eqPts.push(new THREE.Vector3(boxR * Math.sin(p), 0, boxR * Math.cos(p)));
      }
      dynamicGroup.add(makeLine(eqPts, 0x65d9ed, 0.72));

      // BTZ Black Hole Horizon Sphere + Photon Ring
      const bhCore = new THREE.Mesh(
        new THREE.SphereGeometry(st.rPlus, 24, 16),
        new THREE.MeshBasicMaterial({ color: 0x02060c })
      );
      dynamicGroup.add(bhCore);
      const bhWire = new THREE.Mesh(
        new THREE.SphereGeometry(st.rPlus * 1.01, 18, 12),
        new THREE.MeshBasicMaterial({
          color: 0xf5b971,
          wireframe: true,
          transparent: true,
          opacity: 0.5,
        })
      );
      dynamicGroup.add(bhWire);

      // Equatorial Accretion Ring (1.12 r+ to 3.1 r+)
      const diskGeo = new THREE.RingGeometry(st.rPlus * 1.12, st.rPlus * 3.1, 48);
      diskGeo.rotateX(-Math.PI / 2);
      const diskMat = new THREE.MeshBasicMaterial({
        color: 0xf5b971,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      dynamicGroup.add(new THREE.Mesh(diskGeo, diskMat));

      const camPos = new THREE.Vector3(0, 0, r0);
      const ePhi = new THREE.Vector3(1, 0, 0);
      const eTheta = new THREE.Vector3(0, 1, 0);
      const eEll = new THREE.Vector3(0, 0, 1);

      const ndcSamples = [-1.15, -0.82, -0.5, -0.22, 0.22, 0.5, 0.82, 1.15];
      for (const nx of ndcSamples) {
        const d = shaderRayDirection(st.yaw, 0, nx, 0, FOCAL);
        const theta = Math.acos(Math.max(-1, Math.min(1, d.pEll)));
        const tr = traceBtzGeodesic({
          r0,
          thetaFromOutward: theta,
          rPlus: st.rPlus,
          boxRadius: boxR,
          phiSign: d.pPhi >= 0 ? 1 : -1,
        });
        const pts = tr.points.map((pt) => new THREE.Vector3(pt.r * Math.sin(pt.phi), 0.02, pt.r * Math.cos(pt.phi)));
        if (pts.length >= 2) {
          dynamicGroup.add(makeLine(pts, tr.captured ? 0xf5b971 : 0x5bd6ec, 0.78));
        }
      }

      const cDir = shaderRayDirection(st.yaw, st.pitch, 0, 0, FOCAL);
      const cTheta = Math.acos(Math.max(-1, Math.min(1, cDir.pEll)));
      const cTrace = traceBtzGeodesic({
        r0,
        thetaFromOutward: cTheta,
        rPlus: st.rPlus,
        boxRadius: boxR,
        phiSign: cDir.pPhi >= 0 ? 1 : -1,
      });
      const cColor = cTrace.captured ? 0xfcd34d : 0x92e9ff;
      if (cTrace.points.length >= 2) {
        const cPts = cTrace.points.map(
          (pt, idx) =>
            new THREE.Vector3(
              pt.r * Math.sin(pt.phi),
              0.04 + Math.min(1, idx * 0.08) * cDir.pTheta * 1.4,
              pt.r * Math.cos(pt.phi)
            )
        );
        dynamicGroup.add(makeLine(cPts, 0xffffff, 0.96));
        const endDot = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 12, 10),
          new THREE.MeshBasicMaterial({ color: cColor })
        );
        endDot.position.copy(cPts[cPts.length - 1]);
        dynamicGroup.add(endDot);
      }

      addFrustumAndRig(camPos, ePhi, eTheta, eEll, st.yaw, st.pitch, cColor);
      return { camPos, ePhi, eTheta, eEll, centerTarget: new THREE.Vector3(0, 0, 0), camDist: 19.5 };
    };

    const buildDeSitterModel = (st: typeof propsRef.current) => {
      const horizonR = 7.4;
      const horizonSphere = new THREE.Mesh(
        new THREE.SphereGeometry(horizonR, 26, 18),
        new THREE.MeshBasicMaterial({
          color: 0x9f7aea,
          wireframe: true,
          transparent: true,
          opacity: 0.34,
        })
      );
      dynamicGroup.add(horizonSphere);

      const eqPts: THREE.Vector3[] = [];
      for (let k = 0; k <= 72; k++) {
        const p = (k / 72) * Math.PI * 2;
        eqPts.push(new THREE.Vector3(horizonR * Math.sin(p), 0, horizonR * Math.cos(p)));
      }
      dynamicGroup.add(makeLine(eqPts, 0x65d9ed, 0.6));

      const camPos = new THREE.Vector3(0, 0, 0);
      const ePhi = new THREE.Vector3(1, 0, 0);
      const eTheta = new THREE.Vector3(0, 1, 0);
      const eEll = new THREE.Vector3(0, 0, 1);

      const ndcSamples = [-1.15, -0.75, -0.35, 0.35, 0.75, 1.15];
      for (const nx of ndcSamples) {
        const d = shaderRayDirection(st.yaw, st.pitch, nx, 0, FOCAL);
        const end = new THREE.Vector3(d.pPhi * horizonR, d.pTheta * horizonR, d.pEll * horizonR);
        dynamicGroup.add(makeLine([camPos, end], 0x92e9ff, 0.7));
      }
      const cDir = shaderRayDirection(st.yaw, st.pitch, 0, 0, FOCAL);
      const cEnd = new THREE.Vector3(cDir.pPhi * horizonR, cDir.pTheta * horizonR, cDir.pEll * horizonR);
      dynamicGroup.add(makeLine([camPos, cEnd], 0xffffff, 0.96));
      const endDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 10),
        new THREE.MeshBasicMaterial({ color: 0xb794f4 })
      );
      endDot.position.copy(cEnd);
      dynamicGroup.add(endDot);

      addFrustumAndRig(camPos, ePhi, eTheta, eEll, st.yaw, st.pitch, 0xb794f4);
      return { camPos, ePhi, eTheta, eEll, centerTarget: new THREE.Vector3(0, 0, 0), camDist: 16.5 };
    };

    let frame = 0;
    let inView = true;
    let contextLost = false;
    let simTime = 0;
    let lastTs = performance.now();
    let lastSignature = "";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const renderFrame = (now: number) => {
      frame = 0;
      if (contextLost || document.hidden || !inView) return;
      const st = propsRef.current;
      if (!st.visible) return;

      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      if (!reducedMotion.matches) simTime += dt;

      const animated =
        st.regime === "euclidean" || (st.regime === "ensemble_ds" && !st.deSitterView && !st.fixed);

      const signature = [
        st.regime,
        st.ell0.toFixed(3),
        st.rho.toFixed(3),
        st.lensingWidth.toFixed(3),
        st.yaw.toFixed(3),
        st.pitch.toFixed(3),
        st.pinchFactor.toFixed(3),
        st.action.toFixed(2),
        st.rPlus.toFixed(3),
        st.centralCharge,
        st.fixed ? 1 : 0,
        st.effectiveShift.toFixed(4),
        st.deSitterView ? 1 : 0,
        st.preset,
        st.diagOrbit.az.toFixed(3),
        st.diagOrbit.el.toFixed(3),
        animated ? simTime.toFixed(2) : "static",
      ].join("|");

      if (signature !== lastSignature) {
        lastSignature = signature;
        clearGroup(dynamicGroup);

        const viewInfo =
          st.regime === "ads_btz"
            ? buildBtzModel(st)
            : st.regime === "ensemble_ds" && st.deSitterView
            ? buildDeSitterModel(st)
            : buildWormholeModel(st, simTime);

        if (st.preset === "behind") {
          const cDir = shaderRayDirection(st.yaw, st.pitch, 0, 0, FOCAL);
          const lookWorld = new THREE.Vector3()
            .addScaledVector(viewInfo.ePhi, cDir.pPhi)
            .addScaledVector(viewInfo.eTheta, cDir.pTheta)
            .addScaledVector(viewInfo.eEll, cDir.pEll)
            .normalize();
          const camEye = viewInfo.camPos
            .clone()
            .addScaledVector(lookWorld, -3.4)
            .addScaledVector(viewInfo.eTheta, 1.35);
          const target = viewInfo.camPos.clone().addScaledVector(lookWorld, 3.0);
          camera.up.copy(viewInfo.eTheta);
          camera.position.copy(camEye);
          camera.lookAt(target);
        } else {
          const d = viewInfo.camDist;
          const az = st.diagOrbit.az;
          const el = st.diagOrbit.el;
          camera.up.set(0, 1, 0);
          camera.position.set(
            d * Math.cos(el) * Math.sin(az),
            d * Math.sin(el),
            d * Math.cos(el) * Math.cos(az)
          );
          camera.lookAt(viewInfo.centerTarget);
        }

        renderer.render(scene, camera);
      }

      if (animated) {
        frame = requestAnimationFrame(renderFrame);
      }
    };

    const schedule = () => {
      if (!frame && !contextLost && !document.hidden && inView) {
        lastTs = performance.now();
        frame = requestAnimationFrame(renderFrame);
      }
    };
    scheduleRef.current = schedule;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      lastSignature = "";
      schedule();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibility.observe(container);

    const loseContext = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      setStatus("fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", loseContext);
    document.addEventListener("visibilitychange", schedule);

    resize();
    setStatus("ready");

    return () => {
      scheduleRef.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      renderer.domElement.removeEventListener("webglcontextlost", loseContext);
      clearGroup(dynamicGroup);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Redraw immediately whenever any camera, metric, or diagram state changes
  useEffect(() => {
    if (status === "ready" && visible) {
      scheduleRef.current();
    }
  }, [
    status,
    visible,
    regime,
    ell0,
    rho,
    lensingWidth,
    yaw,
    pitch,
    pinchFactor,
    action,
    rPlus,
    centralCharge,
    fixed,
    effectiveShift,
    deSitterView,
    preset,
    diagOrbit,
  ]);

  const applyPreset = (next: DiagramPreset) => {
    setPreset(next);
    if (next === "isometric") {
      setDiagOrbit({ az: 0.56, el: 0.46 });
    } else if (next === "top") {
      setDiagOrbit({ az: 0.0, el: 1.48 });
    } else if (next === "side") {
      setDiagOrbit({ az: Math.PI / 2, el: 0.08 });
    }
  };

  return (
    <div
      className="wh-model-stage"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        dragRef.current = {
          active: true,
          x: e.clientX,
          y: e.clientY,
          az0: diagOrbit.az,
          el0: diagOrbit.el,
        };
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.active) return;
        const dx = e.clientX - dragRef.current.x;
        const dy = e.clientY - dragRef.current.y;
        setPreset("isometric");
        setDiagOrbit({
          az: dragRef.current.az0 - dx * 0.008,
          el: Math.max(-1.45, Math.min(1.5, dragRef.current.el0 + dy * 0.007)),
        });
      }}
      onPointerUp={() => {
        dragRef.current.active = false;
      }}
      onPointerLeave={() => {
        dragRef.current.active = false;
      }}
    >
      <div className="wh-observer-gl" ref={hostRef} hidden={status === "fallback"} />

      {status !== "ready" && (
        <div className="wh-fallback" role="status">
          <p>
            {status === "loading"
              ? "Building geometric embedding & camera frustum…"
              : "WebGL diagram unavailable; the 2D RK4 cross-section below remains active."}
          </p>
        </div>
      )}

      <div className="wh-observer-hud-top" aria-hidden="true">
        <span className="wh-hud-badge">
          {regime === "ads_btz"
            ? "AdS₃ Embedding · Box + Horizon"
            : regime === "ensemble_ds" && deSitterView
            ? "Static de Sitter Patch · Enclosing Horizon"
            : regime === "euclidean"
            ? "Pinched Neck + Baby Universe"
            : "Isometric Flamm Funnel · Camera & Rays"}
        </span>
        <span className="wh-hud-telemetry" style={{ borderColor: telemetry.accent }}>
          <i style={{ background: telemetry.accent }} />
          <span>{telemetry.label}</span>
          <small>{telemetry.detail}</small>
        </span>
      </div>

      <div className="wh-observer-hud-bottom">
        <span>Drag to orbit diagram · White cone = 3D camera</span>
        <div className="wh-hud-actions" role="group" aria-label="Abstracted model camera presets">
          <button
            type="button"
            aria-pressed={preset === "isometric"}
            onClick={() => applyPreset("isometric")}
          >
            Isometric
          </button>
          <button
            type="button"
            aria-pressed={preset === "top"}
            onClick={() => applyPreset("top")}
          >
            Top-down
          </button>
          <button
            type="button"
            aria-pressed={preset === "side"}
            onClick={() => applyPreset("side")}
          >
            Side profile
          </button>
          <button
            type="button"
            aria-pressed={preset === "behind"}
            onClick={() => applyPreset("behind")}
          >
            Behind cam
          </button>
        </div>
      </div>
    </div>
  );
}
