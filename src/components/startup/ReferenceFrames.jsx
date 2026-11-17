import { useEffect, useState } from "react";

// Owner-approved artwork. Do not assume it is a 3x3 sprite sheet:
// the former 300% background-size caused the severe zoom reported in Edge.
const SOURCE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/1f3d1b74f_transitos_neon_startup_animation.png";

export default function ReferenceFrames() {
  const [imageState, setImageState] = useState("loading");

  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = () => { if (active) setImageState("ready"); };
    image.onerror = () => { if (active) setImageState("error"); };
    image.src = SOURCE;
    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden bg-[#010817]">
      {imageState === "ready" ? (
        <img
          src={SOURCE}
          alt="TPMCS TransitOS cinematic startup artwork"
          className="block h-full w-full max-h-full max-w-full object-contain"
          style={{ objectPosition: "center", transform: "none", filter: "none" }}
          draggable={false}
        />
      ) : (
        <div className="flex flex-col items-center gap-5 text-white">
          <img src="/branding/tpmcs-logo.svg" alt="TPMCS" className="h-28 w-auto object-contain" />
          <strong className="text-3xl tracking-widest">TPMCS</strong>
          <span className="text-xs tracking-widest text-cyan-200/70">
            {imageState === "error" ? "Preparing TransitOS" : "Loading startup artwork"}
          </span>
        </div>
      )}
    </div>
  );
}