import { Minus, Plus, Snowflake } from "lucide-react";
import Panel from "./Panel";
import ArcGauge from "./ArcGauge";

function StepButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 ring-1 ring-inset ring-white/10 transition hover:bg-white/20 hover:text-white active:scale-95"
    >
      {children}
    </button>
  );
}

const MODES = [
  { id: "auto", label: "Auto" },
  { id: "eco", label: "Eco" },
  { id: "boost", label: "Boost" },
  { id: "off", label: "Off" },
];

export default function ClimateCard({ temp, set, mode = "auto", onAdjust, onChangeMode }) {
  return (
    <Panel id="card-climate" title="Climate" icon={Snowflake} accent="text-ios-teal">
      <div className="flex items-end justify-between gap-3">
        <div className="pb-1">
          <p className="text-[12.5px] font-medium text-white/45">Set to</p>
          <div className="mt-2 flex items-center gap-2">
            <StepButton label="Lower set point" onClick={() => onAdjust(-1)}>
              <Minus className="h-3.5 w-3.5" strokeWidth={2.4} />
            </StepButton>
            <span className="min-w-[54px] text-center text-[19px] font-semibold tracking-tight text-white">
              {Math.round(set)}°
            </span>
            <StepButton label="Raise set point" onClick={() => onAdjust(1)}>
              <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
            </StepButton>
          </div>
          <p className="mt-2.5 text-[12px] capitalize text-white/40">
            {mode === "off" ? "System off" : `${mode} mode`}
          </p>
        </div>

        <div className="relative h-[118px] w-[104px] shrink-0 text-center">
          <div className="absolute left-0 top-[18px]" aria-hidden="true">
            <ArcGauge value={set} min={50} max={90} size={104} thickness={7} color="#64d2ff" />
          </div>
          <div className="absolute inset-x-0 top-[73px] z-10 flex flex-col items-center">
            <p className="text-[22px] font-semibold leading-none tracking-tight text-white">
              {Math.round(temp)}
              <span className="text-[13px] font-medium text-white/40">°</span>
            </p>
            <p className="mt-1.5 text-[11px] font-medium text-white/40">Cabin</p>
          </div>
        </div>
      </div>

      {onChangeMode ? (
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-full bg-black/30 p-1 ring-1 ring-inset ring-white/[0.07]">
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={mode === item.id}
              onClick={() => onChangeMode(item.id)}
              className={
                mode === item.id
                  ? "rounded-full bg-white/90 py-1.5 text-[11px] font-semibold text-[#0b0b0f] shadow-sm transition"
                  : "rounded-full py-1.5 text-[11px] font-medium text-white/45 transition hover:text-white/80"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </Panel>
  );
}