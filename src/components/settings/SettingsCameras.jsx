import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Camera, Grid2x2, Video } from "lucide-react";
import useCameras from "@/hooks/useCameras";
import ModuleCard from "@/components/dash/ModuleCard";
import CameraFeed from "@/components/camera/CameraFeed";
import CameraTile from "@/components/camera/CameraTile";
import SurroundPanel from "./SurroundPanel";
import { cn } from "@/lib/utils";

// Live camera feeds, now part of Settings so the dashboard stays uncluttered.
export default function SettingsCameras({ className }) {
  const cameras = useCameras();
  const [selectedId, setSelectedId] = useState(null);
  const hash = useLocation({ select: (location) => location.hash });
  const anchor = useRef(null);

  const selected = cameras.items.find((camera) => camera.id === selectedId) ?? cameras.items[0] ?? null;
  const liveCount = cameras.items.filter((camera) => camera.status !== "offline").length;

  // The dashboard shortcut links here with #cameras, so land on the feeds.
  useEffect(() => {
    if (hash === "cameras" || hash === "#cameras") {
      anchor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  if (cameras.loading) {
    return (
      <div id="cameras" ref={anchor} className={cn("grid gap-3", className)}>
        <div className="flex items-center gap-3 self-start rounded-full border border-line bg-surface px-5 py-2.5">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-blue" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">Loading cameras</span>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div id="cameras" ref={anchor} className={cn("grid gap-3", className)}>
        <p className="rounded-xl border border-dashed border-line/80 px-4 py-10 text-center text-[11.5px] text-white/40">
          No cameras registered on the van hub yet.
        </p>
      </div>
    );
  }

  return (
    <div id="cameras" ref={anchor} className={cn("grid gap-3 scroll-mt-4 lg:grid-cols-3", className)}>
      <div className="lg:col-span-3">
        <SurroundPanel cameras={cameras.items} />
      </div>

      <ModuleCard
        title={selected.name}
        icon={Video}
        className="lg:col-span-2"
        action={<span className="font-mono text-[10px] text-white/35">{selected.resolution ?? "1080p"}</span>}
      >
        <CameraFeed camera={selected} onUpdate={(patch) => cameras.update(selected.id, patch)} />
      </ModuleCard>

      <ModuleCard
        title="All feeds"
        icon={Grid2x2}
        action={
          <span className="inline-flex items-center gap-2 font-mono text-[10px] text-white/35">
            <span className="inline-flex items-center gap-1 text-sys-blue">
              <Camera className="h-3 w-3" strokeWidth={2.2} />
              {liveCount} live
            </span>
            {cameras.items.length}
          </span>
        }
      >
        <ul className="flex flex-col gap-2">
          {cameras.items.map((camera) => (
            <CameraTile
              key={camera.id}
              camera={camera}
              active={camera.id === selected.id}
              onSelect={() => setSelectedId(camera.id)}
            />
          ))}
        </ul>
        <p className="mt-3 text-[9.5px] leading-relaxed text-white/30">
          Pick a camera to open its feed. Use Photo on a feed to drop in your own still — the van hub keeps pushing new
          ones over it.
        </p>
      </ModuleCard>
    </div>
  );
}