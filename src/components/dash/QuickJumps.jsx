import { Link, useLocation } from "@tanstack/react-router";
import { Camera, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const JUMPS = [
  { id: "electrical", label: "Electrical", icon: Zap, to: "/electrical" },
  { id: "cameras", label: "Cameras", icon: Camera, to: "/cameras" },
  { id: "automation", label: "Automation", icon: Layers, to: "/automation" },
];

// One-tap jumps to the three screens consulted most often while parked.
export default function QuickJumps() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <nav aria-label="Quick access" className="mb-1.5 grid grid-cols-3 gap-1.5">
      {JUMPS.map(({ id, label, icon: Icon, to }) => {
        const isActive = pathname.startsWith(to);
        return (
          <Link
            key={id}
            to={to}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 transition-colors",
              isActive
                ? "border-neon/60 bg-neon/15 text-neon"
                : "border-line/80 bg-surface text-white/55 hover:border-neon/40 hover:text-white/85"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate text-[9px] font-semibold uppercase tracking-[0.12em]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}