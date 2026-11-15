import { cn } from "@/lib/utils";

export default function ModuleCard({ title, icon: Icon, action, children, className }) {
  return (
    <section className={cn("rounded-2xl border border-line/80 bg-surface p-4", className)}>
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-sys-blue" strokeWidth={2} /> : null}
          <h2 className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}