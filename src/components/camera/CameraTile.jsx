import CameraSnapshot from "./CameraSnapshot";
import { cn } from "@/lib/utils";

export default function CameraTile({ camera, active, onSelect }) {
  const live = camera.status !== "offline";

  return (
    <li>
      <button
        type="button"
        aria-pressed={active}
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border px-2 py-2 text-left transition",
          active
            ? "border-sys-blue/70 bg-sys-blue/10"
            : "border-line/80 bg-surface-raised hover:border-white/20"
        )}
      >
        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line/80 bg-black">
          <CameraSnapshot camera={camera} compact />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11.5px] font-medium text-white">{camera.name}</span>
          <span className="block truncate text-[9.5px] uppercase tracking-[0.1em] text-white/40">
            {camera.location}
          </span>
        </span>

        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            live ? "animate-soft-pulse bg-sys-red" : "bg-white/25"
          )}
        />
      </button>
    </li>
  );
}