import { useEffect, useRef } from "react";
import * as THREE from "three";

const ALERT = 0xff2f2f;
const SIDE_YAW = { left: Math.PI, right: 0 };

// Soft studio gradient used as the reflection map, so the paint reads as glossy
// metal instead of flat colour.
function environmentTexture(renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#a8e8ff");
  grad.addColorStop(0.32, "#2c5268");
  grad.addColorStop(0.52, "#0a1a26");
  grad.addColorStop(1, "#01050a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;
  texture.dispose();
  pmrem.dispose();
  return env;
}

function contactShadow() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 126);
  grad.addColorStop(0, "rgba(0,0,0,0.9)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.42)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

// Ford Transit side profile (length along +X, nose at the front).
function bodyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-3.0, 0.62);
  shape.lineTo(-3.1, 1.15);
  shape.quadraticCurveTo(-3.16, 1.5, -3.14, 2.5);
  shape.quadraticCurveTo(-3.13, 2.84, -2.8, 2.86);
  shape.lineTo(0.35, 2.9);
  shape.quadraticCurveTo(0.86, 2.9, 1.12, 2.62);
  shape.lineTo(1.6, 2.1);
  shape.lineTo(2.05, 1.86);
  shape.quadraticCurveTo(2.34, 1.78, 2.55, 1.58);
  shape.lineTo(2.92, 1.36);
  shape.quadraticCurveTo(3.12, 1.26, 3.14, 1.02);
  shape.lineTo(3.14, 0.8);
  shape.quadraticCurveTo(3.14, 0.6, 2.9, 0.6);
  shape.lineTo(-2.86, 0.6);
  shape.quadraticCurveTo(-3.0, 0.6, -3.0, 0.62);
  return shape;
}

function markerPosition(warning) {
  const z = warning.side === "left" ? -1.16 : 1.16;
  if (warning.zone === "front") return [2.0, 0.5, z];
  if (warning.zone === "rear") return [-1.95, 0.5, z];
  if (warning.zone === "fuel") return [-2.62, 1.0, -1.16];
  return [0.1, 1.72, z];
}

