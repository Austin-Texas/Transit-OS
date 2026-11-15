import { Link, useLocation } from "@tanstack/react-router";
import { Activity, Archive, Camera, DoorOpen, Droplets, Lightbulb, Snowflake, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCK = [
  { id: "doors", label: "Doors", icon: DoorOpen, to: "/security" },
  { id: "cabinets", label: "Cabinets", icon: Archive, to: "/camper" },
  { id: "lights", label: "Lights", icon: Lightbulb, to: "/camper" },
  { id: "climate", label: "Climate", icon: Snowflake, to: "/climate" },
  { id: "power", label: "Power", icon: Zap, to: "/electrical" },
  { id: "water", label: "Water", icon: Droplets, to: "/water" },
  { id: "diagnose", label: "Diagnose", icon: Activity, to: "/vehicle" },
  { id: "cameras", label: "Cameras", icon: Camera, to: "/cameras" },
];

export default function QuickDock() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <div className="shrink-0 px-3 pb-1 pt-2">
      <div className="flex items-stretch justify-between gap-1 rounded-2xl border border-line/80 bg-surface px-2 py-1.5">
        {DOCK.map(({ id, label, icon: Icon, to }) => (
          <Link
            key={id}
            to={to}
            className={cn(
              "group flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5",
              pathname === to ? "bg-white/[0.06] text-sys-blue" : "text-white/50 hover:bg-white/[0.05] hover:text-sys-blue"
            )}
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
            <span className="truncate text-[8.5px] font-medium uppercase tracking-[0.08em]">{label}</span>
          </Link>
        ))}
      </div>
      <div className="mx-auto mt-1.5 h-1 w-16 rounded-full bg-white/60" />
    </div>
  );
}