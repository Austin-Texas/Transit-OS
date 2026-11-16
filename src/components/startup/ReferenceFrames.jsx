import { useEffect, useState } from "react";

// Approved high-resolution artwork, hosted in the owner's TransitOS Base44 media library.
const SOURCE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/1f3d1b74f_transitos_neon_startup_animation.png";
const FRAME_MS = 250;

export default function ReferenceFrames({ onFail }) {
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let frame;
    const image = new Image();
    image.onload = () => setReady(true);
    image.onerror = () => onFail?.();
    image.src = SOURCE;
    const start = performance.now();
    const tick = (now) => {
      setElapsed(now - start);
      frame = window.setTimeout(() => requestAnimationFrame(tick), FRAME_MS);
    };
    frame = window.setTimeout(() => requestAnimationFrame(tick), FRAME_MS);
    return () => { window.clearTimeout(frame); image.onload = null; image.onerror = null; };
  }, [onFail]);
  // The approved 3x3 image is nine keyframes. Use 250ms cadence for the
  // opening sequence, then hold the detailed vehicle composition until boot.
  const index = elapsed < 2000 ? Math.min(7, Math.floor(elapsed / FRAME_MS)) : 6;
  const x = index % 3 * 50;
  const y = Math.floor(index / 3) * 50;
  if (!ready) return null;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#01040d]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${SOURCE}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "300% 300%",
          backgroundPosition: `${x}% ${y}%`,
          transform: "scale(1.015)",
          filter: "contrast(1.06) saturate(1.12)",
        }}
      />
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 55%, transparent 55%, rgba(0,2,12,.3) 100%)",
      }} />
    </div>
  );
}
