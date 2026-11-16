import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "@/components/electrical/ChartTip";

const TICK = { fontSize: 9, fill: "rgba(255,255,255,0.35)" };

const TANKS = [
  { key: "fresh", name: "Fresh", color: "#00f0ff" },
  { key: "gray", name: "Gray", color: "#8ea3b8" },
  { key: "black", name: "Black", color: "#ff9500" },
];

// Tank levels over the selected window, so a trip can be planned on real use.
export default function TankChart({ points }) {
  return (
    <div className="h-[190px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
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
          {TANKS.map((tank) => (
            <Line
              key={tank.key}
              type="monotone"
              dataKey={tank.key}
              name={tank.name}
              stroke={tank.color}
              strokeWidth={2}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}