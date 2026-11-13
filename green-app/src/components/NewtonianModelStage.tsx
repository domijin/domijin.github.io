"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  effectiveShelterDepth,
  infrasonicStrainASD,
  thermalTurbulentStrainASD,
  type ShelterGeometry,
} from "@/lib/newtonianNoiseModels";

export type ObserverRegime = "infrasound" | "thermal" | "shelter" | "deep_arm";
type DiagramPreset = "isometric" | "top" | "side" | "pov";

export interface NewtonianModelStageProps {
  regime: ObserverRegime;
  depthM: number;
  freqHz: number;
  windSpeed: number;
  qualityQ: number;
  eddyRadiusM: number;
  armLengthM: number;
  shelterShape: ShelterGeometry;
  shelterSizeM: number;
  turbulentOn: boolean;
  simTime: number;
  camAzimuth: number;
  camElevation: number;
  camDistance: number;
  visible: boolean;
}

/**
 * Abstracted geometric model and camera rig view (Three.js), synchronized 1:1
 * with the rendered 3D physical scene on the left:
 *  - Origin (0,0,0) = test mass mirror; interferometer arm runs along +/- X
 *  - Vertical axis Y = altitude z above test mass (air half-space y >= D_vis)
 *  - Displays the exclusion sphere/shelter boundary, 1/r^3 tidal halo,
 *    cycloid streamline + eddy orbit circle (or acoustic wave packet slab),
 *    instantaneous gravitational pull vector dg(t), and the live camera frustum.
 */
