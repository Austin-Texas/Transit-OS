import { Activity, Car, TriangleAlert } from "lucide-react";
import Panel from "./Panel";
import { miles } from "@/lib/van";
import { cn } from "@/lib/utils";

export default function VehicleCard({ odometer, alertCount = 0, topAlert, onDiagnostics }) {
  return (
    <Panel id="card-vehicle" title="Vehicle" icon={Car}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">Odometer</p>
          <p className="mt-1 font-mono text-[12.5px] text-white">{miles(odometer)} mi</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]",
            alertCount ? "border-warn/50 bg-warn/15 text-warn" : "border-ok/45 bg-ok/10 text-ok"
          )}
        >
          <TriangleAlert className="h-3 w-3" strokeWidth={2.2} />
          {alertCount ? `${alertCount} alert${alertCount > 1 ? "s" : ""}` : "Nominal"}
        </span>
      </div>

      <p className="mt-2 truncate text-[10px] text-white/40">
        {topAlert ? topAlert : "No active vehicle faults reported."}
      </p>

      <button
        type="button"
        onClick={onDiagnostics}
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-neon/35 bg-neon/[0.07] px-2.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-neon transition hover:bg-neon/15"
      >
        <span className="inline-flex items-center gap-1.5">
          <Activity className="h-3 w-3" strokeWidth={2.2} />
          Run Diagnostics
        </span>
        <span className="font-mono text-[9px] text-neon/60">→</span>
      </button>
    </Panel>
  );
}