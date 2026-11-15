import { Flame } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

export default function LpgCard({ percent, gallons }) {
  return (
    <Panel id="card-lpg" title="LPG / Propane" icon={Flame}>
      <div className="flex items-center justify-between gap-2">
        <ArcGauge mode="ring" value={percent} size={78} thickness={6} color="#ff9500">
          <p className="font-mono text-[15px] font-semibold leading-none text-white">{percent}%</p>
        </ArcGauge>
        <div className="text-right">
          <p className="font-mono text-[12.5px] text-white">{Number(gallons).toFixed(1)} gal</p>
          <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/35">Remaining</p>
        </div>
      </div>
    </Panel>
  );
}