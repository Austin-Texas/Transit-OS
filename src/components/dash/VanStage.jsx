import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Move } from "lucide-react";
import { Link } from "@tanstack/react-router";
import FordTransit3D from "@/components/van/FordTransit3D";
import HotspotDialog from "@/components/van/HotspotDialog";
import { cn } from "@/lib/utils";

// The home stage: the neon wireframe van you can spin with a finger, plus a
// photo view, exactly like the reference dashboard layout.
export default function VanStage({
  cabinTemp,
  vehicleName,
  trim,
  warnings = [],
  focus,
  status,
  onClearFocus,
}) {
  const side = focus?.side;
  const [tip, setTip] = useState(null);
  const [hotspot, setHotspot] = useState(null);

  return (
    <section
      className={cn(
        "photo-slot relative flex min-h-[380px] flex-1 overflow-hidden rounded-2xl border bg-[radial-gradient(125%_120%_at_50%_-10%,#0d2d40_0%,#061019_52%,#03070c_100%)] lg:min-h-[420px]",
        focus ? "border-alert/55" : "border-line/80"
      )}
    >
      <FordTransit3D
        className="absolute inset-0 h-full w-full"
        focus={focus}
        warnings={warnings}
        status={status}
        onTip={setTip}
        onPick={(key) => {
          if (!key) return;
          setTip(null);
          setHotspot(key);
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_68%_at_50%_44%,transparent_42%,rgba(2,6,11,0.6)_100%)]" />

      <div className="pointer-events-none absolute left-4 top-3.5 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/65">
        <span className="h-1.5 w-1.5 rounded-full bg-sys-blue" />
        Live van · Interior {Math.round(cabinTemp)}°F
      </div>

      {focus ? (
        <div className="absolute right-3 top-12 z-10 flex max-w-[74%] items-center gap-2 rounded-full border border-alert/60 bg-ink-950/90 px-2.5 py-1 backdrop-blur">
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
      ) : warnings.length ? (
        <span className="absolute right-3 top-12 z-10 inline-flex items-center gap-1.5 rounded-full border border-alert/50 bg-ink-950/85 px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-alert backdrop-blur">
          {warnings.length} warning{warnings.length > 1 ? "s" : ""}
        </span>
      ) : null}

      <div className="pointer-events-none absolute bottom-3.5 left-4 z-10 min-w-0 max-w-[68%]">
        <p className="text-[15px] font-semibold leading-tight tracking-tight text-white">{vehicleName}</p>
        <p className="text-[9.5px] uppercase leading-snug tracking-[0.18em] text-white/45">{trim}</p>
      </div>

      {tip ? (
        <div
          className="pointer-events-none absolute z-30 w-[188px] -translate-x-1/2 -translate-y-[calc(100%+14px)]"
          style={{ left: tip.x, top: tip.y }}
        >
          <div
            className={cn(
              "rounded-lg border bg-ink-950/95 px-2.5 py-1.5 backdrop-blur",
              tip.tone === "alert"
                ? "border-alert/70"
                : tip.tone === "muted"
                  ? "border-white/20"
                  : "border-ok/50"
            )}
          >
            <p
              className={cn(
                "text-[9.5px] font-semibold uppercase tracking-[0.1em]",
                tip.tone === "alert" ? "text-alert" : tip.tone === "muted" ? "text-white/55" : "text-ok"
              )}
            >
              {tip.title}
            </p>
            <p className="mt-0.5 text-[9.5px] leading-snug text-white/60">{tip.detail}</p>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.14em] text-white/35 backdrop-blur sm:flex">
        <Move className="h-3 w-3" strokeWidth={2.2} />
        Swipe to spin · tap parts for readings
      </div>

      <Link
        to="/settings"
        hash="cameras"
        className="group absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-2 rounded-full border border-neon/45 bg-ink-950/75 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-neon backdrop-blur transition hover:border-neon/80 hover:bg-neon/15"
      >
        <Camera className="h-3.5 w-3.5" strokeWidth={2.2} />
        Cameras
      </Link>

      <HotspotDialog hotspot={hotspot} status={status} onClose={() => setHotspot(null)} />
    </section>
  );
}