import { BedDouble, Car, Droplets, Home, Layers, Settings, ShieldCheck, Snowflake, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "vehicle", label: "Vehicle", icon: Car },
  { id: "camper", label: "Camper", icon: BedDouble },
  { id: "electrical", label: "Electrical", icon: Zap },
  { id: "water", label: "Water", icon: Droplets },
  { id: "climate", label: "Climate", icon: Snowflake },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "automation", label: "Automation", icon: Layers },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function SideRail({ active, onSelect }) {
  return (
    <nav className="flex w-[164px] shrink-0 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
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
          </button>
        );
      })}
    </nav>
  );
}