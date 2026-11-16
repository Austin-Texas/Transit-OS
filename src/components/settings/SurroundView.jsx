import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, MoveHorizontal } from "lucide-react";
import { Image } from "@/components/ui/image";
import PhotoGrade from "@/components/van/PhotoGrade";
import useSurroundPanorama from "@/hooks/useSurroundPanorama";
import { cn } from "@/lib/utils";

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
const FEATHER = "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)";

const normalize = (value) => ((value % 360) + 360) % 360;
const compass = (angle) => COMPASS[Math.round(normalize(angle) / 45) % 8];

// Tesla-style surround: the camera stills are stitched into one panorama and
// panned as a seamless ring, so dragging sweeps the whole van without a seam.
export default function SurroundView({ sources = [], children }) {
  const { panorama, ordered, loading } = useSurroundPanorama(sources);
  const [heading, setHeading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const box = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const count = ordered.length;
  const ring = panorama && size.height
    ? (panorama.width / panorama.height) * size.height
    : Math.max(size.width, 1) * Math.max(count, 1);
  const offset = ((((heading / 360) * ring) % ring) + ring) % ring;

  const turn = (delta) => setHeading((value) => value + delta);

  const onPointerDown = (event) => {
    drag.current = { x: event.clientX, heading };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const delta = ((event.clientX - drag.current.x) / ring) * 360;
    setHeading(drag.current.heading - delta);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={box}
      className="photo-slot relative aspect-[21/9] w-full touch-none select-none overflow-hidden rounded-xl border bg-ink-950"
    >
      {panorama && size.height ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${panorama.url})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: `${-offset}px center`,
            transition: dragging ? "none" : "background-position 300ms ease-out",
          }}
        />
      ) : count ? (
        <div className="absolute inset-0 overflow-hidden">
          {[...ordered, ...ordered].map((source, index) => (
            <div
              key={`${source.id}-${index}`}
              className="absolute inset-y-0"
              style={{
                left: index * (size.width || 1) - offset - (size.width || 1) * 0.1,
                width: (size.width || 1) * 1.2,
                maskImage: FEATHER,
                WebkitMaskImage: FEATHER,
              }}
            >
              <Image src={source.url} alt={source.name} className="h-full w-full object-cover" />
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
        className={cn("absolute inset-0", dragging ? "cursor-grabbing" : "cursor-grab")}
      />

      <div className="pointer-events-none absolute inset-x-0 top-3 flex items-center justify-between px-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-ink-950/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-neon backdrop-blur">
          {loading ? <Loader2 className="h-2.5 w-2.5 animate-spin" strokeWidth={2.4} /> : null}
          {loading ? "Stitching" : "360° surround"}
        </span>
        <span className="rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] text-white/70 backdrop-blur">
          {compass(heading)} · {Math.round(normalize(heading))}°
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