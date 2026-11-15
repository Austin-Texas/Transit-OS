import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, Car, Layers, MapPin, Moon } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import { MODES } from "@/lib/van";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/automation")({
  head: () => ({
    meta: [
      { title: "TransitOS — Automation" },
      { name: "description", content: "Quick modes that set climate, lighting, locks and pump in one tap." },
    ],
  }),
  component: AutomationPage,
});

const MODE_ICONS = { camping: MapPin, sleeping: BedDouble, driving: Car, away: Moon, custom: Layers };

const MODE_SUMMARIES = {
  camping: "Lights on, pump ready, climate at set point, all compartments locked.",
  sleeping: "Dim lighting, quiet climate, doors locked.",
  driving: "Pump off, cabinets locked, climate in eco.",
  away: "Everything locked, lights off, pump off.",
  custom: "Whatever you last configured by hand.",
};

function AutomationPage() {
  const van = useVanDashboard();
  const { status } = van;

  if (!status) return <ModuleShell title="Automation" />;

  return (
    <ModuleShell
      title="Automation"
      subtitle="One-tap modes for the whole van"
      status={status}
      meta={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sys-blue/45 bg-sys-blue/10 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-sys-blue">
          <Layers className="h-3 w-3" strokeWidth={2.2} />
          {status.active_mode}
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <ModuleCard title="Quick modes" icon={Layers}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MODES.map((mode) => {
              const Icon = MODE_ICONS[mode.id] ?? Layers;
              const isActive = status.active_mode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => van.setMode(mode.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border px-3 py-3 text-left transition",
                    isActive
                      ? "border-sys-blue bg-sys-blue/15 text-white"
                      : "border-line/80 bg-surface-raised text-white/60 hover:border-white/20"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-sys-blue" : "text-white/40")} strokeWidth={1.9} />
                  <span className="text-[12px] font-semibold">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </ModuleCard>

        <ModuleCard title={`What "${status.active_mode}" does`} icon={MapPin}>
          <p className="rounded-xl border border-line/80 bg-surface-raised px-3 py-3 text-[11.5px] leading-relaxed text-white/55">
            {MODE_SUMMARIES[status.active_mode] ?? MODE_SUMMARIES.custom}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            <li className="flex items-center justify-between rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5">
              <span className="text-[11.5px] text-white/75">Climate</span>
              <span className="font-mono text-[10.5px] text-white/45">
                {status.climate_mode ?? "auto"} · {Math.round(status.climate_set ?? 72)}°F
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5">
              <span className="text-[11.5px] text-white/75">Lighting</span>
              <span className="font-mono text-[10.5px] text-white/45">
                {status.lights_on ? `on · ${status.light_level ?? 70}%` : "off"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5">
              <span className="text-[11.5px] text-white/75">Locks</span>
              <span className="font-mono text-[10.5px] text-white/45">
                {status.locks_locked === false ? "open" : "locked"}
              </span>
            </li>
            <li className="flex items-center justify-between rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5">
              <span className="text-[11.5px] text-white/75">Water pump</span>
              <span className="font-mono text-[10.5px] text-white/45">{status.water_pump_on ? "running" : "idle"}</span>
            </li>
          </ul>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}