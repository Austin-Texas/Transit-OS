import { Droplets } from "lucide-react";
import Panel from "./Panel";

const LEVELS = [
  { key: "fresh_water", label: "Fresh", color: "#64d2ff" },
  { key: "gray_water", label: "Gray", color: "#8e8e93" },
  { key: "black_water", label: "Black", color: "#ff9f0a" },
];

export default function WaterCard({ status }) {
  return (
    <Panel id="card-water" title="Water" icon={Droplets} accent="text-ios-blue">
      <div className="grid grid-cols-3 gap-3">
        {LEVELS.map(({ key, label, color }) => {
          const value = Math.round(Number(status[key] ?? 0));
          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <div className="relative h-[76px] w-full overflow-hidden rounded-2xl bg-white/[0.05] ring-1 ring-inset ring-white/10">
                <div
                  className="absolute inset-x-0 bottom-0 transition-all duration-700 ease-out"
                  style={{
                    height: `${Math.min(100, Math.max(0, value))}%`,
                    background: `linear-gradient(180deg, ${color}, ${color}80)`,
                    boxShadow: `0 -8px 22px -10px ${color}`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.04]" />
              </div>
              <p className="text-[11.5px] font-medium text-white/45">{label}</p>
              <p className="text-[14.5px] font-semibold tracking-tight text-white">{value}%</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}