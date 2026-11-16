import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "@/components/electrical/ChartTip";

const TICK = { fontSize: 9, fill: "rgba(255,255,255,0.35)" };

export default function TrendChartPanel({ points, series, activeKey, loading, count }) {
  if (loading) {
    return <div className="h-[300px] animate-soft-pulse rounded-lg bg-white/[0.03]" />;
  }

  if (!count) {
    return (
      <p className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-line/80 px-4 text-center text-[10px] leading-relaxed text-white/35">
        No readings in this window — step back to a week your hub recorded.
      </p>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={TICK}
            axisLine={false}
            tickLine={false}
            minTickGap={56}
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
          {series.map((item) => {
            const active = item.key === activeKey;
            return (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color}
                strokeWidth={active ? 2.6 : 1.2}
                strokeOpacity={active ? 1 : 0.3}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}