import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const pad = (value) => String(value).padStart(2, "0");

const timeLabel = (date, range) => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (range > 48) {
    return date.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", timeZone: zone });
  }
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false, timeZone: zone });
};

const pct = (value) =>
  value === null || value === undefined || value === "" ? null : Math.round(Number(value));

// Power and tank history pushed by the van hub, charted for the selected window.
export default function useEnergyReadings(range = 24, offsetHours = 0) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const until = new Date(Date.now() - offsetHours * 3600 * 1000).toISOString();
    const since = new Date(Date.now() - (range + offsetHours) * 3600 * 1000).toISOString();
    try {
      const page = await base44.entities.EnergyReading.filter(
        { recorded_at: { $gte: since, $lte: until } },
        { sort: "-recorded_at", limit: 500 }
      );
      // Newest first from the server, oldest first for the charts.
      setItems((page.items ?? []).slice().reverse());
    } finally {
      setLoading(false);
    }
  }, [range, offsetHours]);

  useEffect(() => {
    load();
  }, [load]);

  const points = items.map((reading) => {
    const at = new Date(reading.recorded_at);
    return {
      label: timeLabel(at, range),
      battery: Math.round(Number(reading.battery_percent ?? 0)),
      solar: Math.round(Number(reading.solar_w ?? 0)),
      load: Math.round(Number(reading.load_w ?? 0)),
      fresh: pct(reading.fresh_water),
      gray: pct(reading.gray_water),
      black: pct(reading.black_water),
      lpg: pct(reading.lpg_percent),
    };
  });

  const last = items[items.length - 1];
  const solarPeak = items.reduce((max, r) => Math.max(max, Number(r.solar_w ?? 0)), 0);
  const avgLoad = items.length
    ? Math.round(items.reduce((sum, r) => sum + Number(r.load_w ?? 0), 0) / items.length)
    : 0;

  return { points, loading, last, solarPeak, avgLoad, count: items.length, refresh: load };
}

export { pad };