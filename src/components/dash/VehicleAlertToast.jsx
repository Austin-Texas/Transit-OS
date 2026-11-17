import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Cpu, ShieldAlert, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

const RANK = { critical: 0, warning: 1, info: 2 };

// Drops from the top of the screen the moment a new problem appears. Tapping it
// turns the 3D van to that side and lights the fault red.
export default function VehicleAlertToast({ alerts = [], warnings = [], onLocate }) {
  const [dismissed, setDismissed] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const merged = [
      ...alerts
        .filter((alert) => alert.status !== "resolved")
        .map((alert) => ({
          id: alert.id,
          title: alert.title,
          detail: alert.detail,
          // A module fault has no side of the van to turn to.
          side: alert.side === "left" || alert.side === "right" ? alert.side : null,
          zone: "side",
          severity: alert.severity ?? "warning",
        })),
      ...warnings,
    ];

    setItems(
      merged
        .filter((item) => !dismissed.includes(item.id))
        .sort((a, b) => (RANK[a.severity] ?? 3) - (RANK[b.severity] ?? 3))
    );
  }, [alerts, warnings, dismissed]);

  if (!items.length) return null;

  const item = items[0];
  const critical = item.severity === "critical";
  const SideIcon = item.side === "left" ? ArrowLeft : ArrowRight;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[92px] z-40 flex justify-center px-3">
      <div
        className={cn(
          "glass pointer-events-auto flex w-full max-w-xl items-center gap-1 rounded-[20px] px-2 py-1.5",
          critical ? "bg-ios-pink/15" : "bg-ios-orange/10"
        )}
      >
        <button
          type="button"
          onClick={() => onLocate(item)}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1.5 py-1 text-left transition hover:bg-white/[0.05]"
        >
          <span
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-md border",
              critical ? "border-alert/45 bg-alert/15 text-alert" : "border-warn/45 bg-warn/15 text-warn"
            )}
          >
            {critical ? (
              <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2.2} />
            ) : (
              <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2.2} />
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11.5px] font-semibold leading-tight text-white">{item.title}</span>
            {item.detail ? (
              <span className="mt-0.5 block truncate text-[9.5px] text-white/50">{item.detail}</span>
            ) : null}
          </span>

          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em]",
              critical ? "border-alert/40 text-alert/90" : "border-warn/40 text-warn/90"
            )}
          >
            {item.side ? (
              <SideIcon className="h-2.5 w-2.5" strokeWidth={2.6} />
            ) : (
              <Cpu className="h-2.5 w-2.5" strokeWidth={2.6} />
            )}
            {item.side ?? "module"}
          </span>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/35" strokeWidth={2.2} />
        </button>

        {items.length > 1 ? (
          <span className="shrink-0 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/40">
            +{items.length - 1}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setDismissed((prev) => [...prev, item.id])}
          aria-label="Dismiss notification"
          className="shrink-0 rounded p-1.5 text-white/30 transition hover:text-white"
        >
          <X className="h-3 w-3" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}