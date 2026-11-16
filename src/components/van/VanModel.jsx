import { useEffect, useRef } from "react";
import * as THREE from "three";

const CORE = 0x38d9ff;
const FAINT = 0x1c6f95;
const ALERT = 0xff4d4d;

const wheelIssue = (title = "") => /tire|wheel|pressure|brake|axle|hub/i.test(title);
const yawForSide = (side) => (side === "left" ? Math.PI : 0);
const zForSide = (side) => (side === "left" ? -1.04 : 1.04);

function edgeBox(geometry, material, position, rotation) {
  const line = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), material);
  line.position.set(position[0], position[1], position[2]);
  if (rotation) line.rotation.set(rotation[0], rotation[1], rotation[2]);
  return line;
}

// The van points along +X, +Z is its right flank.
function buildVan(core, faint) {
  const van = new THREE.Group();

  van.add(edgeBox(new THREE.BoxGeometry(5.2, 2.0, 2.0), core, [0, 1.5, 0]));
  van.add(edgeBox(new THREE.BoxGeometry(1.2, 0.95, 1.92), core, [2.5, 0.98, 0]));
  van.add(edgeBox(new THREE.BoxGeometry(4.8, 0.26, 1.9), faint, [-0.2, 2.62, 0]));

  const wheel = new THREE.CylinderGeometry(0.46, 0.46, 0.3, 14);
  [[1.85, 1.02], [1.85, -1.02], [-1.7, 1.02], [-1.7, -1.02]].forEach(([x, z]) => {
    van.add(edgeBox(wheel, faint, [x, 0.46, z], [Math.PI / 2, 0, 0]));
  });

  van.add(edgeBox(new THREE.BoxGeometry(4.9, 0.05, 1.85), faint, [0, 0.52, 0]));
  van.add(edgeBox(new THREE.BoxGeometry(2.0, 0.46, 1.7), faint, [-1.45, 1.13, 0]));
  van.add(edgeBox(new THREE.BoxGeometry(1.3, 0.9, 1.55), faint, [0.3, 1.35, 0]));
  van.add(edgeBox(new THREE.BoxGeometry(0.85, 1.45, 1.0), faint, [1.45, 1.72, -0.45]));

  return van;
}

// A slowly orbiting wireframe of the van. It swings round to face whichever
// side of the vehicle a device or fault sits on.
export default function VanModel({ side = "right", title = "", className }) {
  const hostRef = useRef(null);
  const api = useRef(null);
  const latest = useRef({ side, title });
  latest.current = { side, title };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const core = new THREE.LineBasicMaterial({ color: CORE, transparent: true, opacity: 0.9 });
    const faint = new THREE.LineBasicMaterial({ color: FAINT, transparent: true, opacity: 0.5 });
    const glow = new THREE.MeshBasicMaterial({
      color: ALERT,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const solid = new THREE.MeshBasicMaterial({ color: ALERT, transparent: true, opacity: 0.95 });

    scene.add(buildVan(core, faint));

    const marker = new THREE.Group();
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 8, 48), glow);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 8, 36), glow);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), solid);
    marker.add(halo, ring, dot);
    scene.add(marker);

    const place = ({ side: targetSide, title: targetTitle }) => {
      const wheel = wheelIssue(targetTitle);
      marker.position.set(wheel ? -1.7 : -0.7, wheel ? 0.48 : 1.45, zForSide(targetSide));
    };
    place(latest.current);

    const startYaw = yawForSide(latest.current.side) + Math.PI * 0.78;
    const state = { yaw: startYaw, target: yawForSide(latest.current.side) };

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      let diff = state.target - state.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      state.yaw += diff * Math.min(1, dt * 3.2);

      const radius = 8.2;
      camera.position.set(Math.sin(state.yaw) * radius, 3.1, Math.cos(state.yaw) * radius);
      camera.lookAt(0, 1.25, 0);

      const time = performance.now() / 1000;
      ring.scale.setScalar(1 + Math.sin(time * 3) * 0.14);
      halo.scale.setScalar(1 + Math.sin(time * 3 - 1.1) * 0.18);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    api.current = {
      apply: ({ side: nextSide, title: nextTitle }) => {
        state.target = yawForSide(nextSide);
        place({ side: nextSide, title: nextTitle });
      },
    };

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      api.current = null;
      scene.traverse((node) => node.geometry?.dispose());
      [core, faint, glow, solid].forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    api.current?.apply({ side, title });
  }, [side, title]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}