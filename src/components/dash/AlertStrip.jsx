import { BellRing, ShieldAlert, TriangleAlert, X } from "lucide-react";
import { clockTime } from "@/lib/van";
import { cn } from "@/lib/utils";

const RANK = { critical: 0, warning: 1, info: 2 };
const ICONS = { critical: ShieldAlert, warning: TriangleAlert, info: BellRing };

function AlertItem({ alert, onResolve }) {
  const Icon = ICONS[alert.severity] ?? TriangleAlert;
  const critical = alert.severity === "critical";

  return (
    <li
      className={cn(
        "flex items-center gap-2.5 px-3 py-2",
        critical ? "bg-alert/[0.06]" : "bg-warn/[0.05]"
      )}
    >
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
          critical ? "border-alert/45 bg-alert/15 text-alert" : "border-warn/45 bg-warn/15 text-warn"
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-[11.5px] font-semibold leading-tight", critical ? "text-white" : "text-white/90")}>
          {alert.title}
        </p>
        {alert.detail ? <p className="mt-0.5 truncate text-[9.5px] text-white/45">{alert.detail}</p> : null}
      </div>

      <span className="hidden shrink-0 font-mono text-[9px] text-white/30 sm:block">
        {alert.occurred_at ? clockTime(alert.occurred_at) : ""}
      </span>

      <button
        type="button"
        onClick={() => onResolve(alert.id)}
        className={cn(
          "shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] transition",
          critical
            ? "border-alert/50 text-alert hover:bg-alert/15"
            : "border-warn/50 text-warn hover:bg-warn/15"
        )}
      >
        Resolve
      </button>

      <button
        type="button"
        onClick={() => onResolve(alert.id)}
        aria-label={`Dismiss ${alert.title}`}
        className="shrink-0 rounded p-1 text-white/25 transition hover:text-white"
      >
        <X className="h-3 w-3" strokeWidth={2.6} />
      </button>
    </li>
  );
}

// Pops the active alerts onto the main screen: newest critical first, so the
// one thing that needs a decision right now is never buried.
export default function AlertStrip({ alerts = [], onResolve }) {
  const active = alerts
    .filter((alert) => alert.status !== "resolved")
    .sort(
      (a, b) =>
        (RANK[a.severity] ?? 3) - (RANK[b.severity] ?? 3) ||
        new Date(b.occurred_at ?? 0) - new Date(a.occurred_at ?? 0)
    );

  if (!active.length) return null;

  const critical = active.filter((alert) => alert.severity === "critical").length;
  const shown = active.slice(0, 2);
  const hidden = active.length - shown.length;

  return (
    <section
      role="alert"
      aria-live="assertive"
      className={cn(
        "shrink-0 overflow-hidden rounded-xl border shadow-[0_0_36px_-18px_rgba(255,59,48,0.95)]",
        critical ? "border-alert/55 bg-alert/[0.07]" : "border-warn/50 bg-warn/[0.05]"
      )}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-1.5">
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-alert/60" />
          <span className="relative h-2 w-2 rounded-full bg-alert" />
        </span>
        <span
          className={cn(
            "text-[9px] font-semibold uppercase tracking-[0.2em]",
            critical ? "text-alert" : "text-warn"
          )}
        >
          {critical ? `${critical} critical` : "Attention needed"}
        </span>
        <span className="text-[9px] uppercase tracking-[0.14em] text-white/30">
          {active.length} active
        </span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.14em] text-white/30">
          {hidden > 0 ? `+${hidden} more` : "Live alert"}
        </span>
      </header>

      <ul className="divide-y divide-white/[0.06]">
        {shown.map((alert) => (
          <AlertItem key={alert.id ?? alert.alert_key ?? alert.title} alert={alert} onResolve={onResolve} />
        ))}
      </ul>
    </section>
  );
}