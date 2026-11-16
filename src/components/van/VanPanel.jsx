import { BatteryMedium } from "lucide-react";
import VanPhoto from "@/components/van/VanPhoto";
import { VAN_IMAGE } from "@/lib/van";
import { cn } from "@/lib/utils";

// The big vehicle panel: the owner's van, its build, and whether the hub is
// reachable right now.
export default function VanPanel({ status, offline = false, className }) {
  return (
    <section
      className={cn(
        "panel-surface photo-slot relative flex flex-col overflow-hidden rounded-2xl border",
        offline ? "border-alert/45" : undefined,
        className
      )}
    >
      <div className="relative min-h-0 flex-1">
        <VanPhoto
          uri={status.van_photo_uri}
          fallback={VAN_IMAGE}
          alt="Your camper van"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-transparent" />
        <div className="relative flex h-full flex-col justify-start p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-white/45">Ford</p>
          <p className="mt-1 text-[22px] font-semibold leading-tight tracking-tight text-white sm:text-[26px]">
            {status.vehicle_name}
          </p>
          <p className="text-[11px] text-white/45">{status.trim}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]",
            offline ? "border-alert/45 bg-alert/10 text-alert" : "border-ok/40 bg-ok/10 text-ok"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", !offline && "animate-soft-pulse")} />
          {offline ? "System offline" : "System online"}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
          {status.active_mode ?? "camping"} mode
        </span>

        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/70">
          <BatteryMedium className="h-4 w-4 text-ok" strokeWidth={1.7} />
          {Number(status.battery_voltage ?? 0).toFixed(1)} V
        </span>
      </div>
    </section>
  );
}