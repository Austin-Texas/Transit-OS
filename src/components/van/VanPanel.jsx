import { BatteryMedium } from "lucide-react";
import VanPhoto from "@/components/van/VanPhoto";
import { VAN_IMAGE } from "@/lib/van";
import { cn } from "@/lib/utils";

// The hero vehicle panel: the owner's van, its build, and whether the hub is
// reachable right now.
export default function VanPanel({ status, offline = false, className }) {
  return (
    <section
      className={cn(
        "glass group relative flex flex-col overflow-hidden rounded-[28px] p-0 transition duration-300 ease-out hover:shadow-[0_36px_84px_-40px_rgba(0,0,0,1)]",
        className
      )}
    >
      <span className="sheen z-10" aria-hidden="true" />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <VanPhoto
          uri={status.van_photo_uri}
          fallback={VAN_IMAGE}
          alt="Your camper van"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#04060c] via-[#04060c]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060c] via-transparent to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
          <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur">
            Ford
          </span>
          <p className="mt-3 text-[26px] font-semibold leading-tight tracking-tight text-white sm:text-[32px]">
            {status.vehicle_name}
          </p>
          <p className="mt-1 text-[13px] font-medium text-white/50">{status.trim}</p>
        </div>
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
    </section>
  );
}