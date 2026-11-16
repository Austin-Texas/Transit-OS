import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BedDouble,
  Camera,
  Droplets,
  Flame,
  Layers,
  LayoutGrid,
  MapPin,
  Mic,
  Snowflake,
  Zap,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { MODES } from "@/lib/van";
import { cn } from "@/lib/utils";

const DOCK = [
  { id: "home", label: "Home", icon: LayoutGrid, to: "/" },
  { id: "diagnostics", label: "Diagnostics", icon: Activity, to: "/diagnostics" },
  { id: "cabin", label: "Cabin", icon: BedDouble, to: "/camper" },
  { id: "climate", label: "Climate", icon: Snowflake, to: "/climate" },
  { id: "water", label: "Water", icon: Droplets, to: "/water" },
  { id: "lpg", label: "LPG", icon: Flame, to: "/lpg" },
  { id: "power", label: "Power", icon: Zap, to: "/electrical" },
  { id: "automation", label: "Automation", icon: Layers, to: "/automation" },
  { id: "cameras", label: "Cameras", icon: Camera, to: "/settings", hash: "cameras" },
  { id: "maps", label: "Maps", icon: MapPin, to: "/tracking" },
];

// The bar shared by every screen: quick modes with the microphone on the top
// row, one tap to each module on the row underneath.
export default function AppDock({ status, onVoice }) {
  const pathname = useLocation({ select: (location) => location.pathname });

  const setMode = (mode) => {
    if (!status?.id) return;
    base44.entities.VanStatus.update(status.id, { active_mode: mode }).catch(console.error);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2">
      {status ? (
        <div className="glass no-scrollbar flex items-center gap-2 overflow-x-auto rounded-[22px] px-3 py-2">
          <span className="shrink-0 text-[12px] font-medium text-white/40">Quick modes</span>
          <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
            {MODES.map((mode) => {
              const isActive = status.active_mode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setMode(mode.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition duration-200 active:scale-[0.98]",
                    isActive
                      ? "bg-white text-[#0b0b0f] shadow-[0_10px_26px_-14px_rgba(255,255,255,0.8)]"
                      : "bg-white/[0.07] text-white/55 ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.12] hover:text-white"
                  )}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
          {onVoice ? (
            <button
              type="button"
              onClick={onVoice}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-[12px] font-semibold text-white/70 ring-1 ring-inset ring-white/[0.08] transition hover:bg-white/[0.12] hover:text-white"
            >
              <Mic className="h-3.5 w-3.5 text-ios-teal" strokeWidth={2.2} />
              Voice
            </button>
          ) : null}
        </div>
      ) : null}

      <nav
        aria-label="TransitOS modules"
        className="glass no-scrollbar flex items-stretch gap-0.5 overflow-x-auto rounded-[26px] px-2 py-2"
      >
        {DOCK.map(({ id, label, icon: Icon, to, hash }) => {
          const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={id}
              to={to}
              hash={hash}
              aria-current={isActive ? "page" : undefined}
              className="group flex min-w-[62px] flex-1 flex-col items-center gap-1 rounded-[18px] px-1 py-1 transition duration-200"
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-[11px] transition duration-200",
                  isActive
                    ? "bg-white text-[#0b0b0f] shadow-[0_10px_24px_-14px_rgba(255,255,255,0.9)]"
                    : "bg-white/[0.06] text-white/55 group-hover:bg-white/[0.1] group-hover:text-white/80"
                )}
              >
                <Icon className="h-[16px] w-[16px]" strokeWidth={2} />
              </span>
              <span
                className={cn(
                  "truncate text-[9.5px] font-medium transition-colors",
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}