import { Image } from "@/components/ui/image";
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

export default function VanStage({ cabinTemp, vehicleName, trim }) {
  return (
    <section className="relative min-h-[260px] flex-1 overflow-hidden rounded-2xl border border-line/80 bg-surface">
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sys-blue/[0.08] blur-3xl" />

      <Image
        src={VAN_STAGE_IMAGE}
        alt="Transparent cutaway view of the camper van layout"
        fittingType="fit"
        className="absolute inset-0 h-full w-full object-contain"
      />

      <Marker className="absolute left-[64%] top-[38%]" tone="bg-sys-red" label="Rear cabin" />
      <Marker className="absolute left-[52%] top-[58%]" tone="bg-sys-green" label="Cabin ok" />

      <div className="absolute left-4 top-3.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
        <span className="h-1.5 w-1.5 rounded-full bg-sys-blue" />
        Live 3D · Interior {Math.round(cabinTemp)}°F
      </div>

      <div className="absolute bottom-3.5 left-4">
        <p className="text-[14px] font-semibold leading-tight tracking-tight text-white">{vehicleName}</p>
        <p className="text-[9.5px] uppercase tracking-[0.18em] text-white/40">{trim}</p>
      </div>
    </section>
  );
}