import { cn } from "@/lib/utils";

export default function Panel({ id, title, icon: Icon, action, children, className }) {
  return (
    <section
      id={id}
      className={cn(
        "panel-surface relative overflow-hidden rounded-2xl border border-neon/15 p-4 transition-colors duration-300 hover:border-neon/35",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-neon/80" strokeWidth={1.75} /> : null}
          <h2 className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{title}</h2>
        </div>
        {action}
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );
}