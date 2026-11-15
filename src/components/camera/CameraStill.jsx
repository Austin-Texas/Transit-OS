import { cn } from "@/lib/utils";

// Renders in place of a camera still until a real snapshot lands, so the frame
// is already sized and lit for the photo the user uploads later.
export default function CameraStill({ compact = false, className }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        "[background:radial-gradient(120%_100%_at_50%_28%,#0e2433_0%,#081522_52%,#03080e_100%)]",
        className
      )}
    >
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(0,240,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.10)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_50%,rgba(0,150,255,0.20)_0%,transparent_58%)]" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-neon/25" />

      <div className="absolute inset-0 grid place-items-center">
        <div
          className={cn(
            "flex flex-col items-center text-center",
            compact ? "gap-1" : "gap-1.5 rounded-xl border border-white/10 bg-black/35 px-5 py-3 backdrop-blur"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={cn("text-neon/70", compact ? "h-4 w-4" : "h-6 w-6")}
            aria-hidden="true"
          >
            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h9A2.5 2.5 0 0 1 17 8.5v7A2.5 2.5 0 0 1 14.5 18h-9A2.5 2.5 0 0 1 3 15.5v-7Z" stroke="currentColor" strokeWidth="1.3" />
            <path d="M17 11.2l3.2-1.9a.7.7 0 0 1 1.05.6v4.2a.7.7 0 0 1-1.05.6L17 12.8v-1.6Z" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span
            className={cn(
              "font-semibold uppercase text-white/55",
              compact ? "text-[7px] tracking-[0.14em]" : "text-[10px] tracking-[0.28em]"
            )}
          >
            Awaiting snapshot
          </span>
          {compact ? null : (
            <span className="text-[9.5px] text-white/30">Upload a still or let the van hub push one</span>
          )}
        </div>
      </div>
    </div>
  );
}