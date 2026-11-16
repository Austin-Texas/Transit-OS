import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "@/components/electrical/ChartTip";
import useEnergyReadings from "@/hooks/useEnergyReadings";
import ModuleCard from "./ModuleCard";

const SERIES = [
  { key: "battery", name: "Battery", color: "#00f0ff" },
  { key: "fresh", name: "Fresh water", color: "#00ff41" },
  { key: "gray", name: "Gray water", color: "#ff9500" },
];

const TICK = { fontSize: 9, fill: "rgba(255,255,255,0.35)" };

// A week of house battery and tank levels, so a trip can be planned on real use.
export default function TrendChart() {
  const { points, loading, count } = useEnergyReadings(168);

  return (
    <ModuleCard
      title="7-day trends"
      icon={TrendingUp}
      action={
        <span className="flex items-center gap-2">
          {SERIES.map((series) => (
            <span key={series.key} className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: series.color }} />
              <span className="text-[8px] uppercase tracking-[0.1em] text-white/35">{series.name}</span>
            </span>
          ))}
        </span>
      }
    >
      {loading ? (
        <div className="h-[124px] animate-soft-pulse rounded-lg bg-white/[0.03]" />
      ) : count ? (
        <div className="h-[124px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 4, right: 6, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={TICK}
                axisLine={false}
                tickLine={false}
                minTickGap={48}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={TICK}
                axisLine={false}
                tickLine={false}
                width={42}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<ChartTip unit="%" />} cursor={{ stroke: "rgba(0,240,255,0.3)" }} />
              {SERIES.map((series) => (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.name}
                  stroke={series.color}
                  strokeWidth={1.8}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-line/80 px-3 py-5 text-center text-[9.5px] leading-relaxed text-white/35">
          History fills in as your hub posts readings — a week of battery and tank levels appears here.
        </p>
      )}
    </ModuleCard>
  );
}