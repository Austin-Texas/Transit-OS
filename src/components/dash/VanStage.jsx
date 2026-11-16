import { ArrowLeft, ArrowRight, X } from "lucide-react";
import VanPhoto from "@/components/van/VanPhoto";
import VanModel from "@/components/van/VanModel";
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

export default function VanStage({ cabinTemp, vehicleName, trim, photoUri, onPhoto, focus, onClearFocus }) {
  const side = focus?.side === "left" ? "left" : "right";

  return (
    <section className="relative min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-line/80 bg-surface lg:min-h-[190px]">
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sys-blue/[0.08] blur-3xl" />

      <VanPhoto
        uri={photoUri}
        fallback={VAN_STAGE_IMAGE}
        alt="Your camper van"
        className="absolute inset-0 h-full w-full object-cover"
        onPhoto={focus ? undefined : onPhoto}
      />

      {/* Neon grade over the photo so it reads as part of the dark interface. */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neon/10 via-transparent to-sys-blue/10 mix-blend-screen" />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgba(2,10,20,0.8)_100%)]" />

      {focus ? (
        <>
          <span className="pointer-events-none absolute inset-0 bg-ink-950/80" />
          <VanModel side={side} title={focus.title} className="absolute inset-0" />

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
        {focus ? "3D view · turning" : "Live 3D"} · Interior {Math.round(cabinTemp)}°F
      </div>

      <div className="pointer-events-none absolute bottom-3.5 left-4">
        <p className="text-[14px] font-semibold leading-tight tracking-tight text-white">{vehicleName}</p>
        <p className="text-[9.5px] uppercase tracking-[0.18em] text-white/40">{trim}</p>
      </div>
    </section>
  );
}