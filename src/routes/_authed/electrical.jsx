import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, BatteryMedium, Plug, Sun, Zap } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import Metric from "@/components/dash/Metric";
import ArcGauge from "@/components/van/ArcGauge";

export const Route = createFileRoute("/_authed/electrical")({
  head: () => ({
    meta: [
      { title: "TransitOS — Electrical" },
      { name: "description", content: "House battery, solar harvest and 12V systems for your camper." },
    ],
  }),
  component: ElectricalPage,
});

function ElectricalPage() {
  const van = useVanDashboard();
  const { status } = van;

  if (!status) return <ModuleShell title="Electrical" />;

  const percent = Number(status.battery_percent ?? 0);
  const solar = Number(status.solar_w ?? 0);

  return (
    <ModuleShell title="Electrical" subtitle="House bank, solar and 12V distribution" status={status}>
      <div className="grid gap-3 lg:grid-cols-3">
        <ModuleCard title="House battery" icon={BatteryCharging}>
          <div className="flex flex-col items-center gap-3 py-1">
            <ArcGauge value={percent} size={168} thickness={11} color="#00ff41">
              <p className="font-mono text-[30px] font-semibold leading-none text-white">{percent}%</p>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-ok/80">State of charge</p>
            </ArcGauge>
            <div className="grid w-full grid-cols-2 gap-2">
              <Metric icon={BatteryMedium} label="Bank" value="LiFePO4" tone="text-sys-green" />
              <Metric icon={Zap} label={`${solar > 0 ? "Charging" : "Idle"}`} value={`${solar} W`} tone="text-sys-green" />
            </div>
          </div>
        </ModuleCard>

        <ModuleCard title="Solar" icon={Sun}>
          <div className="grid grid-cols-2 gap-2">
            <Metric icon={Sun} label="Input" value={`${solar} W`} tone="text-sys-green" />
            <Metric icon={BatteryMedium} label="Starter" value={`${Number(status.battery_voltage).toFixed(1)} V`} />
            <Metric icon={Plug} label="Alternator" value={status.active_mode === "driving" ? "Charging" : "Standby"} tone="text-white/50" />
            <Metric icon={Zap} label="Roof array" value="2 × 200 W" tone="text-white/50" />
          </div>
          <p className="mt-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[10.5px] leading-relaxed text-white/40">
            Panels are harvesting {solar} W right now. The house bank is {percent}% charged and the
            starter battery reads {Number(status.battery_voltage).toFixed(1)} V.
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
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${circuit.on ? "bg-ok" : "bg-white/25"}`}
                  />
                </span>
              </li>
            ))}
          </ul>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}