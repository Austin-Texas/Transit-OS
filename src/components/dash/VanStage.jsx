import { useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Move } from "lucide-react";
import { Link } from "@tanstack/react-router";
import FordTransit3D from "@/components/van/FordTransit3D";
import { Image } from "@/components/ui/image";
import { VAN_STAGE_IMAGE } from "@/lib/van";
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
  const [mode, setMode] = useState("3d");
  const [webgl, setWebgl] = useState("pending");
  const [tip, setTip] = useState(null);

  const failed = webgl === "failed";
  const photo = mode === "2d" || failed || webgl === "pending";
  const show3d = mode === "3d" && !failed;

  return (
    <section
      className={cn(
        "photo-slot relative flex min-h-[380px] flex-1 overflow-hidden rounded-2xl border bg-[radial-gradient(125%_120%_at_50%_-10%,#0d2d40_0%,#061019_52%,#03070c_100%)] lg:min-h-[420px]",
        focus ? "border-alert/55" : "border-line/80"
      )}
    >
      {photo ? (
        <button
          type="button"
          onClick={() => setMode("3d")}
          aria-label="Switch to the 3D view"
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={VAN_STAGE_IMAGE}
            alt={vehicleName || "Ford Transit camper van"}
            fittingType="fill"
            className="pointer-events-none h-full w-full object-cover"
          />
        </button>
      ) : null}

      {show3d ? (
        <FordTransit3D
          className="absolute inset-0 h-full w-full"
          focus={focus}
          warnings={warnings}
          status={status}
          onReady={setWebgl}
          onTip={setTip}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_68%_at_50%_44%,transparent_42%,rgba(2,6,11,0.6)_100%)]" />

      <div className="pointer-events-none absolute left-4 top-3.5 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/65">
        <span className="h-1.5 w-1.5 rounded-full bg-sys-blue" />
        Live van · Interior {Math.round(cabinTemp)}°F
      </div>

      <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-0.5 rounded-full border border-neon/35 bg-ink-950/85 p-0.5 backdrop-blur">
        {[
          { id: "3d", label: "3D" },
          { id: "2d", label: "2D" },
        ].map((option) => {
          const active = option.id === "3d" ? !photo : photo;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              aria-pressed={active}
              className={cn(
                "rounded-full px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] transition",
                active ? "bg-neon/20 text-neon" : "text-white/45 hover:text-white/80"
              )}
            >
              {option.label}
            </button>
          );
        })}
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

      <div className="pointer-events-none absolute bottom-3.5 left-4 z-10 min-w-0 max-w-[58%]">
        <p className="truncate text-[15px] font-semibold leading-tight tracking-tight text-white">{vehicleName}</p>
        <p className="truncate text-[9.5px] uppercase tracking-[0.18em] text-white/45">{trim}</p>
      </div>

      {tip ? (
        <div
          className="pointer-events-none absolute z-30 w-[188px] -translate-x-1/2 -translate-y-[calc(100%+14px)]"
          style={{ left: tip.x, top: tip.y }}
        >
          <div
            className={cn(
              "rounded-lg border bg-ink-950/95 px-2.5 py-1.5 backdrop-blur",
              tip.tone === "alert" ? "border-alert/70" : "border-ok/50"
            )}
          >
            <p
              className={cn(
                "text-[9.5px] font-semibold uppercase tracking-[0.1em]",
                tip.tone === "alert" ? "text-alert" : "text-ok"
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
        Swipe to spin · under view
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