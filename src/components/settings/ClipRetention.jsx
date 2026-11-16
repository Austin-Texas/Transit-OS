import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { purgeOldSurroundClips } from "@/lib/server-fns";
import useClipRetention from "@/hooks/useClipRetention";

// Retention window for the dashcam library, with a one-tap cleanup.
export default function ClipRetention({ onPurged }) {
  const retention = useClipRetention();
  const purge = useServerFn(purgeOldSurroundClips);
  const [draft, setDraft] = useState("");
  const [clearing, setClearing] = useState(false);

  const value = draft === "" ? String(retention.days) : draft;

  const commit = async () => {
    const next = await retention.save(value);
    setDraft("");
    toast.success(`Keeping the last ${next} days of clips`);
  };

  const clear = async () => {
    setClearing(true);
    try {
      const result = await purge();
      toast.success(
        result.deleted
          ? `Deleted ${result.deleted} clip${result.deleted === 1 ? "" : "s"} older than ${result.days} days`
          : `No clips older than ${result.days} days to delete`
      );
      await onPurged?.();
    } catch (error) {
      toast.error(error?.message || "Couldn't clear the old clips");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="mt-2 space-y-1.5 rounded-lg border border-line/70 bg-surface-raised px-2 py-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="clip-retention" className="text-[9.5px] uppercase tracking-[0.1em] text-white/45">
          Keep clips for
        </label>
        <span className="flex items-center gap-1">
          <input
            id="clip-retention"
            type="number"
            min="1"
            max="3650"
            inputMode="numeric"
            value={value}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            className="w-12 rounded border border-line/80 bg-ink-950 px-1.5 py-0.5 text-right font-mono text-[10.5px] text-white outline-none focus:border-neon/60"
          />
          <span className="text-[9.5px] text-white/40">days</span>
          {retention.saving ? <Loader2 className="h-3 w-3 animate-spin text-white/40" /> : null}
        </span>
      </div>

      <button
        type="button"
        onClick={clear}
        disabled={clearing || retention.loading}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-alert/40 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-alert/90 transition hover:bg-alert/10 disabled:opacity-50"
      >
        {clearing ? (
          <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.4} />
        ) : (
          <Trash2 className="h-3 w-3" strokeWidth={2.2} />
        )}
        {clearing ? "Clearing" : `Clear clips older than ${retention.days} days`}
      </button>

      <p className="text-[8.5px] leading-relaxed text-white/25">
        A nightly check at 3:00 AM removes anything past this window.
      </p>
    </div>
  );
}