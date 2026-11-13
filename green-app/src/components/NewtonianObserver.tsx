"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  activeSubtractionSensorCount,
  effectiveShelterDepth,
  infrasonicStrainASD,
  smoothThermalAdvectionASD,
  thermalTurbulentStrainASD,
  type ShelterGeometry,
} from "@/lib/newtonianNoiseModels";
import NewtonianModelStage, { type ObserverRegime } from "./NewtonianModelStage";

type StageViewMode = "split" | "rendered" | "model";

export interface NewtonianObserverProps {
  regime: ObserverRegime;
  onRegimeChange: (regime: ObserverRegime) => void;
  depthM: number;
  onDepthChange: (d: number) => void;
  freqHz: number;
  onFreqChange: (f: number) => void;
  windSpeed: number;
  onWindSpeedChange: (v: number) => void;
  qualityQ: number;
  onQualityQChange: (q: number) => void;
  eddyRadiusM: number;
  onEddyRadiusChange: (r: number) => void;
  armLengthM: number;
  onArmLengthChange: (l: number) => void;
  shelterShape: ShelterGeometry;
  onShelterShapeChange: (s: ShelterGeometry) => void;
  shelterSizeM: number;
  onShelterSizeChange: (r: number) => void;
}

const PARCEL_COUNT = 28;

