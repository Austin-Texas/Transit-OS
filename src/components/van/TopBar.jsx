import { Bluetooth, Car, CloudSun, Home, Settings } from "lucide-react";
import Clock from "./Clock";

const BARS = [3, 5, 7, 9, 11];

export default function TopBar({ onOpenSettings }) {
  return (
    <header className="sticky top-0 z-30 border-b border-neon/15 bg-ink-950/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1560px] items-center justify-between gap-3 px-3 py-2.5 lg:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-neon/35 bg-neon/10 shadow-[0_0_22px_-8px_rgba(0,240,255,1)]">
            <Car className="h-4 w-4 text-neon" strokeWidth={1.6} />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold tracking-tight text-white">
              TransitOS<span className="text-neon">™</span>
            </p>
            <p className="text-[8.5px] uppercase tracking-[0.26em] text-white/35">Smart Camper</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-neon/25 bg-white/[0.04] px-3.5 py-1.5 md:flex">
          <Home className="h-3.5 w-3.5 text-neon" strokeWidth={1.8} />
          <span className="text-[11px] font-medium tracking-wide text-white/80">Main Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-end gap-[3px] sm:flex">
            {BARS.map((height) => (
              <span key={height} className="w-[3px] rounded-full bg-ok" style={{ height, opacity: height > 6 ? 1 : 0.45 }} />
            ))}
          </div>
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
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-neon/40 hover:text-neon"
          >
            <Settings className="h-4 w-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </header>
  );
}