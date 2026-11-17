import { Bluetooth, CloudSun, Home, Settings, Wifi } from "lucide-react";
import Clock from "./Clock";
import BrandMark from "@/components/brand/BrandMark";

export default function TopBar({ onOpenSettings }) {
  return (
    <header className="sticky top-0 z-30 border-b border-neon/15 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-3 px-3 py-2.5 lg:px-6">
        <div className="flex items-center gap-2.5">
          <BrandMark variant="neon" />
          <div className="leading-tight">
            <p className="text-[22px] font-semibold tracking-tight text-white">
              TransitOS<span className="text-neon">™</span>
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Smart Camper Platform</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-neon/25 bg-white/[0.04] px-3.5 py-1.5 md:flex">
          <Home className="h-3.5 w-3.5 text-neon" strokeWidth={1.8} />
          <span className="text-[11px] font-medium tracking-wide text-white/80">Main Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <Wifi className="hidden h-4 w-4 text-ok sm:block" strokeWidth={1.8} />
          <Bluetooth className="hidden h-3.5 w-3.5 text-neon sm:block" strokeWidth={1.8} />
          <div className="hidden items-center gap-1 sm:flex">
            <CloudSun className="h-4 w-4 text-ok" strokeWidth={1.6} />
            <span className="font-mono text-[10.5px] text-white/55">18°C</span>
          </div>
          <Clock />
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-neon/40 hover:text-neon"
          >
            <Settings className="h-4 w-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </header>
  );
}