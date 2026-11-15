import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "./ChartTip";

const TICK = { fontSize: 9, fill: "rgba(255,255,255,0.35)" };

export default function BatteryChart({ points }) {
  return (
    <div className="h-[190px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="batteryFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff41" stopOpacity={0.34} />
              <stop offset="100%" stopColor="#00ff41" stopOpacity={0} />
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
          <YAxis
            domain={[0, 100]}
            tick={TICK}
            axisLine={false}
            tickLine={false}
            width={46}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<ChartTip unit="%" />} cursor={{ stroke: "rgba(0,240,255,0.3)" }} />
          <Area
            type="monotone"
            dataKey="battery"
            name="Battery"
            stroke="#00ff41"
            strokeWidth={2}
            fill="url(#batteryFill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}