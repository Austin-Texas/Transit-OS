import { BedDouble, Camera, Car, Droplets, Flame, LayoutDashboard, Layers, MapPin, Snowflake, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, target: "top" },
  { id: "vehicle", label: "Vehicle", icon: Car, target: "card-vehicle" },
  { id: "cabin", label: "Cabin", icon: BedDouble, target: "card-cabin" },
  { id: "climate", label: "Climate", icon: Snowflake, target: "card-climate" },
  { id: "water", label: "Water", icon: Droplets, target: "card-water" },
  { id: "lpg", label: "LPG", icon: Flame, target: "card-lpg" },
  { id: "power", label: "Power", icon: Zap, target: "card-power" },
  { id: "automation", label: "Automation", icon: Layers, target: null },
  { id: "cameras", label: "Cameras", icon: Camera, target: null },
  { id: "maps", label: "Maps", icon: MapPin, target: null },
];

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="sticky bottom-0 z-30 border-t border-neon/15 bg-ink-950/90 backdrop-blur-xl">
      <div className="no-scrollbar mx-auto flex w-full max-w-[1800px] items-stretch gap-1 overflow-x-auto px-2 py-2 lg:px-6">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-[78px] flex-1 flex-col items-center gap-1.5 rounded-xl px-2 py-2 transition-colors duration-200",
                isActive ? "bg-neon/10 text-neon" : "text-white/35 hover:text-white/70"
              )}
            >
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-full border transition-all duration-300",
                  isActive
                    ? "border-neon bg-neon/20 text-neon shadow-[0_0_26px_-4px_rgba(0,240,255,1)]"
                    : "border-white/10 bg-white/[0.03]"
                )}
              >
                <Icon className="h-[21px] w-[21px]" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.12em]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}