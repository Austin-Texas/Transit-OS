import { ArrowLeft, ArrowRight } from "lucide-react";
import { clockTime, openAlerts } from "@/lib/van";
import { cn } from "@/lib/utils";

const severityDot = { critical: "bg-alert", warning: "bg-warn", info: "bg-ios-blue" };

// Open faults, kept on the diagnostics screen so a fault can be located on the
// van (or resolved) without leaving the stage.
export default function DiagnosticsAlerts({ alerts = [], onLocate, onResolve }) {
  const active = openAlerts(alerts);

  return (
    <section className="glass relative flex flex-col rounded-[26px] p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">Open alerts</h2>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            active.length ? "bg-alert/15 text-alert" : "bg-ok/15 text-ok"
          )}
        >
          {active.length}
        </span>
      </div>

      {active.length ? (
        <ul className="mt-2 flex flex-col gap-1.5">
          {active.map((alert) => (
            <li key={alert.id} className="rounded-[14px] bg-white/[0.04] px-2.5 py-2 ring-1 ring-inset ring-white/[0.07]">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                    severityDot[alert.severity] ?? "bg-warn"
                  )}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-semibold text-white/85">{alert.title}</p>
                  <p className="truncate text-[10.5px] text-white/35">
                    {alert.detail ? `${alert.detail} · ` : ""}
                    {alert.occurred_at ? clockTime(alert.occurred_at) : "just now"}
                  </p>
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-end gap-1.5">
                {alert.side ? (
                  <button
                    type="button"
                    onClick={() => onLocate(alert)}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[10.5px] font-semibold text-white/85 transition hover:bg-white/20"
                  >
                    {alert.side === "left" ? (
                      <ArrowLeft className="h-3 w-3" strokeWidth={2.4} />
                    ) : (
                      <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
                    )}
                    Locate
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onResolve(alert.id)}
                  className="rounded-full bg-ok/15 px-2 py-1 text-[10.5px] font-semibold text-ok transition hover:bg-ok/25"
                >
                  Resolve
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-[14px] bg-ok/[0.1] px-2.5 py-2 text-[11.5px] font-medium text-ok ring-1 ring-inset ring-ok/20">
          No open alerts.
        </p>
      )}
    </section>
  );
}