export default function NewtonianModelStage(props: NewtonianModelStageProps) {
  const {
    regime,
    depthM,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    shelterSizeM,
    turbulentOn,
    simTime,
    camAzimuth,
    camElevation,
    camDistance,
    visible,
  } = props;

  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [preset, setPreset] = useState<DiagramPreset>("isometric");
  const [diagOrbit, setDiagOrbit] = useState({ az: 0.68, el: 0.42 });

  const dragRef = useRef<{
    active: boolean;
    x: number;
    y: number;
    az0: number;
    el0: number;
  }>({
    active: false,
    x: 0,
    y: 0,
    az0: 0.68,
    el0: 0.42,
  });

  // Visual mapping: compress large physical depths cleanly onto scene coordinates
  const depthVis = useMemo(() => {
    const rawD =
      regime === "shelter"
        ? effectiveShelterDepth(shelterShape, shelterSizeM)
        : depthM;
    if (rawD <= 25) return 1.2 + (rawD / 25) * 1.4;
    return 2.6 + Math.log10(rawD / 25) * 1.15;
  }, [regime, depthM, shelterShape, shelterSizeM]);

  const effectiveDepthVal = useMemo(() => {
    if (regime === "shelter") {
      return effectiveShelterDepth(shelterShape, shelterSizeM);
    }
    return depthM;
  }, [regime, depthM, shelterShape, shelterSizeM]);

  const telemetry = useMemo(() => {
    if (regime === "infrasound") {
      const asd = infrasonicStrainASD({
        fHz: freqHz,
        depthM,
        armLengthM,
        qualityFactorQ: qualityQ,
      });
      const lambda = 340 / Math.max(0.05, freqHz);
      return {
        label: qualityQ > 40 ? "Plane-wave acoustic front" : `Wave packet (Q = ${qualityQ.toFixed(1)})`,
        accent: "#65d9ed",
        detail: `λ = ${lambda >= 100 ? lambda.toFixed(0) : lambda.toFixed(1)} m · √S_h = ${asd.toExponential(1)}`,
      };
    }
    if (regime === "shelter") {
      const asd = thermalTurbulentStrainASD({
        fHz: freqHz,
        depthM: effectiveDepthVal,
        armLengthM,
        windSpeed,
        qualityFactorQ: Infinity,
      });
      return {
        label: `D_eff = ${effectiveDepthVal.toFixed(2)} m`,
        accent: "#f5b971",
        detail: `${shelterShape === "halfCube" ? "Half-cube" : shelterShape === "semicylinder" ? "Semicylinder" : "Hemisphere"} · √S_h = ${asd.toExponential(1)}`,
      };
    }
    const fEddy = windSpeed / (2 * Math.PI * Math.max(0.15, eddyRadiusM));
    const asd = thermalTurbulentStrainASD({
      fHz: regime === "thermal" ? fEddy : freqHz,
      depthM,
      armLengthM,
      windSpeed,
      qualityFactorQ: turbulentOn ? Infinity : 0.1,
    });
    return {
      label: turbulentOn
        ? `Cycloid eddy (R = ${eddyRadiusM.toFixed(2)} m)`
        : "Smooth uniform advection",
      accent: turbulentOn ? "#f5b971" : "#65d9ed",
      detail: `f_eddy = ${fEddy.toFixed(2)} Hz · √S_h = ${asd.toExponential(1)}`,
    };
  }, [
    regime,
    depthM,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    effectiveDepthVal,
    turbulentOn,
  ]);

  const stateRef = useRef({
    regime,
    depthM,
    depthVis,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    shelterSizeM,
    effectiveDepthVal,
    turbulentOn,
    simTime,
    camAzimuth,
    camElevation,
    camDistance,
    preset,
    diagOrbit,
    visible,
  });
  stateRef.current = {
    regime,
    depthM,
    depthVis,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    shelterSizeM,
    effectiveDepthVal,
    turbulentOn,
    simTime,
    camAzimuth,
    camElevation,
    camDistance,
    preset,
    diagOrbit,
    visible,
  };

  const triggerUpdateRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("fallback");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x040c16, 1);
    renderer.domElement.setAttribute(
      "aria-label",
      "Synchronized 3D geometric abstraction showing the atmospheric exclusion boundary, eddy cycloid orbit or acoustic wave packet, tidal pull vector, and synced observer camera frustum"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);

    // Static reference frame: ground/x-arm axis & y-elevation grid
    const baseGroup = new THREE.Group();
    scene.add(baseGroup);

    const floorGrid = new THREE.GridHelper(16, 16, 0x1b425c, 0x0e2536);
    floorGrid.position.y = -0.02;
    baseGroup.add(floorGrid);

    // Arm axis +/- X
    const armAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8.2, 0, 0),
      new THREE.Vector3(8.2, 0, 0),
    ]);
    const armAxisMat = new THREE.LineBasicMaterial({
      color: 0x65d9ed,
      transparent: true,
      opacity: 0.72,
    });
    baseGroup.add(new THREE.Line(armAxisGeo, armAxisMat));

    // Test mass node at origin
    const testMassGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 24);
    testMassGeo.rotateZ(Math.PI / 2);
    const testMassMat = new THREE.MeshBasicMaterial({
      color: 0xe6f8ff,
      wireframe: true,
    });
    const testMassMesh = new THREE.Mesh(testMassGeo, testMassMat);
    baseGroup.add(testMassMesh);

    const testMassCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x65d9ed })
    );
    baseGroup.add(testMassCore);

    // Dynamic objects updated per prop change / time step
    const dynamicGroup = new THREE.Group();
    scene.add(dynamicGroup);

    // Live camera frustum marker representing the Rendered 3D view's camera
    const camRigGroup = new THREE.Group();
    scene.add(camRigGroup);

    const camBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.22, 0.22),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    );
    camRigGroup.add(camBox);

    const fov = 0.42;
    const fLen = 1.65;
    const fx = Math.tan(fov) * fLen;
    const fy = fx * 0.72;
    const frustumPts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-fx, -fy, fLen),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(fx, -fy, fLen),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(fx, fy, fLen),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-fx, fy, fLen),
      new THREE.Vector3(-fx, -fy, fLen),
      new THREE.Vector3(fx, -fy, fLen),
      new THREE.Vector3(fx, -fy, fLen),
      new THREE.Vector3(fx, fy, fLen),
      new THREE.Vector3(fx, fy, fLen),
      new THREE.Vector3(-fx, fy, fLen),
      new THREE.Vector3(-fx, fy, fLen),
      new THREE.Vector3(-fx, -fy, fLen),
    ];
    const frustumLines = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(frustumPts),
      new THREE.LineBasicMaterial({ color: 0xf5b971, transparent: true, opacity: 0.9 })
    );
    camRigGroup.add(frustumLines);

    // Sight ray from rendered camera to test mass target
    const sightRayMat = new THREE.LineDashedMaterial({
      color: 0xffffff,
      dashSize: 0.25,
      gapSize: 0.16,
      transparent: true,
      opacity: 0.55,
    });
    const sightRayGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(0, 0.8, 0),
    ]);
    const sightRay = new THREE.Line(sightRayGeo, sightRayMat);
    scene.add(sightRay);

    const disposeGroup = (grp: THREE.Group) => {
      while (grp.children.length > 0) {
        const obj = grp.children[0];
        grp.remove(obj);
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
            child.geometry.dispose();
            const mat = child.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat.dispose();
          }
        });
      }
    };

    let lastSig = "";

    const rebuildModel = () => {
      const st = stateRef.current;
      const sig = [
        st.regime,
        st.depthVis.toFixed(3),
        st.freqHz.toFixed(2),
        st.windSpeed.toFixed(2),
        st.qualityQ.toFixed(2),
        st.eddyRadiusM.toFixed(2),
        st.armLengthM,
        st.shelterShape,
        st.shelterSizeM.toFixed(2),
        st.turbulentOn ? "1" : "0",
      ].join("|");

      if (sig !== lastSig) {
        lastSig = sig;
        disposeGroup(dynamicGroup);

        const dV = st.depthVis;

        // 1) Standoff exclusion sphere (radius = dV) and boundary surface
        const exclusionSphere = new THREE.Mesh(
          new THREE.SphereGeometry(dV, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.5),
          new THREE.MeshBasicMaterial({
            color: 0x3b8ea5,
            wireframe: true,
            transparent: true,
            opacity: 0.22,
          })
        );
        dynamicGroup.add(exclusionSphere);

        // 1/r^3 tidal sensitivity halo ring at y = dV
        const ringGeo = new THREE.RingGeometry(dV * 0.96, dV * 1.02, 48);
        ringGeo.rotateX(-Math.PI / 2);
        const haloRing = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({
            color: 0x65d9ed,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.35,
          })
        );
        haloRing.position.y = 0.01;
        dynamicGroup.add(haloRing);

        if (st.regime === "shelter") {
          const Rvis = Math.max(1.2, st.depthVis * 1.75);
          let shellMesh: THREE.Mesh;
          if (st.shelterShape === "hemisphere") {
            shellMesh = new THREE.Mesh(
              new THREE.SphereGeometry(Rvis, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
              new THREE.MeshBasicMaterial({
                color: 0xf5b971,
                wireframe: true,
                transparent: true,
                opacity: 0.42,
              })
            );
          } else if (st.shelterShape === "semicylinder") {
            const geo = new THREE.CylinderGeometry(
              Rvis,
              Rvis,
              9.5,
              24,
              1,
              false,
              0,
              Math.PI
            );
            geo.rotateZ(Math.PI / 2);
            geo.rotateX(-Math.PI / 2);
            shellMesh = new THREE.Mesh(
              geo,
              new THREE.MeshBasicMaterial({
                color: 0xf5b971,
                wireframe: true,
                transparent: true,
                opacity: 0.4,
              })
            );
          } else {
            const geo = new THREE.BoxGeometry(Rvis * 2, Rvis, Rvis * 2);
            shellMesh = new THREE.Mesh(
              geo,
              new THREE.MeshBasicMaterial({
                color: 0xf5b971,
                wireframe: true,
                transparent: true,
                opacity: 0.38,
              })
            );
            shellMesh.position.y = Rvis * 0.5;
          }
          dynamicGroup.add(shellMesh);
        } else {
          // Ground-air boundary interface plane at y = dV
          const boundPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 9, 14, 9),
            new THREE.MeshBasicMaterial({
              color: 0x4ca3c2,
              wireframe: true,
              transparent: true,
              opacity: 0.24,
            })
          );
          boundPlane.rotation.x = -Math.PI / 2;
          boundPlane.position.y = dV;
          dynamicGroup.add(boundPlane);
        }

        if (st.regime === "infrasound") {
          // Wave-packet envelope slab above ground
          const packetWidth = st.qualityQ > 40 ? 11.5 : Math.min(11.0, Math.max(1.8, st.qualityQ * 1.9));
          const slab = new THREE.Mesh(
            new THREE.BoxGeometry(packetWidth, 1.35, 3.6),
            new THREE.MeshBasicMaterial({
              color: 0x65d9ed,
              wireframe: true,
              transparent: true,
              opacity: 0.38,
            })
          );
          slab.position.set(0, dV + 0.72, 0);
          slab.name = "packetSlab";
          dynamicGroup.add(slab);
        } else {
          // Advected cycloid or smooth streamline trajectory above y = dV (or above shelter top)
          const baseY = st.regime === "shelter" ? dV * 1.85 : dV + 0.75;
          const Rvis = st.turbulentOn ? Math.min(1.1, Math.max(0.22, st.eddyRadiusM * 0.28)) : 0;
          const kCycloid = 1.15;
          const pathPts: THREE.Vector3[] = [];
          for (let i = 0; i <= 140; i++) {
            const x = -6.5 + (i / 140) * 13;
            const phase = x * kCycloid;
            const px = x + Rvis * Math.cos(phase);
            const py = baseY + Rvis * Math.sin(phase);
            pathPts.push(new THREE.Vector3(px, py, 0));
          }
          const pathLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pathPts),
            new THREE.LineBasicMaterial({
              color: st.turbulentOn ? 0xf5b971 : 0x65d9ed,
              transparent: true,
              opacity: 0.85,
            })
          );
          dynamicGroup.add(pathLine);

          if (Rvis > 0) {
            const circlePts: THREE.Vector3[] = [];
            for (let i = 0; i <= 48; i++) {
              const a = (i / 48) * Math.PI * 2;
              circlePts.push(new THREE.Vector3(Math.cos(a) * Rvis, baseY + Math.sin(a) * Rvis, 0));
            }
            const eddyRing = new THREE.Line(
              new THREE.BufferGeometry().setFromPoints(circlePts),
              new THREE.LineBasicMaterial({
                color: 0xffd28d,
                transparent: true,
                opacity: 0.75,
              })
            );
            eddyRing.name = "eddyRing";
            dynamicGroup.add(eddyRing);
          }
        }

        // Dominant air parcel sphere & Newtonian pull vector arrow -> updated each frame in animate
        const parcelMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xf5b971 })
        );
        parcelMesh.name = "activeParcel";
        dynamicGroup.add(parcelMesh);

        const forcePts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.2, 0.8, 0)];
        const forceLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(forcePts),
          new THREE.LineBasicMaterial({ color: 0xf5b971 })
        );
        forceLine.name = "forceLine";
        dynamicGroup.add(forceLine);

        const armForcePts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.2, 0, 0)];
        const armForceLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(armForcePts),
          new THREE.LineBasicMaterial({ color: 0x65d9ed })
        );
        armForceLine.name = "armForceLine";
        dynamicGroup.add(armForceLine);

        // Far-end mirror indicator when comparing baseline L
        if (st.regime === "deep_arm") {
          const farX = Math.min(7.2, 2.2 + Math.log10(Math.max(10, st.armLengthM)) * 1.1);
          const endMirror = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16),
            new THREE.MeshBasicMaterial({ color: 0x90a8ff, wireframe: true })
          );
          endMirror.rotation.z = Math.PI / 2;
          endMirror.position.set(farX, 0, 0);
          dynamicGroup.add(endMirror);
        }
      }

      // Live animation update of active parcel, force vector, and rendered camera rig
      const st2 = stateRef.current;
      const dV = st2.depthVis;
      const baseY = st2.regime === "shelter" ? dV * 1.85 : dV + 0.75;
      const t = st2.simTime;

      const parcel = dynamicGroup.getObjectByName("activeParcel") as THREE.Mesh | undefined;
      const eddyRing = dynamicGroup.getObjectByName("eddyRing") as THREE.Line | undefined;
      const packetSlab = dynamicGroup.getObjectByName("packetSlab") as THREE.Mesh | undefined;
      const forceLine = dynamicGroup.getObjectByName("forceLine") as THREE.Line | undefined;
      const armForceLine = dynamicGroup.getObjectByName("armForceLine") as THREE.Line | undefined;

      let px = 0;
      let py = baseY;
      if (st2.regime === "infrasound") {
        const waveLoop = ((t * 1.6) % 10) - 5;
        px = waveLoop;
        py = dV + 0.65;
        if (packetSlab) {
          packetSlab.position.x = waveLoop * 0.45;
        }
      } else {
        const drift = ((t * (0.45 + st2.windSpeed * 0.08)) % 10) - 5;
        const Rvis = st2.turbulentOn ? Math.min(1.1, Math.max(0.22, st2.eddyRadiusM * 0.28)) : 0;
        const phase = t * (st2.windSpeed / Math.max(0.3, st2.eddyRadiusM)) * 0.45;
        px = drift + Rvis * Math.cos(phase);
        py = baseY + Rvis * Math.sin(phase);
        if (eddyRing) {
          eddyRing.position.x = drift;
        }
      }

      if (parcel) {
        parcel.position.set(px, py, 0);
        const r = Math.hypot(px, py);
        const r3 = Math.max(0.6, r * r * r);
        // Normalized visual length showing 1/r^3 tidal decay & x-projection
        const scale = Math.min(2.4, (dV * dV * 1.9) / r3);
        const fxEnd = (px / r) * scale * 1.4;
        const fyEnd = (py / r) * scale * 1.4;
        if (forceLine) {
          const posAttr = forceLine.geometry.getAttribute("position") as THREE.BufferAttribute;
          posAttr.setXYZ(1, fxEnd, fyEnd, 0);
          posAttr.needsUpdate = true;
        }
        if (armForceLine) {
          const posAttr = armForceLine.geometry.getAttribute("position") as THREE.BufferAttribute;
          posAttr.setXYZ(1, fxEnd, 0, 0);
          posAttr.needsUpdate = true;
        }
      }

      // Synchronize the Rendered Camera Rig 1:1 with NewtonianObserver's orbit state
      const targetCenter = new THREE.Vector3(0, dV * 0.48, 0);
      const az = st2.camAzimuth;
      const el = st2.camElevation;
      const dist = st2.camDistance;
      const camPos = new THREE.Vector3(
        targetCenter.x + dist * Math.cos(el) * Math.sin(az),
        targetCenter.y + dist * Math.sin(el),
        targetCenter.z + dist * Math.cos(el) * Math.cos(az)
      );
      camRigGroup.position.copy(camPos);
      camRigGroup.lookAt(targetCenter);

      const sAttr = sightRay.geometry.getAttribute("position") as THREE.BufferAttribute;
      sAttr.setXYZ(0, camPos.x, camPos.y, camPos.z);
      sAttr.setXYZ(1, targetCenter.x, targetCenter.y, targetCenter.z);
      sAttr.needsUpdate = true;
      sightRay.computeLineDistances();

      // Place Diagram View Camera according to preset or user drag
      if (st2.preset === "top") {
        camera.position.set(0, 14.5, 0.01);
        camera.lookAt(0, 1.0, 0);
      } else if (st2.preset === "side") {
        camera.position.set(0, dV * 0.72 + 1.0, 13.5);
        camera.lookAt(0, dV * 0.6, 0);
      } else if (st2.preset === "pov") {
        const backOffset = camPos.clone().sub(targetCenter).normalize().multiplyScalar(2.6);
        camera.position.copy(camPos).add(backOffset).add(new THREE.Vector3(0, 1.2, 0));
        camera.lookAt(targetCenter);
      } else {
        const oAz = st2.diagOrbit.az;
        const oEl = st2.diagOrbit.el;
        const oR = 13.8;
        camera.position.set(
          oR * Math.cos(oEl) * Math.sin(oAz),
          dV * 0.55 + oR * Math.sin(oEl),
          oR * Math.cos(oEl) * Math.cos(oAz)
        );
        camera.lookAt(0, dV * 0.55, 0);
      }

      renderer.render(scene, camera);
    };

    triggerUpdateRef.current = rebuildModel;

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 4 || h < 4) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      rebuildModel();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setStatus("fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    resize();
    setStatus("ready");

    return () => {
      ro.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      disposeGroup(dynamicGroup);
      disposeGroup(baseGroup);
      disposeGroup(camRigGroup);
      sightRayGeo.dispose();
      sightRayMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (visible && status === "ready") {
      triggerUpdateRef.current();
    }
  }, [
    visible,
    status,
    regime,
    depthM,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    shelterSizeM,
    turbulentOn,
    simTime,
    camAzimuth,
    camElevation,
    camDistance,
    preset,
    diagOrbit,
  ]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      az0: diagOrbit.az,
      el0: diagOrbit.el,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    if (preset !== "isometric") setPreset("isometric");
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setDiagOrbit({
      az: dragRef.current.az0 - dx * 0.009,
      el: Math.max(-0.2, Math.min(1.35, dragRef.current.el0 + dy * 0.008)),
    });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if pointer already released
      }
    }
  };

  return (
    <div
      className="wh-model-stage"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="wh-observer-gl" ref={hostRef} />
      {status === "fallback" && (
        <div className="wh-fallback">
          <p>3D geometric model requires WebGL. The synchronized analytical calculations remain active below.</p>
        </div>
      )}
      <div className="wh-observer-hud-top">
        <span className="wh-hud-badge">Abstracted geometric model · synced</span>
        <span className="wh-hud-telemetry">
          <i style={{ background: telemetry.accent }} />
          <strong>{telemetry.label}</strong>
          <small>{telemetry.detail}</small>
        </span>
      </div>
      <div className="wh-observer-hud-bottom">
        <span>Drag to orbit diagram · white frustum = rendered viewpoint</span>
        <div className="wh-hud-actions">
          {(["isometric", "top", "side", "pov"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={preset === p}
              onClick={() => setPreset(p)}
            >
              {p === "isometric"
                ? "Isometric"
                : p === "top"
                  ? "Top-down"
                  : p === "side"
                    ? "Side profile"
                    : "Behind cam"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
