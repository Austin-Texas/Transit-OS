import { Box, Network, Scan, Thermometer, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

// The ways the digital twin can be looked at, in the order the reference
// layout lists them.
export const TWIN_MODES = [
  { id: "3d", label: "3D view", icon: Box, hint: "Drag to spin · tap a part to open its module" },
  { id: "systems", label: "Systems", icon: Network, hint: "Every monitored system lit on the body" },
  { id: "xray", label: "X-ray", icon: Scan, hint: "Outer panels drop away, the build shows through" },
  { id: "thermal", label: "Thermal", icon: Thermometer, hint: "Warm zones glowing, cool zones blue" },
  { id: "flow", label: "Flow", icon: Waves, hint: "Water and power routing, drawn live" },
];

export default function TwinModeBar({ mode = "3d", onSelect }) {
  const active = TWIN_MODES.find((entry) => entry.id === mode) ?? TWIN_MODES[0];

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto lg:flex-col">
        {TWIN_MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={mode === id}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] transition lg:justify-start lg:rounded-2xl",
              mode === id
                ? "bg-white/[0.14] text-white ring-1 ring-inset ring-white/70"
                : "text-white/45 ring-1 ring-inset ring-white/10 hover:text-white/80"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            {label}
          </button>
        ))}
      </div>
      <p className="text-[10.5px] leading-snug text-white/35">{active.hint}</p>
    </div>
  );
}