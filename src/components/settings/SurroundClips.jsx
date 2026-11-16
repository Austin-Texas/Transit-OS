import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const stamp = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

function ClipCard({ clip, onDelete }) {
  const [url, setUrl] = useState(null);
  const motion = clip.trigger === "motion";

  useEffect(() => {
    let active = true;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: clip.file_uri, expires_in: 3600 })
      .then(({ signed_url }) => {
        if (active) setUrl(signed_url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [clip.file_uri]);

  return (
    <li
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-black",
        motion ? "border-alert/45" : "border-line/80"
      )}
    >
      {url ? (
        <video src={url} controls playsInline preload="metadata" className="h-[92px] w-full bg-black object-cover" />
      ) : (
        <div className="grid h-[92px] w-full place-items-center bg-surface-raised">
          <span className="text-[8.5px] uppercase tracking-[0.16em] text-white/35">Loading clip</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-1.5 border-t border-line/70 bg-surface-raised px-2 py-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              "shrink-0 rounded px-1 py-0.5 text-[7.5px] font-semibold uppercase tracking-[0.1em]",
              motion ? "bg-alert/20 text-alert" : "bg-neon/15 text-neon"
            )}
          >
            {motion ? "Motion" : "Manual"}
          </span>
          <span className="truncate text-[8.5px] uppercase tracking-[0.1em] text-white/45">
            {clip.reason || stamp(clip.recorded_at)}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="font-mono text-[8.5px] text-white/35">{Math.round(clip.duration_s ?? 0)}s</span>
          <button
            type="button"
            onClick={() => onDelete(clip.id)}
            aria-label="Delete clip"
            className="rounded p-0.5 text-white/35 transition hover:text-alert"
          >
            <Trash2 className="h-3 w-3" strokeWidth={2.2} />
          </button>
        </span>
      </div>
    </li>
  );
}

export default function SurroundClips({ clips }) {
  if (clips.loading) {
    return <p className="text-[9.5px] text-white/30">Loading clips</p>;
  }

  if (!clips.items.length) {
    return (
      <p className="rounded-lg border border-dashed border-line/80 px-3 py-4 text-center text-[9.5px] leading-relaxed text-white/35">
        No 360° clips yet. One saves automatically the next time a camera reports motion, or record one yourself.
      </p>
    );
  }

  return (
    <ul className="grid max-h-[186px] gap-2 overflow-y-auto pr-1 no-scrollbar">
      {clips.items.map((clip) => (
        <ClipCard key={clip.id} clip={clip} onDelete={clips.remove} />
      ))}
    </ul>
  );
}