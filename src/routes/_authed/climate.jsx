import { createFileRoute } from "@tanstack/react-router";
import { Flame, Minus, Plus, Snowflake, Thermometer, Wind } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import Metric from "@/components/dash/Metric";
import ArcGauge from "@/components/van/ArcGauge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/climate")({
  head: () => ({
    meta: [
      { title: "TransitOS — Climate" },
      { name: "description", content: "Cabin temperature, set point and climate modes for your van." },
    ],
  }),
  component: ClimatePage,
});

const MODES = [
  { id: "auto", label: "Auto", detail: "Maintains the set point" },
  { id: "eco", label: "Eco", detail: "Quiet, low draw" },
  { id: "boost", label: "Boost", detail: "Fast cool or heat" },
  { id: "off", label: "Off", detail: "System idle" },
];

function ClimatePage() {
  const van = useVanDashboard();
  const { status } = van;

  if (!status) return <ModuleShell title="Climate" />;

  const temp = Number(status.climate_temp ?? 0);
  const set = Number(status.climate_set ?? 72);

  return (
    <ModuleShell
      title="Climate"
      subtitle="Cabin temperature and ventilation"
      status={status}
      meta={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sys-blue/45 bg-sys-blue/10 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-sys-blue">
          <Snowflake className="h-3 w-3" strokeWidth={2.2} />
          {status.climate_mode ?? "auto"}
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-3">
        <ModuleCard title="Thermostat" icon={Thermometer} className="lg:col-span-2">
          <div className="flex flex-col items-center gap-4 py-1 sm:flex-row sm:justify-around">
            <ArcGauge value={temp} min={40} max={100} size={196} thickness={12} color="#00f2ff">
              <p className="font-mono text-[34px] font-semibold leading-none text-white">
                {Math.round(temp)}
                <span className="text-[16px] text-white/45">°F</span>
              </p>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-sys-blue/80">Cabin</p>
            </ArcGauge>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[9.5px] uppercase tracking-[0.18em] text-white/35">Set point</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Lower set point"
                  onClick={() => van.adjustClimate(-1)}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-line/80 bg-surface-raised text-white/70 transition hover:border-sys-blue/50 hover:text-sys-blue"
                >
                  <Minus className="h-4 w-4" strokeWidth={2.4} />
                </button>
                <span className="w-16 text-center font-mono text-[24px] font-semibold text-white">{Math.round(set)}°</span>
                <button
                  type="button"
                  aria-label="Raise set point"
                  onClick={() => van.adjustClimate(1)}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-line/80 bg-surface-raised text-white/70 transition hover:border-sys-blue/50 hover:text-sys-blue"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>
              <p className="text-[10px] text-white/35">50° – 90° F</p>
            </div>
          </div>
        </ModuleCard>

        <ModuleCard title="Mode" icon={Snowflake}>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map((mode) => {
              const isActive = (status.climate_mode ?? "auto") === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => van.update({ climate_mode: mode.id })}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left transition",
                    isActive
                      ? "border-sys-blue bg-sys-blue/15 text-white"
                      : "border-line/80 bg-surface-raised text-white/60 hover:border-white/20"
                  )}
                >
                  <span className="block text-[12px] font-semibold">{mode.label}</span>
                  <span className="mt-0.5 block text-[9.5px] leading-tight text-white/40">{mode.detail}</span>
                </button>
              );
            })}
          </div>
        </ModuleCard>

        <ModuleCard title="Environment" icon={Wind} className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric icon={Thermometer} label="Interior" value={`${Math.round(temp)}°F`} />
            <Metric icon={Wind} label="Humidity" value={`${status.humidity ?? 0}%`} tone="text-white/50" />
            <Metric icon={Snowflake} label="Exterior" value={`${Math.round(status.exterior_temp ?? 0)}°F`} tone="text-white/50" />
            <Metric icon={Flame} label="Propane" value={`${status.lpg_percent ?? 0}%`} tone="text-warn" />
          </div>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}