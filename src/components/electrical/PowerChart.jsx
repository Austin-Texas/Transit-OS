import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "./ChartTip";

const TICK = { fontSize: 9, fill: "rgba(255,255,255,0.35)" };

export default function PowerChart({ points }) {
  return (
    <div className="h-[190px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={points} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={TICK}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
            interval="preserveStartEnd"
          />
          <YAxis tick={TICK} axisLine={false} tickLine={false} width={46} tickFormatter={(value) => `${value}`} />
          <Tooltip content={<ChartTip unit=" W" />} cursor={{ stroke: "rgba(0,240,255,0.3)" }} />
          <Area
            type="monotone"
            dataKey="solar"
            name="Solar"
            stroke="#00f0ff"
            strokeWidth={2}
            fill="url(#solarFill)"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="load"
            name="Draw"
            stroke="#ff9500"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}