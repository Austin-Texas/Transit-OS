import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildVanModel } from "@/lib/van3dModel";
import { VAN_SKIN_IMAGE } from "@/lib/van";

const RED = 0xff3131;
const GREEN = 0x00ff41;

// Camera angle that puts a fault in view: the flank it sits on, angled toward
// the corner it belongs to. Underbody faults drop the camera below the van.
function targetYawFor(focus) {
  const side = focus?.side === "left" ? "left" : "right";
  const base = side === "left" ? Math.PI : 0;
  const corner = focus?.zone === "front" ? 1 : focus?.zone === "rear" || focus?.zone === "fuel" ? -1 : 0;
  return base + (side === "right" ? corner : -corner) * 0.6;
}

function markerPosition(warning) {
  const z = warning.side === "left" ? -1.12 : 1.12;
  if (warning.zone === "front") return [2.0, 0.44, z];
  if (warning.zone === "rear") return [-1.95, 0.44, z];
  if (warning.zone === "fuel") return [-2.62, 0.95, -1.12];
  if (warning.zone === "underbody") return [-2.35, 0.14, 0.46];
  return [0.1, 1.74, z];
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// The black callout box from the reference view, drawn into a canvas sprite so
// it always faces the camera.
function createTag() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.center.set(0, 0.5);
  sprite.scale.set(1.95, 0.49, 1);
  sprite.renderOrder = 20;
  sprite.userData.canvas = canvas;
  sprite.userData.texture = texture;
  return sprite;
}

function paintTag(sprite, text, alert) {
  const { canvas, texture } = sprite.userData;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  roundRect(ctx, 3, 12, 506, 104, 26);
  ctx.fillStyle = "rgba(4, 10, 16, 0.84)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(150, 226, 255, 0.34)";
  ctx.stroke();
  ctx.fillStyle = alert ? "#ff3b30" : "#00ff41";
  ctx.fillRect(22, 42, 7, 44);
  ctx.font = "600 40px Inter, Arial, sans-serif";
  ctx.fillStyle = "#eaf7ff";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 46, 66);
  texture.needsUpdate = true;
}

