import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Shared translucent card surface: every dashboard module sits on it.
export default function Panel({
  id,
  title,
  icon: Icon,
  action,
  to,
  children,
  className,
  accent = "text-ios-teal",
}) {
  const heading = (
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
      <h2 className="truncate text-[13px] font-semibold tracking-[-0.01em] text-white">{title}</h2>
    </div>
  );

  return (
    <section
      id={id}
      className={cn(
        "glass relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 transition duration-300 ease-out",
        "hover:-translate-y-[3px] hover:shadow-[0_36px_80px_-40px_rgba(0,0,0,1)]",
        className
      )}
    >
      <span className="sheen" aria-hidden="true" />

      <header className="flex items-center justify-between gap-2">
        {to ? (
          <Link
            to={to}
            aria-label={`Open ${title}`}
            className="group/head -m-1 flex min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl p-1 transition hover:bg-white/[0.05]"
          >
            {heading}
            <ChevronRight
              className="h-4 w-4 shrink-0 text-white/25 transition duration-200 group-hover/head:translate-x-0.5 group-hover/head:text-white/60"
              strokeWidth={2}
            />
          </Link>
        ) : (
          <>
            {heading}
            {action ?? <ChevronRight className="h-4 w-4 shrink-0 text-white/25" strokeWidth={2} />}
          </>
        )}
        {to && action ? action : null}
      </header>

      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}