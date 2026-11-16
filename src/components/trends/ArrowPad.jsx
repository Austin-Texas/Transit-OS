import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BUTTON =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-line/80 bg-surface-raised text-white/70 transition hover:border-sys-blue/60 hover:text-sys-blue disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-line/80 disabled:hover:text-white/70";

// Four-way control: up/down picks the metric, left/right steps the week back.
export default function ArrowPad({
  label,
  sub,
  onUp,
  onDown,
  onLeft,
  onRight,
  upDisabled,
  downDisabled,
  leftDisabled,
  rightDisabled,
}) {
  return (
    <div className="grid grid-cols-3 place-items-center gap-1.5">
      <span />
      <button type="button" aria-label="Previous metric" onClick={onUp} disabled={upDisabled} className={BUTTON}>
        <ArrowUp className="h-4 w-4" strokeWidth={2} />
      </button>
      <span />

      <button type="button" aria-label="Earlier week" onClick={onLeft} disabled={leftDisabled} className={BUTTON}>
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
      </button>
      <div className="w-full rounded-lg border border-line/80 bg-ink-900/60 px-1 py-1.5 text-center">
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-sys-blue">{label}</p>
        <p className="truncate text-[8px] uppercase tracking-[0.1em] text-white/35">{sub}</p>
      </div>
      <button type="button" aria-label="Later week" onClick={onRight} disabled={rightDisabled} className={BUTTON}>
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>

      <span />
      <button type="button" aria-label="Next metric" onClick={onDown} disabled={downDisabled} className={cn(BUTTON)}>
        <ArrowDown className="h-4 w-4" strokeWidth={2} />
      </button>
      <span />
    </div>
  );
}