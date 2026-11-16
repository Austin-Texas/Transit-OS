import { base44 } from "@/api/base44Client";

// Records the 360° surround view as a real video clip: the camera stills are
// stitched into one panorama and swept past the viewport while the canvas is
// captured with MediaRecorder.

const WIDTH = 1280;
const HEIGHT = 720;

const loadImage = (url) =>
  new Promise((resolve) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });

function drawCover(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.width, h / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function paint(ctx, images, angle) {
  const strip = images.length * WIDTH;
  const shift = ((((angle / 360) * strip) % strip) + strip) % strip;

  ctx.fillStyle = "#020a14";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let i = -1; i <= images.length; i += 1) {
    const x = i * WIDTH - shift;
    if (x + WIDTH < 0 || x > WIDTH) continue;
    drawCover(ctx, images[((i % images.length) + images.length) % images.length], x, 0, WIDTH, HEIGHT);
  }

  const grade = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  grade.addColorStop(0, "rgba(0,240,255,0.16)");
  grade.addColorStop(0.5, "rgba(0,0,0,0)");
  grade.addColorStop(1, "rgba(0,122,255,0.18)");
  ctx.fillStyle = grade;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const vignette = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.25, WIDTH / 2, HEIGHT / 2, HEIGHT * 0.95);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(2,10,20,0.85)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // centre reticle
  ctx.strokeStyle = "rgba(0,240,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, HEIGHT / 2 - 40);
  ctx.lineTo(WIDTH / 2, HEIGHT / 2 - 30);
  ctx.moveTo(WIDTH / 2, HEIGHT / 2 + 30);
  ctx.lineTo(WIDTH / 2, HEIGHT / 2 + 40);
  ctx.stroke();

  // heading ticks
  for (let step = 0; step < 12; step += 1) {
    const x = (WIDTH / 12) * step + 40;
    ctx.fillStyle = step % 3 === 0 ? "rgba(0,240,255,0.55)" : "rgba(255,255,255,0.22)";
    ctx.fillRect(x, HEIGHT - 78, 1.5, step % 3 === 0 ? 14 : 8);
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(0,240,255,0.9)";
  ctx.font = "600 20px Inter, Arial, sans-serif";
  ctx.fillText("360° SURROUND", 30, 46);

  ctx.fillStyle = "rgba(255,59,48,1)";
  ctx.beginPath();
  ctx.arc(38, HEIGHT - 36, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "600 17px Inter, Arial, sans-serif";
  ctx.fillText("REC", 54, HEIGHT - 30);

  const stamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "500 18px 'JetBrains Mono', monospace";
  ctx.fillText(`${Math.round(angle) % 360}°  ${stamp}`, WIDTH - 30, HEIGHT - 30);
  ctx.textAlign = "left";
}

export async function recordSurround({ urls, seconds = 10, onProgress }) {
  if (!window.MediaRecorder) throw new Error("Recording isn't supported in this browser");

  const loaded = await Promise.all(urls.map(loadImage));
  const images = loaded.filter(Boolean);
  if (!images.length) throw new Error("No camera stills to record yet");

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(
    (type) => window.MediaRecorder.isTypeSupported?.(type)
  );
  if (!mime) throw new Error("Recording isn't supported in this browser");

  paint(ctx, images, 0);

  let stream;
  try {
    stream = canvas.captureStream(30);
  } catch {
    throw new Error("This browser can't record the surround view");
  }

  const chunks = [];
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  const finished = new Promise((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
  });

  recorder.start();

  const started = performance.now();
  await new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = Math.min((now - started) / (seconds * 1000), 1);
      try {
        paint(ctx, images, elapsed * 720);
      } catch {
        // a tainted canvas can't be recorded; bail out early
      }
      onProgress?.(elapsed);
      if (elapsed < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });

  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());

  const blob = await finished;
  if (!blob.size) throw new Error("The clip came back empty");
  return { blob, duration_s: seconds };
}

// Stores a recorded clip on the van's private storage and in the clip library.
export async function saveSurroundClip({ blob, duration_s, cameraCount, trigger = "manual", reason }) {
  const file = new File([blob], `surround-${Date.now()}.webm`, { type: "video/webm" });
  const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
  return base44.entities.SurroundClip.create({
    recorded_at: new Date().toISOString(),
    duration_s,
    file_uri,
    camera_count: cameraCount,
    size_kb: Math.round(blob.size / 1024),
    trigger,
    ...(reason ? { reason } : {}),
  });
}