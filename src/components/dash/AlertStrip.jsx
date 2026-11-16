import { ArrowLeft, ArrowRight, BellRing, ChevronRight, ShieldAlert, TriangleAlert, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { clockTime } from "@/lib/van";
import { cn } from "@/lib/utils";

const RANK = { critical: 0, warning: 1, info: 2 };
const ICONS = { critical: ShieldAlert, warning: TriangleAlert, info: BellRing };

function AlertItem({ alert, onResolve, onFocus }) {
  const Icon = ICONS[alert.severity] ?? TriangleAlert;
  const critical = alert.severity === "critical";
  const side = alert.side === "left" || alert.side === "right" ? alert.side : null;
  const canFocus = Boolean(side && onFocus);
  const SideIcon = side === "left" ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();
  const serviceLink = (alert.alert_key ?? "").includes("maintenance");

  return (
    <li className={cn("flex items-center gap-1 px-1.5 py-1.5", critical ? "bg-alert/[0.06]" : "bg-warn/[0.05]")}>
      <button
        type="button"
        onClick={() => (serviceLink ? navigate({ to: "/maintenance" }) : canFocus && onFocus(alert))}
        disabled={!serviceLink && !canFocus}
        aria-label={
          serviceLink
            ? `Open the maintenance page: ${alert.title}`
            : canFocus
              ? `Turn the van to the ${side} side: ${alert.title}`
              : alert.title
        }
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition",
          serviceLink || canFocus ? "hover:bg-white/[0.05]" : "cursor-default"
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

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-[11.5px] font-semibold leading-tight",
              critical ? "text-white" : "text-white/90"
            )}
          >
            {alert.title}
          </span>
          {alert.detail ? (
            <span className="mt-0.5 block truncate text-[9.5px] text-white/45">{alert.detail}</span>
          ) : null}
        </span>

        {serviceLink ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]",
              critical ? "border-alert/40 text-alert/85" : "border-warn/40 text-warn/85"
            )}
          >
            Service
            <ChevronRight className="h-2.5 w-2.5" strokeWidth={2.6} />
          </span>
        ) : canFocus ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]",
              critical ? "border-alert/40 text-alert/85" : "border-warn/40 text-warn/85"
            )}
          >
            <SideIcon className="h-2.5 w-2.5" strokeWidth={2.6} />
            {side}
          </span>
        ) : null}

        <span className="hidden shrink-0 font-mono text-[9px] text-white/30 sm:block">
          {alert.occurred_at ? clockTime(alert.occurred_at) : ""}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onResolve(alert.id)}
        className={cn(
          "shrink-0 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] transition",
          critical ? "border-alert/50 text-alert hover:bg-alert/15" : "border-warn/50 text-warn hover:bg-warn/15"
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
export default function AlertStrip({ alerts = [], onResolve, onFocus }) {
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
        <span className="text-[9px] uppercase tracking-[0.14em] text-white/30">{active.length} active</span>
        <span className="ml-auto text-[9px] uppercase tracking-[0.14em] text-white/30">
          {hidden > 0 ? `+${hidden} more` : "Tap to locate"}
        </span>
      </header>

      <ul className="divide-y divide-white/[0.06]">
        {shown.map((alert) => (
          <AlertItem
            key={alert.id ?? alert.alert_key ?? alert.title}
            alert={alert}
            onResolve={onResolve}
            onFocus={onFocus}
          />
        ))}
      </ul>
    </section>
  );
}