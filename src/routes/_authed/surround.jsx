import { createFileRoute } from "@tanstack/react-router";
import { Orbit, ShieldAlert } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import useCameras from "@/hooks/useCameras";
import ModuleShell from "@/components/dash/ModuleShell";
import SurroundPanel from "@/components/settings/SurroundPanel";

export const Route = createFileRoute("/_authed/surround")({
  head: () => ({
    meta: [
      { title: "TransitOS — 360° Cameras" },
      { name: "description", content: "Surround camera inspection and recordings." },
    ],
  }),
  component: SurroundCameraPage,
});

function SurroundCameraPage() {
  const { status } = useVanDashboard();
  const cameras = useCameras();

  return (
    <ModuleShell title="360° Camera" subtitle="Surround inspection and recordings" status={status}>
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <Orbit className="mt-0.5 h-5 w-5 shrink-0 text-ios-teal" />
          <div>
            <p className="text-[12px] font-semibold text-white">360° surround camera</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/50">
              Drag to inspect the available views. Actual live coverage depends on cameras connected to your van hub.
              A stitched overhead bird's-eye image requires compatible camera calibration and stitching hardware/software.
            </p>
          </div>
        </div>
        {cameras.loading ? (
          <p className="rounded-2xl border border-white/10 p-6 text-sm text-white/50">Loading camera sources…</p>
        ) : (
          <SurroundPanel cameras={cameras.items} />
        )}
        <p className="flex items-start gap-2 text-[11px] text-amber-200/70">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Camera images are supplemental. Always check mirrors and surroundings directly when maneuvering.
        </p>
      </div>
    </ModuleShell>
  );
}
