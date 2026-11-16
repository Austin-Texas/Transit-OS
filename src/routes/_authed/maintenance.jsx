import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Wrench } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import useMaintenance from "@/hooks/useMaintenance";
import { syncVanAlerts } from "@/lib/server-fns";
import { formatMiles, serviceState } from "@/lib/maintenance";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import MaintenanceCard from "@/components/maintenance/MaintenanceCard";
import MaintenanceForm from "@/components/maintenance/MaintenanceForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RANK = { due: 0, soon: 1, ok: 2 };

export const Route = createFileRoute("/_authed/maintenance")({
  head: () => ({
    meta: [
      { title: "TransitOS — Maintenance" },
      { name: "description", content: "Service intervals for every part, checked against the odometer." },
    ],
  }),
  component: MaintenancePage,
});

function Tile({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-line/80 bg-surface-raised px-3 py-2">
      <p className="text-[8.5px] uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className={cn("mt-0.5 font-mono text-[14px] font-semibold", tone ?? "text-white")}>{value}</p>
    </div>
  );
}

function MaintenancePage() {
  const van = useVanDashboard();
  const maintenance = useMaintenance();
  const [form, setForm] = useState(null);

  const odometer = van.status?.odometer ?? null;

  // Alerts follow every change, so a part that just came due is flagged and
  // pushed without waiting for the next telemetry sample.
  const resync = () => {
    syncVanAlerts().catch(() => {});
  };

  const sorted = useMemo(() => {
    return [...maintenance.items].sort((a, b) => {
      const left = serviceState(a, odometer);
      const right = serviceState(b, odometer);
      return (RANK[left.status] ?? 3) - (RANK[right.status] ?? 3) || right.progress - left.progress;
    });
  }, [maintenance.items, odometer]);

  const due = sorted.filter((item) => serviceState(item, odometer).due).length;
  const soon = sorted.filter((item) => serviceState(item, odometer).soon).length;

  const close = () => setForm(null);

  const save = async (values) => {
    if (form?.item) await maintenance.update(form.item.id, values);
    else await maintenance.create(values);
    close();
    resync();
  };

  const service = async (item) => {
    await maintenance.markServiced(item, odometer);
    resync();
  };

  const remove = async (item) => {
    await maintenance.remove(item.id);
    resync();
  };

  return (
    <ModuleShell
      title="Maintenance"
      subtitle="Service limits tracked against your odometer"
      status={van.status}
      meta={
        <Button size="sm" onClick={() => setForm({ item: null })} className="h-8 gap-1.5 text-[11px]">
          <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
          Track a part
        </Button>
      }
    >
      {van.status ? (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px]">
          <ModuleCard
            title={sorted.length ? `${sorted.length} parts tracked` : "Parts tracked"}
            icon={Wrench}
            action={
              <span className="font-mono text-[9.5px] text-white/35">
                Odometer {odometer === null ? "—" : formatMiles(odometer)}
              </span>
            }
          >
            {maintenance.loading ? (
              <div className="h-[120px] animate-soft-pulse rounded-lg bg-white/[0.03]" />
            ) : sorted.length ? (
              <div className="grid gap-2">
                {sorted.map((item) => (
                  <MaintenanceCard
                    key={item.id}
                    item={item}
                    odometer={odometer}
                    onService={service}
                    onEdit={(target) => setForm({ item: target })}
                    onDelete={remove}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-line/80 px-4 py-6 text-center text-[10px] leading-relaxed text-white/35">
                No parts tracked yet. Add oil, tires, filters or detectors and each one is checked against the
                odometer and the date it was last serviced.
              </p>
            )}
          </ModuleCard>

          <div className="grid gap-2.5 self-start">
            <Tile label="Due now" value={due} tone={due ? "text-alert" : undefined} />
            <Tile label="Due soon" value={soon} tone={soon ? "text-warn" : undefined} />
            <ModuleCard title="How it works" icon={Wrench}>
              <p className="text-[9.5px] leading-relaxed text-white/40">
                Each part carries a mileage or day interval and the reading it was last serviced at. When either
                limit passes, an alert opens in the dashboard, lands in the alert strip and is pushed to your
                phone alongside the other van warnings.
              </p>
            </ModuleCard>
          </div>
        </div>
      ) : null}

      {form ? (
        <MaintenanceForm
          item={form.item}
          odometer={odometer}
          onClose={close}
          onSave={save}
        />
      ) : null}
    </ModuleShell>
  );
}