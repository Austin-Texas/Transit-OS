import { Droplets } from "lucide-react";
import Panel from "./Panel";

const LEVELS = [
  { key: "fresh_water", label: "Fresh", color: "#00f0ff" },
  { key: "gray_water", label: "Gray", color: "#8aa0b4" },
  { key: "black_water", label: "Black", color: "#5f6f80" },
];

export default function WaterCard({ status }) {
  return (
    <Panel id="card-water" title="Water" icon={Droplets}>
      <div className="grid grid-cols-3 gap-2.5">
        {LEVELS.map(({ key, label, color }) => {
          const value = Number(status[key] ?? 0);
          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <div className="relative h-[62px] w-full overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.04]">
                <div
                  className="absolute inset-x-0 bottom-0 transition-all duration-700 ease-out"
                  style={{ height: `${value}%`, background: `linear-gradient(180deg, ${color}, ${color}66)` }}
                />
              </div>
              <p className="text-[8.5px] uppercase tracking-[0.14em] text-white/35">{label}</p>
              <p className="font-mono text-[10.5px] text-white/85">{value}%</p>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}