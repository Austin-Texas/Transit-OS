import { BatteryCharging, CloudSun, Droplet, Droplets, Gauge, Sun, Thermometer } from "lucide-react";

function Stat({ icon: Icon, label, value, sub, tone = "text-white/45" }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-line/80 bg-surface px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className={`h-3.5 w-3.5 ${tone}`} strokeWidth={1.9} />
        <span className="truncate text-[9px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="font-mono text-[13px] font-semibold leading-none text-white">{value}</span>
        {sub ? <span className="font-mono text-[10px] leading-none text-white/40">{sub}</span> : null}
      </div>
    </div>
  );
}

export default function StatStrip({ status, faultCount }) {
  const battery = status.battery_percent;
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
      <Stat icon={BatteryCharging} label="Battery" value={`${Number(status.battery_voltage).toFixed(1)} V`} sub={`${battery}%`} tone="text-sys-green" />
      <Stat icon={Sun} label="Solar" value={`${status.solar_w ?? 0} W`} tone="text-sys-green" />
      <Stat icon={Droplet} label="Fresh Water" value={`${status.fresh_water}%`} tone="text-sys-blue" />
      <Stat icon={Droplets} label="Gray Water" value={`${status.gray_water}%`} tone="text-white/55" />
      <Stat icon={Thermometer} label="Interior" value={`${Math.round(status.climate_temp)}°F`} sub={`${status.humidity ?? 0}%`} tone="text-sys-blue" />
      <Stat icon={CloudSun} label="Exterior" value={`${Math.round(status.exterior_temp ?? 0)}°F`} />
      <Stat
        icon={Gauge}
        label="Engine"
        value={faultCount ? `${faultCount} Fault${faultCount > 1 ? "s" : ""}` : "No Faults"}
        tone={faultCount ? "text-sys-red" : "text-sys-green"}
      />
    </div>
  );
}