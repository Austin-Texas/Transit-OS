import { cn } from "@/lib/utils";

// The hover bubble on the 3D van: a small raw-reading card, not a sentence.
export default function HotspotTip({ tip }) {
  if (!tip) return null;

  const tone = tip.tone;
  const dot = tone === "alert" ? "bg-ios-pink" : tone === "muted" ? "bg-white/35" : "bg-ios-green";
  const statusTone =
    tone === "alert" ? "text-ios-pink" : tone === "muted" ? "text-white/45" : "text-ios-green";

  return (
    <div
      className="pointer-events-none absolute z-30 w-[178px] -translate-x-1/2 -translate-y-[calc(100%+14px)]"
      style={{ left: tip.x, top: tip.y }}
    >
      <div className="overflow-hidden rounded-[14px] border border-white/[0.12] bg-[#080d13]/92 shadow-[0_20px_44px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
            <span className="truncate text-[9.5px] font-semibold uppercase tracking-[0.1em] text-white/80">
              {tip.title}
            </span>
          </span>
          <span className={cn("shrink-0 text-[9px] font-semibold", statusTone)}>{tip.status}</span>
        </div>

        <dl className="flex flex-col gap-[3px] border-t border-white/[0.08] px-2.5 py-1.5">
          {tip.rows.map((row) => (
            <div key={row.k} className="flex items-baseline justify-between gap-3">
              <dt className="text-[8.5px] uppercase tracking-[0.09em] text-white/40">{row.k}</dt>
              <dd className="font-mono text-[10.5px] font-semibold tabular-nums leading-tight text-white/90">
                {row.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}