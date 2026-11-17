import { cn } from "@/lib/utils";

// Telemetry status pill: the dot breathes while readings are live and goes
// solid when the van link drops.
export default function LiveBadge({ live = true, label, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        live ? "bg-ios-green/15 text-ios-green" : "bg-ios-pink/15 text-ios-pink",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", live && "live-dot")} />
      {label ?? (live ? "Live" : "Offline")}
    </span>
  );
}