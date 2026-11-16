import { Link } from "@tanstack/react-router";
import { ChevronRight, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import useEnergyReadings from "@/hooks/useEnergyReadings";

const pill = (label, value, color) => (
  <span key={label} className="flex items-center gap-1.5">
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    <span className="text-[8px] uppercase tracking-[0.1em] text-white/35">{label}</span>
    <span className="font-mono text-[10px] font-semibold text-white/80">{value}</span>
  </span>
);

// The dashboard entry point: opens the full trends page.
export default function TrendChartButton() {
  const { points, loading, last, count } = useEnergyReadings(168);

  const values = (key) => {
    const value = last?.[key];
    return value === null || value === undefined ? "—" : `${Math.round(Number(value))}%`;
  };

  return (
    <Link
      to="/trends"
      className="group block rounded-2xl border border-line/80 bg-surface p-4 transition hover:border-sys-blue/50 hover:bg-white/[0.02]"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-sys-blue" strokeWidth={2} />
          <h2 className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            7-day trends
          </h2>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-line/80 px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-white/45 transition group-hover:border-sys-blue/50 group-hover:text-sys-blue">
          Open chart
          <ChevronRight className="h-3 w-3" />
        </span>
      </div>

      <div className="h-[64px] w-full">
        {loading ? (
          <div className="h-full animate-soft-pulse rounded-lg bg-white/[0.03]" />
        ) : count ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="battery"
                stroke="#00f0ff"
                strokeWidth={1.6}
                fill="url(#trendFill)"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="fresh"
                stroke="#00ff41"
                strokeWidth={1.2}
                strokeOpacity={0.6}
                fill="transparent"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-line/80 text-[9px] uppercase tracking-[0.16em] text-white/30">
            History builds as the hub reports
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {pill("Battery", values("battery"), "#00f0ff")}
        {pill("Fresh", values("fresh"), "#00ff41")}
        {pill("Gray", values("gray"), "#ff9500")}
      </div>
    </Link>
  );
}