export default function NewtonianObserver(props: NewtonianObserverProps) {
  const {
    regime,
    onRegimeChange,
    depthM,
    onDepthChange,
    freqHz,
    onFreqChange,
    windSpeed,
    onWindSpeedChange,
    qualityQ,
    onQualityQChange,
    eddyRadiusM,
    onEddyRadiusChange,
    armLengthM,
    onArmLengthChange,
    shelterShape,
    onShelterShapeChange,
    shelterSizeM,
    onShelterSizeChange,
  } = props;

  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [viewMode, setViewMode] = useState<StageViewMode>("split");
  const [playing, setPlaying] = useState(true);
  const [turbulentOn, setTurbulentOn] = useState(true);
  const [simTime, setSimTime] = useState(0);

  const [camOrbit, setCamOrbit] = useState({ az: 0.42, el: 0.28, dist: 10.5 });
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
    az0: 0.42,
    el0: 0.28,
  });

  // Compressed visual depth matching NewtonianModelStage 1:1
  const depthVis = useMemo(() => {
    const rawD =
      regime === "shelter"
        ? effectiveShelterDepth(shelterShape, shelterSizeM)
        : depthM;
    if (rawD <= 25) return 1.2 + (rawD / 25) * 1.4;
    return 2.6 + Math.log10(rawD / 25) * 1.15;
  }, [regime, depthM, shelterShape, shelterSizeM]);

  const effectiveDepth = useMemo(() => {
    if (regime === "shelter") {
      return effectiveShelterDepth(shelterShape, shelterSizeM);
    }
    return depthM;
  }, [regime, depthM, shelterShape, shelterSizeM]);

  const liveMetrics = useMemo(() => {
    const infraCoherent = infrasonicStrainASD({
      fHz: freqHz,
      depthM: effectiveDepth,
      armLengthM,
      qualityFactorQ: Infinity,
    });
    const infraPacket = infrasonicStrainASD({
      fHz: freqHz,
      depthM: effectiveDepth,
      armLengthM,
      qualityFactorQ: qualityQ,
    });
    const smoothThermal = smoothThermalAdvectionASD({
      fHz: freqHz,
      depthM: effectiveDepth,
      armLengthM,
      windSpeed,
    });
    const cycloidThermal = thermalTurbulentStrainASD({
      fHz: freqHz,
      depthM: effectiveDepth,
      armLengthM,
      windSpeed,
      qualityFactorQ: turbulentOn ? Infinity : 0.1,
    });
    const fEddy = windSpeed / (2 * Math.PI * Math.max(0.15, eddyRadiusM));
    const sensors = activeSubtractionSensorCount(freqHz, effectiveDepth, windSpeed);
    return {
      infraCoherent,
      infraPacket,
      smoothThermal,
      cycloidThermal,
      fEddy,
      sensors,
    };
  }, [freqHz, effectiveDepth, armLengthM, qualityQ, windSpeed, turbulentOn, eddyRadiusM]);

  // Deterministic pseudo-random parcel layout for both stages
  const parcelSeeds = useMemo(
    () =>
      Array.from({ length: PARCEL_COUNT }, (_, idx) => {
        const s1 = Math.sin(idx * 12.9898 + 4.1) * 43758.5453;
        const s2 = Math.sin(idx * 78.233 + 1.9) * 43758.5453;
        const s3 = Math.sin(idx * 39.425 + 7.3) * 43758.5453;
        const frac1 = s1 - Math.floor(s1);
        const frac2 = s2 - Math.floor(s2);
        const frac3 = s3 - Math.floor(s3);
        return {
          x0: (idx / PARCEL_COUNT) * 14 - 7,
          zOff: (frac1 - 0.5) * 4.4,
          yOff: frac2 * 1.15,
          phase: frac3 * Math.PI * 2,
          warm: idx % 2 === 0,
          radius: 0.22 + frac1 * 0.22,
        };
      }),
    []
  );

  const renderStateRef = useRef({
    regime,
    depthVis,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    turbulentOn,
    playing,
    camOrbit,
    viewMode,
  });
  renderStateRef.current = {
    regime,
    depthVis,
    freqHz,
    windSpeed,
    qualityQ,
    eddyRadiusM,
    armLengthM,
    shelterShape,
    turbulentOn,
    playing,
    camOrbit,
    viewMode,
  };

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x04101c, 1);
    renderer.domElement.setAttribute(
      "aria-label",
      "Rendered 3D physical scene of an interferometer test mass inside an underground cavern or surface shelter beneath moving atmospheric waves and air parcels; drag to orbit"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04101c, 0.032);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

    // Lighting
    scene.add(new THREE.AmbientLight(0x6da6c8, 0.72));
    const keyLight = new THREE.DirectionalLight(0xd9f6ff, 1.35);
    keyLight.position.set(5, 9, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xf5b971, 0.55);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Vacuum tube & suspended test mass at (0, 0, 0)
    const chamberGroup = new THREE.Group();
    scene.add(chamberGroup);

    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x2a4f68,
      metalness: 0.72,
      roughness: 0.28,
      transparent: true,
      opacity: 0.36,
      side: THREE.DoubleSide,
    });
    const beamTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 15, 24, 1, true),
      tubeMat
    );
    beamTube.rotation.z = Math.PI / 2;
    chamberGroup.add(beamTube);

    // Vacuum enclosure housing around central test mass
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.68, 1.25, 24),
      new THREE.MeshStandardMaterial({
        color: 0x203b50,
        metalness: 0.65,
        roughness: 0.35,
        transparent: true,
        opacity: 0.32,
      })
    );
    chamberGroup.add(tower);

    // Suspended fused-silica test-mass mirror
    const mirror = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.16, 28),
      new THREE.MeshStandardMaterial({
        color: 0xdff8ff,
        emissive: 0x165570,
        emissiveIntensity: 0.55,
        metalness: 0.3,
        roughness: 0.12,
      })
    );
    mirror.rotation.z = Math.PI / 2;
    chamberGroup.add(mirror);

    // Glowing interferometer laser beam along X axis
    const laser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 15, 12),
      new THREE.MeshBasicMaterial({ color: 0x65d9ed })
    );
    laser.rotation.z = Math.PI / 2;
    chamberGroup.add(laser);

    // Stratified bedrock slab (height adjusts dynamically between y=0 and y=depthVis)
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0d2132,
      roughness: 0.92,
      metalness: 0.08,
      transparent: true,
      opacity: 0.78,
    });
    const rockSlab = new THREE.Mesh(new THREE.BoxGeometry(14, 1, 7), rockMat);
    scene.add(rockSlab);

    // Surface turf / top ground plane
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(14.2, 7.2),
      new THREE.MeshStandardMaterial({
        color: 0x153549,
        roughness: 0.85,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
      })
    );
    groundPlane.rotation.x = -Math.PI / 2;
    scene.add(groundPlane);

    // Surface shelter dome / semicylinder / hall (shown only in shelter mode)
    const shelterGroup = new THREE.Group();
    scene.add(shelterGroup);
    const shelterMat = new THREE.MeshStandardMaterial({
      color: 0x26546e,
      metalness: 0.45,
      roughness: 0.35,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const shelterHemi = new THREE.Mesh(
      new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      shelterMat
    );
    const shelterSemiGeo = new THREE.CylinderGeometry(1, 1, 5.2, 24, 1, false, 0, Math.PI);
    shelterSemiGeo.rotateZ(Math.PI / 2);
    shelterSemiGeo.rotateX(-Math.PI / 2);
    const shelterSemi = new THREE.Mesh(shelterSemiGeo, shelterMat);
    const shelterBox = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), shelterMat);
    shelterBox.position.y = 0.5;
    shelterGroup.add(shelterHemi, shelterSemi, shelterBox);

    // Acoustic wavefront planes (used in infrasound regime)
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);
    const waveSheets: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const sheet = new THREE.Mesh(
        new THREE.PlaneGeometry(0.14, 2.2, 1, 1),
        new THREE.MeshBasicMaterial({
          color: 0x65d9ed,
          transparent: true,
          opacity: 0.36,
          side: THREE.DoubleSide,
        })
      );
      sheet.rotation.y = Math.PI / 2;
      waveGroup.add(sheet);
      waveSheets.push(sheet);
    }

    // Air parcels (cool-dense cyan / warm-buoyant amber eddies)
    const parcelGroup = new THREE.Group();
    scene.add(parcelGroup);
    const parcelMeshes: THREE.Mesh[] = [];
    const parcelGeo = new THREE.SphereGeometry(1, 16, 16);
    for (let i = 0; i < PARCEL_COUNT; i++) {
      const warm = parcelSeeds[i].warm;
      const mat = new THREE.MeshStandardMaterial({
        color: warm ? 0xf5b971 : 0x65d9ed,
        emissive: warm ? 0x5c3610 : 0x104c5c,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        transparent: true,
        opacity: 0.82,
      });
      const m = new THREE.Mesh(parcelGeo, mat);
      parcelGroup.add(m);
      parcelMeshes.push(m);
    }

    let frame = 0;
    let inView = true;
    let contextLost = false;
    let simT = 0;
    let lastTs = performance.now();
    let lastReactTick = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const animate = (now: number) => {
      frame = 0;
      if (contextLost || document.hidden || !inView) return;
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const st = renderStateRef.current;

      if (st.playing && !reducedMotion.matches) {
        simT += dt;
      }

      if (now - lastReactTick > 45) {
        lastReactTick = now;
        setSimTime(simT);
      }

      const dV = st.depthVis;

      // Update ground/rock vs shelter visibility
      if (st.regime === "shelter") {
        rockSlab.visible = false;
        groundPlane.position.y = -0.3;
        shelterGroup.visible = true;
        const Rvis = Math.max(1.2, dV * 1.75);
        shelterHemi.visible = st.shelterShape === "hemisphere";
        shelterSemi.visible = st.shelterShape === "semicylinder";
        shelterBox.visible = st.shelterShape === "halfCube";
        shelterHemi.scale.setScalar(Rvis);
        shelterSemi.scale.set(Rvis, Rvis, Rvis);
        shelterBox.scale.set(Rvis, Rvis, Rvis);
        shelterBox.position.y = Rvis * 0.5;
      } else {
        shelterGroup.visible = false;
        rockSlab.visible = true;
        const rockHeight = Math.max(0.4, dV);
        rockSlab.scale.set(1, rockHeight, 1);
        rockSlab.position.y = rockHeight * 0.5 - 0.15;
        groundPlane.position.y = dV;
      }

      // Acoustic wave sheets vs advected thermal air parcels
      if (st.regime === "infrasound") {
        waveGroup.visible = true;
        parcelGroup.visible = false;
        const lambdaVis = Math.max(1.0, Math.min(3.8, 8 / Math.max(0.4, st.freqHz)));
        const speedVis = 2.2;
        const packetEnvelope = st.qualityQ > 40 ? 10 : Math.max(1.1, st.qualityQ * 0.95);
        for (let i = 0; i < waveSheets.length; i++) {
          const x = ((((i * lambdaVis + simT * speedVis) % 13) + 13) % 13) - 6.5;
          const sheet = waveSheets[i];
          sheet.position.set(x, dV + 1.05, 0);
          const env = Math.exp(-Math.pow(x / packetEnvelope, 2));
          (sheet.material as THREE.MeshBasicMaterial).opacity = 0.12 + 0.45 * env;
        }
        // Subtle mirror displacement at acoustic cadence
        mirror.position.x = 0.03 * Math.sin(simT * Math.min(8, st.freqHz * 2.5));
      } else {
        waveGroup.visible = false;
        parcelGroup.visible = true;
        const baseY = st.regime === "shelter" ? dV * 1.85 : dV + 0.85;
        const Rvis = st.turbulentOn ? Math.min(1.1, Math.max(0.2, st.eddyRadiusM * 0.28)) : 0;
        const omegaVis = (st.windSpeed / Math.max(0.3, st.eddyRadiusM)) * 0.45;
        const speedVis = 0.45 + st.windSpeed * 0.08;

        let netPullX = 0;
        for (let i = 0; i < PARCEL_COUNT; i++) {
          const seed = parcelSeeds[i];
          const xBase = ((((seed.x0 + simT * speedVis) % 14) + 14) % 14) - 7;
          const phase = simT * omegaVis + seed.phase;
          const px = xBase + Rvis * Math.cos(phase);
          const py = baseY + seed.yOff + Rvis * Math.sin(phase);
          const pz = seed.zOff;
          const m = parcelMeshes[i];
          m.position.set(px, py, pz);
          m.scale.setScalar(seed.radius);
          const r2 = px * px + py * py + pz * pz;
          netPullX += ((seed.warm ? -1 : 1) * px) / Math.pow(Math.max(1, r2), 1.5);
        }
        mirror.position.x = Math.max(-0.08, Math.min(0.08, netPullX * 0.14));
      }

      // Place camera smoothly around test mass & boundary center
      const target = new THREE.Vector3(0, dV * 0.48, 0);
      const { az, el, dist } = st.camOrbit;
      camera.position.set(
        target.x + dist * Math.cos(el) * Math.sin(az),
        target.y + dist * Math.sin(el),
        target.z + dist * Math.cos(el) * Math.cos(az)
      );
      camera.lookAt(target);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    const schedule = () => {
      if (!frame && !contextLost && !document.hidden && inView) {
        lastTs = performance.now();
        frame = requestAnimationFrame(animate);
      }
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 4 || h < 4) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      schedule();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(container);

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
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      renderer.domElement.removeEventListener("webglcontextlost", loseContext);
      tubeMat.dispose();
      beamTube.geometry.dispose();
      tower.geometry.dispose();
      (tower.material as THREE.Material).dispose();
      mirror.geometry.dispose();
      (mirror.material as THREE.Material).dispose();
      laser.geometry.dispose();
      (laser.material as THREE.Material).dispose();
      rockSlab.geometry.dispose();
      rockMat.dispose();
      groundPlane.geometry.dispose();
      (groundPlane.material as THREE.Material).dispose();
      shelterHemi.geometry.dispose();
      shelterSemi.geometry.dispose();
      shelterBox.geometry.dispose();
      shelterMat.dispose();
      waveSheets.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.Material).dispose();
      });
      parcelGeo.dispose();
      parcelMeshes.forEach((m) => (m.material as THREE.Material).dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [parcelSeeds]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      az0: camOrbit.az,
      el0: camOrbit.el,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setCamOrbit((prev) => ({
      ...prev,
      az: dragRef.current.az0 - dx * 0.0085,
      el: Math.max(-0.18, Math.min(1.25, dragRef.current.el0 + dy * 0.0075)),
    }));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    }
  };

  // Live 2D waveform trace SVG illustrating smooth vs cycloid acceleration modulation
  const tracePath = useMemo(() => {
    const W = 520;
    const midY = 74;
    const ptsSmooth: string[] = [];
    const ptsActive: string[] = [];
    const cycFreqRatio = Math.max(0.6, Math.min(5, windSpeed / Math.max(0.4, eddyRadiusM * 2)));
    for (let i = 0; i <= 110; i++) {
      const u = (i / 110) * 2 - 1;
      const xPx = (i / 110) * (W - 24) + 12;
      // Smooth pass-by dipole envelope x / (x^2 + d^2)^(3/2)
      const smoothVal = (u / Math.pow(u * u + 0.16, 1.5)) * 12;
      const modVal = turbulentOn
        ? smoothVal + Math.sin(u * Math.PI * 2 * cycFreqRatio + simTime * 2.2) * 19 * Math.exp(-u * u * 1.4)
        : smoothVal;
      ptsSmooth.push(`${i === 0 ? "M" : "L"}${xPx.toFixed(1)},${(midY - smoothVal).toFixed(1)}`);
      ptsActive.push(`${i === 0 ? "M" : "L"}${xPx.toFixed(1)},${(midY - modVal).toFixed(1)}`);
    }
    return {
      smooth: ptsSmooth.join(" "),
      active: ptsActive.join(" "),
    };
  }, [windSpeed, eddyRadiusM, turbulentOn, simTime]);

  const regimeBadge =
    regime === "infrasound"
      ? "Rendered 3D · Infrasound wavefronts"
      : regime === "thermal"
        ? "Rendered 3D · Turbulent air parcels"
        : regime === "shelter"
          ? "Rendered 3D · Surface enclosure"
          : "Rendered 3D · Underground cavern";

  return (
    <div className="wh-observer-shell">
      <div className="wh-observer-tabs" role="tablist" aria-label="Atmospheric Newtonian noise physical regime">
        <button
          role="tab"
          aria-selected={regime === "infrasound"}
          onClick={() => onRegimeChange("infrasound")}
        >
          <span>01 · Pressure waves</span>
          <strong>Infrasound packets</strong>
        </button>
        <button
          role="tab"
          aria-selected={regime === "thermal"}
          onClick={() => onRegimeChange("thermal")}
        >
          <span>02 · Eddy wind</span>
          <strong>Smooth vs cycloidal</strong>
        </button>
        <button
          role="tab"
          aria-selected={regime === "shelter"}
          onClick={() => onRegimeChange("shelter")}
        >
          <span>03 · Building shell</span>
          <strong>Surface enclosure D_eff</strong>
        </button>
        <button
          role="tab"
          aria-selected={regime === "deep_arm"}
          onClick={() => onRegimeChange("deep_arm")}
        >
          <span>04 · Siting &amp; baseline</span>
          <strong>Deep cavern vs arm L</strong>
        </button>
      </div>

      <div className="wh-view-mode-bar" role="group" aria-label="Stage view layout">
        <div className="wh-view-mode-buttons">
          <button
            type="button"
            aria-pressed={viewMode === "split"}
            onClick={() => setViewMode("split")}
          >
            Split (Rendered + Model)
          </button>
          <button
            type="button"
            aria-pressed={viewMode === "rendered"}
            onClick={() => setViewMode("rendered")}
          >
            Rendered 3D only
          </button>
          <button
            type="button"
            aria-pressed={viewMode === "model"}
            onClick={() => setViewMode("model")}
          >
            Geometric model only
          </button>
        </div>
        <span className="wh-bridge-hint">
          Drag rendered view on left &rarr; camera frustum &amp; standoff geometry update live on right
        </span>
      </div>

      <div
        className={`wh-observer-stages ${
          viewMode === "split" ? "wh-observer-stages--split" : "wh-observer-stages--single"
        }`}
      >
        <div
          className="wh-observer-stage"
          hidden={viewMode === "model"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="wh-observer-gl" ref={hostRef} />
          {status === "fallback" && (
            <div className="wh-fallback">
              <p>3D scene requires WebGL. The synchronized analytical coupling diagram below remains active.</p>
            </div>
          )}
          <div className="wh-observer-reticle" aria-hidden="true">
            <span />
          </div>
          <div className="wh-observer-hud-top">
            <span className="wh-hud-badge">{regimeBadge}</span>
            <span className="wh-hud-legend">
              <span>
                <i style={{ background: "#65d9ed" }} />
                {regime === "infrasound" ? "Compression / laser arm" : "Cool dense parcel"}
              </span>
              <span>
                <i style={{ background: "#f5b971" }} />
                {regime === "shelter" ? "Exclusion wall" : "Warm buoyant eddy"}
              </span>
            </span>
          </div>
          <div className="wh-observer-hud-bottom">
            <span>
              Drag to orbit viewpoint · D_eff = {effectiveDepth.toFixed(1)} m · √S_h ≈{" "}
              {(regime === "infrasound" ? liveMetrics.infraPacket : liveMetrics.cycloidThermal).toExponential(1)} Hz⁻¹/²
            </span>
            <div className="wh-hud-actions">
              <button
                type="button"
                className="wh-hud-primary"
                onClick={() => setPlaying((v) => !v)}
              >
                {playing ? "Pause advection" : "Resume advection"}
              </button>
              <button
                type="button"
                onClick={() => setCamOrbit({ az: 0.42, el: 0.28, dist: 10.5 })}
              >
                Reset viewpoint
              </button>
            </div>
          </div>
        </div>

        <div className="wh-model-pane" hidden={viewMode === "rendered"}>
          <NewtonianModelStage
            regime={regime}
            depthM={depthM}
            freqHz={freqHz}
            windSpeed={windSpeed}
            qualityQ={qualityQ}
            eddyRadiusM={eddyRadiusM}
            armLengthM={armLengthM}
            shelterShape={shelterShape}
            shelterSizeM={shelterSizeM}
            turbulentOn={turbulentOn}
            simTime={simTime}
            camAzimuth={camOrbit.az}
            camElevation={camOrbit.el}
            camDistance={camOrbit.dist}
            visible={viewMode !== "rendered"}
          />
        </div>
      </div>

      <div className="wh-observer-deck">
        <div className="wh-observer-controls">
          {regime !== "shelter" ? (
            <div className="wh-range">
              <label htmlFor="obs-depth">
                Minimum standoff depth D (ground or cavern)
                <output htmlFor="obs-depth">{depthM} m</output>
              </label>
              <input
                id="obs-depth"
                type="range"
                min={5}
                max={1000}
                step={5}
                value={depthM}
                onChange={(e) => onDepthChange(Number(e.target.value))}
              />
            </div>
          ) : (
            <>
              <div className="wh-sector-picker" role="group" aria-label="Surface enclosure geometry">
                {(
                  [
                    { id: "hemisphere", label: "Hemisphere", ratio: "0.50 R" },
                    { id: "semicylinder", label: "Semicylinder", ratio: "0.64 R" },
                    { id: "halfCube", label: "Half-cube", ratio: "0.55 h" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={shelterShape === item.id}
                    onClick={() => onShelterShapeChange(item.id)}
                  >
                    {item.label}
                    <small>D_eff = {item.ratio}</small>
                  </button>
                ))}
              </div>
              <div className="wh-range">
                <label htmlFor="obs-shelter-size">
                  Shelter radius / height (R or h)
                  <output htmlFor="obs-shelter-size">{shelterSizeM} m</output>
                </label>
                <input
                  id="obs-shelter-size"
                  type="range"
                  min={4}
                  max={60}
                  step={1}
                  value={shelterSizeM}
                  onChange={(e) => onShelterSizeChange(Number(e.target.value))}
                />
              </div>
            </>
          )}

          <div className="wh-range">
            <label htmlFor="obs-freq">
              Evaluation frequency f
              <output htmlFor="obs-freq">{freqHz.toFixed(1)} Hz</output>
            </label>
            <input
              id="obs-freq"
              type="range"
              min={0.5}
              max={15}
              step={0.5}
              value={freqHz}
              onChange={(e) => onFreqChange(Number(e.target.value))}
            />
          </div>

          {regime === "infrasound" && (
            <div className="wh-range">
              <label htmlFor="obs-q">
                Wave-packet quality factor Q = l / λ
                <output htmlFor="obs-q">
                  {qualityQ >= 45 ? "∞ (plane wave)" : qualityQ.toFixed(1)}
                </output>
              </label>
              <input
                id="obs-q"
                type="range"
                min={0.5}
                max={50}
                step={0.5}
                value={qualityQ}
                onChange={(e) => onQualityQChange(Number(e.target.value))}
              />
            </div>
          )}

          {(regime === "thermal" || regime === "shelter" || regime === "deep_arm") && (
            <>
              <div className="wh-range">
                <label htmlFor="obs-wind">
                  Advective wind speed v
                  <output htmlFor="obs-wind">{windSpeed} m/s</output>
                </label>
                <input
                  id="obs-wind"
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={windSpeed}
                  onChange={(e) => onWindSpeedChange(Number(e.target.value))}
                />
              </div>
              <div className="wh-range">
                <label htmlFor="obs-eddy">
                  Cycloidal eddy radius R (f_peak = v / 2πR = {liveMetrics.fEddy.toFixed(2)} Hz)
                  <output htmlFor="obs-eddy">
                    {turbulentOn ? `${eddyRadiusM.toFixed(2)} m` : "Off (smooth)"}
                  </output>
                </label>
                <input
                  id="obs-eddy"
                  type="range"
                  min={0.3}
                  max={6.0}
                  step={0.1}
                  value={eddyRadiusM}
                  onChange={(e) => onEddyRadiusChange(Number(e.target.value))}
                />
              </div>
              <div className="wh-view-controls">
                <button
                  type="button"
                  aria-pressed={turbulentOn}
                  onClick={() => setTurbulentOn(true)}
                >
                  Cycloidal turbulence
                </button>
                <button
                  type="button"
                  aria-pressed={!turbulentOn}
                  onClick={() => setTurbulentOn(false)}
                >
                  Smooth laminar wind
                </button>
              </div>
            </>
          )}

          {regime === "deep_arm" && (
            <div className="wh-range">
              <label htmlFor="obs-arm">
                Interferometer baseline L
                <output htmlFor="obs-arm">{(armLengthM / 1000).toFixed(1)} km</output>
              </label>
              <input
                id="obs-arm"
                type="range"
                min={1000}
                max={40000}
                step={1000}
                value={armLengthM}
                onChange={(e) => onArmLengthChange(Number(e.target.value))}
              />
            </div>
          )}

          <div className="wh-observer-note">
            <p>
              <strong>Why geometry bridges to strain:</strong> each cold/warm parcel pulls along{" "}
              <code>δg_x ∝ x / r³</code>. Smooth wind only fluctuates on the crossing timescale{" "}
              <code>D / v</code> (exponentially damped above it); cycloidal circulation of radius{" "}
              <code>R</code> modulates acceleration at <code>f = v / (2πR)</code>, turning exponential
              shielding into a power-law tail.
            </p>
          </div>
        </div>

        <div className="wh-geodesic-panel">
          <div className="wh-geodesic-head">
            <span>TIDAL ACCELERATION PULSE δg_x(t) ALONG ARM AXIS</span>
            <span>D_eff = {effectiveDepth.toFixed(1)} m</span>
          </div>
          <svg
            className="wh-geodesic-svg"
            viewBox="0 0 520 155"
            role="img"
            aria-label="Schematic comparison of smooth laminar fly-by gravitational pulse versus cycloidally modulated high-frequency acceleration"
          >
            <line x1="12" y1="74" x2="508" y2="74" stroke="#1b3a50" strokeWidth="1" />
            <line x1="260" y1="14" x2="260" y2="138" stroke="#1b3a50" strokeDasharray="3 4" />
            <path d={tracePath.smooth} fill="none" stroke="#65d9ed" strokeWidth="1.75" opacity="0.85" />
            <path d={tracePath.active} fill="none" stroke="#f5b971" strokeWidth="2.1" />
            <text x="16" y="22" fill="#65d9ed" fontSize="11" fontFamily="ui-monospace,monospace">
              Smooth pass-by dipole ~ x / (x² + D²)³/²
            </text>
            <text x="16" y="38" fill="#f5b971" fontSize="11" fontFamily="ui-monospace,monospace">
              {turbulentOn
                ? "Cycloid eddy modulation injects power at Ω = v/R"
                : "Laminar mode active (cycloidal modulation off)"}
            </text>
            <text x="260" y="150" textAnchor="middle" fill="#8bb4ca" fontSize="10" fontFamily="ui-monospace,monospace">
              parcel position relative to test mass (t = 0 overhead)
            </text>
          </svg>
          <div className="wh-geodesic-stats">
            <span>
              Infrasound ({qualityQ >= 45 ? "Q→∞" : `Q=${qualityQ.toFixed(1)}`}):{" "}
              {liveMetrics.infraPacket.toExponential(2)} Hz⁻¹/²
            </span>
            <span>
              Thermal ({turbulentOn ? "turbulent" : "smooth"}):{" "}
              {(turbulentOn ? liveMetrics.cycloidThermal : liveMetrics.smoothThermal).toExponential(2)} Hz⁻¹/²
            </span>
            <span>
              3D active array (N): {liveMetrics.sensors.parcelCount.toExponential(1)} sensors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
