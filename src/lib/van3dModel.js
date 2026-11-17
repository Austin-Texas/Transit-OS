import * as THREE from "three";

// Neon wireframe Ford Transit camper, built entirely from lines and translucent
// surfaces so the interior and the underbody stay visible from any angle.
// Everything is created per call: the stage can be unmounted (2D mode) and
// rebuilt without reusing disposed GPU resources.

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

export function buildVanModel() {
  const materials = {
    shell: new THREE.MeshBasicMaterial({
      color: 0x1b7a99,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    shellEdge: new THREE.LineBasicMaterial({ color: 0x9df0ff, transparent: true, opacity: 0.9 }),
    inner: new THREE.MeshBasicMaterial({
      color: 0x14586e,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    innerEdge: new THREE.LineBasicMaterial({ color: 0x4fbcd8, transparent: true, opacity: 0.62 }),
    frame: new THREE.LineBasicMaterial({ color: 0x2f93ae, transparent: true, opacity: 0.5 }),
    glass: new THREE.MeshBasicMaterial({
      color: 0x53d3ef,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    pad: new THREE.MeshBasicMaterial({ color: 0xff8a3d, transparent: true, opacity: 0.9 }),
    padDot: new THREE.MeshBasicMaterial({ color: 0x00ff41 }),
  };

  const group = new THREE.Group();
  const hotspots = [];

  // Real surfaces: a lit material that starts as dark tinted teal and takes its
  // high-resolution map once the texture has downloaded.
  const textured = [];
  const materialFor = (key, repeat, opacity) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x0d3346,
      roughness: 0.82,
      metalness: 0.02,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    textured.push({ material, key, repeat });
    return material;
  };

  const wire = (geometry, surface, edge, threshold = 24) => {
    const holder = new THREE.Group();
    if (surface) holder.add(new THREE.Mesh(geometry, surface));
    holder.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, threshold), edge));
    group.add(holder);
    return holder;
  };

  const box = (w, h, d, x, y, z, { outer = false, glass = false, rotation, tex } = {}) => {
    const surface = tex
      ? materialFor(tex.key, tex.repeat, tex.opacity)
      : glass
        ? materials.glass
        : outer
          ? materials.shell
          : materials.inner;
    const holder = wire(
      new THREE.BoxGeometry(w, h, d),
      surface,
      outer ? materials.shellEdge : materials.innerEdge
    );
    holder.position.set(x, y, z);
    if (rotation) holder.rotation.set(rotation[0], rotation[1], rotation[2]);
    return holder;
  };

  // Photo skins: flat panels that carry the owner's own photos once they have
  // uploaded them. Hidden until a photo exists, so the model shows its plain
  // materials until then.
  const photoPlane = (width, height, x, y, z, flip) => {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    plane.position.set(x, y, z);
    if (flip) plane.rotation.y = Math.PI;
    plane.visible = false;
    plane.userData.slot = { width, height };
    group.add(plane);
    return plane;
  };

  const skins = {
    exterior: [photoPlane(6.2, 2.2, 0, 1.75, -1.07, true), photoPlane(6.2, 2.2, 0, 1.75, 1.07, false)],
    cabin: [photoPlane(3.8, 1.75, -0.6, 1.72, -0.99, true), photoPlane(3.8, 1.75, -0.6, 1.72, 0.99, false)],
  };

  // Shell: high-roof Transit, extrudes across the width.
  const shell = new THREE.ExtrudeGeometry(bodyShape(), {
    depth: 2.02,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 1,
    curveSegments: 14,
  });
  shell.translate(0, 0, -1.01);
  wire(shell, materialFor("paint", [5, 2.4], 0.16), materials.shellEdge, 28);

  // Glazing outlines on both flanks.
  [
    [1.34, 2.16, 0.94, 0.6],
    [0.02, 2.16, 1.5, 0.64],
    [-2.02, 2.16, 1.46, 0.64],
  ].forEach(([x, y, width, height]) => {
    [-1.045, 1.045].forEach((z) => box(width, height, 0.02, x, y, z, { glass: true }));
  });
  box(0.66, 0.05, 1.74, 1.4, 2.4, 0, { glass: true, rotation: [0, 0, -0.9] });
  box(0.03, 0.5, 1.42, -3.14, 2.2, 0, { glass: true });

  // Door seams and sliding-door track.
  [-1.05, 1.05].forEach((z) => {
    box(0.02, 1.55, 0.02, 0.95, 1.75, z, { outer: true });
    box(0.02, 1.55, 0.02, -0.7, 1.75, z, { outer: true });
    box(0.02, 1.4, 0.02, 1.66, 1.72, z, { outer: true });
    box(3.4, 0.06, 0.02, 0.1, 1.0, z, { outer: true });
  });

  // Cab: dashboard, wheel, seats.
  box(0.42, 0.24, 1.7, 2.5, 1.12, 0, { tex: { key: "floor", repeat: [1.4, 0.5], opacity: 0.6 } });
  box(0.5, 0.5, 0.5, 1.95, 1.25, -0.52, { tex: { key: "fabric", repeat: [0.7, 0.7], opacity: 0.9 } });
  box(0.5, 0.5, 0.5, 1.95, 1.25, 0.52, { tex: { key: "fabric", repeat: [0.7, 0.7], opacity: 0.9 } });
  box(0.12, 0.42, 0.12, 1.85, 1.5, -0.52);
  const wheel = wire(new THREE.TorusGeometry(0.19, 0.02, 6, 18), null, materials.innerEdge, 18);
  wheel.position.set(2.18, 1.3, -0.52);
  wheel.rotation.y = Math.PI / 2;

  // Living space: floor, galley, dinette, overhead lockers.
  box(5.3, 0.04, 1.88, -0.15, 0.8, 0, { tex: { key: "floor", repeat: [4.5, 1.7], opacity: 0.92 } });
  box(2.3, 0.82, 0.46, -0.55, 1.24, -0.72, { tex: { key: "oak", repeat: [1.7, 0.9], opacity: 0.9 } });
  box(1.7, 0.86, 0.46, 0.72, 1.26, 0.72, { tex: { key: "fabric", repeat: [1.3, 0.7], opacity: 0.9 } });
  box(0.62, 0.46, 1.55, 0.02, 1.05, 0.05, { tex: { key: "oak", repeat: [1.5, 0.5], opacity: 0.85 } });
  box(0.8, 0.04, 0.66, 0.58, 1.42, 0.12, { tex: { key: "oak", repeat: [0.7, 0.55], opacity: 0.9 } });
  box(2.6, 0.3, 0.34, -0.6, 2.48, -0.78, { tex: { key: "oak", repeat: [1.9, 0.25], opacity: 0.88 } });
  box(2.6, 0.3, 0.34, -0.6, 2.48, 0.78, { tex: { key: "oak", repeat: [1.9, 0.25], opacity: 0.88 } });

  // Sleeping platform and mattress across the rear.
  box(1.86, 0.1, 1.9, -2.0, 1.9, 0, { tex: { key: "oak", repeat: [1.4, 1.4], opacity: 0.85 } });
  box(1.7, 0.18, 1.68, -2.0, 2.02, 0, { tex: { key: "fabric", repeat: [1.5, 1.5], opacity: 0.92 } });
  box(2.5, 0.03, 1.7, -0.9, 2.62, 0, { tex: { key: "headliner", repeat: [2.2, 1.5], opacity: 0.8 } });
  box(0.5, 0.07, 0.5, 0.35, 2.92, 0.16, { outer: true });

  // Chassis rails, cross members and rear axle.
  [-0.58, 0.58].forEach((z) => box(5.5, 0.08, 0.09, 0, 0.5, z, { outer: true }));
  [-2.4, -1.2, 0.2, 1.6].forEach((x) => box(0.08, 0.06, 1.3, x, 0.48, 0, { outer: true }));
  const axle = wire(new THREE.CylinderGeometry(0.06, 0.06, 1.9, 10), null, materials.frame, 18);
  axle.position.set(-1.95, 0.47, 0);
  axle.rotation.x = Math.PI / 2;

  // Wheels.
  [
    [2.0, -1.03],
    [2.0, 1.03],
    [-1.95, -1.03],
    [-1.95, 1.03],
  ].forEach(([x, z]) => {
    const tyre = wire(new THREE.TorusGeometry(0.44, 0.08, 6, 22), null, materials.shellEdge, 18);
    tyre.position.set(x, 0.5, z);
    const rim = wire(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 12), null, materials.innerEdge, 18);
    rim.position.set(x, 0.5, z);
    rim.rotation.x = Math.PI / 2;
  });

  // Underbody: fresh water tank at the spare-tyre carrier, heat pad beneath it.
  const tank = wire(new THREE.CylinderGeometry(0.29, 0.29, 1.0, 18), materials.inner, materials.innerEdge, 20);
  tank.position.set(-2.35, 0.42, 0);
  tank.rotation.x = Math.PI / 2;
  [-0.34, 0.34].forEach((z) => box(0.68, 0.03, 0.06, -2.35, 0.66, z, { outer: true }));

  const carrier = wire(new THREE.TorusGeometry(0.52, 0.02, 5, 24), null, materials.frame, 18);
  carrier.position.set(-2.3, 0.2, 0);
  carrier.rotation.x = Math.PI / 2;

  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.035, 0.84), materials.pad);
  pad.position.set(-2.35, 0.16, 0);
  group.add(pad);
  const padEdges = new THREE.LineSegments(new THREE.EdgesGeometry(pad.geometry), materials.shellEdge);
  padEdges.position.copy(pad.position);
  group.add(padEdges);

  // Heat-pad status dot, readable from below.
  const padDot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), materials.padDot);
  padDot.position.set(-2.35, 0.13, 0.44);
  group.add(padDot);

  // House battery, strapped to the floor between the chassis rails.
  box(0.56, 0.26, 0.72, -0.7, 0.62, 0.34, { tex: { key: "floor", repeat: [0.6, 0.4], opacity: 0.7 } });

  // Invisible tap targets: each one opens its own readings on the dashboard.
  const hotspot = (key, [x, y, z], radius) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 10, 10),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    mesh.position.set(x, y, z);
    mesh.userData.hotspot = key;
    group.add(mesh);
    hotspots.push(mesh);
  };

  hotspot("heat_pad", [-2.35, 0.14, 0], 0.24);
  hotspot("water_tank", [-2.35, 0.46, 0], 0.42);
  hotspot("battery", [-0.7, 0.62, 0.34], 0.42);
  hotspot("engine", [2.45, 1.05, 0], 0.62);
  hotspot("climate", [0.35, 2.86, 0.16], 0.46);
  hotspot("cabin", [-2.0, 2.05, 0], 0.72);

  // Small markers so the tank and battery are findable before the first tap.
  [
    [0x00f0ff, -2.35, 0.44, 0.52],
    [0x00ff41, -0.7, 0.5, 0.74],
  ].forEach(([color, x, y, z]) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 12, 12),
      new THREE.MeshBasicMaterial({ color })
    );
    dot.position.set(x, y, z);
    group.add(dot);
  });

  return {
    group,
    hotspots,
    padMaterial: materials.pad,
    padDotMaterial: materials.padDot,
    padDot,
    textured,
    skins,
  };
}

// Drops the downloaded maps onto the surfaces that asked for them. Each surface
// gets its own clone so it can repeat at its own scale without affecting the
// others. Returns the clones, which the stage disposes with the scene.
export function applyVanTextures(entries, textures) {
  const applied = [];
  entries.forEach(({ material, key, repeat }) => {
    const base = textures[key];
    if (!base) return;
    const map = base.clone();
    map.needsUpdate = true;
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeat[0], repeat[1]);
    map.anisotropy = base.anisotropy;
    material.map = map;
    material.color.set(0xffffff);
    material.needsUpdate = true;
    applied.push(map);
  });
  return applied;
}