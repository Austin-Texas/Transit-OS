import { Activity, Check, X } from "lucide-react";
import { clockTime, openAlerts } from "@/lib/van";

function AlertRow({ alert, onResolve }) {
  return (
    <li className="group relative overflow-hidden rounded-xl border border-alert/25 bg-alert/[0.07] p-2.5 pl-3 transition hover:border-alert/50">
      <span className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-alert" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium leading-snug text-alert">{alert.title}</p>
          {alert.detail ? <p className="mt-0.5 truncate text-[9.5px] text-white/45">{alert.detail}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => onResolve(alert)}
          aria-label={`Resolve ${alert.title}`}
          className="shrink-0 rounded p-1 text-white/25 transition hover:text-white"
        >
          <X className="h-3 w-3" strokeWidth={2.4} />
        </button>
      </div>
      <p className="mt-1.5 font-mono text-[9px] text-white/30">{clockTime(alert.occurred_at)}</p>
    </li>
  );
}

export default function AlertsPanel({ alerts, onResolve, onDiagnostics }) {
  const active = openAlerts(alerts);
  return (
    <aside className="panel-surface flex flex-col rounded-2xl border border-neon/15 p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Alerts ({active.length})</h2>
        <span className={active.length ? "h-1.5 w-1.5 animate-soft-pulse rounded-full bg-alert" : "h-1.5 w-1.5 rounded-full bg-ok"} />
      </header>

      {active.length ? (
        <ul className="mt-3 max-h-[300px] space-y-2.5 overflow-y-auto">
          {active.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onResolve={onResolve} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
          <Check className="h-5 w-5 text-ok" strokeWidth={2} />
          <p className="text-[11px] text-white/45">No active alerts</p>
        </div>
      )}

      <button
        type="button"
        onClick={onDiagnostics}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-neon/40 bg-neon/10 px-3 py-2.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neon transition hover:bg-neon/20"
      >
        <Activity className="h-3.5 w-3.5" strokeWidth={2} />
        Run Diagnostics
      </button>
    </aside>
  );
}