function buildVan() {
  const van = new THREE.Group();

  const paint = new THREE.MeshStandardMaterial({
    color: 0xe9eff5,
    metalness: 0.5,
    roughness: 0.3,
    envMapIntensity: 1.2,
    emissive: new THREE.Color(ALERT),
    emissiveIntensity: 0,
  });
  const trim = new THREE.MeshStandardMaterial({ color: 0x0d1319, metalness: 0.45, roughness: 0.62 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x0a1c26,
    metalness: 0.95,
    roughness: 0.06,
    envMapIntensity: 1.7,
  });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xc3ced8, metalness: 1, roughness: 0.16 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x080a0d, roughness: 0.95, metalness: 0.1 });
  const rim = new THREE.MeshStandardMaterial({ color: 0x98a6b3, metalness: 0.95, roughness: 0.22 });
  const head = new THREE.MeshStandardMaterial({
    color: 0xfff4dc,
    emissive: 0xfff1cf,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });
  const tail = new THREE.MeshStandardMaterial({
    color: 0x8d120e,
    emissive: 0xff2418,
    emissiveIntensity: 1.5,
    roughness: 0.3,
  });

  const add = (geometry, material, position, rotation) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    van.add(mesh);
    return mesh;
  };

  // Shell
  const shell = new THREE.ExtrudeGeometry(bodyShape(), {
    depth: 2.02,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    curveSegments: 18,
  });
  shell.translate(0, 0, -1.01);
  add(shell, paint, [0, 0, 0]);

  // Glass: cab, sliding door and rear quarter panels on both flanks.
  [
    [1.34, 2.16, 0.94, 0.6],
    [0.02, 2.16, 1.5, 0.64],
    [-2.02, 2.16, 1.46, 0.64],
  ].forEach(([x, y, width, height]) => {
    [-1.075, 1.075].forEach((z) => {
      add(new THREE.BoxGeometry(width, height, 0.03), glass, [x, y, z]);
    });
  });

  // Windshield and rear doors glass
  add(new THREE.BoxGeometry(0.74, 0.09, 1.84), glass, [1.37, 2.38, 0], [0, 0, -0.88]);
  add(new THREE.BoxGeometry(0.04, 0.5, 1.4), glass, [-3.17, 2.2, 0]);

  // Nose: grille, lights, bumper
  add(new THREE.BoxGeometry(0.08, 0.4, 1.36), trim, [3.14, 1.04, 0]);
  [0.94, 1.1].forEach((y) => add(new THREE.BoxGeometry(0.04, 0.035, 1.24), chrome, [3.19, y, 0]));
  [-0.6, 0.6].forEach((z) => add(new THREE.BoxGeometry(0.1, 0.16, 0.44), head, [3.12, 1.44, z]));
  [-0.78, 0.78].forEach((z) => add(new THREE.BoxGeometry(0.08, 0.09, 0.16), head, [3.16, 0.84, z]));
  add(new THREE.BoxGeometry(0.22, 0.34, 1.98), trim, [3.06, 0.68, 0]);

  // Tail lights and rear bumper
  [-0.78, 0.78].forEach((z) => add(new THREE.BoxGeometry(0.07, 0.56, 0.16), tail, [-3.18, 1.52, z]));
  add(new THREE.BoxGeometry(0.2, 0.32, 1.98), trim, [-3.08, 0.68, 0]);

  // Side trim, door seams, mirrors
  [-1.04, 1.04].forEach((z) => {
    add(new THREE.BoxGeometry(5.5, 0.16, 0.05), trim, [0, 0.72, z]);
    add(new THREE.BoxGeometry(0.025, 1.5, 0.03), trim, [0.98, 1.72, z]);
    add(new THREE.BoxGeometry(0.025, 1.5, 0.03), trim, [-0.72, 1.72, z]);
  });
  [-1.03, 1.03].forEach((z) => add(new THREE.BoxGeometry(0.18, 0.045, 0.05), trim, [1.74, 2.0, z]));
  [-1.16, 1.16].forEach((z) => add(new THREE.BoxGeometry(0.1, 0.24, 0.17), trim, [1.76, 2.04, z]));

  // Roof details of the camper build
  add(new THREE.BoxGeometry(2.4, 0.05, 1.5), glass, [-1.1, 2.94, 0]);
  add(new THREE.BoxGeometry(0.62, 0.1, 0.62), trim, [0.86, 2.96, 0.28]);
  add(new THREE.BoxGeometry(2.6, 0.12, 0.1), trim, [0.1, 2.6, 1.12]);

  // Wheels plus arch trim
  const wheelXs = [2.0, -1.95];
  wheelXs.forEach((x) => {
    [-1.02, 1.02].forEach((z) => {
      add(new THREE.CylinderGeometry(0.47, 0.47, 0.32, 26), rubber, [x, 0.47, z], [Math.PI / 2, 0, 0]);
      add(new THREE.CylinderGeometry(0.28, 0.28, 0.34, 22), rim, [x, 0.47, z], [Math.PI / 2, 0, 0]);
      add(new THREE.CylinderGeometry(0.09, 0.09, 0.36, 16), chrome, [x, 0.47, z], [Math.PI / 2, 0, 0]);
      add(new THREE.TorusGeometry(0.56, 0.05, 8, 26, Math.PI), trim, [x, 0.5, z * 1.01], [0, 0, 0]);
    });
  });

  // Headlight beams on the floor
  [-0.8, 0.8].forEach((z) => {
    const beam = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 0.9),
      new THREE.MeshBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.07, depthWrite: false })
    );
    beam.rotation.x = -Math.PI / 2;
    beam.position.set(4.4, 0.02, z);
    van.add(beam);
  });

  return { van, paint };
}

