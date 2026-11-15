import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, Car, Layers, MapPin, Moon, Plus, Workflow } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import useAutomations from "@/hooks/useAutomations";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import AutomationRule from "@/components/automation/AutomationRule";
import AutomationForm from "@/components/automation/AutomationForm";
import { MODES } from "@/lib/van";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/automation")({
  head: () => ({
    meta: [
      { title: "TransitOS — Automation" },
      {
        name: "description",
        content: "Schedules and sensor rules that run your van's climate, lighting, locks and water pump.",
      },
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
  const automations = useAutomations();
  const { status } = van;
  const [editingId, setEditingId] = useState(null);

  const editing = automations.items.find((item) => item.id === editingId) ?? null;
  const activeCount = automations.items.filter((item) => item.enabled !== false).length;

  const submit = async (payload) => {
    if (editing) await automations.update(editing.id, payload);
    else await automations.create(payload);
    setEditingId(null);
  };

  const remove = async (id) => {
    if (editingId === id) setEditingId(null);
    await automations.remove(id);
  };

  return (
    <ModuleShell
      title="Automation"
      subtitle="Schedules and rules that run the van for you"
      status={status}
      meta={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sys-blue/45 bg-sys-blue/10 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-sys-blue">
          <Workflow className="h-3 w-3" strokeWidth={2.2} />
          {activeCount} active
        </span>
      }
    >
      <div className="grid gap-3 xl:grid-cols-3">
        <ModuleCard
          title="Schedules & rules"
          icon={Workflow}
          className="xl:col-span-2"
          action={
            <span className="font-mono text-[10px] text-white/35">
              {automations.items.length} total
            </span>
          }
        >
          {automations.items.length ? (
            <ul className="flex flex-col gap-2">
              {automations.items.map((automation) => (
                <AutomationRule
                  key={automation.id}
                  automation={automation}
                  editing={automation.id === editingId}
                  onToggle={(value) => automations.update(automation.id, { enabled: value })}
                  onEdit={() => setEditingId(automation.id)}
                  onDelete={() => remove(automation.id)}
                />
              ))}
            </ul>
          ) : automations.loading ? (
            <div className="flex items-center gap-3 self-start rounded-full border border-line bg-surface px-4 py-2">
              <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-blue" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">Loading rules</span>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-line/80 px-3 py-8 text-center text-[11.5px] text-white/40">
              No automations yet. Build one on the right and the van hub will run it.
            </p>
          )}
        </ModuleCard>

        <ModuleCard title={editing ? "Edit automation" : "New automation"} icon={Plus}>
          <AutomationForm editing={editing} onSubmit={submit} onCancel={() => setEditingId(null)} />
        </ModuleCard>
      </div>

      {status ? (
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
                <span className="font-mono text-[10.5px] text-white/45">
                  {status.water_pump_on ? "running" : "idle"}
                </span>
              </li>
            </ul>
          </ModuleCard>
        </div>
      ) : null}
    </ModuleShell>
  );
}