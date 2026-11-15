import { BatteryMedium } from "lucide-react";
import { Image } from "@/components/ui/image";
import { VAN_IMAGE } from "@/lib/van";

export default function VanPanel({ status }) {
  return (
    <section className="panel-surface flex flex-col overflow-hidden rounded-2xl border border-neon/15">
      <div className="relative h-[280px] w-full xl:h-full xl:min-h-[520px] xl:flex-1">
        <Image
          src={VAN_IMAGE}
          alt="Camper van parked in the mountains"
          fittingType="fill"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-transparent" />
        <div className="relative flex h-full flex-col justify-start p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-white/45">Ford</p>
          <p className="mt-1 text-[22px] font-semibold leading-tight tracking-tight text-white">{status.vehicle_name}</p>
          <p className="text-[11px] text-white/45">{status.trim}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/[0.07] px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/40 bg-ok/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ok">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-ok" />
          System Online
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white/70">
          <BatteryMedium className="h-4 w-4 text-ok" strokeWidth={1.7} />
          {Number(status.battery_voltage).toFixed(1)} V
        </span>
      </div>
    </section>
  );
}