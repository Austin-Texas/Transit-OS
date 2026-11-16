import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  BatteryMedium,
  Box,
  Car,
  Check,
  Compass,
  Fuel,
  Gauge,
  TriangleAlert,
  Truck,
} from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import Metric from "@/components/dash/Metric";
import VanStage from "@/components/dash/VanStage";
import DiagramViews, { viewFocus } from "@/components/van/DiagramViews";
import { siteWarnings } from "@/lib/siteWarnings";
import { clockTime, miles, openAlerts } from "@/lib/van";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/diagnostics")({
  head: () => ({
    meta: [
      { title: "TransitOS — Diagnostics" },
      {
        name: "description",
        content: "Explore your van in 3D: drivetrain, utilities and live faults, plus OBD-II health checks.",
      },
    ],
  }),
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const van = useVanDashboard();
  const { status, alerts, diagnostics } = van;
  const [focus, setFocus] = useState(null);

  const warnings = useMemo(() => siteWarnings(status), [status]);

  if (!status) return <ModuleShell title="Diagnostics" />;

  const faults = openAlerts(alerts).length;

  const locate = (alert) =>
    setFocus({
      viewId: null,
      id: alert.id,
      side: alert.side,
      zone: "side",
      title: alert.title,
    });

  return (
    <ModuleShell
      title="Diagnostics"
      subtitle={`${status.vehicle_name} · ${status.trim}`}
      status={status}
      meta={
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold",
            faults ? "bg-ios-orange/15 text-ios-orange" : "bg-ios-green/15 text-ios-green"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {faults ? `${faults} open fault${faults > 1 ? "s" : ""}` : "All systems nominal"}
        </span>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ModuleCard title="Live 3D diagnostics" icon={Box} className="lg:col-span-2">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_250px]">
            <VanStage
              cabinTemp={status.cabin_temp ?? status.climate_temp}
              vehicleName={status.vehicle_name}
              trim={status.trim}
              warnings={warnings}
              focus={focus}
              status={status}
              onClearFocus={() => setFocus(null)}
            />
            <DiagramViews
              active={focus?.viewId ?? "full"}
              onSelect={(id) => setFocus(id === "full" ? null : viewFocus(id))}
              status={status}
            />
          </div>
        </ModuleCard>

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
                className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-2 last:border-0"
              >
                <dt className="text-[12px] font-medium text-white/40">{label}</dt>
                <dd className="truncate text-[12.5px] font-medium text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
        </ModuleCard>

        <ModuleCard title="System diagnostics" icon={Activity} className="lg:col-span-2">
          <ul className="flex flex-col gap-2">
            {diagnostics.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.05] px-3.5 py-2.5 ring-1 ring-inset ring-white/[0.08]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                      row.state === "ok" ? "bg-ios-green/15 text-ios-green" : "bg-ios-orange/15 text-ios-orange"
                    )}
                  >
                    {row.state === "ok" ? (
                      <Check className="h-4 w-4" strokeWidth={2.4} />
                    ) : (
                      <TriangleAlert className="h-4 w-4" strokeWidth={2.2} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-white">{row.label}</span>
                    <span className="block truncate text-[11.5px] text-white/40">{row.detail}</span>
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[11.5px] font-semibold",
                    row.state === "ok" ? "text-ios-green" : "text-ios-orange"
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
                  className="flex items-center justify-between gap-3 rounded-2xl bg-ios-pink/[0.1] px-3.5 py-2.5 ring-1 ring-inset ring-ios-pink/25"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-ios-pink">{alert.title}</span>
                    <span className="block truncate text-[11.5px] text-white/40">
                      {alert.detail ? `${alert.detail} · ` : ""}
                      {alert.occurred_at ? clockTime(alert.occurred_at) : "just now"}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {alert.side === "left" || alert.side === "right" ? (
                      <button
                        type="button"
                        onClick={() => locate(alert)}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-[11.5px] font-semibold text-white transition hover:bg-white/20"
                      >
                        Locate
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => van.resolveAlert(alert.id)}
                      className="rounded-full bg-ios-green/15 px-3 py-1.5 text-[11.5px] font-semibold text-ios-green transition hover:bg-ios-green/25"
                    >
                      Resolve
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-ios-green/[0.1] px-3.5 py-3 text-[12.5px] font-medium text-ios-green ring-1 ring-inset ring-ios-green/20">
              No open alerts — the hub reports a clean bill of health.
            </p>
          )}
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}