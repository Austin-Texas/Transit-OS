import { cn } from "@/lib/utils";

export default function ModuleCard({ title, icon: Icon, action, children, className }) {
  return (
    <section className={cn("glass rounded-[26px] p-5", className)}>
      <header className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon ? (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-ios-teal ring-1 ring-inset ring-white/10">
              <Icon className="h-4 w-4" strokeWidth={1.9} />
            </span>
          ) : null}
          <h2 className="truncate text-[13px] font-semibold tracking-tight text-white">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}