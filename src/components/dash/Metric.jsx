import { cn } from "@/lib/utils";

export default function Metric({ icon: Icon, label, value, sub, tone = "text-ios-teal" }) {
  return (
    <div className="rounded-2xl bg-white/[0.05] px-3.5 py-3 ring-1 ring-inset ring-white/[0.08]">
      <div className="flex items-center gap-1.5">
        {Icon ? <Icon className={cn("h-3.5 w-3.5 shrink-0", tone)} strokeWidth={2} /> : null}
        <span className="truncate text-[11.5px] font-medium text-white/40">{label}</span>
      </div>
      <p className="mt-1.5 text-[15px] font-semibold leading-none tracking-tight text-white">{value}</p>
      {sub ? <p className="mt-1 truncate text-[11px] text-white/40">{sub}</p> : null}
    </div>
  );
}