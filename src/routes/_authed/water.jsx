import { createFileRoute } from "@tanstack/react-router";
import { Droplets, RefreshCw, Waves } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import ToggleRow from "@/components/dash/ToggleRow";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/water")({
  head: () => ({
    meta: [
      { title: "TransitOS — Water" },
      { name: "description", content: "Fresh, gray and black tank levels with the water pump control." },
    ],
  }),
  component: WaterPage,
});

const TANKS = [
  { key: "fresh_water", label: "Fresh", hint: "Drinking water", tone: "bg-sys-blue" },
  { key: "gray_water", label: "Gray", hint: "Sink & shower", tone: "bg-white/40" },
  { key: "black_water", label: "Black", hint: "Toilet", tone: "bg-warn" },
];

function WaterPage() {
  const van = useVanDashboard();
  const { status } = van;

  if (!status) return <ModuleShell title="Water" />;

  return (
    <ModuleShell title="Water" subtitle="Tank levels, pump and drainage" status={status}>
      <div className="grid gap-3 lg:grid-cols-3">
        <ModuleCard title="Tanks" icon={Droplets} className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-3">
            {TANKS.map((tank) => {
              const value = Number(status[tank.key] ?? 0);
              return (
                <div key={tank.key} className="flex flex-col items-center gap-2">
                  <div className="relative h-[168px] w-full overflow-hidden rounded-xl border border-line/80 bg-surface-raised">
                    <div
                      className={cn("absolute inset-x-0 bottom-0 transition-all duration-700 ease-out", tank.tone)}
                      style={{ height: `${Math.min(100, Math.max(0, value))}%` }}
                    />
                    <div className="absolute inset-x-0 top-3 text-center">
                      <p className="font-mono text-[15px] font-semibold text-white mix-blend-difference">{value}%</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{tank.label}</p>
                    <p className="text-[9.5px] text-white/30">{tank.hint}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ModuleCard>

        <ModuleCard title="Pump" icon={Waves}>
          <ToggleRow
            icon={Waves}
            label="Water pump"
            sub={status.water_pump_on ? "Running · 4.0 A" : "Idle"}
            checked={Boolean(status.water_pump_on)}
            onChange={(value) => van.update({ water_pump_on: value })}
          />
          <p className="mt-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[10.5px] leading-relaxed text-white/40">
            The pump pressurises the fresh line. Switch it off while driving to avoid running dry.
          </p>
        </ModuleCard>

        <ModuleCard title="Tank actions" icon={RefreshCw} className="lg:col-span-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => van.update({ fresh_water: 100 })}
              className="rounded-xl border border-sys-blue/45 bg-sys-blue/10 px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-sys-blue transition hover:bg-sys-blue/20"
            >
              Mark fresh full
            </button>
            <button
              type="button"
              onClick={() => van.update({ gray_water: 0 })}
              className="rounded-xl border border-line/80 bg-surface-raised px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65 transition hover:border-white/25 hover:text-white"
            >
              Dumped gray
            </button>
            <button
              type="button"
              onClick={() => van.update({ black_water: 0 })}
              className="rounded-xl border border-line/80 bg-surface-raised px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65 transition hover:border-white/25 hover:text-white"
            >
              Dumped black
            </button>
          </div>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}