import { Flame } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

export default function LpgCard({ percent, gallons }) {
  return (
    <Panel id="card-lpg" title="Propane" icon={Flame} accent="text-ios-orange">
      <div className="flex items-center justify-between gap-3">
        <ArcGauge value={percent} size={112} thickness={8} color="#ff9f0a">
          <p className="text-[24px] font-semibold leading-none tracking-tight text-white">
            {percent}
            <span className="text-[13px] font-medium text-white/40">%</span>
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-white/40">Tank</p>
        </ArcGauge>
        <div className="text-right">
          <p className="text-[22px] font-semibold leading-none tracking-tight text-white">
            {Number(gallons).toFixed(1)}
          </p>
          <p className="mt-1.5 text-[12px] font-medium text-white/45">gal remaining</p>
        </div>
      </div>
    </Panel>
  );
}