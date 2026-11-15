import { Zap } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

export default function PowerCard({ percent }) {
  return (
    <Panel id="card-power" title="Power" icon={Zap}>
      <div className="flex items-end justify-between gap-2">
        <div className="pb-3">
          <p className="font-mono text-[12px] text-ok">LiFePO4</p>
          <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/35">House bank</p>
          <p className="mt-2 text-[10px] text-white/30">Solar 340 W</p>
        </div>
        <ArcGauge value={percent} size={100} color="#00ff41">
          <p className="font-mono text-[21px] font-semibold leading-none text-white">{percent}%</p>
          <p className="mt-1 text-[8.5px] uppercase tracking-[0.16em] text-ok/70">Battery</p>
        </ArcGauge>
      </div>
    </Panel>
  );
}