import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Panel({ id, title, icon: Icon, action, children, className }) {
  return (
    <section
      id={id}
      className={cn(
        "panel-surface relative overflow-hidden rounded-2xl border border-neon/25 p-4 shadow-[0_0_34px_-24px_rgba(0,240,255,1)] transition-colors duration-300 hover:border-neon/45",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-neon/85" strokeWidth={1.75} /> : null}
          <h2 className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">{title}</h2>
        </div>
        {action ?? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/25" strokeWidth={2} />}
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );
}