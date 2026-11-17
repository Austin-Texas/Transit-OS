import { useEffect, useRef, useState } from "react";
import { Move } from "lucide-react";
import { Image } from "@/components/ui/image";
import { spinZones } from "@/lib/vanSpinZones";
import { cn } from "@/lib/utils";

// The van as a 360 turnaround: one photo every 45°, dragged like a turntable.
// Order runs front-left, left, rear-left, rear, rear-right, right, front-right,
// front, so dragging right turns the van the way a finger expects.
const FRAMES = [
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/fa95d21d7_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/4da962cb6_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/50129feff_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/d9dde82c5_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/65a9031c6_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/c05f67ae5_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/7c92aff70_generated_image.png",
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/3d1f33360_generated_image.png",
];

// Pixels of drag that turn the van one frame.
const PX_PER_FRAME = 90;

const wrap = (index) => ((index % FRAMES.length) + FRAMES.length) % FRAMES.length;

export default function VanSpin({ side, className, onPick }) {
  const [frame, setFrame] = useState(0);
  const drag = useRef(null);
  const moved = useRef(0);

  // A fault on one flank turns the van round to show that side.
  useEffect(() => {
    if (side === "left") setFrame(1);
    else if (side === "right") setFrame(5);
  }, [side]);

  const nudge = (delta) => setFrame((current) => wrap(current + delta));

  const onDown = (event) => {
    moved.current = 0;
    drag.current = { x: event.clientX, frame };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    moved.current = Math.max(moved.current, Math.abs(dx));
    const steps = Math.round(dx / PX_PER_FRAME);
    setFrame(wrap(drag.current.frame - steps));
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      className={cn(
        "absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing",
        className
      )}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") nudge(-1);
        if (event.key === "ArrowLeft") nudge(1);
      }}
      tabIndex={0}
      role="img"
      aria-label={`Van turnaround, view ${frame + 1} of ${FRAMES.length}`}
    >
      {FRAMES.map((url, index) => (
        <Image
          key={url}
          src={url}
          alt=""
          fittingType="fill"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-150",
            index === frame ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      {/* Every part of the van opens its module. A drag never counts as a tap. */}
      {spinZones(frame).map((zone) => (
        <button
          key={zone.key}
          type="button"
          aria-label={`Open ${zone.label}`}
          onClick={() => {
            if (moved.current < 8) onPick?.(zone.key);
          }}
          style={{
            left: `${zone.left}%`,
            top: `${zone.top}%`,
            width: `${zone.right - zone.left}%`,
            height: `${zone.bottom - zone.top}%`,
          }}
          className="group absolute rounded-2xl outline-none transition hover:bg-white/[0.07] hover:ring-1 hover:ring-inset hover:ring-neon/40 focus-visible:ring-2 focus-visible:ring-neon"
        >
          <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-ink-950/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/80 opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
            {zone.label}
          </span>
        </button>
      ))}

      <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.14em] text-white/40 backdrop-blur sm:flex">
        <Move className="h-3 w-3" strokeWidth={2.2} />
        Drag to spin · tap a part to open its module
      </div>
    </div>
  );
}