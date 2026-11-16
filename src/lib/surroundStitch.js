// Stitches the van's camera stills into one seamless 360° panorama.
// Each camera covers an equal slice of the ring; neighbouring slices are
// cross-faded so the panels read as a single continuous view, and the ring is
// drawn past both edges so panning wraps with no seam.

const BEARINGS = [
  { angle: 0, words: ["front", "forward", "hood", "windshield", "nose", "cab"] },
  { angle: 90, words: ["right", "passenger", "starboard"] },
  { angle: 180, words: ["rear", "back", "tail", "reverse", "backup", "bumper"] },
  { angle: 270, words: ["left", "driver", "port"] },
];

const MAX_STRIP = 6144;

const loadImage = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });

const drawCover = (ctx, image, x, y, width, height) => {
  const scale = Math.max(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, x + (width - w) / 2, y + (height - h) / 2, w, h);
};

// Where each camera sits around the van, read from its name, mount location
// and side, so the panorama runs clockwise from the front.
const bearingOf = (source) => {
  const text = `${source.name ?? ""} ${source.location ?? ""} ${source.side ?? ""}`.toLowerCase();
  const hit = BEARINGS.find((bearing) => bearing.words.some((word) => text.includes(word)));
  return hit ? hit.angle : null;
};

export function orderSources(sources = []) {
  const placed = sources.map((source, index) => ({ source, index, angle: bearingOf(source) }));
  if (placed.every((item) => item.angle === null)) return sources;

  return placed
    .slice()
    .sort((a, b) => (a.angle ?? 360 + a.index) - (b.angle ?? 360 + b.index))
    .map((item) => item.source);
}

export async function stitchSurround(sources = [], { height = 720, feather = 0.22 } = {}) {
  const loaded = await Promise.all(
    sources.map(async (source) => ({ source, image: await loadImage(source.url) }))
  );
  const panels = loaded.filter((panel) => panel.image);
  if (panels.length < 2) return null;

  const slice = Math.min(1024, Math.floor(MAX_STRIP / panels.length));
  const blend = Math.max(20, Math.round(slice * feather));
  const total = slice * panels.length;

  const canvas = document.createElement("canvas");
  canvas.width = total;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#020a14";
  ctx.fillRect(0, 0, total, height);

  const paint = (image, x) => {
    const layer = document.createElement("canvas");
    layer.width = slice + blend;
    layer.height = height;
    const layerCtx = layer.getContext("2d");
    if (!layerCtx) return;

    drawCover(layerCtx, image, 0, 0, slice + blend, height);

    // Feather the leading edge, so it dissolves into the camera beside it.
    const fade = layerCtx.createLinearGradient(0, 0, blend, 0);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, "rgba(0,0,0,1)");
    layerCtx.globalCompositeOperation = "destination-in";
    layerCtx.fillStyle = fade;
    layerCtx.fillRect(0, 0, blend, height);
    layerCtx.globalCompositeOperation = "source-over";

    ctx.drawImage(layer, x, 0);
  };

  for (let index = -1; index <= panels.length; index += 1) {
    const panel = panels[((index % panels.length) + panels.length) % panels.length];
    paint(panel.image, index * slice - blend);
  }

  try {
    return { url: canvas.toDataURL("image/jpeg", 0.86), width: total, height };
  } catch {
    // Tainted canvas (a still without CORS headers) — the view falls back to
    // laying the panels out side by side.
    return null;
  }
}