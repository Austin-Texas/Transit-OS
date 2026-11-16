import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { Image } from "@/components/ui/image";
import PhotoGrade from "@/components/van/PhotoGrade";
import { cn } from "@/lib/utils";

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const compass = (angle) => COMPASS[Math.round((angle % 360) / 45) % 8];

// Drag-to-look 360° surround: every camera still laid around one ring, panned
// across the viewport the same way the recorded clip sweeps it.
export default function SurroundView({ sources, children }) {
  const [heading, setHeading] = useState(0);
  const drag = useRef(null);
  const box = useRef(null);
  const count = sources.length;

  const turn = (delta) => setHeading((value) => (value + delta + 360) % 360);

  const onPointerDown = (event) => {
    drag.current = { x: event.clientX, heading };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const width = box.current?.clientWidth || 1;
    const delta = ((event.clientX - drag.current.x) / width) * 360;
    setHeading((((drag.current.heading - delta) % 360) + 360) % 360);
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      ref={box}
      onClickCapture={(event) => {
        if (event.target.closest("button")) event.stopPropagation();
      }}
      className="photo-slot relative aspect-[21/9] w-full touch-none select-none overflow-hidden rounded-xl border bg-ink-950"
    >
      {count ? (
        <div
          className="flex h-full transition-transform duration-200 ease-out"
          style={{ width: `${count * 100}%`, transform: `translateX(-${(heading / 360) * 100}%)` }}
        >
          {sources.map((source) => (
            <div key={source.id} className="h-full" style={{ width: `${100 / count}%` }}>
              <Image
                src={source.url}
                alt={`${source.name} surround panel`}
                fittingType="fill"
                className="pointer-events-none h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid h-full place-items-center">
          <span className="rounded-xl border border-white/10 bg-black/35 px-5 py-3 text-center text-[10px] uppercase tracking-[0.28em] text-white/50 backdrop-blur">
            No camera stills yet
          </span>
        </div>
      )}

      <PhotoGrade />

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      <div className="pointer-events-none absolute inset-x-0 top-3 flex items-center justify-between px-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-ink-950/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-neon backdrop-blur">
          360° surround
        </span>
        <span className="rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] text-white/70 backdrop-blur">
          {compass(heading)} · {Math.round(heading)}°
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
        <span className="h-7 w-7 rounded-full border border-neon/50" />
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => turn(-30)}
          aria-label="Look left"
          className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-ink-950/70 text-white/70 backdrop-blur transition hover:border-neon/60 hover:text-neon"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
        <button
          type="button"
          onClick={() => turn(30)}
          aria-label="Look right"
          className="grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-ink-950/70 text-white/70 backdrop-blur transition hover:border-neon/60 hover:text-neon"
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
        </button>
        <span className="ml-1 hidden items-center gap-1 text-[9px] uppercase tracking-[0.14em] text-white/35 sm:inline-flex">
          <MoveHorizontal className="h-3 w-3" strokeWidth={2} />
          Drag to look
        </span>
      </div>

      {children ? <div className={cn("absolute bottom-3 right-3")}>{children}</div> : null}
    </div>
  );
}