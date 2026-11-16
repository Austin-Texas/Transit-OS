import { Check, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMiles, intervalText, remainingText, serviceState } from "@/lib/maintenance";

const TONE = {
  due: { text: "text-alert", dot: "bg-alert", bar: "bg-alert", border: "border-alert/45" },
  soon: { text: "text-warn", dot: "bg-warn", bar: "bg-warn", border: "border-warn/40" },
  ok: { text: "text-ok", dot: "bg-ok", bar: "bg-ok", border: "border-line/80" },
};

const ACTION =
  "grid h-6 w-6 place-items-center rounded-md border border-line/80 text-white/45 transition hover:border-sys-blue/60 hover:text-sys-blue disabled:opacity-30";

export default function MaintenanceCard({ item, odometer, onService, onEdit, onDelete }) {
  const state = serviceState(item, odometer);
  const tone = TONE[state.status];

  return (
    <div className={cn("rounded-xl border bg-surface-raised px-3 py-2.5", tone.border)}>
      <div className="flex items-start gap-2">
        <span className={cn("mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold leading-tight text-white">{item.name}</p>
          <p className="truncate text-[8.5px] uppercase tracking-[0.12em] text-white/35">
            {item.category} · {intervalText(item)}
          </p>
        </div>
        <span className={cn("shrink-0 font-mono text-[10px] font-semibold", tone.text)}>
          {remainingText(state)}
        </span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className={cn("h-full rounded-full", tone.bar)}
          style={{ width: `${Math.max(3, Math.round(state.progress * 100))}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="truncate text-[8.5px] text-white/30">
          Last serviced{" "}
          {item.last_service_miles !== null && item.last_service_miles !== undefined
            ? formatMiles(item.last_service_miles)
            : "not logged"}
          {item.last_service_date ? ` · ${item.last_service_date}` : ""}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={`Mark ${item.name} serviced`}
            title="Mark serviced"
            onClick={() => onService(item)}
            className={ACTION}
          >
            <Check className="h-3 w-3" strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.name}`}
            title="Edit"
            onClick={() => onEdit(item)}
            className={ACTION}
          >
            <Pencil className="h-3 w-3" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.name}`}
            title="Delete"
            onClick={() => onDelete(item)}
            className={cn(ACTION, "hover:border-alert/60 hover:text-alert")}
          >
            <Trash2 className="h-3 w-3" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}