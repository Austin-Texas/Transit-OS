import { ArrowLeft, ArrowRight, Camera, Move, ZoomIn } from "lucide-react";
import { Link } from "@tanstack/react-router";
import FordTransit3D from "@/components/van/FordTransit3D";
import { cn } from "@/lib/utils";

// The diagnostics stage: the live 3D van, turntable-spinning on its own and
// draggable by hand, with fault markers drawn where the readings point.
export default function VanStage({ focus, onClearFocus, status, warnings = [] }) {
  const side = focus?.side;

  return (
    <section
      className={cn(
        "photo-slot relative flex min-h-[380px] flex-1 overflow-hidden rounded-[26px] border bg-[radial-gradient(125%_120%_at_50%_-10%,#122841_0%,#0a1220_55%,#05070c_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:min-h-[430px]",
        focus ? "border-ios-pink/50" : "border-white/10"
      )}
    >
      <FordTransit3D
        className="absolute inset-0"
        focus={focus}
        warnings={warnings}
        status={status}
      />

      {focus ? (
        <div className="absolute right-3 top-3 z-10 flex max-w-[74%] items-center gap-2 rounded-full border border-alert/60 bg-ink-950/90 px-2.5 py-1 backdrop-blur">
          <span className="inline-flex shrink-0 items-center gap-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-alert">
            {side === "left" ? (
              <ArrowLeft className="h-3 w-3" strokeWidth={2.4} />
            ) : (
              <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
            )}
            {focus.zone === "underbody" ? "underbody" : `${side} side`}
          </span>
          <span className="truncate text-[9.5px] text-white/70">{focus.title}</span>
          <button
            type="button"
            onClick={onClearFocus}
            aria-label="Back to full van view"
            className="shrink-0 rounded-full p-0.5 text-white/45 transition hover:text-white"
          >
            <span className="text-[11px] leading-none">×</span>
          </button>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.14em] text-white/45 backdrop-blur sm:flex">
        <Move className="h-3 w-3" strokeWidth={2.2} />
        Swipe or drag to spin
        <span className="text-white/20">·</span>
        <ZoomIn className="h-3 w-3" strokeWidth={2.2} />
        Pinch or scroll to zoom
      </div>

      <Link
        to="/settings"
        hash="cameras"
        className="group absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-[11.5px] font-semibold text-white ring-1 ring-inset ring-white/15 backdrop-blur-xl transition hover:bg-white/20"
      >
        <Camera className="h-3.5 w-3.5" strokeWidth={2.2} />
        Cameras
      </Link>
    </section>
  );
}