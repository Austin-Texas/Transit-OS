import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LOGO_SVG_URL } from "@/lib/startupStages";

/* ------------------------------------------------------------------ */
/* small math helpers                                                  */
/* ------------------------------------------------------------------ */

const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a, b, p) => a + (b - a) * p;
const span = (t, start, end) => smooth((t - start) / (end - start));

function track(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i += 1) {
    const [t1, v1] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, smooth((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
}

/* ------------------------------------------------------------------ */
/* canvas textures                                                     */
/* ------------------------------------------------------------------ */

const SANS = '-apple-system, "SF Pro Display", "Helvetica Neue", Inter, Arial, sans-serif';

function canvasTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d"), canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function spacedText(ctx, text, cx, cy, font, spacingEm, fill, glow, blur) {
  ctx.font = font;
  ctx.textBaseline = "middle";
  const size = Number(font.match(/(\d+)px/)?.[1] ?? 100);
  const spacing = size * spacingEm;
  const widths = [...text].map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, w) => sum + w, 0) + spacing * (text.length - 1);
  let x = cx - total / 2;
  ctx.fillStyle = fill;
  ctx.shadowColor = glow;
  ctx.shadowBlur = blur;
  [...text].forEach((char, index) => {
    ctx.fillText(char, x, cy);
    x += widths[index] + spacing;
  });
}

function wordmarkTexture() {
  return canvasTexture(1024, 256, (ctx, w, h) =>
    spacedText(
      ctx,
      "TPMCS",
      w / 2,
      h / 2,
      `800 150px ${SANS}`,
      0.36,
      "#ffffff",
      "rgba(120,220,255,0.85)",
      28,
    ),
  );
}

function presentsTexture() {
  return canvasTexture(1024, 160, (ctx, w, h) =>
    spacedText(ctx, "PRESENTS", w / 2, h / 2, `500 74px ${SANS}`, 0.62, "#d8e7f5", "rgba(90,200,255,0.5)", 18),
  );
}

function taglineTexture() {
  return canvasTexture(1024, 128, (ctx, w, h) =>
    spacedText(
      ctx,
      "INTELLIGENT VEHICLE OPERATING SYSTEM",
      w / 2,
      h / 2,
      `500 54px ${SANS}`,
      0.2,
      "#cfe3f4",
      "rgba(80,190,255,0.45)",
      14,
    ),
  );
}

function titleTexture() {
  return canvasTexture(1280, 420, (ctx, w, h) => {
    ctx.textBaseline = "middle";
    ctx.font = `italic 900 250px ${SANS}`;
    const transit = ctx.measureText("Transit").width;
    const os = ctx.measureText("OS").width;
    let x = (w - (transit + os)) / 2;
    ctx.fillStyle = "#f8fbff";
    ctx.shadowColor = "rgba(150,190,255,0.6)";
    ctx.shadowBlur = 26;
    ctx.fillText("Transit", x, h / 2);
    x += transit;
    ctx.fillStyle = "#00e6ff";
    ctx.shadowColor = "rgba(0,230,255,0.95)";
    ctx.shadowBlur = 60;
    ctx.fillText("OS", x, h / 2);
  });
}

const radialGlowTexture = () =>
  canvasTexture(256, 256, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(120,225,255,0.55)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  });

const streakTexture = () =>
  canvasTexture(512, 64, (ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.42, "rgba(90,200,255,0.75)");
    gradient.addColorStop(0.5, "rgba(220,250,255,1)");
    gradient.addColorStop(0.58, "rgba(150,120,255,0.75)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "destination-in";
    const falloff = ctx.createLinearGradient(0, 0, 0, h);
    falloff.addColorStop(0, "rgba(0,0,0,0)");
    falloff.addColorStop(0.5, "rgba(0,0,0,1)");
    falloff.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = falloff;
    ctx.fillRect(0, 0, w, h);
  });

const dotTexture = () =>
  canvasTexture(64, 64, (ctx, w) => {
    const gradient = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(150,220,255,0.6)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, w);
  });

