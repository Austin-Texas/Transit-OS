import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import VanPhoto from "@/components/van/VanPhoto";
import PhotoGrade from "@/components/van/PhotoGrade";
import { VAN_STAGE_IMAGE } from "@/lib/van";

function Marker({ className, tone, label }) {
  return (
    <div className={className}>
      <span className="relative flex h-3 w-3 items-center justify-center">
        <span className={`absolute inset-0 animate-soft-pulse rounded-full ${tone}`} />
        <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />
      </span>
      <span className="mt-1 block whitespace-nowrap rounded-full border border-line bg-ink-950/80 px-2 py-0.5 text-[8.5px] uppercase tracking-[0.12em] text-white/60 backdrop-blur">
        {label}
      </span>
    </div>
  );
}

export default function VanStage({ cabinTemp, vehicleName, trim, photoUri, focus, onClearFocus }) {
  const side = focus?.side === "left" ? "left" : "right";

  return (
    <section className="photo-slot relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border bg-surface lg:min-h-[190px]">
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sys-blue/[0.08] blur-3xl" />

      <VanPhoto
        uri={photoUri}
        fallback={VAN_STAGE_IMAGE}
        alt="Your camper van"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Neon grade over the photo so it reads as part of the dark interface. */}
      <PhotoGrade />

      {focus ? (
        <>
          <span className="pointer-events-none absolute inset-0 bg-ink-950/55" />
          {/* The flank the alert sits on lights up on the photo itself. */}
          <span
            className={`pointer-events-none absolute inset-y-0 w-2/5 ${
              side === "left"
                ? "left-0 bg-gradient-to-r from-alert/30 via-alert/[0.06] to-transparent"
                : "right-0 bg-gradient-to-l from-alert/30 via-alert/[0.06] to-transparent"
            }`}
          />
          <span
            className={`pointer-events-none absolute inset-y-8 w-[2px] rounded-full bg-alert shadow-[0_0_26px_6px_rgba(255,59,48,0.45)] ${
              side === "left" ? "left-4" : "right-4"
            }`}
          />

          <div className="absolute right-3 top-3 flex max-w-[72%] items-center gap-2 rounded-full border border-alert/55 bg-ink-950/85 px-2.5 py-1 backdrop-blur">
            <span className="inline-flex shrink-0 items-center gap-1 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-alert">
              {side === "left" ? (
                <ArrowLeft className="h-3 w-3" strokeWidth={2.4} />
              ) : (
                <ArrowRight className="h-3 w-3" strokeWidth={2.4} />
              )}
              {side} side
            </span>
            <span className="truncate text-[9.5px] text-white/60">{focus.title}</span>
            <button
              type="button"
              onClick={onClearFocus}
              aria-label="Back to van view"
              className="shrink-0 rounded-full p-0.5 text-white/40 transition hover:text-white"
            >
              <X className="h-3 w-3" strokeWidth={2.6} />
            </button>
          </div>
        </>
      ) : (
        <>
          <Marker className="absolute left-[64%] top-[38%]" tone="bg-sys-red" label="Rear cabin" />
          <Marker className="absolute left-[52%] top-[58%]" tone="bg-sys-green" label="Cabin ok" />
        </>
      )}

      <div className="pointer-events-none absolute left-4 top-3.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
        <span className="h-1.5 w-1.5 rounded-full bg-sys-blue" />
        {focus ? "Live view · side focus" : "Live van"} · Interior {Math.round(cabinTemp)}°F
      </div>

      <div className="pointer-events-none absolute bottom-3.5 left-4">
        <p className="text-[14px] font-semibold leading-tight tracking-tight text-white">{vehicleName}</p>
        <p className="text-[9.5px] uppercase tracking-[0.18em] text-white/40">{trim}</p>
      </div>

      {/* Camera feeds live in Settings now; this is the one-tap way in. */}
      <Link
        to="/settings"
        hash="cameras"
        className="group absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-2 rounded-full border border-neon/45 bg-ink-950/70 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-neon backdrop-blur transition hover:border-neon/80 hover:bg-neon/15"
      >
        <Camera className="h-3.5 w-3.5" strokeWidth={2.2} />
        Cameras
        <ArrowUpRight className="h-3 w-3 opacity-60 transition group-hover:opacity-100" strokeWidth={2.4} />
      </Link>
    </section>
  );
}