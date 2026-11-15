import { useEffect, useState } from "react";
import { Bell, BellOff, Moon, Signal } from "lucide-react";
import { Image } from "@/components/ui/image";
import FeedToggle from "./FeedToggle";
import { cn } from "@/lib/utils";

const stamp = () =>
  new Date().toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

export default function CameraFeed({ camera, onUpdate }) {
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(stamp());
    const timer = setInterval(() => setNow(stamp()), 1000);
    return () => clearInterval(timer);
  }, []);

  const live = camera.status !== "offline";

  return (
    <div className="overflow-hidden rounded-xl border border-line/80 bg-black">
      <div className="relative aspect-video w-full">
        <Image
          src={camera.snapshot_url}
          alt={`${camera.name} feed`}
          fittingType="fill"
          className={cn(
            "h-full w-full",
            camera.night_vision && "brightness-110 contrast-125 grayscale",
            !live && "opacity-40"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_42%,rgba(0,0,0,0.62)_100%)]" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur",
              live
                ? "border-sys-red/60 bg-black/45 text-sys-red"
                : "border-white/20 bg-black/45 text-white/55"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                live ? "animate-soft-pulse bg-sys-red" : "bg-white/40"
              )}
            />
            {live ? "Rec" : "Offline"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            <Signal className="h-3 w-3" strokeWidth={2} />
            {camera.resolution ?? "1080p"}
          </span>
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-semibold text-white">{camera.name}</span>
            <span className="block truncate text-[9.5px] uppercase tracking-[0.14em] text-white/50">
              {camera.location}
            </span>
          </span>
          <span className="shrink-0 rounded border border-white/15 bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-neon backdrop-blur">
            {now}
          </span>
        </div>

        {!live ? (
          <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
            No signal
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/80 bg-surface-raised px-3 py-2">
        <span className="text-[10px] text-white/40">
          {camera.last_motion ? "Motion detected recently" : "No motion detected"}
        </span>
        <div className="flex items-center gap-1.5">
          <FeedToggle
            icon={Moon}
            label="Night"
            active={!!camera.night_vision}
            onClick={() => onUpdate({ night_vision: !camera.night_vision })}
          />
          <FeedToggle
            icon={camera.motion_alerts === false ? BellOff : Bell}
            label="Motion"
            active={camera.motion_alerts !== false}
            onClick={() => onUpdate({ motion_alerts: camera.motion_alerts === false })}
          />
        </div>
      </div>
    </div>
  );
}