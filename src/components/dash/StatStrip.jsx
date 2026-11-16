import { BatteryCharging, Droplet, Droplets, Fuel, Gauge, Sun, Thermometer, CircleDot } from "lucide-react";
import { TANK_CAPACITY_GAL, gallonsFrom } from "@/lib/van";
import { FUEL_CAPACITY_GAL } from "@/lib/siteWarnings";
import { cn } from "@/lib/utils";

function Stat({ icon: Icon, label, value, sub, tone = "text-white/45", alert = false }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl border bg-surface px-3 py-2.5",
        alert ? "border-alert/50 bg-alert/[0.06]" : "border-line/80"
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3.5 w-3.5", alert ? "text-alert" : tone)} strokeWidth={1.9} />
        <span className="truncate text-[9px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={cn("font-mono text-[13px] font-semibold leading-none", alert ? "text-alert" : "text-white")}>
          {value}
        </span>
        {sub ? <span className="font-mono text-[10px] leading-none text-white/40">{sub}</span> : null}
      </div>
    </div>
  );
}

export default function StatStrip({ status, faultCount, warnings = [] }) {
  const freshGal = gallonsFrom(status.fresh_water, TANK_CAPACITY_GAL.fresh_water);
  const grayGal = gallonsFrom(status.gray_water, TANK_CAPACITY_GAL.gray_water);
  const fuelGal = gallonsFrom(status.fuel_percent, FUEL_CAPACITY_GAL);
  const tireAlert = warnings.some((warning) => warning.id?.startsWith("tire_"));
  const fuelAlert = warnings.some((warning) => warning.id === "fuel_level");
  const tireValues = [status.tire_fl, status.tire_fr, status.tire_rl, status.tire_rr].filter((psi) =>
    Number.isFinite(Number(psi))
  );
  const lowest = tireValues.length ? Math.min(...tireValues) : null;

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-4">
      <Stat
        icon={BatteryCharging}
        label="Battery"
        value={`${Number(status.battery_voltage ?? 12).toFixed(1)} V`}
        sub={`${Math.round(status.battery_percent ?? 0)}%`}
        tone="text-sys-green"
      />
      <Stat icon={Sun} label="Solar" value={`${status.solar_w ?? 0} W`} tone="text-sys-green" />
      <Stat
        icon={Droplet}
        label="Fresh water"
        value={`${freshGal.toFixed(1)}`}
        sub="gal"
        tone="text-sys-blue"
      />
      <Stat icon={Droplets} label="Gray water" value={`${grayGal.toFixed(1)}`} sub="gal" tone="text-white/55" />
      <Stat
        icon={Fuel}
        label="Fuel"
        value={`${Math.round(status.fuel_percent ?? 0)}%`}
        sub={`${fuelGal.toFixed(1)} gal`}
        tone="text-warn"
        alert={fuelAlert}
      />
      <Stat
        icon={CircleDot}
        label="Tire pressure"
        value={lowest === null ? "—" : `${lowest} PSI`}
        sub={tireAlert ? "check" : "ok"}
        tone="text-white/55"
        alert={tireAlert}
      />
      <Stat
        icon={Thermometer}
        label="Interior"
        value={`${Math.round(status.climate_temp ?? 0)}°F`}
        sub={`${Math.round(status.humidity ?? 0)}%`}
        tone="text-sys-blue"
      />
      <Stat
        icon={Gauge}
        label="Engine"
        value={faultCount ? `${faultCount} Fault${faultCount > 1 ? "s" : ""}` : "No Faults"}
        tone={faultCount ? "text-sys-red" : "text-sys-green"}
        alert={Boolean(faultCount)}
      />
    </div>
  );
}