export default function FordTransit3D({ focus, warnings = [], status, className, onReady, onTip }) {
  const hostRef = useRef(null);
  const api = useRef(null);
  const tipRef = useRef(onTip);
  tipRef.current = onTip;
  const latest = useRef({ focus, warnings, status });
  latest.current = { focus, warnings, status };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      onReady?.("failed");
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearAlpha(0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

    const { group: van, hotspots, padMaterial, padDotMaterial, skinMaterial } = buildVanModel();
    scene.add(van);

    // The Transit diagnostic render is the van's look, wrapped on both flanks.
    new THREE.TextureLoader().load(
      VAN_SKIN_IMAGE,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        skinMaterial.map = texture;
        skinMaterial.opacity = 0.92;
        skinMaterial.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // Status callouts, as in the reference: one on the rear cabin, one on the
    // habitation panel.
    const rearTag = createTag();
    rearTag.position.set(-0.55, 2.3, -1.12);
    const rearDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 14, 14),
      new THREE.MeshBasicMaterial({ color: RED })
    );
    rearDot.position.copy(rearTag.position);
    const cabinTag = createTag();
    cabinTag.position.set(0.8, 1.28, 1.1);
    const cabinDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 14, 14),
      new THREE.MeshBasicMaterial({ color: GREEN })
    );
    cabinDot.position.copy(cabinTag.position);
    scene.add(rearTag, rearDot, cabinTag, cabinDot);

    const updateTags = () => {
      const rearAlert = latest.current.warnings.length > 0;
      paintTag(rearTag, rearAlert ? "REAR CABIN" : "REAR CABIN OK", rearAlert);
      rearDot.material.color.set(rearAlert ? RED : GREEN);
      const temp = Number(latest.current.status?.cabin_temp ?? 72);
      const cabinAlert = temp < 58 || temp > 82;
      paintTag(cabinTag, cabinAlert ? "CABIN FAULT" : "CABIN OK", cabinAlert);
      cabinDot.material.color.set(cabinAlert ? RED : GREEN);
    };

    const applyHeat = (fault) => {
      padMaterial.color.set(fault ? 0xff2f2f : 0xff8a3d);
      padDotMaterial.color.set(fault ? 0xff2f2f : 0x00ff41);
    };

    // Warning pins on the corners that raised them.
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    const pinDotMaterial = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const pinRingMaterial = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0.8 });
    let rings = [];

    const rebuildPins = (list = []) => {
      pinGroup.children.forEach((child) => child.geometry.dispose());
      pinGroup.clear();
      rings = [];
      list
        .filter((warning) => warning.zone !== "underbody")
        .forEach((warning, index) => {
          const position = markerPosition(warning);
          const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), pinDotMaterial);
          dot.position.set(position[0], position[1], position[2]);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 30), pinRingMaterial);
          ring.position.copy(dot.position);
          ring.userData.phase = index * 1.4;
          pinGroup.add(dot, ring);
          rings.push(ring);
        });
    };

    const state = {
      yaw: 0.6,
      pitch: 0.2,
      yawTarget: 0.6,
      pitchTarget: 0.2,
      snap: false,
      velocity: 0,
    };
    let dragging = false;
    let spun = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let hovered = null;

    const hitTest = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(hotspots, false)[0];
      return hit ? hit.object : null;
    };

    const tipFor = (object, event) => {
      if (!object) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      const fault = Boolean(latest.current.status?.tank_heater_fault);
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        title: fault ? "Heat pad malfunction" : "Heat pad OK",
        detail: fault
          ? "Hardware fault: pad under the fresh tank · software: heater controller not responding"
          : "Hardware: heat pad nominal · software: heater controller online",
        tone: fault ? "alert" : "ok",
      };
    };

    const onDown = (event) => {
      dragging = true;
      spun = true;
      moved = 0;
      state.snap = false;
      state.velocity = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.style.cursor = "grabbing";
      host.setPointerCapture?.(event.pointerId);
      tipRef.current?.(null);
    };

    const onMove = (event) => {
      if (!dragging) {
        const object = hitTest(event);
        if (object !== hovered) {
          hovered = object;
          renderer.domElement.style.cursor = object ? "pointer" : "grab";
          tipRef.current?.(tipFor(object, event));
        } else if (object) {
          tipRef.current?.(tipFor(object, event));
        }
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      state.yaw -= dx * 0.0085;
      state.velocity = -dx * 0.0085;
      state.pitch = Math.min(1.05, Math.max(-0.95, state.pitch + dy * 0.0034));
      if (Math.abs(dx) > 2) state.snap = false;
    };

    const onUp = (event) => {
      const wasDragging = dragging;
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (event?.type === "pointerleave" || event?.type === "pointercancel") {
        hovered = null;
        tipRef.current?.(null);
        return;
      }
      if (wasDragging && moved < 8) {
        // A tap on the heat pad keeps its readout open, even on a phone.
        const object = hitTest(event);
        if (object) tipRef.current?.(tipFor(object, event));
        hovered = object;
      }
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
    let reported = false;

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = performance.now() / 1000;

      if (state.snap && !dragging) {
        let diff = state.yawTarget - state.yaw;
        diff = ((diff + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        state.yaw += diff * Math.min(1, dt * 3.6);
        state.pitch += (state.pitchTarget - state.pitch) * Math.min(1, dt * 3.2);
      } else if (!dragging) {
        if (Math.abs(state.velocity) > 0.0006) {
          state.yaw += state.velocity;
          state.velocity *= 0.93;
        } else if (!spun) {
          state.yaw += dt * 0.15;
        }
      }

      // Frame the van to the stage: as wide as the panel allows, never clipped.
      const halfFov = THREE.MathUtils.degToRad(16);
      const horizontal = Math.tan(halfFov) * Math.max(0.4, camera.aspect);
      const dist = Math.min(16, Math.max(3.5 / horizontal, 1.95 / Math.tan(halfFov)));
      camera.position.set(
        Math.sin(state.yaw) * Math.cos(state.pitch) * dist,
        1.35 + Math.sin(state.pitch) * dist,
        Math.cos(state.yaw) * Math.cos(state.pitch) * dist
      );
      camera.lookAt(0, 1.3, 0);

      const pulse = 0.55 + Math.abs(Math.sin(time * 3)) * 0.4;
      rings.forEach((ring) => {
        ring.scale.setScalar(1 + Math.sin(time * 3 + ring.userData.phase) * 0.22);
        ring.material.opacity = pulse;
      });
      rearDot.scale.setScalar(1 + Math.sin(time * 2.4) * 0.18);
      cabinDot.scale.setScalar(1 + Math.sin(time * 2.4 + 1) * 0.18);
      padMaterial.opacity = 0.72 + Math.sin(time * 2) * 0.18;

      renderer.render(scene, camera);
      if (!reported) {
        reported = true;
        onReady?.("ready");
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const applyFocus = (next) => {
      const sided = next?.side === "left" || next?.side === "right";
      if (!sided) {
        state.snap = false;
        return;
      }
      state.yawTarget = targetYawFor(next);
      state.pitchTarget = next.zone === "underbody" ? -0.62 : 0.2;
      state.snap = true;
    };

    updateTags();
    applyHeat(Boolean(latest.current.status?.tank_heater_fault));
    applyFocus(latest.current.focus);
    rebuildPins(latest.current.warnings);

    api.current = {
      focus: applyFocus,
      warnings: (list) => {
        rebuildPins(list);
        updateTags();
      },
      tags: updateTags,
      heat: applyHeat,
    };

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerleave", onUp);
      host.removeEventListener("pointermove", onMove);
      api.current = null;
      tipRef.current?.(null);
      const disposed = new Set();
      scene.traverse((node) => {
        if (node.geometry) node.geometry.dispose();
        const list = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
        list.forEach((material) => {
          if (disposed.has(material)) return;
          disposed.add(material);
          if (material.map) material.map.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const warningKey = warnings.map((warning) => warning.id).join("|");
  const fault = Boolean(status?.tank_heater_fault);

  useEffect(() => {
    api.current?.focus(focus);
  }, [focus]);

  useEffect(() => {
    api.current?.warnings(latest.current.warnings);
  }, [warningKey]);

  useEffect(() => {
    api.current?.tags();
  }, [warningKey, status?.cabin_temp]);

  useEffect(() => {
    api.current?.heat(fault);
  }, [fault]);

  return <div ref={hostRef} className={className} style={{ touchAction: "none" }} />;
}