import { BedDouble } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CABIN_IMAGE } from "@/lib/van";

export default function CabinCard({ temp }) {
  return (
    <section
      id="card-cabin"
      className="panel-surface relative overflow-hidden rounded-2xl border border-neon/15 transition-colors duration-300 hover:border-neon/35"
    >
      <div className="relative h-[132px] w-full">
        <Image
          src={CABIN_IMAGE}
          alt="Camper van cabin interior with warm lighting"
          fittingType="fill"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/55" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3">
          <div className="flex items-center gap-2">
            <BedDouble className="h-3.5 w-3.5 text-neon/80" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Cabin</span>
          </div>
          <span className="rounded-full border border-ok/40 bg-ok/10 px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-ok">
            Lights on
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <div>
            <p className="font-mono text-[15px] font-semibold leading-none text-white">{Math.round(temp)}°F</p>
            <p className="mt-1 text-[9.5px] text-white/45">Interior · warm LED</p>
          </div>
        </div>
      </div>
    </section>
  );
}