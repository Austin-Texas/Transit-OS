import { createFileRoute } from "@tanstack/react-router";
import { Activity, BatteryMedium, Car, Check, Compass, Fuel, Gauge, TriangleAlert, Truck } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import Metric from "@/components/dash/Metric";
import { clockTime, miles, openAlerts } from "@/lib/van";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/vehicle")({
  head: () => ({
    meta: [
      { title: "TransitOS — Vehicle" },
      { name: "description", content: "Odometer, drivetrain health and OBD-II diagnostics for your van." },
    ],
  }),
  component: VehiclePage,
});

function VehiclePage() {
  const van = useVanDashboard();
  const { status, alerts, diagnostics } = van;

  if (!status) return <ModuleShell title="Vehicle" />;

  const faults = openAlerts(alerts).length;

  return (
    <ModuleShell
      title="Vehicle"
      subtitle={`${status.vehicle_name} · ${status.trim}`}
      status={status}
      meta={
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]",
            faults ? "border-alert/45 bg-alert/10 text-alert" : "border-ok/45 bg-ok/10 text-ok"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {faults ? `${faults} open fault${faults > 1 ? "s" : ""}` : "All systems nominal"}
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <ModuleCard title="Drivetrain" icon={Car}>
          <div className="grid grid-cols-2 gap-2">
            <Metric icon={Gauge} label="Odometer" value={`${miles(status.odometer)} mi`} />
            <Metric
              icon={Fuel}
              label="Engine"
              value={faults ? "Service" : "Running"}
              tone={faults ? "text-sys-red" : "text-sys-green"}
            />
            <Metric icon={BatteryMedium} label="Starter" value={`${Number(status.battery_voltage).toFixed(1)} V`} />
            <Metric icon={Compass} label="Mode" value={status.active_mode} tone="text-white/50" />
          </div>
        </ModuleCard>

        <ModuleCard title="Build & identification" icon={Truck}>
          <dl className="flex flex-col">
            {[
              ["Vehicle", status.vehicle_name],
              ["Trim", status.trim],
              ["VIN", status.vin ?? "—"],
              ["Propane", `${status.lpg_percent ?? 0}% · ${Number(status.lpg_gallons ?? 0).toFixed(1)} gal`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-2 last:border-0"
              >
                <dt className="text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</dt>
                <dd className="truncate font-mono text-[11.5px] text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
        </ModuleCard>

        <ModuleCard title="System diagnostics" icon={Activity} className="lg:col-span-2">
          <ul className="flex flex-col gap-2">
            {diagnostics.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-lg border",
                      row.state === "ok"
                        ? "border-ok/35 bg-ok/10 text-ok"
                        : "border-warn/40 bg-warn/10 text-warn"
                    )}
                  >
                    {row.state === "ok" ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                    ) : (
                      <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2.2} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11.5px] font-medium text-white">{row.label}</span>
                    <span className="block truncate text-[10px] text-white/40">{row.detail}</span>
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em]",
                    row.state === "ok" ? "text-ok/80" : "text-warn"
                  )}
                >
                  {row.state === "ok" ? "OK" : "Check"}
                </span>
              </li>
            ))}
          </ul>
        </ModuleCard>

        <ModuleCard title={`Active alerts (${alerts.length})`} icon={TriangleAlert} className="lg:col-span-2">
          {alerts.length ? (
            <ul className="flex flex-col gap-2">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-alert/35 bg-alert/[0.07] px-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[11.5px] font-medium text-alert">{alert.title}</span>
                    <span className="block truncate text-[10px] text-white/40">
                      {alert.detail ? `${alert.detail} · ` : ""}
                      {alert.occurred_at ? clockTime(alert.occurred_at) : "just now"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => van.resolveAlert(alert.id)}
                    className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70 transition hover:border-ok/50 hover:text-ok"
                  >
                    Resolve
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-ok/30 bg-ok/[0.06] px-3 py-3 text-[11.5px] text-ok">
              No open alerts — the hub reports a clean bill of health.
            </p>
          )}
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}