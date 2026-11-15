import { cn } from "@/lib/utils";

const TONES = {
  neon: {
    frame: "border-neon/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_30px_-22px_rgba(0,240,255,0.9)]",
    icon: "bg-neon/15 text-neon",
    glow: "bg-neon/25",
    led: "bg-neon shadow-[0_0_10px] shadow-neon/80",
    state: "text-neon",
  },
  green: {
    frame: "border-ok/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_30px_-22px_rgba(0,255,65,0.85)]",
    icon: "bg-ok/15 text-ok",
    glow: "bg-ok/25",
    led: "bg-ok shadow-[0_0_10px] shadow-ok/80",
    state: "text-ok",
  },
};

const SCREWS = ["left-1.5 top-1.5", "right-1.5 top-1.5", "left-1.5 bottom-1.5", "right-1.5 bottom-1.5"];

// A tactile rocker switch: the whole plate is the tap target.
export default function PhysicalToggle({ icon: Icon, label, sub, checked, onChange, tone = "neon" }) {
  const t = TONES[tone] ?? TONES.neon;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-xl border bg-gradient-to-b from-ink-800 to-ink-900 p-3 pb-3.5 text-left transition-all duration-200",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] active:translate-y-[1px] active:brightness-95",
        checked ? t.frame : "border-line/80"
      )}
    >
      <span className={cn("pointer-events-none absolute -bottom-6 left-1/2 h-12 w-2/3 -translate-x-1/2 rounded-full blur-2xl transition-opacity duration-300", t.glow, checked ? "opacity-100" : "opacity-0")} />

      {SCREWS.map((position) => (
        <span
          key={position}
          className={cn(
            "pointer-events-none absolute h-1.5 w-1.5 rounded-full border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]",
            position
          )}
        >
          <span className="absolute left-1/2 top-1/2 h-[1px] w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/60" />
        </span>
      ))}

      <span className="relative flex items-center gap-2">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-md border transition-colors",
            checked ? cn("border-transparent", t.icon) : "border-line/70 bg-white/[0.04] text-white/35"
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11.5px] font-semibold tracking-tight text-white">{label}</span>
          <span className="block truncate text-[9px] uppercase tracking-[0.14em] text-white/35">{sub}</span>
        </span>
        <span
          className={cn(
            "font-mono text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors",
            checked ? t.state : "text-white/25"
          )}
        >
          {checked ? "On" : "Off"}
        </span>
      </span>

      <span className="relative mt-2.5 block h-9 w-full rounded-full border border-white/[0.06] bg-ink-950 shadow-[inset_0_2px_8px_rgba(0,0,0,0.85)]">
        <span className="absolute inset-y-0 left-3 flex items-center font-mono text-[8px] uppercase tracking-[0.18em] text-white/15">
          Off
        </span>
        <span className="absolute inset-y-0 right-3 flex items-center font-mono text-[8px] uppercase tracking-[0.18em] text-white/15">
          On
        </span>
        <span
          className={cn(
            "absolute top-[3px] flex h-[26px] w-[calc(50%-6px)] items-center rounded-full border bg-gradient-to-b transition-all duration-300 ease-out",
            "shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-2px_4px_rgba(0,0,0,0.45)]",
            checked
              ? "left-[calc(50%+3px)] border-white/25 from-white/[0.24] to-white/[0.06]"
              : "left-[3px] border-white/15 from-white/[0.13] to-white/[0.03]"
          )}
        >
          <span className="ml-2 flex gap-[3px]">
            {[0, 1, 2].map((ridge) => (
              <span key={ridge} className="h-2.5 w-[1px] rounded-full bg-black/40 shadow-[1px_0_0_rgba(255,255,255,0.14)]" />
            ))}
          </span>
          <span
            className={cn(
              "ml-auto mr-2 h-1.5 w-1.5 rounded-full transition-colors",
              checked ? t.led : "bg-white/15"
            )}
          />
        </span>
      </span>
    </button>
  );
}