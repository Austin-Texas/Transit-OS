import { Activity, Car, TriangleAlert } from "lucide-react";
import Panel from "./Panel";
import { miles } from "@/lib/van";
import { cn } from "@/lib/utils";

export default function VehicleCard({ odometer, alertCount = 0, topAlert, onDiagnostics }) {
  return (
    <Panel id="card-vehicle" title="Vehicle" icon={Car} accent="text-ios-purple">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[22px] font-semibold leading-none tracking-tight text-white">{miles(odometer)}</p>
          <p className="mt-1.5 text-[12px] font-medium text-white/45">Odometer, miles</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            alertCount ? "bg-ios-orange/15 text-ios-orange" : "bg-ios-green/15 text-ios-green"
          )}
        >
          <TriangleAlert className="h-3.5 w-3.5" strokeWidth={2.2} />
          {alertCount ? `${alertCount} alert${alertCount > 1 ? "s" : ""}` : "Nominal"}
        </span>
      </div>

      <p className="mt-2.5 truncate text-[12px] text-white/40">
        {topAlert ? topAlert : "No active vehicle faults reported."}
      </p>

      <button
        type="button"
        onClick={onDiagnostics}
        className="mt-4 flex w-full items-center justify-between rounded-full bg-ios-blue px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(10,132,255,0.9)] transition hover:brightness-110 active:scale-[0.99]"
      >
        <span className="inline-flex items-center gap-2">
          <Activity className="h-4 w-4" strokeWidth={2.2} />
          Run Diagnostics
        </span>
        <span className="text-white/70">→</span>
      </button>
    </Panel>
  );
}