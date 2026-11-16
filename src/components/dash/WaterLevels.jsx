import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const TANKS = [
  { key: "fresh_water", label: "Fresh", bar: "bg-neon", track: "bg-neon/15", value: "text-neon" },
  { key: "gray_water", label: "Gray", bar: "bg-white/45", track: "bg-white/10", value: "text-white/75" },
  { key: "black_water", label: "Black", bar: "bg-white/25", track: "bg-white/10", value: "text-white/60" },
];

const level = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

// Tank levels at a glance, sitting beside the power readings on the stage.
export default function WaterLevels({ status }) {
  const fresh = level(status.fresh_water);
  const freshLow = fresh < 15;

  return (
    <section className="shrink-0 rounded-2xl border border-line/80 bg-surface p-3">
      <header className="mb-2.5 flex items-center gap-2">
        <Droplets className="h-3.5 w-3.5 text-sys-blue" strokeWidth={2} />
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Water Tanks</h2>
        <span
          className={cn(
            "ml-auto text-[9px] uppercase tracking-[0.14em]",
            freshLow ? "text-alert" : "text-white/30"
          )}
        >
          {freshLow ? "Fresh tank low" : "Levels ok"}
        </span>
      </header>

      <div className="grid grid-cols-3 gap-2.5">
        {TANKS.map((tank) => {
          const value = level(status[tank.key]);
          const low = tank.key === "fresh_water" ? value < 15 : value > 85;
          return (
            <div key={tank.key} className="rounded-xl border border-line/70 bg-surface-raised px-2.5 py-2">
              <div className="flex items-baseline justify-between gap-1">
                <span className="truncate text-[8.5px] font-medium uppercase tracking-[0.14em] text-white/40">
                  {tank.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-[13px] font-semibold leading-none",
                    low ? "text-alert" : tank.value
                  )}
                >
                  {value}%
                </span>
              </div>
              <div className={cn("mt-2 h-1.5 w-full overflow-hidden rounded-full", tank.track)}>
                <div
                  className={cn("h-full rounded-full transition-[width] duration-500", low ? "bg-alert" : tank.bar)}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}