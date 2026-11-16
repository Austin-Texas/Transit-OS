import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import useEnergyReadings from "@/hooks/useEnergyReadings";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import ArrowPad from "@/components/trends/ArrowPad";
import TrendChartPanel from "@/components/trends/TrendChartPanel";
import { MAX_OFFSET_DAYS, METRIC_KEYS, METRICS, WINDOW_HOURS } from "@/lib/trends";
import { cn } from "@/lib/utils";

const DAY_HOURS = 24;

export const Route = createFileRoute("/_authed/trends")({
  validateSearch: (search) => {
    const next = {};
    if (typeof search.metric === "string" && METRIC_KEYS.includes(search.metric)) next.metric = search.metric;
    const offset = Number(search.offset);
    if (Number.isFinite(offset) && offset >= 1) next.offset = Math.min(MAX_OFFSET_DAYS, Math.trunc(offset));
    return next;
  },
  head: () => ({
    meta: [
      { title: "TransitOS — Trends" },
      { name: "description", content: "Seven-day history of house battery and tank levels." },
    ],
  }),
  component: TrendsPage,
});

const fmtDay = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-line/80 bg-surface-raised px-2.5 py-1.5">
      <p className="text-[8.5px] uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className={cn("mt-0.5 font-mono text-[12px] font-semibold", tone ?? "text-white")}>{value}</p>
    </div>
  );
}

function TrendsPage() {
  const van = useVanDashboard();
  // Opens on whatever was picked with the dashboard arrows.
  const search = Route.useSearch();
  const [metric, setMetric] = useState(() =>
    Math.max(0, METRICS.findIndex((item) => item.key === search.metric))
  );
  const [offsetDays, setOffsetDays] = useState(search.offset ?? 0);
  const history = useEnergyReadings(WINDOW_HOURS, offsetDays * DAY_HOURS);
  const active = METRICS[metric];

  if (!van.status) return <ModuleShell title="Trends" />;

  const end = new Date(Date.now() - offsetDays * DAY_HOURS * 3600 * 1000);
  const start = new Date(end.getTime() - WINDOW_HOURS * 3600 * 1000);
  const windowLabel = `${fmtDay(start)} – ${fmtDay(end)}`;

  const values = history.points
    .map((point) => point[active.key])
    .filter((value) => value !== null && value !== undefined);

  const current = values.length ? values[values.length - 1] : null;
  const low = values.length ? Math.min(...values) : null;
  const high = values.length ? Math.max(...values) : null;
  const change = values.length > 1 ? current - values[0] : null;

  const show = (value) => (value === null ? "—" : `${Math.round(value)}%`);

  return (
    <ModuleShell title="Trends" subtitle="Seven days of power and tanks" status={van.status}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px]">
        <ModuleCard
          title={`${active.name} · ${windowLabel}`}
          icon={TrendingUp}
          action={
            <span className="flex items-center gap-2.5">
              {METRICS.map((item, index) => (
                <span key={item.key} className="flex items-center gap-1">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: item.color, opacity: index === metric ? 1 : 0.35 }}
                  />
                  <span
                    className={cn(
                      "text-[8px] uppercase tracking-[0.1em]",
                      index === metric ? "text-white/70" : "text-white/30"
                    )}
                  >
                    {item.short}
                  </span>
                </span>
              ))}
            </span>
          }
        >
          <TrendChartPanel
            points={history.points}
            series={METRICS}
            activeKey={active.key}
            loading={history.loading}
            count={history.count}
          />

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Now" value={show(current)} />
            <Stat label="Low" value={show(low)} />
            <Stat label="High" value={show(high)} />
            <Stat
              label="Change"
              value={change === null ? "—" : `${change > 0 ? "+" : ""}${Math.round(change)}%`}
              tone={change === null ? undefined : change < 0 ? "text-warn" : "text-ok"}
            />
          </div>
        </ModuleCard>

        <ModuleCard title="Navigate" icon={TrendingUp}>
          <ArrowPad
            label={active.short}
            sub={offsetDays ? `${offsetDays}d ago` : "This week"}
            onUp={() => setMetric((value) => Math.max(0, value - 1))}
            onDown={() => setMetric((value) => Math.min(METRICS.length - 1, value + 1))}
            onLeft={() => setOffsetDays((value) => Math.min(MAX_OFFSET_DAYS, value + 1))}
            onRight={() => setOffsetDays((value) => Math.max(0, value - 1))}
            upDisabled={metric === 0}
            downDisabled={metric === METRICS.length - 1}
            leftDisabled={offsetDays >= MAX_OFFSET_DAYS}
            rightDisabled={offsetDays === 0}
          />
          <p className="mt-3 text-center text-[9px] leading-relaxed text-white/35">
            Up and down switch between battery and tanks. Left and right step back or forward a week.
          </p>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}