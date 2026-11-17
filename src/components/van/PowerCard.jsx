import { Zap } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

export default function PowerCard({ percent = 0, voltage, solar = 0, load = 0 }) {
  const charging = Number(solar) > Number(load);
  const color = percent < 30 ? "#ff375f" : "#30d158";

  return (
    <Panel id="card-power" title="Power" icon={Zap} accent="text-ios-green">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[22px] font-semibold leading-none tracking-tight text-white">
            {Number(voltage ?? 0).toFixed(1)}
            <span className="ml-1 text-[13px] font-medium text-white/40">V</span>
          </p>
          <p className="mt-1.5 text-[12px] font-medium text-white/45">House bank</p>
          <p className={charging ? "mt-2.5 text-[12px] font-medium text-ios-green" : "mt-2.5 text-[12px] font-medium text-ios-orange"}>
            {charging ? "Charging" : "On battery"} · {Math.round(solar)} W
          </p>
          <p className="mt-0.5 text-[12px] text-white/35">{Math.round(load)} W load</p>
        </div>

        <div className="relative h-[72px] w-[104px] shrink-0 text-center">
          <div className="absolute left-0 top-[18px]" aria-hidden="true">
            <ArcGauge value={percent} size={104} thickness={7} color={color} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[22px] font-semibold leading-none tracking-tight text-white">
              {percent}
              <span className="text-[13px] font-medium text-white/40">%</span>
            </p>
            <p className="mt-1.5 text-[11px] font-medium text-white/40">Battery</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}