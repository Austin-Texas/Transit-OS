import { Minus, Plus, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "auto", label: "Auto" },
  { id: "eco", label: "Eco" },
  { id: "boost", label: "Boost" },
  { id: "off", label: "Off" },
];

// Climate modes and the set point, adjustable straight from the main screen.
export default function ClimateControl({ temp, set, mode, onChangeMode, onAdjust }) {
  const active = mode ?? "auto";
  const running = active !== "off";

  return (
    <section className="relative flex flex-col overflow-hidden rounded-xl border border-line/80 bg-gradient-to-b from-ink-800 to-ink-900 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-md border transition-colors",
            running ? "border-transparent bg-sys-blue/15 text-sys-blue" : "border-line/70 bg-white/[0.04] text-white/35"
          )}
        >
          <Thermometer className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11.5px] font-semibold tracking-tight text-white">Climate</span>
          <span className="block truncate text-[9px] uppercase tracking-[0.14em] text-white/35">
            {running ? `${active} · interior ${Math.round(temp)}°F` : "System idle"}
          </span>
        </span>

        <span className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Lower set point"
            onClick={() => onAdjust(-1)}
            className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-sys-blue/50 hover:text-sys-blue active:translate-y-[1px]"
          >
            <Minus className="h-3 w-3" strokeWidth={2.6} />
          </button>
          <span className="w-12 text-center font-mono text-[15px] font-semibold text-white">{Math.round(set)}°</span>
          <button
            type="button"
            aria-label="Raise set point"
            onClick={() => onAdjust(1)}
            className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-sys-blue/50 hover:text-sys-blue active:translate-y-[1px]"
          >
            <Plus className="h-3 w-3" strokeWidth={2.6} />
          </button>
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-4 gap-1 rounded-full border border-white/[0.06] bg-ink-950 p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)]">
        {MODES.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChangeMode(item.id)}
              className={cn(
                "rounded-full py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] transition-all duration-200 active:translate-y-[1px]",
                isActive
                  ? item.id === "off"
                    ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                    : "bg-sys-blue/20 text-sys-blue shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                  : "text-white/35 hover:text-white/70"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}