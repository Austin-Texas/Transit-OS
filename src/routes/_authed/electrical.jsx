import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, BatteryCharging, BatteryMedium, Plug, Sun, Zap } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import useEnergyReadings from "@/hooks/useEnergyReadings";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import Metric from "@/components/dash/Metric";
import ArcGauge from "@/components/van/ArcGauge";
import BatteryChart from "@/components/electrical/BatteryChart";
import PowerChart from "@/components/electrical/PowerChart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/electrical")({
  head: () => ({
    meta: [
      { title: "TransitOS — Electrical" },
      { name: "description", content: "House battery, solar harvest and power consumption over time." },
    ],
  }),
  component: ElectricalPage,
});

const RANGES = [
  { hours: 6, label: "6H" },
  { hours: 24, label: "24H" },
  { hours: 168, label: "7D" },
];

function TrendStat({ label, value, tone = "text-white" }) {
  return (
    <div className="rounded-lg border border-line/80 bg-surface-raised px-2.5 py-1.5">
      <p className="text-[8.5px] uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className={cn("mt-0.5 font-mono text-[11.5px] font-semibold", tone)}>{value}</p>
    </div>
  );
}

function ElectricalPage() {
  const van = useVanDashboard();
  const [range, setRange] = useState(24);
  const history = useEnergyReadings(range);
  const { status } = van;

  if (!status) return <ModuleShell title="Electrical" />;

  const percent = Number(status.battery_percent ?? 0);
  const solar = Number(status.solar_w ?? 0);
  const draw = Number(status.load_w ?? 0);
  const batteries = history.points.map((point) => point.battery);
  const low = batteries.length ? Math.min(...batteries) : 0;
  const high = batteries.length ? Math.max(...batteries) : 0;

  return (
    <ModuleShell
      title="Electrical"
      subtitle="House bank, solar and consumption over time"
      status={status}
      meta={
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          {RANGES.map((option) => (
            <button
              key={option.hours}
              type="button"
              aria-pressed={range === option.hours}
              onClick={() => setRange(option.hours)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] transition",
                range === option.hours ? "bg-sys-blue text-white" : "text-white/45 hover:text-white/80"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <ModuleCard
          title="Battery level"
          icon={BatteryCharging}
          action={<span className="font-mono text-[10px] text-white/35">{history.count} readings</span>}
        >
          {history.loading ? (
            <div className="h-[190px] animate-pulse rounded-xl border border-line/60 bg-surface-raised" />
          ) : history.points.length ? (
            <BatteryChart points={history.points} />
          ) : (
            <p className="grid h-[190px] place-items-center rounded-xl border border-dashed border-line/80 text-[11px] text-white/40">
              No battery readings in this window yet.
            </p>
          )}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <TrendStat label="Now" value={`${percent}%`} tone="text-ok" />
            <TrendStat label="Low" value={`${low}%`} />
            <TrendStat label="High" value={`${high}%`} />
          </div>
        </ModuleCard>

        <ModuleCard
          title="Power flow"
          icon={Activity}
          action={
            <span className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.12em] text-white/40">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                Solar
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" />
                Draw
              </span>
            </span>
          }
        >
          {history.loading ? (
            <div className="h-[190px] animate-pulse rounded-xl border border-line/60 bg-surface-raised" />
          ) : history.points.length ? (
            <PowerChart points={history.points} />
          ) : (
            <p className="grid h-[190px] place-items-center rounded-xl border border-dashed border-line/80 text-[11px] text-white/40">
              No power readings in this window yet.
            </p>
          )}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <TrendStat label="Draw now" value={`${draw} W`} tone="text-warn" />
            <TrendStat label="Solar peak" value={`${history.solarPeak} W`} tone="text-sys-blue" />
            <TrendStat label="Avg draw" value={`${history.avgLoad} W`} />
          </div>
        </ModuleCard>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <ModuleCard title="House battery" icon={BatteryCharging}>
          <div className="flex flex-col items-center gap-3 py-1">
            <ArcGauge value={percent} size={168} thickness={11} color="#00ff41">
              <p className="font-mono text-[30px] font-semibold leading-none text-white">{percent}%</p>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-ok/80">State of charge</p>
            </ArcGauge>
            <div className="grid w-full grid-cols-2 gap-2">
              <Metric icon={BatteryMedium} label="Bank" value="LiFePO4" tone="text-sys-green" />
              <Metric icon={Zap} label={solar > 0 ? "Charging" : "Idle"} value={`${solar} W`} tone="text-sys-green" />
            </div>
          </div>
        </ModuleCard>

        <ModuleCard title="Solar" icon={Sun}>
          <div className="grid grid-cols-2 gap-2">
            <Metric icon={Sun} label="Input" value={`${solar} W`} tone="text-sys-green" />
            <Metric icon={Zap} label="Draw" value={`${draw} W`} tone="text-warn" />
            <Metric icon={BatteryMedium} label="Starter" value={`${Number(status.battery_voltage).toFixed(1)} V`} />
            <Metric
              icon={Plug}
              label="Alternator"
              value={status.active_mode === "driving" ? "Charging" : "Standby"}
              tone="text-white/50"
            />
          </div>
          <p className="mt-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[10.5px] leading-relaxed text-white/40">
            Panels are harvesting {solar} W while the van draws {draw} W. The house bank is {percent}% charged
            and the starter battery reads {Number(status.battery_voltage).toFixed(1)} V.
          </p>
        </ModuleCard>

        <ModuleCard title="12V circuits" icon={Plug}>
          <ul className="flex flex-col gap-2">
            {[
              { name: "Refrigerator", load: "3.2 A", on: true },
              { name: "Roof fan", load: "1.1 A", on: status.active_mode !== "away" },
              { name: "USB / outlets", load: "0.8 A", on: true },
              { name: "Water pump", load: status.water_pump_on ? "4.0 A" : "0 A", on: Boolean(status.water_pump_on) },
            ].map((circuit) => (
              <li
                key={circuit.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5"
              >
                <span className="truncate text-[11.5px] text-white/75">{circuit.name}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-[10.5px] text-white/45">{circuit.load}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${circuit.on ? "bg-ok" : "bg-white/25"}`} />
                </span>
              </li>
            ))}
          </ul>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}