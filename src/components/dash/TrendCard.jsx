import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import useEnergyReadings from "@/hooks/useEnergyReadings";
import ArrowPad from "@/components/trends/ArrowPad";
import { MAX_OFFSET_DAYS, METRICS, WINDOW_HOURS } from "@/lib/trends";

// The dashboard entry point: arrows drive the preview live, the link carries
// the current selection into the full analytics page.
export default function TrendCard() {
  const [metric, setMetric] = useState(0);
  const [offsetDays, setOffsetDays] = useState(0);
  const { points, loading, count } = useEnergyReadings(WINDOW_HOURS, offsetDays * 24);
  const active = METRICS[metric];

  const values = points.map((point) => point[active.key]).filter((value) => value !== null && value !== undefined);
  const current = values.length ? values[values.length - 1] : null;
  const low = values.length ? Math.min(...values) : null;
  const high = values.length ? Math.max(...values) : null;
  const show = (value) => (value === null ? "—" : `${Math.round(value)}%`);
  const windowLabel = offsetDays ? `${offsetDays}d ago` : "This week";

  return (
    <section className="rounded-2xl border border-line/80 bg-surface p-4">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-sys-blue" strokeWidth={2} />
          <h2 className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            7-day trends
          </h2>
        </div>
        <span className="flex items-center gap-2.5">
          {METRICS.map((item, index) => (
            <span key={item.key} className="flex items-center gap-1">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: item.color, opacity: index === metric ? 1 : 0.3 }}
              />
              <span
                className={
                  index === metric
                    ? "text-[8px] uppercase tracking-[0.1em] text-white/70"
                    : "text-[8px] uppercase tracking-[0.1em] text-white/30"
                }
              >
                {item.short}
              </span>
            </span>
          ))}
        </span>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <div className="h-[118px] w-full">
            {loading ? (
              <div className="h-full animate-soft-pulse rounded-lg bg-white/[0.03]" />
            ) : count ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={points} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <YAxis domain={[0, 100]} hide />
                  {METRICS.map((item) => {
                    const on = item.key === active.key;
                    return (
                      <Line
                        key={item.key}
                        type="monotone"
                        dataKey={item.key}
                        name={item.name}
                        stroke={item.color}
                        strokeWidth={on ? 2.4 : 1.1}
                        strokeOpacity={on ? 1 : 0.28}
                        dot={false}
                        connectNulls
                        isAnimationActive={false}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-line/80 text-[9px] uppercase tracking-[0.16em] text-white/30">
                No readings in this window
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {[
              ["Now", show(current)],
              ["Low", show(low)],
              ["High", show(high)],
            ].map(([label, value]) => (
              <span key={label} className="flex items-baseline gap-1">
                <span className="text-[8px] uppercase tracking-[0.12em] text-white/35">{label}</span>
                <span className="font-mono text-[11px] font-semibold text-white/85">{value}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="w-full shrink-0 sm:w-[164px]">
          <ArrowPad
            compact
            label={active.short}
            sub={windowLabel}
            onUp={() => setMetric((value) => Math.max(0, value - 1))}
            onDown={() => setMetric((value) => Math.min(METRICS.length - 1, value + 1))}
            onLeft={() => setOffsetDays((value) => Math.min(MAX_OFFSET_DAYS, value + 1))}
            onRight={() => setOffsetDays((value) => Math.max(0, value - 1))}
            upDisabled={metric === 0}
            downDisabled={metric === METRICS.length - 1}
            leftDisabled={offsetDays >= MAX_OFFSET_DAYS}
            rightDisabled={offsetDays === 0}
          />
          <Link
            to="/trends"
            search={{ metric: active.key, offset: offsetDays || undefined }}
            className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-sys-blue/40 bg-sys-blue/10 px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-sys-blue transition hover:bg-sys-blue/20"
          >
            Full analytics
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}