export default function FordTransit3D({ focus, warnings = [], className }) {
  const hostRef = useRef(null);
  const api = useRef(null);
  const latest = useRef({ focus, warnings });
  latest.current = { focus, warnings };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearAlpha(0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.environment = environmentTexture(renderer);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x7fd8ff, 1.2);
    fillLight.position.set(-7, 4, -6);
    scene.add(fillLight);
    scene.add(new THREE.HemisphereLight(0x9fdcff, 0x02060a, 0.5));

    const alertLight = new THREE.PointLight(ALERT, 0, 9);
    scene.add(alertLight);

    const { van, paint } = buildVan();
    scene.add(van);

    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 7),
      new THREE.MeshBasicMaterial({ map: contactShadow(), transparent: true, opacity: 0.85, depthWrite: false })
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.005;
    scene.add(contact);

    const grid = new THREE.GridHelper(18, 24, 0x0d3a4a, 0x07202c);
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    grid.position.y = 0.002;
    scene.add(grid);

    // Warning pins sit on the exact corner of the van that raised them.
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: ALERT, transparent: true, opacity: 0.85 });
    const dotMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3b30,
      emissive: 0xff3b30,
      emissiveIntensity: 2.6,
      roughness: 0.3,
    });
    let rings = [];

    const rebuildMarkers = (list = []) => {
      markerGroup.children.forEach((child) => child.geometry.dispose());
      markerGroup.clear();
      rings = [];
      list.forEach((warning, index) => {
        const position = markerPosition(warning);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), dotMaterial);
        dot.position.set(position[0], position[1], position[2]);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.013, 8, 36), ringMaterial);
        ring.position.set(position[0], position[1], position[2]);
        ring.userData.phase = index * 1.4;
        markerGroup.add(dot, ring);
        rings.push(ring);
      });
    };

    const state = { yaw: 0.5, pitch: 0.22, target: 0.5, locked: false, alert: false };
    let dragging = false;
    let spun = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (event) => {
      dragging = true;
      spun = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.style.cursor = "grabbing";
      host.setPointerCapture?.(event.pointerId);
    };
    const onMove = (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      state.yaw -= dx * 0.0085;
      state.pitch = Math.min(0.62, Math.max(-0.04, state.pitch + dy * 0.0032));
      if (state.locked && Math.abs(dx) > 2) state.locked = false;
    };
    const onUp = () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };

    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("pointerleave", onUp);

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
      const time = performance.now() / 1000;

      if (state.locked) {
        let diff = state.target - state.yaw;
        diff = ((diff + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        state.yaw += diff * Math.min(1, dt * 2.8);
      } else if (!dragging && !spun) {
        state.yaw += dt * 0.16;
      }

      const dist = Math.max(9.2, 11.4 / Math.max(0.45, camera.aspect));
      const elevation = state.pitch;
      camera.position.set(
        Math.sin(state.yaw) * Math.cos(elevation) * dist,
        1.3 + Math.sin(elevation) * dist,
        Math.cos(state.yaw) * Math.cos(elevation) * dist
      );
      camera.lookAt(0, 1.28, 0);

      paint.emissiveIntensity = state.alert ? 0.16 + Math.sin(time * 4) * 0.1 : 0;
      if (state.alert) alertLight.intensity = 9 + Math.sin(time * 4) * 4;

      rings.forEach((ring) => {
        ring.scale.setScalar(1 + Math.sin(time * 3 + ring.userData.phase) * 0.22);
        ring.material.opacity = 0.55 + Math.abs(Math.sin(time * 3 + ring.userData.phase)) * 0.4;
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const apply = (next) => {
      const alertSide = next.focus?.side;
      state.alert = Boolean(alertSide);
      if (alertSide) {
        state.target = SIDE_YAW[alertSide] ?? state.yaw;
        state.locked = true;
        alertLight.position.set(0, 1.5, alertSide === "left" ? -2.4 : 2.4);
      } else {
        state.locked = false;
        alertLight.intensity = 0;
      }
      rebuildMarkers(next.warnings);
    };

    apply(latest.current);

    api.current = { apply, reset: () => { state.locked = false; } };

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerleave", onUp);
      api.current = null;
      scene.traverse((node) => {
        node.geometry?.dispose();
      });
      [paint, ringMaterial, dotMaterial].forEach((material) => material.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    api.current?.apply({ focus, warnings });
  }, [focus, warnings]);

  return <div ref={hostRef} className={className} style={{ touchAction: "none" }} />;
}