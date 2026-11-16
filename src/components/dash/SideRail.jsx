import { Link, useLocation } from "@tanstack/react-router";
import { BedDouble, Car, Droplets, Home, Layers, Settings, ShieldCheck, Snowflake, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, to: "/" },
  { id: "vehicle", label: "Vehicle", icon: Car, to: "/vehicle" },
  { id: "camper", label: "Camper", icon: BedDouble, to: "/camper" },
  { id: "electrical", label: "Electrical", icon: Zap, to: "/electrical" },
  { id: "trends", label: "Trends", icon: TrendingUp, to: "/trends" },
  { id: "water", label: "Water", icon: Droplets, to: "/water" },
  { id: "climate", label: "Climate", icon: Snowflake, to: "/climate" },
  { id: "security", label: "Security", icon: ShieldCheck, to: "/security" },
  { id: "automation", label: "Automation", icon: Layers, to: "/automation" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export default function SideRail() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <nav className="flex w-[164px] shrink-0 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            to={item.to}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[12.5px] font-medium transition-colors",
              isActive
                ? "bg-sys-blue text-white shadow-[0_10px_26px_-14px_rgba(0,122,255,1)]"
                : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.9} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}