import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Move, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import FordTransit3D from "@/components/van/FordTransit3D";
import { Image } from "@/components/ui/image";
import { VAN_STAGE_IMAGE, miles } from "@/lib/van";
import { cn } from "@/lib/utils";

// The home stage: a full 3D Ford Transit you can spin with a finger, with the
// warning pins sitting on the exact corner that raised them.
export default function VanStage({
  cabinTemp,
  vehicleName,
  trim,
  odometer,
  warnings = [],
  focus,
  onClearFocus,
}) {
  const side = focus?.side;
  const [live, setLive] = useState(false);

  return (
    <section
      className={cn(
        "photo-slot relative flex min-h-[380px] flex-1 overflow-hidden rounded-2xl border bg-[radial-gradient(125%_120%_at_50%_-10%,#0d2d40_0%,#061019_52%,#03070c_100%)] lg:min-h-[420px]",
        focus ? "border-alert/55" : "border-line/80"
      )}
    >
      <Image
        src={VAN_STAGE_IMAGE}
        alt="Ford Transit camper van"
        fittingType="fill"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          live ? "opacity-0" : "opacity-100"
        )}
      />
      <FordTransit3D
        className="absolute inset-0 h-full w-full"
        focus={focus}
        warnings={warnings}
        onReady={setLive}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(72%_62%_at_50%_42%,transparent_38%,rgba(2,6,11,0.62)_100%)]" />

      <div className="pointer-events-none absolute left-4 top-3.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
        <span className="h-1.5 w-1.5 rounded-full bg-sys-blue" />
        {focus ? "Live view · side focus" : "Live van"} · Interior {Math.round(cabinTemp)}°F
      </div>

      {focus ? (
        <div className="absolute right-3 top-3 z-10 flex max-w-[74%] items-center gap-2 rounded-full border border-alert/60 bg-ink-950/90 px-2.5 py-1 backdrop-blur">
          <span className="inline-flex shrink-0 items-center gap-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-alert">
            {side === "left" ? (
              <ArrowLeft className="h-3 w-3" strokeWidth={2.4} />
            ) : (
              <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
            )}
            {side} side
          </span>
          <span className="truncate text-[9.5px] text-white/70">{focus.title}</span>
          <button
            type="button"
            onClick={onClearFocus}
            aria-label="Back to full van view"
            className="shrink-0 rounded-full p-0.5 text-white/45 transition hover:text-white"
          >
            <X className="h-3 w-3" strokeWidth={2.6} />
          </button>
        </div>
      ) : warnings.length ? (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-alert/50 bg-ink-950/85 px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-alert backdrop-blur">
          {warnings.length} warning{warnings.length > 1 ? "s" : ""}
        </span>
      ) : null}

      <div className="pointer-events-none absolute bottom-3.5 left-4 min-w-0 max-w-[62%]">
        <p className="truncate text-[15px] font-semibold leading-tight tracking-tight text-white">{vehicleName}</p>
        <p className="truncate text-[9.5px] uppercase tracking-[0.18em] text-white/40">{trim}</p>
        <p className="mt-1 font-mono text-[9.5px] tracking-[0.1em] text-white/30">
          {miles(odometer)} mi · 360° view
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.14em] text-white/45 backdrop-blur sm:flex">
        <Move className="h-3 w-3" strokeWidth={2.2} />
        Swipe to spin · 360°
      </div>

      <Link
        to="/settings"
        hash="cameras"
        className="group absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-2 rounded-full border border-neon/45 bg-ink-950/75 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-neon backdrop-blur transition hover:border-neon/80 hover:bg-neon/15"
      >
        <Camera className="h-3.5 w-3.5" strokeWidth={2.2} />
        Cameras
      </Link>
    </section>
  );
}