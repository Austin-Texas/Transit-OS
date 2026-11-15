import { useEffect, useState } from "react";
import { Bell, BellOff, Moon } from "lucide-react";
import CameraSnapshot from "./CameraSnapshot";
import FeedToggle from "./FeedToggle";
import UploadStillButton from "./UploadStillButton";
import { cn } from "@/lib/utils";

const clock = () =>
  new Date().toLocaleTimeString("en-US", {
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

const dateStamp = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

const since = (iso) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (!Number.isFinite(minutes) || minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.round(hours / 24)} d ago`;
};

function Brackets() {
  return (
    <span className="pointer-events-none absolute inset-2.5" aria-hidden="true">
      <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-white/35" />
      <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-white/35" />
      <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-white/35" />
      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-white/35" />
    </span>
  );
}

export default function CameraFeed({ camera, onUpdate }) {
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(clock());
    const timer = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(timer);
  }, []);

  const live = camera.status !== "offline";

  return (
    <div className="overflow-hidden rounded-xl border border-line/80 bg-black">
      <div className="relative aspect-video w-full">
        <CameraSnapshot camera={camera} />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_42%,rgba(0,0,0,0.62)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.14)_0px,rgba(255,255,255,0.14)_1px,transparent_1px,transparent_3px)]" />
        <Brackets />

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

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/65 backdrop-blur">
            {camera.resolution ?? "1080p"} · 30 fps
          </span>
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[12px] font-semibold text-white">{camera.name}</span>
            <span className="block truncate text-[9.5px] uppercase tracking-[0.14em] text-white/50">
              {camera.location ?? "Van"}
            </span>
          </span>
          <span className="shrink-0 rounded border border-white/15 bg-black/45 px-1.5 py-0.5 text-right font-mono text-[10px] text-neon backdrop-blur">
            <span className="block">{now}</span>
            <span className="block text-[8px] uppercase tracking-[0.1em] text-white/45">{dateStamp()}</span>
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
          {camera.last_motion ? `Motion · ${since(camera.last_motion)}` : "No motion detected"}
        </span>
        <div className="flex items-center gap-1.5">
          <UploadStillButton onUploaded={(fileUri) => onUpdate({ snapshot_url: fileUri })} />
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