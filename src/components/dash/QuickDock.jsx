import { Activity, Archive, Camera, DoorOpen, Droplets, Lightbulb, Snowflake, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCK = [
  { id: "doors", label: "Doors", icon: DoorOpen },
  { id: "cabinets", label: "Cabinets", icon: Archive },
  { id: "lights", label: "Lights", icon: Lightbulb },
  { id: "climate", label: "Climate", icon: Snowflake },
  { id: "power", label: "Power", icon: Zap },
  { id: "water", label: "Water", icon: Droplets },
  { id: "diagnose", label: "Diagnose", icon: Activity },
  { id: "cameras", label: "Cameras", icon: Camera },
  { id: "assistant", label: "AI Assistant", icon: Sparkles },
];

export default function QuickDock({ onSelect }) {
  return (
    <div className="shrink-0 px-3 pb-1 pt-2">
      <div className="flex items-stretch justify-between gap-1 rounded-2xl border border-line/80 bg-surface px-2 py-1.5">
        {DOCK.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect({ id, label })}
            className={cn(
              "group flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5",
              "text-white/50 transition-colors hover:bg-white/[0.05] hover:text-sys-blue"
            )}
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
            <span className="truncate text-[8.5px] font-medium uppercase tracking-[0.08em]">{label}</span>
          </button>
        ))}
      </div>
      <div className="mx-auto mt-1.5 h-1 w-16 rounded-full bg-white/60" />
    </div>
  );
}