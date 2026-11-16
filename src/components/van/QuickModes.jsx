import { cn } from "@/lib/utils";
import { MODES } from "@/lib/van";

export default function QuickModes({ active, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[12px] font-medium text-white/40">Quick modes</span>
      {MODES.map((mode) => {
        const isActive = active === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-4 py-2 text-[12.5px] font-semibold transition duration-200 active:scale-[0.98]",
              isActive
                ? "bg-white text-[#0b0b0f] shadow-[0_10px_26px_-14px_rgba(255,255,255,0.8)]"
                : "bg-white/[0.07] text-white/55 ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.12] hover:text-white"
            )}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}