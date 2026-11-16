import { Link, useLocation } from "@tanstack/react-router";
import {
  BedDouble,
  Camera,
  Car,
  Droplets,
  Flame,
  Layers,
  LayoutDashboard,
  MapPin,
  Settings,
  Snowflake,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DOCK = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { id: "vehicle", label: "Vehicle", icon: Car, to: "/vehicle" },
  { id: "cabin", label: "Cabin", icon: BedDouble, to: "/camper" },
  { id: "climate", label: "Climate", icon: Snowflake, to: "/climate" },
  { id: "water", label: "Water", icon: Droplets, to: "/water" },
  { id: "lpg", label: "LPG", icon: Flame, to: "/lpg" },
  { id: "power", label: "Power", icon: Zap, to: "/electrical" },
  { id: "automation", label: "Automation", icon: Layers, to: "/automation" },
  { id: "cameras", label: "Cameras", icon: Camera, to: "/settings", hash: "cameras" },
  { id: "maps", label: "Maps", icon: MapPin, to: "/tracking" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

// Bottom navigation for the dashboard: one tap to every TransitOS module.
export default function HomeDock() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <nav
      aria-label="TransitOS modules"
      className="sticky bottom-0 z-30 border-t border-line/70 bg-ink-950/92 backdrop-blur-xl"
    >
      <div className="no-scrollbar mx-auto flex w-full max-w-[1500px] items-stretch gap-1 overflow-x-auto px-2 py-2 sm:px-4">
        {DOCK.map(({ id, label, icon: Icon, to, hash }) => {
          const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={id}
              to={to}
              hash={hash}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-[68px] flex-1 flex-col items-center gap-1 rounded-xl px-1.5 py-1.5 transition-colors",
                isActive ? "bg-neon/10 text-neon" : "text-white/40 hover:bg-white/[0.04] hover:text-white/75"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border transition-colors",
                  isActive ? "border-neon/70 bg-neon/15" : "border-white/[0.08] bg-white/[0.03]"
                )}
              >
                <Icon className="h-[16px] w-[16px]" strokeWidth={1.9} />
              </span>
              <span className="truncate text-[8.5px] font-semibold uppercase tracking-[0.1em]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}