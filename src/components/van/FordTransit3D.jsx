import { useEffect, useRef } from "react";
import * as THREE from "three";
import { applyVanTextures, buildVanModel } from "@/lib/van3dModel";
import { loadVanTextures } from "@/lib/vanTextures";
import useVanPhotos from "@/hooks/useVanPhotos";
import { heatPad } from "@/lib/heatPad";
import { TANK_CAPACITY_GAL, gallonsFrom } from "@/lib/van";

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

const reading = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const show = (value, digits, unit) =>
  value === null ? "—" : `${value.toFixed(digits)}${unit ? ` ${unit}` : ""}`;

// What hovering each tap target says, read straight from the latest telemetry:
// a compact list of raw readings rather than a sentence.
function hotspotTip(key, status) {
  if (key === "water_tank") {
    const level = reading(status?.fresh_water);
    return {
      title: "Fresh water",
      status: level === null ? "No report" : level <= 20 ? "Low" : "Nominal",
      tone: level === null ? "muted" : level <= 20 ? "alert" : "ok",
      rows: [
        { k: "Level", v: level === null ? "—" : `${level.toFixed(1)} %` },
        {
          k: "Volume",
          v: level === null ? "—" : `${gallonsFrom(level, TANK_CAPACITY_GAL.fresh_water).toFixed(1)} gal`,
        },
        { k: "Pump", v: status?.water_pump_on ? "On" : "Off" },
        { k: "Heat pad", v: heatPad(status).label },
      ],
    };
  }

  if (key === "battery") {
    const volts = reading(status?.battery_voltage);
    const percent = reading(status?.battery_percent);
    const solar = reading(status?.solar_w);
    const load = reading(status?.load_w);
    return {
      title: "Electrical system",
      status: percent === null ? "No report" : percent <= 30 ? "Low charge" : "Nominal",
      tone: percent === null ? "muted" : percent <= 30 ? "alert" : "ok",
      rows: [
        { k: "Starter", v: show(volts, 2, "V") },
        { k: "House", v: percent === null ? "—" : `${Math.round(percent)} %` },
        { k: "Solar in", v: show(solar, 0, "W") },
        { k: "Load", v: show(load, 0, "W") },
      ],
    };
  }

  if (key === "engine") {
    const miles = reading(status?.odometer);
    const fuel = reading(status?.fuel_percent);
    return {
      title: "Engine & drivetrain",
      status: status?.active_mode === "driving" ? "Running" : "Parked",
      tone: "ok",
      rows: [
        {
          k: "Odometer",
          v: miles === null ? "—" : `${Math.round(miles).toLocaleString("en-US")} mi`,
        },
        { k: "Fuel", v: fuel === null ? "—" : `${Math.round(fuel)} %` },
        { k: "Starter", v: show(reading(status?.battery_voltage), 2, "V") },
        { k: "Mode", v: status?.active_mode ?? "—" },
      ],
    };
  }

  if (key === "climate") {
    return {
      title: "Climate",
      status: status?.climate_mode === "off" ? "Off" : "Running",
      tone: status?.climate_mode === "off" ? "muted" : "ok",
      rows: [
        { k: "Cabin", v: show(reading(status?.climate_temp), 0, "°F") },
        { k: "Set point", v: show(reading(status?.climate_set), 0, "°F") },
        { k: "Outside", v: show(reading(status?.exterior_temp), 0, "°F") },
        { k: "Mode", v: status?.climate_mode ?? "—" },
      ],
    };
  }

  if (key === "cabin") {
    const humidity = reading(status?.humidity);
    return {
      title: "Cabin",
      status: status?.locks_locked === false ? "Unlocked" : "Secured",
      tone: status?.locks_locked === false ? "alert" : "ok",
      rows: [
        { k: "Interior", v: show(reading(status?.cabin_temp ?? status?.climate_temp), 0, "°F") },
        { k: "Humidity", v: humidity === null ? "—" : `${Math.round(humidity)} %` },
        { k: "Lights", v: status?.lights_on === false ? "Off" : "On" },
        { k: "Locks", v: status?.locks_locked === false ? "Unlocked" : "Locked" },
      ],
    };
  }

  const pad = heatPad(status);
  return {
    title: "Heat pad",
    status: pad.label,
    tone: pad.key === "fault" ? "alert" : pad.key === "unknown" ? "muted" : "ok",
    rows: [
      { k: "Pad temp", v: show(pad.temp, 1, "°F") },
      { k: "Set point", v: show(pad.target, 0, "°F") },
      { k: "Draw", v: show(pad.watts, 0, "W") },
      { k: "Reported", v: pad.reportedAt ?? "—" },
    ],
  };
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

export default function FordTransit3D({
  focus,
  warnings = [],
  status,
  mode = "3d",
  className,
  onReady,
  onTip,
  onPick,
}) {
  const hostRef = useRef(null);
  const api = useRef(null);
  const tipRef = useRef(onTip);
  tipRef.current = onTip;
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const photos = useVanPhotos(status);
  const latest = useRef({ focus, warnings, status, photos, mode });
  latest.current = { focus, warnings, status, photos, mode };

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

    const {
      group: van,
      hotspots,
      materials,
      padMaterial,
      padDotMaterial,
      padDot,
      textured,
      skins,
    } = buildVanModel();
    scene.add(van);

    // Light for the textured panels: a soft sky fill, a warm key from the front
    // and a cool neon rim from behind, so oak and fabric read as real surfaces.
    scene.add(new THREE.HemisphereLight(0xcdeef8, 0x06131d, 1.25));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(4.5, 6, 5);
    const rimLight = new THREE.DirectionalLight(0x6fe2f5, 0.85);
    rimLight.position.set(-5, 3, -4.5);
    scene.add(keyLight, rimLight);

    // The maps download in the background; the stage shows its wireframe until
    // they land, then dresses every panel at once.
    let disposed = false;
    const loadedMaps = [];
    loadVanTextures(renderer).then((textures) => {
      if (disposed) {
        Object.values(textures).forEach((texture) => texture.dispose());
        return;
      }
      Object.values(textures).forEach((texture) => loadedMaps.push(texture));
      applyVanTextures(textured, textures);
    });

    // The owner's photos skin the panels: the exterior shot on both flanks, the
    // cabin shot along the living space. Each panel stays hidden until its photo
    // is available, so an empty slot simply shows the real materials.
    const photoLoader = new THREE.TextureLoader();
    photoLoader.setCrossOrigin("anonymous");
    const photoAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const applyPhoto = (config) => {
      Object.entries(skins).forEach(([slot, planes]) => {
        const url = config?.[slot];
        planes.forEach((plane) => {
          if (!url) {
            plane.visible = false;
            return;
          }
          if (plane.userData.url === url) {
            plane.visible = true;
            return;
          }
          photoLoader
            .loadAsync(url)
            .then((texture) => {
              if (disposed) {
                texture.dispose();
                return;
              }
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = photoAnisotropy;
              const aspect = (texture.image?.width || 16) / (texture.image?.height || 9);
              const slot = plane.userData.slot;
              const height = Math.min(slot.height, slot.width / aspect);
              plane.scale.set(height * aspect, height, 1);
              if (plane.material.map) plane.material.map.dispose();
              plane.material.map = texture;
              plane.material.opacity = slot === "cabin" ? 0.74 : 0.82;
              plane.material.needsUpdate = true;
              plane.userData.url = url;
              plane.visible = true;
            })
            .catch(() => {});
        });
      });
    };

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

    // The pad is tinted by what the controller reported: heating amber, holding
    // cyan, idle dim, fault red, and grey while the sensor is silent.
    const PAD_COLORS = {
      heating: 0xff8a3d,
      holding: 0x00f0ff,
      idle: 0x2f93ae,
      fault: 0xff2f2f,
      unknown: 0x24596b,
    };
    let faulted = heatPad(latest.current.status).key === "fault";

    // The hotspot the fault belongs to: the pad sits under the spare-tire tank.
    // A failure marks that exact spot with pulsing red rings on the pad and a
    // tag that reads through the body, so it is visible before the camera
    // swings underneath.
    const padAlert = new THREE.Group();
    padAlert.visible = faulted;
    const padRings = [0.36, 0.6].map((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.05, 40),
        new THREE.MeshBasicMaterial({
          color: 0xff2f2f,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          depthTest: false,
          depthWrite: false,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(-2.35, 0.125, 0);
      ring.renderOrder = 18;
      ring.userData.phase = index * 1.5;
      padAlert.add(ring);
      return ring;
    });
    const padAlertTag = createTag();
    padAlertTag.position.set(-3.15, 0.46, 0.92);
    paintTag(padAlertTag, "HEAT PAD FAILURE", true);
    padAlert.add(padAlertTag);
    scene.add(padAlert);

    const applyHeat = (key) => {
      faulted = key === "fault";
      padAlert.visible = faulted;
      padMaterial.color.set(PAD_COLORS[key] ?? PAD_COLORS.unknown);
      padDotMaterial.color.set(key === "fault" ? 0xff2f2f : key === "unknown" ? 0x6b8794 : 0x00ff41);
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

    // Diagnostic modes: the same model, dressed five ways. Base values are kept
    // once so every switch starts from the untouched wireframe.
    const matBase = new Map();
    const texturedMaterials = new Set(textured.map((entry) => entry.material));
    van.traverse((node) => {
      const list = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
      list.forEach((material) => {
        if (matBase.has(material) || material === padMaterial || material === padDotMaterial) return;
        matBase.set(material, {
          opacity: material.opacity,
          color: texturedMaterials.has(material) ? new THREE.Color(0xffffff) : material.color.clone(),
        });
      });
    });

    // Systems: a faint halo around every monitored point on the van.
    const haloGroup = new THREE.Group();
    haloGroup.visible = false;
    van.add(haloGroup);
    const halos = hotspots.map((spot) => {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(spot.geometry.parameters.radius, 18, 12),
        new THREE.MeshBasicMaterial({
          color: 0x64d2ff,
          wireframe: true,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
        })
      );
      halo.position.copy(spot.position);
      haloGroup.add(halo);
      return halo;
    });

    // Flow: water from the tank to the galley, power from the battery to the
    // roof unit, each drawn as a route with dots travelling along it.
    const flowGroup = new THREE.Group();
    flowGroup.visible = false;
    van.add(flowGroup);
    const travellers = [];
    [
      {
        color: 0x00f0ff,
        speed: 0.16,
        points: [
          [-2.35, 0.42, 0],
          [-1.7, 0.62, -0.2],
          [-0.95, 1.05, -0.5],
          [-0.55, 1.3, -0.72],
        ],
      },
      {
        color: 0x00ff41,
        speed: 0.12,
        points: [
          [-0.7, 0.62, 0.34],
          [-0.6, 1.3, 0.4],
          [-0.1, 2.1, 0.3],
          [0.35, 2.72, 0.16],
          [0.35, 2.94, 0.16],
        ],
      },
    ].forEach((route) => {
      const curve = new THREE.CatmullRomCurve3(
        route.points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
      );
      flowGroup.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
          new THREE.LineBasicMaterial({ color: route.color, transparent: true, opacity: 0.5 })
        )
      );
      [0, 0.34, 0.67].forEach((offset) => {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 10, 10),
          new THREE.MeshBasicMaterial({ color: route.color })
        );
        dot.userData = { curve, offset, speed: route.speed };
        flowGroup.add(dot);
        travellers.push(dot);
      });
    });

    const applyMode = (next) => {
      matBase.forEach((base, material) => {
        material.opacity = base.opacity;
        material.color.copy(base.color);
      });
      haloGroup.visible = next === "systems";
      flowGroup.visible = next === "flow";

      if (next === "systems") {
        texturedMaterials.forEach((material) => {
          material.opacity = Math.min(material.opacity, 0.07);
        });
        materials.shell.opacity = 0.03;
        materials.inner.opacity = 0.06;
        materials.glass.opacity = 0.05;
        materials.shellEdge.opacity = 0.28;
        materials.innerEdge.opacity = 0.9;
        materials.frame.opacity = 0.85;
      } else if (next === "xray") {
        texturedMaterials.forEach((material) => {
          material.opacity = Math.min(material.opacity, 0.14);
        });
        materials.shell.opacity = 0.015;
        materials.shellEdge.opacity = 0.16;
        materials.inner.opacity = 0.34;
        materials.innerEdge.opacity = 1;
        materials.glass.opacity = 0.05;
      } else if (next === "thermal") {
        textured.forEach(({ material, key }) => {
          material.color.set(key === "paint" ? 0xff4d17 : 0x123fa8);
          material.opacity = Math.max(material.opacity, 0.9);
        });
        materials.shell.color.set(0xff4d17);
        materials.shell.opacity = 0.22;
        materials.inner.color.set(0x1840c4);
        materials.inner.opacity = 0.28;
        materials.shellEdge.color.set(0xffb03a);
        materials.innerEdge.color.set(0x76d8ff);
      }
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

    // Which system a point on the van belongs to. The invisible tap spheres win;
    // anywhere else on the body resolves from the point itself, so every panel,
    // wheel and roof fitting is clickable.
    const zoneFor = (hit) => {
      if (hit.object.userData.hotspot) return hit.object.userData.hotspot;
      const local = van.worldToLocal(hit.point.clone());
      if (local.y < 0.42 && local.x < -1.2) return "heat_pad";
      if (local.x > 1.75) return "engine";
      if (local.y > 2.55) return "climate";
      if (local.x < -1.4) return local.y > 1.4 ? "cabin" : "water_tank";
      if (local.y < 0.9) return "battery";
      return "cabin";
    };

    const hitTest = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      const hit =
        raycaster.intersectObjects(hotspots, false)[0] || raycaster.intersectObject(van, true)[0];
      return hit ? zoneFor(hit) : null;
    };

    const tipFor = (key, event) => {
      if (!key) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        // Kept a bubble's width inside the stage, so it never clips at the edge.
        x: Math.min(Math.max(event.clientX - rect.left, 96), Math.max(96, rect.width - 96)),
        // And far enough below the top edge for the bubble to sit above the pin.
        y: Math.max(event.clientY - rect.top, 122),
        ...hotspotTip(key, latest.current.status),
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
        const key = hitTest(event);
        if (key !== hovered) {
          hovered = key;
          renderer.domElement.style.cursor = key ? "pointer" : "grab";
          tipRef.current?.(tipFor(key, event));
        } else if (key) {
          tipRef.current?.(tipFor(key, event));
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
        // A tap on any part of the van opens that system.
        const key = hitTest(event);
        if (key) {
          tipRef.current?.(tipFor(key, event));
          pickRef.current?.(key);
        }
        hovered = key;
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
        // Returning from an underbody view: once level again, wander freely.
        if (!focusHeld && Math.abs(diff) < 0.01 && Math.abs(state.pitchTarget - state.pitch) < 0.01) {
          state.snap = false;
        }
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
      // A faulted heat pad pulses, so the red dot is easy to find under the van.
      padDot.scale.setScalar(faulted ? 1.5 + Math.abs(Math.sin(time * 3.4)) * 0.7 : 1);
      if (padAlert.visible) {
        padRings.forEach((ring) => {
          const wave = (Math.sin(time * 2.6 + ring.userData.phase) + 1) / 2;
          ring.scale.setScalar(1 + wave * 0.32);
          ring.material.opacity = 0.32 + (1 - wave) * 0.55;
        });
      }

      // System halos breathe, and the flow dots run their routes.
      if (haloGroup.visible) {
        halos.forEach((halo, index) => {
          halo.material.opacity = 0.09 + (Math.sin(time * 2 + index * 0.9) + 1) * 0.09;
        });
      }
      if (flowGroup.visible) {
        travellers.forEach((dot) => {
          const t = (time * dot.userData.speed + dot.userData.offset) % 1;
          dot.position.copy(dot.userData.curve.getPointAt(t));
        });
      }

      renderer.render(scene, camera);
      if (!reported) {
        reported = true;
        onReady?.("ready");
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    let focusHeld = false;

    const applyFocus = (next) => {
      const sided = next?.side === "left" || next?.side === "right";
      if (!sided) {
        // Leaving a fault view: climb back to the normal eye line.
        if (!focusHeld) return;
        focusHeld = false;
        state.yawTarget = state.yaw;
        state.pitchTarget = 0.2;
        state.snap = true;
        return;
      }
      focusHeld = true;
      state.yawTarget = targetYawFor(next);
      state.pitchTarget = next.zone === "underbody" ? -0.62 : 0.2;
      state.snap = true;
    };

    updateTags();
    applyHeat(heatPad(latest.current.status).key);
    applyFocus(latest.current.focus);
    rebuildPins(latest.current.warnings);
    applyPhoto(latest.current.photos);
    applyMode(latest.current.mode);

    api.current = {
      focus: applyFocus,
      warnings: (list) => {
        rebuildPins(list);
        updateTags();
      },
      tags: updateTags,
      heat: applyHeat,
      photo: applyPhoto,
      mode: applyMode,
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
      disposed = true;
      loadedMaps.forEach((texture) => texture.dispose());
      const disposedMaterials = new Set();
      scene.traverse((node) => {
        if (node.geometry) node.geometry.dispose();
        const list = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
        list.forEach((material) => {
          if (disposedMaterials.has(material)) return;
          disposedMaterials.add(material);
          if (material.map) material.map.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const warningKey = warnings.map((warning) => warning.id).join("|");
  const padKey = heatPad(status).key;
  const photoKey = `${photos.exterior ?? ""}|${photos.cabin ?? ""}`;

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
    api.current?.heat(padKey);
  }, [padKey]);

  useEffect(() => {
    api.current?.photo(latest.current.photos);
  }, [photoKey]);

  useEffect(() => {
    api.current?.mode(mode);
    // A diagnostic mode needs the model, so the photo view steps aside.
    if (mode !== "3d") tipRef.current?.(null);
  }, [mode]);

  return <div ref={hostRef} className={className} style={{ touchAction: "none" }} />;
}