import { Activity, Bell, Check, Gauge, X, TriangleAlert } from "lucide-react";
import { clockTime, openAlerts } from "@/lib/van";

const iconFor = (alert) => (/misfire|engine|p0\d/i.test(alert.title) ? Gauge : TriangleAlert);

function AlertRow({ alert, onResolve }) {
  const Icon = iconFor(alert);
  return (
    <li className="group flex items-start gap-2.5 rounded-xl border border-alert/35 bg-alert/[0.07] p-2.5 transition hover:border-alert/60">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-alert/30 bg-alert/10 text-alert">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium leading-snug text-alert">{alert.title}</p>
        {alert.detail ? <p className="mt-0.5 truncate text-[9.5px] text-white/45">{alert.detail}</p> : null}
        <p className="mt-1 font-mono text-[9px] text-white/30">{clockTime(alert.occurred_at)}</p>
      </div>
      <button
        type="button"
        onClick={() => onResolve(alert)}
        aria-label={`Resolve ${alert.title}`}
        className="shrink-0 rounded p-1 text-white/25 transition hover:text-white"
      >
        <X className="h-3 w-3" strokeWidth={2.4} />
      </button>
    </li>
  );
}

export default function AlertsPanel({ alerts = [], warnings = [], onResolve, onDiagnostics }) {
  const active = openAlerts(alerts);
  const total = active.length + warnings.length;

  return (
    <aside className="panel-surface flex flex-col rounded-2xl border border-neon/25 p-4">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-alert/80" strokeWidth={1.8} />
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Alerts ({total})</h2>
        </div>
        <span
          className={
            total ? "h-1.5 w-1.5 animate-soft-pulse rounded-full bg-alert" : "h-1.5 w-1.5 rounded-full bg-ok"
          }
        />
      </header>

      {active.length ? (
        <ul className="mt-3 max-h-[300px] space-y-2.5 overflow-y-auto">
          {active.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onResolve={onResolve} />
          ))}
        </ul>
      ) : null}

      {warnings.length ? (
        <ul className="mt-2 space-y-2">
          {warnings.map((warning) => (
            <li
              key={warning.id}
              className="rounded-xl border border-warn/35 bg-warn/[0.06] p-2.5"
            >
              <p className="truncate text-[11px] font-medium leading-snug text-warn">{warning.title}</p>
              {warning.detail ? <p className="mt-0.5 truncate text-[9.5px] text-white/45">{warning.detail}</p> : null}
              <p className="mt-1 text-[8.5px] uppercase tracking-[0.14em] text-white/25">
                Live telemetry · {warning.side ?? "van"} side
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {!total ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
          <Check className="h-5 w-5 text-ok" strokeWidth={2} />
          <p className="text-[11px] text-white/45">No active alerts</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onDiagnostics}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-neon/50 bg-neon/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neon shadow-[0_0_28px_-12px_rgba(0,240,255,1)] transition hover:bg-neon/20"
      >
        <Activity className="h-3.5 w-3.5" strokeWidth={2} />
        Run Diagnostics
      </button>
    </aside>
  );
}