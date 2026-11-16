import { Circle } from "lucide-react";
import useCameras from "@/hooks/useCameras";
import useCameraSources from "@/hooks/useCameraSources";
import useMotionDashcam from "@/hooks/useMotionDashcam";

// Armed in the app shell: keeps the 360° dashcam saving motion clips from any
// screen, so nothing is missed while the camper is parked.
export default function DashcamWatcher() {
  const cameras = useCameras();
  const sources = useCameraSources(cameras.items);
  const active = cameras.items.some((camera) => camera.motion_alerts !== false);

  useMotionDashcam({
    cameras: cameras.items,
    urls: sources.map((source) => source.url),
    ready: !cameras.loading,
  });

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-40 hidden items-center gap-1.5 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 backdrop-blur lg:inline-flex">
      <Circle className="h-2 w-2 fill-alert text-alert" strokeWidth={1} />
      <span className="text-[8.5px] font-semibold uppercase tracking-[0.16em] text-white/45">Dashcam armed</span>
    </div>
  );
}