/* ------------------------------------------------------------------ */
/* environment                                                         */
/* ------------------------------------------------------------------ */

function buildEnvironment(renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#02040a";
  ctx.fillRect(0, 0, 512, 256);
  [
    ["#0a7dff", 80, 70, 170],
    ["#7c3aed", 400, 55, 150],
    ["#22d3ee", 260, 210, 210],
    ["#3b2bd6", 30, 205, 140],
  ].forEach(([color, x, y, r]) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(texture).texture;
  pmrem.dispose();
  texture.dispose();
  return env;
}

/* ------------------------------------------------------------------ */
/* energy rings                                                        */
/* ------------------------------------------------------------------ */

function energyRing({ inner, outer, color, speed, intensity }) {
  const geometry = new THREE.RingGeometry(inner, outer, 128, 1);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uSpeed: { value: speed },
    },
    vertexShader: `
      varying vec2 vPos;
      void main() {
        vPos = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSpeed;
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec2 vPos;
      void main() {
        float angle = atan(vPos.y, vPos.x);
        float travel = 0.5 + 0.5 * sin(angle * 3.0 - uTime * uSpeed);
        float arc = pow(travel, 7.0);
        float pulse = 0.82 + 0.18 * sin(uTime * 2.2);
        vec3 color = uColor * (0.55 + 2.4 * arc);
        gl_FragColor = vec4(color, (0.22 + 0.78 * arc) * uIntensity * pulse);
      }
    `,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.userData.material = material;
  return mesh;
}

/* ------------------------------------------------------------------ */
/* the van                                                             */
/* ------------------------------------------------------------------ */

