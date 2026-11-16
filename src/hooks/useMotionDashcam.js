import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { recordSurround, saveSurroundClip } from "@/lib/surroundCapture";

const MOTION_WINDOW_MS = 10 * 60 * 1000;
const COOLDOWN_MS = 25 * 1000;
const CLIP_SECONDS = 10;

const stampOf = (camera) => {
  const time = new Date(camera?.last_motion ?? 0).getTime();
  return Number.isFinite(time) ? time : 0;
};

// Tesla-style dashcam: while the app is open, a camera reporting motion saves a
// 360° clip automatically, so the moment is in the library when you look.
export default function useMotionDashcam({ cameras, urls, ready, onSaved }) {
  const baseline = useRef(null);
  const busy = useRef(false);
  const lastSaved = useRef(0);
  const urlsRef = useRef(urls);
  const onSavedRef = useRef(onSaved);

  urlsRef.current = urls;
  onSavedRef.current = onSaved;

  useEffect(() => {
    if (!ready) return;

    if (!baseline.current) {
      baseline.current = new Map(cameras.map((camera) => [camera.id, stampOf(camera)]));
      return;
    }

    // A camera seen for the first time only sets its baseline, so motion from
    // before the app opened is never re-recorded.
    cameras.forEach((camera) => {
      if (!baseline.current.has(camera.id)) baseline.current.set(camera.id, stampOf(camera));
    });

    const fresh = cameras.filter((camera) => {
      if (camera.motion_alerts === false) return false;
      const stamp = stampOf(camera);
      if (!stamp || stamp < Date.now() - MOTION_WINDOW_MS) return false;
      return stamp > (baseline.current.get(camera.id) ?? stamp);
    });
    if (!fresh.length) return;

    fresh.forEach((camera) => baseline.current.set(camera.id, stampOf(camera)));

    if (busy.current || Date.now() - lastSaved.current < COOLDOWN_MS) return;
    if (!urlsRef.current.length) return;

    const camera = fresh[0];
    busy.current = true;
    lastSaved.current = Date.now();

    (async () => {
      try {
        const { blob, duration_s } = await recordSurround({ urls: urlsRef.current, seconds: CLIP_SECONDS });
        await saveSurroundClip({
          blob,
          duration_s,
          cameraCount: urlsRef.current.length,
          trigger: "motion",
          reason: `Motion · ${camera.name}`,
        });
        toast.success(`Motion clip saved · ${camera.name}`);
        await onSavedRef.current?.();
      } catch (error) {
        toast.error(error?.message || "Couldn't save the motion clip");
      } finally {
        busy.current = false;
      }
    })();
  }, [cameras, ready]);
}