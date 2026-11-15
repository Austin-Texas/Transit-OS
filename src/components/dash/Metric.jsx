import { cn } from "@/lib/utils";

export default function Metric({ icon: Icon, label, value, sub, tone = "text-sys-blue" }) {
  return (
    <div className="rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5">
      <div className="flex items-center gap-1.5">
        {Icon ? <Icon className={cn("h-3.5 w-3.5 shrink-0", tone)} strokeWidth={1.9} /> : null}
        <span className="truncate text-[9px] font-medium uppercase tracking-[0.14em] text-white/40">{label}</span>
      </div>
      <p className="mt-1.5 font-mono text-[13px] font-semibold leading-none text-white">{value}</p>
      {sub ? <p className="mt-1 truncate text-[10px] text-white/40">{sub}</p> : null}
    </div>
  );
}