function buildVan(env) {
  const root = new THREE.Group();

  const paint = new THREE.MeshPhysicalMaterial({
    color: "#f2f6fb",
    metalness: 0.3,
    roughness: 0.26,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMap: env,
    envMapIntensity: 1.25,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#0a1421",
    metalness: 0.9,
    roughness: 0.08,
    envMap: env,
    envMapIntensity: 1.6,
  });
  const rubber = new THREE.MeshStandardMaterial({ color: "#0b0d11", roughness: 0.85, metalness: 0.1 });
  const rim = new THREE.MeshStandardMaterial({ color: "#b9c6d4", metalness: 0.95, roughness: 0.24, envMap: env });
  const dark = new THREE.MeshStandardMaterial({ color: "#131a24", metalness: 0.6, roughness: 0.4, envMap: env });

  // side profile of a high-roof cargo van, extruded across its width
  const shape = new THREE.Shape();
  shape.moveTo(-1.55, 0.12);
  shape.lineTo(-1.6, 0.52);
  shape.lineTo(-1.6, 1.22);
  shape.lineTo(-1.48, 1.46);
  shape.lineTo(-0.3, 1.48);
  shape.lineTo(0.1, 1.4);
  shape.lineTo(0.64, 0.97);
  shape.lineTo(1.2, 0.86);
  shape.lineTo(1.52, 0.74);
  shape.lineTo(1.62, 0.54);
  shape.lineTo(1.6, 0.26);
  shape.lineTo(1.42, 0.12);
  shape.closePath();

  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth: 1.52,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
      curveSegments: 10,
    }),
    paint,
  );
  body.position.z = -0.76;
  root.add(body);

  // windshield
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.72, 1.4), glass);
  windshield.position.set(0.36, 1.19, 0);
  windshield.rotation.z = -0.72;
  root.add(windshield);

  // cab door windows
  [-1, 1].forEach((side) => {
    const window = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.34), glass);
    window.position.set(0.16, 1.16, side * 0.77);
    window.rotation.y = side > 0 ? 0 : Math.PI;
    root.add(window);
  });

  // headlights, grille and bumper
  [-1, 1].forEach((side) => {
    const light = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.16, 0.24),
      new THREE.MeshStandardMaterial({ color: "#dff6ff", emissive: "#bfeaff", emissiveIntensity: 2.2 }),
    );
    light.position.set(1.6, 0.62, side * 0.52);
    root.add(light);
  });
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 1.5), dark);
  bumper.position.set(1.56, 0.24, 0);
  root.add(bumper);

  // wheels
  const wheels = [];
  [
    [1.02, 0.75],
    [1.02, -0.75],
    [-1.0, 0.75],
    [-1.0, -0.75],
  ].forEach(([x, z]) => {
    const wheel = new THREE.Group();
    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 26), rubber);
    tyre.rotation.x = Math.PI / 2;
    wheel.add(tyre);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.26, 22), rim);
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);
    // spokes make the wheel's rotation visible
    [0, Math.PI / 2].forEach((angle) => {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.035, 0.28), rim);
      spoke.rotation.z = angle;
      wheel.add(spoke);
    });
    wheel.position.set(x, 0.36, z);
    root.add(wheel);
    wheels.push(wheel);
  });

  root.traverse((object) => {
    if (object.isMesh) object.castShadow = false;
  });

  return { root, wheels };
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export function createStartupScene({ canvas, lowPower = false }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lowPower,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.8));
  renderer.setClearColor(0x01040b, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x01040b, 0.055);

  const env = buildEnvironment(renderer);
  scene.environment = env;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  camera.position.set(0, 1.25, 6.2);

  /* lighting */
  scene.add(new THREE.HemisphereLight(0x8fd8ff, 0x05070d, 0.55));
  const key = new THREE.DirectionalLight(0x9fdcff, 2.1);
  key.position.set(-3.4, 5.2, 4.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8b5cf6, 1.9);
  rim.position.set(4.2, 2.4, -3.4);
  scene.add(rim);
  const sweep = new THREE.PointLight(0xaee9ff, 0, 9, 2);
  sweep.position.set(-2.4, 1.4, 1.6);
  scene.add(sweep);

  /* floor */
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(14, 64),
    new THREE.MeshStandardMaterial({
      color: "#04070d",
      metalness: 0.86,
      roughness: 0.32,
      envMap: env,
      envMapIntensity: 1.15,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const floorGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshBasicMaterial({
      map: radialGlowTexture(),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: "#1e9dff",
    }),
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.y = 0.005;
  scene.add(floorGlow);

  /* energy rings */
  const ringGroup = new THREE.Group();
  ringGroup.position.y = 0.02;
  scene.add(ringGroup);
  const ringOuter = energyRing({ inner: 1.16, outer: 1.27, color: "#6938ff", speed: 1.5, intensity: 0.85 });
  const ringInner = energyRing({ inner: 0.86, outer: 0.94, color: "#22d3ee", speed: 2.6, intensity: 1 });
  const ringHalo = energyRing({ inner: 1.42, outer: 1.46, color: "#1d7bff", speed: 0.9, intensity: 0.45 });
  ringGroup.add(ringOuter, ringInner, ringHalo);

  /* light streaks */
  const streakMap = streakTexture();
  const streaks = [];
  for (let i = 0; i < (lowPower ? 3 : 6); i += 1) {
    const streak = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 0.1 + (i % 3) * 0.05),
      new THREE.MeshBasicMaterial({
        map: streakMap,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: i % 2 ? "#7c5cff" : "#7fdcff",
      }),
    );
    streak.position.set(0, 0.2 + i * 0.42, 1.6 - i * 0.18);
    streak.userData.speed = 0.9 + (i % 4) * 0.35;
    streak.userData.phase = i * 1.37;
    streak.userData.base = 0.2 + i * 0.42;
    scene.add(streak);
    streaks.push(streak);
  }

  /* particles */
  const particleCount = lowPower ? 160 : 420;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = Math.random() * 5.2 - 0.2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      map: dotTexture(),
      size: 0.055,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: "#9ae6ff",
    }),
  );
  scene.add(particles);

  /* the logo — real SVG geometry, extruded, metallic */
  const logoGroup = new THREE.Group();
  logoGroup.position.set(0, 1.12, 0);
  scene.add(logoGroup);
  const logoInner = new THREE.Group();
  logoGroup.add(logoInner);

  const logoPalette = ["#2ad4fb", "#0a7fb0", "#5b4bff", "#2a20c9"];
  let logoLoaded = false;
  new SVGLoader().load(LOGO_SVG_URL, (data) => {
    const meshes = new THREE.Group();
    data.paths.forEach((path, index) => {
      const color = path.color && path.color.getHexString && path.color.getHexString() !== "000000"
        ? `#${path.color.getHexString()}`
        : logoPalette[index % logoPalette.length];
      const material = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.92,
        roughness: 0.17,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMap: env,
        envMapIntensity: 1.5,
        emissive: new THREE.Color(color).multiplyScalar(0.16),
        transparent: true,
      });
      SVGLoader.createShapes(path).forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 70,
          bevelEnabled: true,
          bevelThickness: 8,
          bevelSize: 7,
          bevelSegments: 3,
          curveSegments: 12,
        });
        meshes.add(new THREE.Mesh(geometry, material));
      });
    });

    // SVG space is 199×245 with y pointing down: normalise to ~1.3 units tall.
    const scale = 1.3 / 245;
    meshes.scale.set(scale, -scale, scale);
    const box = new THREE.Box3().setFromObject(meshes);
    const center = box.getCenter(new THREE.Vector3());
    meshes.position.sub(center);
    logoInner.add(meshes);
    logoLoaded = true;
  });

  const additivePlane = (map, width, height, color = "#ffffff") => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color,
      }),
    );
    return mesh;
  };

  /* glow behind the logo */
  const logoGlow = additivePlane(radialGlowTexture(), 4.4, 4.4, "#1c8bff");
  logoGlow.position.set(0, 1.12, -0.7);
  scene.add(logoGlow);

  /* typographic lockups, as textures so the camera moves them in depth */
  const textMaterial = (map, opacity = 0) =>
    new THREE.MeshStandardMaterial({
      map,
      transparent: true,
      opacity,
      depthWrite: false,
      metalness: 0.55,
      roughness: 0.3,
      envMap: env,
      envMapIntensity: 1.3,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.14,
    });

  const wordmarkBelow = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 0.405), textMaterial(wordmarkTexture()));
  wordmarkBelow.position.set(0, -0.92, 0);
  logoGroup.add(wordmarkBelow);

  const wordmarkSide = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), textMaterial(wordmarkTexture()));
  wordmarkSide.position.set(1.35, 1.62, -0.1);
  scene.add(wordmarkSide);

  const separator = additivePlane(streakMap, 2.6, 0.06, "#9fd8ff");
  separator.position.set(0, 1.5, -0.1);
  scene.add(separator);

  const presents = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.27), textMaterial(presentsTexture()));
  presents.position.set(0, 1.28, -0.1);
  scene.add(presents);

  const title = new THREE.Mesh(new THREE.PlaneGeometry(3.15, 1.03), textMaterial(titleTexture()));
  title.position.set(0, 0.62, 0);
  scene.add(title);

  const tagline = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 0.34), textMaterial(taglineTexture()));
  tagline.position.set(0, 0.24, 0);
  scene.add(tagline);

  const pulse = additivePlane(radialGlowTexture(), 1, 1, "#bfeeff");
  pulse.position.set(0, 0.62, 0.4);
  scene.add(pulse);

  /* the van */
  const van = buildVan(env);
  const vanRoot = new THREE.Group();
  vanRoot.add(van.root);
  vanRoot.rotation.y = -0.32;
  vanRoot.position.set(0, 0, -3.6);
  scene.add(vanRoot);

  // mirrored copy for the reflective floor
  const vanReflection = van.root.clone(true);
  vanReflection.scale.y = -1;
  vanReflection.position.y = 0;
  vanReflection.traverse((object) => {
    if (object.isMesh) {
      object.material = object.material.clone();
      object.material.transparent = true;
      object.material.opacity = 0.14;
      object.material.depthWrite = false;
    }
  });
  vanRoot.add(vanReflection);

  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 2.2),
    new THREE.MeshBasicMaterial({
      map: radialGlowTexture(),
      color: "#000000",
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }),
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.01;
  vanRoot.add(contactShadow);

  /* ------------------------------------------------------------------ */
  /* frame update                                                        */
  /* ------------------------------------------------------------------ */

  const cameraTarget = new THREE.Vector3(0, 1.1, 0);
  let width = 1;
  let height = 1;

  const resize = () => {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  };
  resize();

  let elapsed = 0;

  const update = (t) => {
    elapsed = t;
    const dt = 1 / 60;

    /* camera: one continuous dolly / orbit / stabilise */
    camera.position.set(
      track(t, [
        [0, 0],
        [1.5, 0.3],
        [2.5, -0.35],
        [4, 0.7],
        [5.6, 1.3],
        [6.9, 0.95],
        [8, 0.55],
      ]),
      track(t, [
        [0, 1.25],
        [1.5, 1.16],
        [2.5, 1.2],
        [4, 1.5],
        [5.3, 1.55],
        [6.5, 1.62],
        [8, 1.5],
      ]),
      track(t, [
        [0, 6.3],
        [1.5, 4.5],
        [2.5, 4.25],
        [4, 5.5],
        [5.6, 5.18],
        [6.9, 5.5],
        [8, 5.25],
      ]),
    );
    cameraTarget.set(
      0,
      track(t, [
        [0, 1.12],
        [2.4, 1.2],
        [3.2, 1.05],
        [4.4, 0.8],
        [8, 0.72],
      ]),
      0,
    );
    camera.lookAt(cameraTarget);

    /* the mark: emerges from the platform, floats, then recedes */
    const emerge = span(t, 0.05, 1.5);
    const lift = span(t, 2.5, 3.6);
    const vanish = span(t, 3.9, 4.5);

    logoGroup.position.y = lerp(0.18, 1.14, emerge) + lift * 0.55 + Math.sin(t * 1.6) * 0.035;
    logoGroup.scale.setScalar(lerp(0.55, 1, emerge) * lerp(1, 0.34, lift));
    logoGroup.rotation.y = lerp(-1.05, -0.12, emerge) + Math.sin(t * 0.85) * 0.16;
    logoGroup.rotation.x = Math.sin(t * 0.7) * 0.06 - lift * 0.1;
    logoGroup.rotation.z = Math.sin(t * 0.55) * 0.03;
    logoGroup.visible = logoLoaded && vanish < 1;
    logoInner.traverse((object) => {
      if (object.isMesh) object.material.opacity = 1 - vanish;
    });
    logoGlow.material.opacity = (0.16 + emerge * 0.3) * (1 - vanish);

    wordmarkBelow.material.opacity = span(t, 1.35, 2.15) * (1 - span(t, 2.45, 2.8));
    wordmarkSide.material.opacity = span(t, 2.6, 3.15) * (1 - vanish);
    wordmarkSide.visible = wordmarkSide.material.opacity > 0.01;

    /* rings: energy fields that keep moving and expand around the van */
    const ringLift = span(t, 3.9, 5.2);
    const ringScale = lerp(1, 2.15, ringLift);
    ringGroup.scale.setScalar(ringScale);
    ringGroup.position.y = 0.02;
    [ringOuter, ringInner, ringHalo].forEach((ring, index) => {
      ring.userData.material.uniforms.uTime.value = t + index * 1.4;
      ring.userData.material.uniforms.uIntensity.value =
        (0.25 + emerge * 0.9) * (1 - ringLift * 0.25) * (1 + Math.sin(t * 2.4 + index) * 0.12);
    });
    ringInner.rotation.z = t * 0.35;
    ringOuter.rotation.z = -t * 0.22;
    ringHalo.rotation.z = t * 0.12;
    floorGlow.material.opacity = 0.3 + emerge * 0.28 + Math.sin(t * 1.8) * 0.04;

    /* streaks travelling across the frame */
    streaks.forEach((streak) => {
      const local = ((t * streak.userData.speed + streak.userData.phase) % 2) - 1;
      streak.position.x = local * 4.2;
      streak.position.y = streak.userData.base + Math.sin(t * 1.1 + streak.userData.phase) * 0.12;
      streak.rotation.z = -0.06 + Math.sin(t * 0.6 + streak.userData.phase) * 0.02;
      streak.material.opacity =
        Math.max(0, 1 - Math.abs(local)) * (0.1 + 0.5 * span(t, 2.2, 4.2)) * (1 - span(t, 6.2, 7));
    });

    /* presents + separator sweep */
    separator.material.opacity = span(t, 2.5, 2.9) * (1 - vanish * 0.9);
    separator.scale.x = 0.4 + span(t, 2.5, 3.1) * 0.6;
    presents.material.opacity = span(t, 2.55, 3.05) * (1 - vanish * 0.9);

    /* title: emerges through the light streak, then rises for the van */
    const titleIn = span(t, 2.75, 3.45);
    title.position.y = lerp(0.5, 0.66, titleIn) + span(t, 3.9, 4.6) * 1.18;
    title.scale.setScalar(lerp(1.12, 1, titleIn));
    title.material.opacity = titleIn;
    title.material.emissiveIntensity = 0.14 + Math.max(0, 1 - Math.abs(t - 3.5) * 4) * 0.5;
    tagline.position.y = title.position.y - 0.36;
    tagline.material.opacity = span(t, 4.15, 4.8);
    tagline.scale.setScalar(0.9 + span(t, 4.15, 4.8) * 0.1);

    const flash = Math.max(0, 1 - Math.abs(t - 3.5) / 0.35);
    pulse.position.y = 0.66 + span(t, 3.9, 4.6) * 1.18;
    pulse.material.opacity = flash * 0.85;
    pulse.scale.setScalar(1 + flash * 5.2);

    /* the van drives in, wheels turn, suspension settles */
    const drive = span(t, 4.0, 5.35);
    const settle = span(t, 5.35, 6.05);
    vanRoot.position.z = lerp(-3.6, -0.15, drive);
    vanRoot.position.y = Math.sin(settle * Math.PI) * 0.035 * (1 - settle) - (1 - drive) * 0.0;
    vanRoot.rotation.y = -0.32 + Math.sin(t * 0.3) * 0.022 * span(t, 4.2, 6.5);
    van.root.position.y = -Math.sin(settle * Math.PI * 1.4) * 0.03 * (1 - settle);
    van.wheels.forEach((wheel) => {
      wheel.rotation.z -= (1 - settle) * dt * 9 * drive;
    });
    vanReflection.visible = drive > 0.02;

    /* sweeping key light across the paint */
    sweep.position.set(lerp(-3.2, 3.2, span(t, 4.4, 5.9)), 1.35, 1.7);
    sweep.intensity = Math.sin(span(t, 4.4, 5.9) * Math.PI) * 26;

    /* particles and ambient life */
    particles.rotation.y = t * 0.045;
    particles.position.y = Math.sin(t * 0.5) * 0.12;
    particles.material.opacity = 0.35 + 0.35 * span(t, 0.4, 2.2);

    /* end of sequence: calm, dim, ready for the interface */
    const outro = span(t, 6.4, 7.4);
    renderer.toneMappingExposure = lerp(1.06, 0.72, outro);

    renderer.render(scene, camera);
  };

  const dispose = () => {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value && value.isTexture) value.dispose();
          });
          material.dispose();
        });
      }
    });
    env.dispose();
    renderer.dispose();
  };

  return { update, resize, dispose, getElapsed: () => elapsed };
}