import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, Move } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import FordTransit3D from "@/components/van/FordTransit3D";
import VanSpin from "@/components/van/VanSpin";
import HotspotTip from "@/components/van/HotspotTip";
import VanPhoto from "@/components/van/VanPhoto";
import { VAN_IMAGE } from "@/lib/van";
import { cn } from "@/lib/utils";

// Every part of the van opens the module that looks after it.
const PART_MODULES = {
  water_tank: "/water",
  heat_pad: "/water",
  battery: "/electrical",
  engine: "/maintenance",
  climate: "/climate",
  cabin: "/camper",
};

// The home stage: the neon wireframe van you can spin with a finger, plus a
// photo view, exactly like the reference dashboard layout.
export default function VanStage({
  cabinTemp,
  vehicleName,
  trim,
  warnings = [],
  focus,
  status,
  mode = "3d",
  spin = false,
  onClearFocus,
}) {
  const side = focus?.side;
  const navigate = useNavigate();
  const [view, setView] = useState("3d");
  const [tip, setTip] = useState(null);

  // A diagnostic mode always has something to show, so it takes the stage.
  useEffect(() => {
    if (mode !== "3d") setView("3d");
  }, [mode]);

  return (
    <section
      className={cn(
        "photo-slot relative flex min-h-[380px] flex-1 overflow-hidden rounded-[26px] border bg-[radial-gradient(125%_120%_at_50%_-10%,#122841_0%,#0a1220_55%,#05070c_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:min-h-[430px]",
        focus ? "border-ios-pink/50" : "border-white/10"
      )}
    >
      {view === "3d" && spin && mode === "3d" ? (
        <VanSpin
          side={side}
          onPick={(key) => {
            const to = PART_MODULES[key];
            if (to) navigate({ to });
          }}
        />
      ) : view === "3d" ? (
        <FordTransit3D
          className="absolute inset-0 h-full w-full"
          focus={focus}
          warnings={warnings}
          status={status}
          mode={mode}
          onTip={setTip}
          onPick={(key) => {
            if (!key) return;
            const to = PART_MODULES[key];
            if (!to) return;
            setTip(null);
            navigate({ to });
          }}
        />
      ) : (
        <VanPhoto
          uri={status?.van_photo_uri}
          fallback={VAN_IMAGE}
          alt="Your camper van"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_68%_at_50%_44%,transparent_42%,rgba(2,6,11,0.6)_100%)]" />

      <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white/70 ring-1 ring-inset ring-white/10 backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-ios-teal" />
        {view === "3d"
          ? mode !== "3d"
            ? mode.toUpperCase()
            : spin
              ? "360 spin"
              : "Live 3D"
          : "Owner photo"}{" "}
        · Interior {Math.round(cabinTemp)}°F
      </div>

      <div className="absolute right-3 top-3 z-20 flex items-center gap-0.5 rounded-full bg-black/45 p-0.5 ring-1 ring-inset ring-white/15 backdrop-blur">
        {[
          ["3d", "3D"],
          ["photo", "Photo"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            aria-pressed={view === id}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition",
              view === id ? "bg-white/90 text-ink-950" : "text-white/60 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
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

      <HotspotTip tip={tip} />

      {view === "3d" && !(spin && mode === "3d") ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 text-[8.5px] uppercase tracking-[0.14em] text-white/35 backdrop-blur sm:flex">
          <Move className="h-3 w-3" strokeWidth={2.2} />
          Drag to spin · tap a part to open its module
        </div>
      ) : null}

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