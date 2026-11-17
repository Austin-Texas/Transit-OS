import { Zap } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

export default function PowerCard({ percent = 0, voltage, solar = 0, load = 0 }) {
  const charging = Number(solar) > Number(load);
  const color = percent < 30 ? "#ff375f" : "#30d158";

  return (
    <Panel id="card-power" title="Power" icon={Zap} accent="text-ios-green">
      <div className="relative grid grid-cols-[minmax(0,1fr)_104px] gap-x-3">
        {/* Both measurements share the same grid row and typography baseline. */}
        <p className="col-start-1 row-start-1 text-[22px] font-semibold leading-none tracking-tight text-white">
          {Number(voltage ?? 0).toFixed(1)}
          <span className="ml-1 text-[13px] font-medium text-white/40">V</span>
        </p>
        <div className="relative col-start-2 row-start-1 row-span-4 h-[72px] w-[104px] text-center">
          <div className="pointer-events-none absolute left-0 top-[18px]" aria-hidden="true">
            <ArcGauge value={percent} size={104} thickness={7} color={color} />
          </div>
          <p className="relative z-10 text-[22px] font-semibold leading-none tracking-tight text-white">
            {percent}
            <span className="text-[13px] font-medium text-white/40">%</span>
          </p>
          <p className="relative z-10 mt-1.5 text-[11px] font-medium text-white/40">Battery</p>
        </div>
        <p className="col-start-1 row-start-2 mt-1.5 text-[12px] font-medium text-white/45">House bank</p>
        <p className={charging ? "col-start-1 row-start-3 mt-2.5 text-[12px] font-medium text-ios-green" : "col-start-1 row-start-3 mt-2.5 text-[12px] font-medium text-ios-orange"}>
          {charging ? "Charging" : "On battery"} · {Math.round(solar)} W
        </p>
        <p className="col-start-1 row-start-4 mt-0.5 text-[12px] text-white/35">{Math.round(load)} W load</p>
      </div>
    </Panel>
  );
}
