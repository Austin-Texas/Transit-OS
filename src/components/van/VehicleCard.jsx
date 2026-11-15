import { Car, ChevronRight, TriangleAlert } from "lucide-react";
import Panel from "./Panel";
import { miles } from "@/lib/van";

export default function VehicleCard({ odometer, alertCount, onDiagnostics }) {
  return (
    <Panel id="card-vehicle" title="Vehicle" icon={Car}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">Engine</p>
          <p className="mt-1 font-mono text-[12.5px] text-white">{miles(odometer)} mi</p>
        </div>
        <button
          type="button"
          onClick={onDiagnostics}
          className="inline-flex items-center gap-1.5 rounded-full border border-warn/50 bg-warn/15 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-warn transition hover:bg-warn/25"
        >
          <TriangleAlert className="h-3 w-3" strokeWidth={2} />
          Alert{alertCount ? ` ${alertCount}` : ""}
        </button>
      </div>
      <button
        type="button"
        onClick={onDiagnostics}
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.16em] text-white/40 transition hover:border-neon/30 hover:text-neon"
      >
        Diagnostics
        <ChevronRight className="h-3 w-3" strokeWidth={2} />
      </button>
    </Panel>
  );
}