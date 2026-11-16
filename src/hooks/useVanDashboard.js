import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { buildDiagnostics } from "@/lib/van";
import { syncVanAlerts } from "@/lib/server-fns";

const PUBLIC_DEMO = import.meta.env.VITE_PUBLIC_DEMO === "true";
const DEMO_STATUS = {
  id: null, climate_temp: 66, climate_set: 66, cabin_temp: 66, exterior_temp: 68,
  humidity: 45, climate_mode: "off", lpg_percent: 24, lpg_gallons: 6,
  battery_percent: 82, battery_voltage: 12.8, solar_w: 240, load_w: 120,
  fresh_water: 68, gray_water: 25, black_water: 12, lights_on: false,
  locks_locked: true, active_mode: "driving", odometer: 62450,
};

// Live dashboard state backed by the VanStatus and Alert records.
export default function useVanDashboard() {
  const [status, setStatus] = useState(PUBLIC_DEMO ? DEMO_STATUS : null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(!PUBLIC_DEMO);
  const [offline, setOffline] = useState(false);

  const load = useCallback(async () => {
    if (PUBLIC_DEMO) return;
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
    if (PUBLIC_DEMO) return;
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
    if (PUBLIC_DEMO) return undefined;
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
    if (PUBLIC_DEMO) return undefined;
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
    if (PUBLIC_DEMO) return;
    if (status?.id) await base44.entities.VanStatus.update(status.id, patch);

    // Tank changes made in the app (refill, dump) join the history log too.
    const tanks = ["fresh_water", "gray_water", "black_water"].filter((key) => patch[key] !== undefined);
    if (tanks.length) {
      const reading = { recorded_at: new Date().toISOString() };
      tanks.forEach((key) => {
        reading[key] = patch[key];
      });
      await base44.entities.EnergyReading.create(reading);
    }
  };

  const setMode = (mode) => update({ active_mode: mode });

  const adjustClimate = (delta) => {
    const next = Math.min(90, Math.max(50, Number(status?.climate_set ?? 72) + delta));
    update({ climate_set: next, climate_temp: next });
  };

  const resolveAlert = async (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    if (!PUBLIC_DEMO) await base44.entities.Alert.update(alertId, { status: "resolved" });
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