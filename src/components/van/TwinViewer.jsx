import { useCallback, useEffect, useRef } from "react";
import { FlipHorizontal, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Drag to spin the twin all the way round, drag up/down to tilt it, scroll or
// pinch to zoom, double-tap to put it back to square.
export default function TwinViewer({ src, alt, className }) {
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const view = useRef({ spin: 0, tilt: 0, zoom: 1 });
  const spinVelocity = useRef(0);
  const inertia = useRef(0);
  const drag = useRef(null);
  const pointers = useRef(new Map());
  const pinch = useRef(null);

  const paint = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const { spin, tilt, zoom } = view.current;
    el.style.transform = `rotateX(${tilt.toFixed(2)}deg) rotateY(${spin.toFixed(2)}deg) scale(${zoom.toFixed(3)})`;
  }, []);

  const stopInertia = useCallback(() => {
    if (inertia.current) cancelAnimationFrame(inertia.current);
    inertia.current = 0;
  }, []);

  const glide = useCallback(() => {
    spinVelocity.current = clamp(spinVelocity.current, -16, 16);
    const step = () => {
      spinVelocity.current *= 0.94;
      if (Math.abs(spinVelocity.current) < 0.05) {
        inertia.current = 0;
        return;
      }
      view.current.spin += spinVelocity.current;
      paint();
      inertia.current = requestAnimationFrame(step);
    };
    inertia.current = requestAnimationFrame(step);
  }, [paint]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      view.current.zoom = clamp(view.current.zoom * (1 - event.deltaY * 0.0012), 0.75, 2.6);
      paint();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paint]);

  useEffect(() => stopInertia, [stopInertia]);

  const zoomBy = (factor) => {
    view.current.zoom = clamp(view.current.zoom * factor, 0.75, 2.6);
    paint();
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stopInertia();
    spinVelocity.current = 0;

    if (pointers.current.size === 1) {
      drag.current = { x: event.clientX, y: event.clientY };
      pinch.current = null;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        zoom: view.current.zoom,
      };
      drag.current = null;
    }
  };

  const onPointerMove = (event) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      view.current.zoom = clamp((pinch.current.zoom * distance) / pinch.current.distance, 0.75, 2.6);
      paint();
      return;
    }

    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current = { x: event.clientX, y: event.clientY };

    view.current.spin += dx * 0.4;
    view.current.tilt = clamp(view.current.tilt + dy * 0.16, -26, 26);
    spinVelocity.current = dx * 0.4;
    paint();
  };

  const onPointerEnd = (event) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;

    if (pointers.current.size === 1) {
      const [remaining] = [...pointers.current.values()];
      drag.current = { x: remaining.x, y: remaining.y };
      return;
    }

    if (pointers.current.size === 0) {
      drag.current = null;
      if (Math.abs(spinVelocity.current) > 0.6) glide();
    }
  };

  // One tap turns the van all the way round, handy on a phone.
  const flip = () => {
    const el = stageRef.current;
    if (!el) return;
    stopInertia();
    spinVelocity.current = 0;
    view.current.spin += 180;
    el.style.transition = "transform 620ms cubic-bezier(0.32, 1.12, 0.4, 1)";
    paint();
    window.setTimeout(() => {
      if (stageRef.current) stageRef.current.style.transition = "";
    }, 660);
  };

  const reset = () => {
    const el = stageRef.current;
    if (!el) return;
    stopInertia();
    spinVelocity.current = 0;
    view.current = { spin: 0, tilt: 0, zoom: 1 };
    el.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
    paint();
    window.setTimeout(() => {
      if (stageRef.current) stageRef.current.style.transition = "";
    }, 460);
  };

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onDoubleClick={reset}
      onDragStart={(event) => event.preventDefault()}
      style={{ perspective: "1400px" }}
      className={cn(
        "relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-12 bottom-3 h-12 rounded-[50%] bg-ios-teal/20 blur-2xl" />

      <div
        ref={stageRef}
        className="absolute inset-2 will-change-transform sm:inset-4"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* One continuous surface: turning past 90° shows the van's other
            side instead of a blank panel with an upside-down label. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px] shadow-[0_34px_70px_-28px_rgba(0,0,0,0.95)] ring-1 ring-white/15">
          <Image src={src} alt={alt} fittingType="fill" draggable={false} className="h-full w-full" />
        </div>
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-ink-950/70 p-1 backdrop-blur">
        {[
          { key: "out", label: "Zoom out", icon: <ZoomOut className="h-3.5 w-3.5" strokeWidth={2.2} />, onClick: () => zoomBy(0.85) },
          { key: "in", label: "Zoom in", icon: <ZoomIn className="h-3.5 w-3.5" strokeWidth={2.2} />, onClick: () => zoomBy(1.18) },
          { key: "flip", label: "Turn the van around", icon: <FlipHorizontal className="h-3.5 w-3.5" strokeWidth={2.2} />, onClick: flip },
          { key: "reset", label: "Reset view", icon: <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />, onClick: reset },
        ].map((button) => (
          <button
            key={button.key}
            type="button"
            aria-label={button.label}
            title={button.label}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={button.onClick}
            className="grid h-7 w-7 place-items-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
}