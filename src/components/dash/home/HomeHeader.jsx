import { Link } from "@tanstack/react-router";
import { Settings, Thermometer, Waypoints } from "lucide-react";
import Clock from "@/components/van/Clock";
import { cn } from "@/lib/utils";

// Floating branding bar: brand, screen name and the health of the van link.
export default function HomeHeader({ status, offline }) {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4">
      <div className="glass mx-auto flex w-full max-w-[1500px] items-center gap-3 rounded-[24px] px-3.5 py-2.5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-ios-blue to-ios-indigo text-white shadow-[0_10px_24px_-12px_rgba(10,132,255,0.9)]">
          <Waypoints className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>

        <div className="min-w-0 leading-tight">
          <p className="text-[17px] font-semibold tracking-tight text-white">
            Transit<span className="text-ios-teal">OS</span>
            <span className="ml-1 align-super text-[9px] font-medium text-white/35">™</span>
          </p>
          <p className="truncate text-[11.5px] font-medium text-white/40">Main Dashboard</p>
        </div>

        <span
          className={cn(
            "ml-1 hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex",
            offline ? "bg-ios-pink/15 text-ios-pink" : "bg-ios-green/15 text-ios-green"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", !offline && "animate-soft-pulse")} />
          {offline ? "System offline" : "System online"}
        </span>

        <div className="ml-auto flex items-center gap-2 text-white/65">
          <span className="hidden items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1.5 ring-1 ring-inset ring-white/[0.08] sm:inline-flex">
            <Thermometer className="h-3.5 w-3.5 text-ios-teal" strokeWidth={2} />
            <span className="text-[12.5px] font-semibold text-white/85">
              {status ? `${Math.round(status.climate_temp ?? status.cabin_temp ?? 72)}°F` : "--°F"}
            </span>
          </span>
          <Clock />
          <Link
            to="/settings"
            aria-label="Settings"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.08] text-white/60 ring-1 ring-inset ring-white/[0.08] transition hover:bg-white/15 hover:text-white"
          >
            <Settings className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>
      </div>
    </header>
  );
}