import { useEffect, useState } from "react";

// Approved nine-frame 3x3 artwork. The viewport displays exactly ONE cell,
// letterboxed to fit, never the entire sheet stretched to the screen.
const SOURCE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/1f3d1b74f_transitos_neon_startup_animation.png";
const FRAME_MS = 250;

export default function ReferenceFrames({ elapsed = 0 }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = () => { if (active) setLoaded(true); };
    image.onerror = () => { if (active) setLoaded(false); };
    image.src = SOURCE;
    return () => { active = false; image.onload = null; image.onerror = null; };
  }, []);

  // Nine keyframes at 250ms each. Hold the vehicle frame until initialization.
  const index = elapsed < 2250 ? Math.min(8, Math.floor(elapsed / FRAME_MS)) : 6;
  const column = index % 3;
  const row = Math.floor(index / 3);
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-[#010817]" aria-label="TPMCS TransitOS startup visuals">
      {loaded ? (
        <div
          className="relative w-full max-h-full shrink-0"
          style={{
            aspectRatio: "16 / 9",
            width: "min(100vw, 177.7778vh)",
            backgroundImage: `url("${SOURCE}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "300% 300%",
            backgroundPosition: `${column * 50}% ${row * 50}%`,
          }}
          role="img"
          aria-label="TPMCS cinematic startup artwork"
        />
      ) : (
        <div className="flex flex-col items-center gap-5 text-white">
          <img src="/branding/tpmcs-logo.svg" alt="TPMCS" className="h-28 w-auto" />
          <strong className="text-3xl tracking-widest">TPMCS</strong>
        </div>
      )}
    </div>
  );
}
