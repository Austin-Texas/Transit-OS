import { useState } from "react";
import { Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { recordSurround, saveSurroundClip } from "@/lib/surroundCapture";

const CLIP_SECONDS = 10;

// Records the surround view and keeps the clip on the van.
export default function SurroundRecorder({ urls, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const ready = urls.length > 0;

  const record = async () => {
    if (busy) return;
    setBusy(true);
    setProgress(0);
    try {
      const { blob, duration_s } = await recordSurround({
        urls,
        seconds: CLIP_SECONDS,
        onProgress: setProgress,
      });
      await saveSurroundClip({
        blob,
        duration_s,
        cameraCount: urls.length,
        trigger: "manual",
        reason: `Saved by you · ${urls.length} cameras`,
      });
      toast.success("360° clip saved");
      await onSaved?.();
    } catch (error) {
      toast.error(error?.message || "Couldn't record a 360° clip");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <button
      type="button"
      onClick={record}
      disabled={!ready || busy}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-alert/55 bg-ink-950/80 px-3.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur transition hover:border-alert disabled:opacity-45"
    >
      {busy ? (
        <span
          className="absolute inset-y-0 left-0 bg-alert/35 transition-[width] duration-100"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      ) : null}
      <span className="relative inline-flex items-center gap-2">
        {busy ? (
          <Loader2 className="h-3 w-3 animate-spin text-alert" strokeWidth={2.4} />
        ) : (
          <Circle className="h-2.5 w-2.5 fill-alert text-alert" strokeWidth={1} />
        )}
        {busy ? `Recording ${Math.round(progress * CLIP_SECONDS)}s` : `Record ${CLIP_SECONDS}s clip`}
      </span>
    </button>
  );
}