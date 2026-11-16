import { Link } from "@tanstack/react-router";
import { Car, Settings, Thermometer } from "lucide-react";
import Clock from "@/components/van/Clock";
import { cn } from "@/lib/utils";

// Branding, the screen name and the health of the link to the van hub.
export default function HomeHeader({ status, offline }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ink-950/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-2.5 px-3 py-2.5 sm:px-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-neon/35 bg-neon/10 text-neon shadow-[0_0_22px_-8px_rgba(0,240,255,1)]">
          <Car className="h-4 w-4" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 leading-tight">
          <p className="text-[17px] font-semibold tracking-tight text-white">
            Transit<span className="text-neon">OS</span>
            <span className="ml-1 align-super text-[8px] font-medium text-white/30">™</span>
          </p>
          <p className="truncate text-[9px] uppercase tracking-[0.26em] text-white/35">Main Dashboard</p>
        </div>

        <span
          className={cn(
            "ml-1 hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] sm:inline-flex",
            offline ? "border-alert/45 bg-alert/10 text-alert" : "border-ok/45 bg-ok/10 text-ok"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full bg-current", !offline && "animate-soft-pulse")} />
          {offline ? "System offline" : "System online"}
        </span>

        <div className="ml-auto flex items-center gap-2.5 text-white/65">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 sm:inline-flex">
            <Thermometer className="h-3.5 w-3.5 text-neon/80" strokeWidth={2} />
            <span className="font-mono text-[10.5px] text-white/80">
              {status ? `${Math.round(status.climate_temp ?? status.cabin_temp ?? 72)}°F` : "--°F"}
            </span>
          </span>
          <Clock />
          <Link
            to="/settings"
            aria-label="Settings"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-neon/40 hover:text-neon"
          >
            <Settings className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </header>
  );
}