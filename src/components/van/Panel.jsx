import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared translucent card surface: every dashboard module sits on it.
export default function Panel({
  id,
  title,
  icon: Icon,
  action,
  children,
  className,
  accent = "text-ios-teal",
}) {
  return (
    <section
      id={id}
      className={cn(
        "glass relative overflow-hidden rounded-[26px] p-5 transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.09]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon ? (
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-inset ring-white/10",
                accent
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.9} />
            </span>
          ) : null}
          <h2 className="truncate text-[13px] font-semibold tracking-tight text-white">{title}</h2>
        </div>
        {action ?? <ChevronRight className="h-4 w-4 shrink-0 text-white/25" strokeWidth={2} />}
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}