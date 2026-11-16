import { Activity, Bell, Check, Gauge, X, TriangleAlert } from "lucide-react";
import { clockTime, openAlerts } from "@/lib/van";

const iconFor = (alert) => (/misfire|engine|p0\d/i.test(alert.title) ? Gauge : TriangleAlert);

function AlertRow({ alert, onResolve }) {
  const Icon = iconFor(alert);
  return (
    <li className="glass-inset group flex items-start gap-3 rounded-2xl p-3 transition hover:bg-white/[0.09]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ios-pink/15 text-ios-pink">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-snug text-white">{alert.title}</p>
        {alert.detail ? <p className="mt-0.5 truncate text-[11.5px] text-white/45">{alert.detail}</p> : null}
        <p className="mt-1 text-[11px] font-medium text-white/30">{clockTime(alert.occurred_at)}</p>
      </div>
      <button
        type="button"
        onClick={() => onResolve(alert)}
        aria-label={`Resolve ${alert.title}`}
        className="shrink-0 rounded-full p-1.5 text-white/30 transition hover:bg-white/10 hover:text-white"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.4} />
      </button>
    </li>
  );
}

export default function AlertsPanel({ alerts = [], warnings = [], onResolve, onDiagnostics }) {
  const active = openAlerts(alerts);
  const total = active.length + warnings.length;

  return (
    <aside className="glass relative flex h-full flex-col overflow-hidden rounded-[28px] p-5">
      <span className="sheen" aria-hidden="true" />
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ios-pink/15 text-ios-pink">
            <Bell className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight text-white">Alerts</h2>
            <p className="text-[11px] text-white/40">{total ? `${total} need attention` : "All clear"}</p>
          </div>
        </div>
        <span
          className={
            total ? "h-2 w-2 animate-soft-pulse rounded-full bg-ios-pink" : "h-2 w-2 rounded-full bg-ios-green"
          }
        />
      </header>

      {active.length ? (
        <ul className="mt-4 max-h-[300px] space-y-2 overflow-y-auto">
          {active.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onResolve={onResolve} />
          ))}
        </ul>
      ) : null}

      {warnings.length ? (
        <ul className="mt-2 space-y-2">
          {warnings.map((warning) => (
            <li key={warning.id} className="rounded-2xl bg-ios-orange/[0.1] p-3 ring-1 ring-inset ring-ios-orange/25">
              <p className="truncate text-[13px] font-semibold leading-snug text-ios-orange">{warning.title}</p>
              {warning.detail ? <p className="mt-0.5 truncate text-[11.5px] text-white/45">{warning.detail}</p> : null}
              <p className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/30">
                Live telemetry · {warning.side ?? "van"} side
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      {!total ? (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-white/[0.04] py-8 text-center">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ios-green/15 text-ios-green">
            <Check className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <p className="text-[13px] font-medium text-white/70">No active alerts</p>
          <p className="text-[11.5px] text-white/35">Every system is reporting nominal.</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onDiagnostics}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-ios-blue px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_30px_-16px_rgba(10,132,255,0.9)] transition hover:brightness-110 active:scale-[0.99]"
      >
        <Activity className="h-4 w-4" strokeWidth={2.2} />
        Run Diagnostics
      </button>
    </aside>
  );
}