import { cn } from "@/lib/utils";

export default function ToggleRow({ icon: Icon, label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {Icon ? (
          <span
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
              checked ? "bg-sys-blue/15 text-sys-blue" : "bg-white/[0.04] text-white/40"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.9} />
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="block truncate text-[12px] font-medium text-white">{label}</span>
          {sub ? <span className="block truncate text-[10px] text-white/40">{sub}</span> : null}
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-sys-blue" : "bg-white/15"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}