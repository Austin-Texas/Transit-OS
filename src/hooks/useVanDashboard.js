import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SAMPLE_ALERTS, SAMPLE_STATUS, buildDiagnostics } from "@/lib/van";

// Live dashboard state backed by the VanStatus and Alert records.
export default function useVanDashboard() {
  const [status, setStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const vanPage = await base44.entities.VanStatus.filter({}, { sort: "-created_date", limit: 1 });
      let van = vanPage.items?.[0];
      if (!van) van = await base44.entities.VanStatus.create({ ...SAMPLE_STATUS });
      const alertPage = await base44.entities.Alert.filter({ status: "open" }, { sort: "-created_date", limit: 20 });
      setStatus(van);
      setAlerts(alertPage.items ?? []);
    } catch (error) {
      // Keep the dashboard usable from the last known values if the hub is unreachable.
      console.error(error);
      setStatus((prev) => prev ?? { ...SAMPLE_STATUS });
      setAlerts((prev) => (prev.length ? prev : SAMPLE_ALERTS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Applies a change everywhere at once and saves it to the van record.
  const update = async (patch) => {
    setStatus((prev) => ({ ...(prev ?? SAMPLE_STATUS), ...patch }));
    if (status?.id) await base44.entities.VanStatus.update(status.id, patch);
  };

  const setMode = (mode) => update({ active_mode: mode });

  const adjustClimate = (delta) => {
    const next = Math.min(90, Math.max(50, Number(status?.climate_set ?? 72) + delta));
    update({ climate_set: next, climate_temp: next });
  };

  const resolveAlert = async (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    if (!String(alertId).startsWith("sample-")) await base44.entities.Alert.update(alertId, { status: "resolved" });
  };

  return {
    status,
    alerts,
    loading,
    setMode,
    adjustClimate,
    update,
    resolveAlert,
    refresh: load,
    diagnostics: buildDiagnostics(status ?? SAMPLE_STATUS, alerts),
  };
}