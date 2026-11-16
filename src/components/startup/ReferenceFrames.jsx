import { useEffect, useRef } from "react";

// The approved 3x3 artwork is nine distinct 16:9 frames, NOT one background.
// Crop each source cell and fit the complete cell inside the viewport.
const SOURCE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/1f3d1b74f_transitos_neon_startup_animation.png";
const FRAME_MS = 250;

export default function ReferenceFrames() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return undefined;

    let active = true;
    let interval;
    let index = 0;
    const image = new Image();

    const render = () => {
      if (!active || !image.complete || !image.naturalWidth) return;
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.fillStyle = "#010817";
      context.fillRect(0, 0, width, height);

      // Each frame is exactly one third of the full image in each direction.
      const frameWidth = image.naturalWidth / 3;
      const frameHeight = image.naturalHeight / 3;
      const scale = Math.min(width / frameWidth, height / frameHeight);
      const destWidth = frameWidth * scale;
      const destHeight = frameHeight * scale;
      const left = (width - destWidth) / 2;
      const top = (height - destHeight) / 2;
      const column = index % 3;
      const row = Math.floor(index / 3);

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image,
        column * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        left,
        top,
        destWidth,
        destHeight,
      );
    };

    image.onload = () => {
      if (!active) return;
      render();
      interval = window.setInterval(() => {
        // Show all nine approved frames in order, then hold the vehicle
        // frame until the existing initialization stage takes over.
        index = index < 8 ? index + 1 : 6;
        render();
      }, FRAME_MS);
    };
    image.onerror = () => {
      // Existing WebGL startup remains visible beneath this transparent canvas.
      canvas.style.display = "none";
    };
    image.src = SOURCE;
    window.addEventListener("resize", render);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("resize", render);
      image.onload = null;
      image.onerror = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
