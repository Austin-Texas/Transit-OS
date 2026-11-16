import { Zap } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";
import { cn } from "@/lib/utils";

export default function PowerCard({ percent = 0, voltage, solar = 0, load = 0 }) {
  const charging = Number(solar) > Number(load);

  return (
    <Panel id="card-power" title="Power" icon={Zap}>
      <div className="flex items-end justify-between gap-2">
        <div className="pb-3">
          <p className="font-mono text-[12px] text-ok">{Number(voltage ?? 0).toFixed(1)} V</p>
          <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/35">House bank</p>
          <p className={cn("mt-2 text-[10px]", charging ? "text-ok" : "text-warn")}>
            {charging ? "Charging" : "On battery"} · {Math.round(solar)} W solar
          </p>
          <p className="mt-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/25">
            {Math.round(load)} W load
          </p>
        </div>
        <ArcGauge value={percent} size={100} color={percent < 30 ? "#ff3b30" : "#00ff41"}>
          <p className="font-mono text-[21px] font-semibold leading-none text-white">{percent}%</p>
          <p className="mt-1 text-[8.5px] uppercase tracking-[0.16em] text-ok/70">Battery</p>
        </ArcGauge>
      </div>
    </Panel>
  );
}