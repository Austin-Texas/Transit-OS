import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { buildDiagnostics } from "@/lib/van";
import { syncVanAlerts } from "@/lib/server-fns";

// Live dashboard state backed by the VanStatus and Alert records.
export default function useVanDashboard() {
  const [status, setStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    try {
      const vanPage = await base44.entities.VanStatus.filter({}, { sort: "-created_date", limit: 1 });
      const alertPage = await base44.entities.Alert.filter({ status: "open" }, { sort: "-created_date", limit: 20 });
      setStatus(vanPage.items?.[0] ?? null);
      setAlerts(alertPage.items ?? []);
      setOffline(false);
    } catch (error) {
      console.error(error);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-runs the alert rules against the latest readings and refreshes if a
  // critical condition appeared or cleared.
  const sync = useCallback(async () => {
    try {
      const result = await syncVanAlerts();
      if (result?.raised || result?.resolved) await load();
    } catch (error) {
      console.error(error);
    }
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    sync();
  }, [sync]);

  // A camera stamping fresh motion raises its alert without waiting for a reload.
  useEffect(() => {
    let timer = null;
    const unsubscribe = base44.entities.Camera.subscribe(() => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        sync();
      }, 1500);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [sync]);

  // Live telemetry: the dashboard follows new readings as the van hub writes them.
  useEffect(() => {
    const unsubscribeStatus = base44.entities.VanStatus.subscribe((event) => {
      if (event.type === "delete") return;
      setStatus((prev) => (prev && prev.id !== event.data.id ? prev : event.data));
    });
    const unsubscribeAlerts = base44.entities.Alert.subscribe((event) => {
      if (event.type === "delete") {
        setAlerts((prev) => prev.filter((alert) => alert.id !== event.data.id));
        return;
      }
      if (event.data.status === "resolved") {
        setAlerts((prev) => prev.filter((alert) => alert.id !== event.data.id));
        return;
      }
      setAlerts((prev) => [event.data, ...prev.filter((alert) => alert.id !== event.data.id)]);
    });
    return () => {
      unsubscribeStatus();
      unsubscribeAlerts();
    };
  }, []);

  // Applies a change everywhere at once and saves it to the van record.
  const update = async (patch) => {
    setStatus((prev) => (prev ? { ...prev, ...patch } : prev));
    if (status?.id) await base44.entities.VanStatus.update(status.id, patch);
  };

  const setMode = (mode) => update({ active_mode: mode });

  const adjustClimate = (delta) => {
    const next = Math.min(90, Math.max(50, Number(status?.climate_set ?? 72) + delta));
    update({ climate_set: next, climate_temp: next });
  };

  const resolveAlert = async (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    await base44.entities.Alert.update(alertId, { status: "resolved" });
  };

  return {
    status,
    alerts,
    loading,
    offline,
    setMode,
    adjustClimate,
    update,
    resolveAlert,
    refresh: load,
    diagnostics: status ? buildDiagnostics(status, alerts) : [],
  };
}