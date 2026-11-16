import { Droplets, Power, Thermometer } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TANK_CAPACITY_GAL } from "@/lib/van";
import { heatPad } from "@/lib/heatPad";
import { cn } from "@/lib/utils";

const TANKS = [
  { key: "fresh_water", label: "Fresh", capacity: TANK_CAPACITY_GAL.fresh_water, fill: "bg-neon", text: "text-neon" },
  { key: "gray_water", label: "Gray", capacity: TANK_CAPACITY_GAL.gray_water, fill: "bg-white/60", text: "text-white/80" },
  { key: "black_water", label: "Black", capacity: TANK_CAPACITY_GAL.black_water, fill: "bg-white/40", text: "text-white/65" },
];

const SEGMENTS = 16;
const clamp = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

function Tank({ tank, percent }) {
  const litresLow = tank.key === "fresh_water" && percent < 15;
  const full = tank.key !== "fresh_water" && percent > 85;
  const filled = Math.round((percent / 100) * SEGMENTS);
  const gallons = ((percent / 100) * tank.capacity).toFixed(1);

  return (
    <div className="rounded-xl border border-line/70 bg-surface-raised p-2.5">
      <div className="flex items-baseline justify-between gap-1">
        <span className="truncate text-[8.5px] font-medium uppercase tracking-[0.14em] text-white/40">
          {tank.label}
        </span>
        <span className={cn("font-mono text-[9px] font-semibold", litresLow || full ? "text-alert" : "text-white/35")}>
          {percent}%
        </span>
      </div>

      <div className="mt-1 flex items-baseline gap-1">
        <span className={cn("font-mono text-[17px] font-semibold leading-none", litresLow || full ? "text-alert" : tank.text)}>
          {gallons}
        </span>
        <span className="text-[8.5px] uppercase tracking-[0.12em] text-white/30">gal</span>
      </div>
      <p className="mt-0.5 text-[8px] uppercase tracking-[0.1em] text-white/25">
        of {tank.capacity} gal
      </p>

      <div className="mt-2 flex gap-[2px]">
        {Array.from({ length: SEGMENTS }).map((_, index) => {
          const on = index < filled;
          return (
            <span
              key={index}
              className={cn(
                "h-2.5 flex-1 rounded-[1px] transition-opacity duration-300",
                on ? (litresLow || full ? "bg-alert" : tank.fill) : "bg-white/[0.07]"
              )}
              style={{ opacity: on ? 1 - index / (SEGMENTS * 2.4) : 1 }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function WaterLevels({ status }) {
  const fresh = clamp(status.fresh_water);
  const gray = clamp(status.gray_water);
  const black = clamp(status.black_water);
  const pump = Boolean(status.water_pump_on);
  const pad = heatPad(status);
  const total = { fresh: fresh, gray, black };

  return (
    <section className="shrink-0 rounded-2xl border border-line/80 bg-surface p-3">
      <header className="mb-2.5 flex items-center gap-2">
        <Droplets className="h-3.5 w-3.5 text-sys-blue" strokeWidth={2} />
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Water Tanks</h2>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em]",
            pump ? "border-neon/40 bg-neon/10 text-neon" : "border-line text-white/30"
          )}
        >
          <Power className="h-2.5 w-2.5" strokeWidth={2.4} />
          {pump ? "Pump on" : "Pump off"}
        </span>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {TANKS.map((tank) => (
          <Tank key={tank.key} tank={tank} percent={clamp(status[tank.key])} />
        ))}
      </div>

      <p className="mt-2 text-[8.5px] uppercase tracking-[0.12em] text-white/25">
        Total on board · {(total.fresh / 100 * TANK_CAPACITY_GAL.fresh_water).toFixed(1)} gal fresh ·{" "}
        {(gray / 100 * TANK_CAPACITY_GAL.gray_water).toFixed(1)} gal gray
      </p>

      <Link
        to="/water"
        hash="diagnostics"
        className={cn(
          "mt-2 flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] transition",
          pad.fault
            ? "border-alert/55 bg-alert/10 text-alert hover:bg-alert/20"
            : "border-line/70 bg-surface-raised text-white/40 hover:text-white/70"
        )}
      >
        <Thermometer className="h-3 w-3 shrink-0" strokeWidth={2.4} />
        {pad.fault
          ? "Heat pad fault · underbody"
          : pad.known
            ? `Heat pad ${pad.label.toLowerCase()}${pad.temp !== null ? ` · ${Math.round(pad.temp)}°F` : ""}`
            : "Heat pad · no report"}
        <span className="ml-auto text-[8px] tracking-[0.1em] text-white/25">Diagnostics</span>
      </Link>
    </section>
  );
}