import { BatteryCharging, Droplet, Droplets, Flame, Fuel, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const clamp = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const ITEMS = [
  { key: "battery_percent", label: "Battery", icon: BatteryCharging, icon_tone: "text-sys-green", bar: "bg-sys-green", low: 30 },
  { key: "fresh_water", label: "Fresh", icon: Droplet, icon_tone: "text-sys-blue", bar: "bg-sys-blue", low: 20 },
  { key: "gray_water", label: "Gray", icon: Droplets, icon_tone: "text-white/45", bar: "bg-white/35", high: 85 },
  { key: "black_water", label: "Black", icon: Waves, icon_tone: "text-white/45", bar: "bg-white/25", high: 85 },
  { key: "lpg_percent", label: "Propane", icon: Flame, icon_tone: "text-purple-400", bar: "bg-purple-400", low: 20 },
  { key: "fuel_percent", label: "Fuel", icon: Fuel, icon_tone: "text-warn", bar: "bg-warn", low: 15 },
];

function Bar({ item, status }) {
  const percent = clamp(status[item.key]);
  const Icon = item.icon;
  const flagged =
    (item.low !== undefined && percent <= item.low) || (item.high !== undefined && percent >= item.high);
  const text = flagged ? "text-alert" : "text-white";

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3 w-3 shrink-0", flagged ? "text-alert" : item.icon_tone)} strokeWidth={2} />
        <span className="truncate text-[8.5px] uppercase tracking-[0.12em] text-white/40">{item.label}</span>
        <span className={cn("ml-auto shrink-0 font-mono text-[10px] font-semibold", text)}>
          {Math.round(percent)}%
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={cn("h-full rounded-full", flagged ? "bg-alert" : item.bar)}
          style={{ width: `${Math.max(2, percent)}%` }}
        />
      </div>
    </div>
  );
}

export default function UtilitySummary({ status }) {
  return (
    <section className="grid shrink-0 grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-line/80 bg-surface px-3 py-2 sm:grid-cols-3 xl:grid-cols-6">
      {ITEMS.map((item) => (
        <Bar key={item.key} item={item} status={status} />
      ))}
    </section>
  );
}