import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BedDouble,
  Camera,
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
  { id: "dashboard", label: "Home", icon: LayoutDashboard, to: "/" },
  { id: "diagnostics", label: "Diagnostics", icon: Activity, to: "/diagnostics" },
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

// Floating dock: one tap to every TransitOS module.
export default function HomeDock() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <nav aria-label="TransitOS modules" className="sticky bottom-0 z-30 px-3 pb-3 pt-2 sm:px-4">
      <div className="glass no-scrollbar mx-auto flex w-full max-w-[1500px] items-stretch gap-1 overflow-x-auto rounded-[26px] px-2 py-2">
        {DOCK.map(({ id, label, icon: Icon, to, hash }) => {
          const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={id}
              to={to}
              hash={hash}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-[66px] flex-1 flex-col items-center gap-1 rounded-[18px] px-1.5 py-1.5 transition duration-200",
                isActive ? "bg-white/[0.14] text-white" : "text-white/40 hover:bg-white/[0.06] hover:text-white/75"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition",
                  isActive ? "bg-white text-[#0b0b0f]" : "bg-white/[0.06] text-current"
                )}
              >
                <Icon className="h-[16px] w-[16px]" strokeWidth={2} />
              </span>
              <span className="truncate text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}