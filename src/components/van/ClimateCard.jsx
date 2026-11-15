import { Minus, Plus, Snowflake } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

function StepButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-neon/40 hover:text-neon"
    >
      {children}
    </button>
  );
}

export default function ClimateCard({ temp, set, onAdjust }) {
  return (
    <Panel id="card-climate" title="Climate" icon={Snowflake}>
      <div className="flex items-end justify-between gap-2">
        <div className="pb-3">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">Set</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <StepButton label="Lower set point" onClick={() => onAdjust(-1)}>
              <Minus className="h-3 w-3" strokeWidth={2.4} />
            </StepButton>
            <span className="w-10 text-center font-mono text-[12.5px] font-medium text-white">{Math.round(set)}°F</span>
            <StepButton label="Raise set point" onClick={() => onAdjust(1)}>
              <Plus className="h-3 w-3" strokeWidth={2.4} />
            </StepButton>
          </div>
          <p className="mt-2 text-[10px] text-white/30">Auto · Eco</p>
        </div>
        <ArcGauge value={set} min={50} max={90} size={100} color="#00f0ff">
          <p className="font-mono text-[21px] font-semibold leading-none text-white">
            {Math.round(temp)}
            <span className="text-[11px] text-white/45">°F</span>
          </p>
          <p className="mt-1 text-[8.5px] uppercase tracking-[0.16em] text-neon/70">Cabin</p>
        </ArcGauge>
      </div>
    </Panel>
  );
}