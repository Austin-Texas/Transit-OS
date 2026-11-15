import { cn } from "@/lib/utils";
import { MODES } from "@/lib/van";

export default function QuickModes({ active, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[9px] uppercase tracking-[0.22em] text-white/30">Quick Modes</span>
      {MODES.map((mode) => {
        const isActive = active === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            aria-pressed={isActive}
            className={cn(
              "rounded-xl border px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
              isActive
                ? "border-neon bg-neon/15 text-white shadow-[0_0_28px_-8px_rgba(0,240,255,1)]"
                : "border-white/10 bg-white/[0.04] text-white/45 hover:border-neon/30 hover:text-white/80"
            )}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}