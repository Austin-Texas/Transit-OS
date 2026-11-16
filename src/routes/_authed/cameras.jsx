import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Grid2x2, Video } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import useCameras from "@/hooks/useCameras";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import CameraFeed from "@/components/camera/CameraFeed";
import CameraTile from "@/components/camera/CameraTile";

export const Route = createFileRoute("/_authed/cameras")({
  head: () => ({
    meta: [
      { title: "TransitOS — Cameras" },
      { name: "description", content: "Live views from the rear, side and cabin cameras of your camper." },
    ],
  }),
  component: CamerasPage,
});

function CamerasPage() {
  const van = useVanDashboard();
  const cameras = useCameras();
  const [selectedId, setSelectedId] = useState(null);

  const { status } = van;
  const selected = cameras.items.find((camera) => camera.id === selectedId) ?? cameras.items[0] ?? null;
  const liveCount = cameras.items.filter((camera) => camera.status !== "offline").length;

  return (
    <ModuleShell
      title="Cameras"
      subtitle="Live views around the van"
      status={status}
      meta={
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sys-blue/45 bg-sys-blue/10 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-sys-blue">
          <Camera className="h-3 w-3" strokeWidth={2.2} />
          {liveCount} live
        </span>
      }
    >
      {selected ? (
        <div className="grid gap-3 lg:grid-cols-3">
          <ModuleCard
            title={selected.name}
            icon={Video}
            className="lg:col-span-2"
            action={
              <span className="font-mono text-[10px] text-white/35">{selected.resolution ?? "1080p"}</span>
            }
          >
            <CameraFeed
              camera={selected}
              onUpdate={(patch) => cameras.update(selected.id, patch)}
            />
          </ModuleCard>

          <ModuleCard
            title="All feeds"
            icon={Grid2x2}
            action={<span className="font-mono text-[10px] text-white/35">{cameras.items.length}</span>}
          >
            <ul className="flex flex-col gap-2">
              {cameras.items.map((camera) => (
                <CameraTile
                  key={camera.id}
                  camera={camera}
                  active={camera.id === selected?.id}
                  onSelect={() => setSelectedId(camera.id)}
                />
              ))}
            </ul>
            <p className="mt-3 text-[9.5px] leading-relaxed text-white/30">
              Pick a camera to open its feed. Use Photo on a feed to drop in your own still — the van hub keeps pushing new ones over it.
            </p>
          </ModuleCard>
        </div>
      ) : cameras.loading ? (
        <div className="flex items-center gap-3 self-start rounded-full border border-line bg-surface px-5 py-2.5">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-blue" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">Loading cameras</span>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-line/80 px-4 py-10 text-center text-[11.5px] text-white/40">
          No cameras registered on the van hub yet.
        </p>
      )}
    </ModuleShell>
  );
}