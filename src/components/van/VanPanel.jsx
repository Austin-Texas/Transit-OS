import { Link } from "@tanstack/react-router";
import { BatteryMedium } from "lucide-react";
import FordTransit3D from "@/components/van/FordTransit3D";
import { cn } from "@/lib/utils";

// The hero vehicle panel: the same neon wireframe van as the main vehicle view,
// turning on its own. Tapping it opens the full 3D diagnostics stage.
export default function VanPanel({ status, warnings = [], offline = false, className }) {
  return (
    <Link
      to="/diagnostics"
      aria-label="Open the 3D vehicle view"
      className={cn(
        "glass group relative flex flex-col overflow-hidden rounded-[28px] p-0 transition duration-300 ease-out hover:shadow-[0_36px_84px_-40px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-teal/70",
        className
      )}
    >
      <span className="sheen z-10" aria-hidden="true" />
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[radial-gradient(125%_120%_at_50%_-10%,#122841_0%,#0a1220_55%,#05070c_100%)]">
        <div className="pointer-events-none absolute inset-0">
          <FordTransit3D className="h-full w-full" status={status} warnings={warnings} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(82%_72%_at_50%_42%,transparent_46%,rgba(2,6,11,0.62)_100%)]" />

        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white/70 ring-1 ring-inset ring-white/10 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-ios-teal" />
          Live 3D · {status.active_mode ?? "camping"} mode
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="text-[22px] font-semibold leading-tight tracking-tight text-white sm:text-[26px]">
            {status.vehicle_name}
          </p>
          <p className="mt-0.5 truncate text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/45">
            {status.trim}
          </p>
        </div>

        <span className="pointer-events-none absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur">
          Open 3D view
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] bg-black/20 px-4 py-3 backdrop-blur-xl">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            offline ? "bg-ios-pink/15 text-ios-pink" : "bg-ios-green/15 text-ios-green"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", !offline && "animate-soft-pulse")} />
          {offline ? "System offline" : "System online"}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium capitalize text-white/65">
          {status.active_mode ?? "camping"} mode
        </span>

        <span className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/85">
          <BatteryMedium className="h-4 w-4 text-ios-green" strokeWidth={1.9} />
          {Number(status.battery_voltage ?? 0).toFixed(1)} V
        </span>
      </div>
    </Link>
  );
}