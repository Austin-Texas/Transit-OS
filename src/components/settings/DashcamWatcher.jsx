import useCameras from "@/hooks/useCameras";
import useCameraSources from "@/hooks/useCameraSources";
import useMotionDashcam from "@/hooks/useMotionDashcam";

// Armed in the app shell: keeps the 360° dashcam saving motion clips from any
// screen, so nothing is missed while the camper is parked.
export default function DashcamWatcher() {
  const cameras = useCameras();
  const sources = useCameraSources(cameras.items);

  useMotionDashcam({
    cameras: cameras.items,
    urls: sources.map((source) => source.url),
    ready: !cameras.loading,
  });

  return null;
}