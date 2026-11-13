"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Props = { connected: boolean; rotating: boolean; resetKey: number };

// A surface of revolution, r(x) = 0.58 + 0.25 x², in arbitrary drawing units.
// It conveys connectedness only: it is not a metric or a field-equation solution.
function topologyGroup(connected: boolean) {
  const group = new THREE.Group();
  const profile = Array.from({ length: 49 }, (_, i) => {
    const x = -2.4 + i * 0.1;
    return new THREE.Vector2(0.58 + 0.25 * x * x, x);
  });
  const surface = new THREE.MeshPhongMaterial({ color: 0x087eac, transparent: true, opacity: 0.26, side: THREE.DoubleSide, depthWrite: false });
  const wire = new THREE.LineBasicMaterial({ color: 0x4cc9ed, transparent: true, opacity: 0.34 });
  const addSurface = (geometry: THREE.BufferGeometry) => {
    const mesh = new THREE.Mesh(geometry, surface);
    mesh.rotation.z = Math.PI / 2;
    group.add(mesh);
    const lines = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wire);
    lines.rotation.copy(mesh.rotation);
    group.add(lines);
  };
  if (connected) {
    addSurface(new THREE.LatheGeometry(profile, 48));
  } else {
    // Two separate filled discs, not a tube with an invisible middle.
    for (const x of [-2.4, 2.4]) {
      const disc = new THREE.Mesh(new THREE.CircleGeometry(2.02, 48), surface);
      disc.rotation.y = Math.PI / 2;
      disc.position.x = x;
      group.add(disc);
      for (let r = 0.3; r < 2; r += 0.3) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 4, 48), new THREE.MeshBasicMaterial({ color: 0x3a8bad }));
        ring.rotation.y = Math.PI / 2;
        ring.position.x = x;
        group.add(ring);
      }
    }
  }
  for (const [i, x] of [-2.4, 2.4].entries()) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.025, 8, 96), new THREE.MeshBasicMaterial({ color: i === 0 ? 0x66e2ed : 0x7a9cff }));
    ring.rotation.y = Math.PI / 2;
    ring.position.x = x;
    group.add(ring);
  }
  return group;
}

function disposeGroup(group: THREE.Group) {
  const materials = new Set<THREE.Material>();
  group.traverse((obj) => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose();
      (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => materials.add(m));
    }
  });
  materials.forEach((material) => material.dispose());
}

export default function WormholeTopology({ connected, rotating, resetKey }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const update = useRef<((connected: boolean, rotating: boolean, resetKey: number) => void) | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setStatus("fallback");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.setAttribute("aria-label", "Rotatable topology illustration; equivalent text and a two-dimensional diagram are provided below");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false; // Preserve page scrolling, especially on phones.
    controls.enableDamping = false;
    controls.autoRotateSpeed = 0.6;
    const reset = () => { camera.position.set(5.4, 3.4, 8.8); controls.target.set(0, 0, 0); controls.update(); };
    reset();
    scene.add(new THREE.AmbientLight(0xd2efff, 2));
    const light = new THREE.DirectionalLight(0x58cbff, 4);
    light.position.set(2, 5, 3);
    scene.add(light);
    let group = topologyGroup(true);
    scene.add(group);
    let lastConnected = true;
    let lastReset = 0;
    let wantsRotation = false;
    let frame = 0;
    let inView = true;
    let contextLost = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const draw = () => {
      frame = 0;
      if (contextLost || document.hidden || !inView) return;
      controls.autoRotate = wantsRotation && !reducedMotion.matches;
      if (controls.autoRotate) controls.update(1 / 60);
      renderer.render(scene, camera);
      if (controls.autoRotate && !frame) frame = requestAnimationFrame(draw);
    };
    const invalidate = () => { if (!frame) frame = requestAnimationFrame(draw); };
    update.current = (nextConnected, nextRotating, nextReset) => {
      if (lastConnected !== nextConnected) {
        scene.remove(group);
        disposeGroup(group);
        group = topologyGroup(nextConnected);
        scene.add(group);
        lastConnected = nextConnected;
      }
      wantsRotation = nextRotating;
      if (lastReset !== nextReset) { reset(); lastReset = nextReset; }
      invalidate();
    };
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
      // Keep both boundaries within the narrow mobile viewport.
      camera.fov = width < 500 ? 57 : 42;
      camera.updateProjectionMatrix();
      invalidate();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; invalidate(); });
    visibility.observe(container);
    const loseContext = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      setStatus("fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", loseContext);
    controls.addEventListener("change", invalidate);
    document.addEventListener("visibilitychange", invalidate);
    reducedMotion.addEventListener("change", invalidate);
    resize();
    setStatus("ready");
    return () => {
      update.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect(); visibility.disconnect();
      document.removeEventListener("visibilitychange", invalidate);
      reducedMotion.removeEventListener("change", invalidate);
      renderer.domElement.removeEventListener("webglcontextlost", loseContext);
      controls.removeEventListener("change", invalidate);
      controls.dispose(); disposeGroup(group); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => { update.current?.(connected, rotating, resetKey); }, [connected, rotating, resetKey]);

  return <div className="wh-topology">
    <div className="wh-scene" ref={host} hidden={status === "fallback"} />
    <div className="wh-scene-labels" aria-hidden="true"><span>Boundary A</span><span>Boundary B</span></div>
    {status !== "ready" && <div className="wh-fallback" role="status">
      <p>{status === "loading" ? "Preparing 3D; the diagram below is already readable." : "3D is unavailable. The two-dimensional diagram and all numerical experiments remain available."}</p>
      <svg viewBox="0 0 420 150" role="img" aria-label={connected ? "Two boundaries joined by one connected surface" : "Two boundaries with separate surface fillings"}>
        <ellipse cx="60" cy="75" rx="28" ry="60" fill="none" stroke="#66e2ed" strokeWidth="2" />
        <ellipse cx="360" cy="75" rx="28" ry="60" fill="none" stroke="#7a9cff" strokeWidth="2" />
        {connected ? <path d="M60 15 Q210 110 360 15 M60 135 Q210 40 360 135" fill="none" stroke="#4cc9ed" strokeWidth="2" /> : <path d="M60 15V135 M360 15V135" stroke="#4cc9ed" strokeWidth="2" />}
      </svg>
    </div>}
    <p className="wh-scene-note">{status === "ready" ? "Drag to rotate · Use the buttons to change connectivity or reset the view" : "Use the buttons above to change connectivity"}</p>
  </div>;
}
