import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const DEFAULT_DAYS = 30;

const clamp = (value) => {
  const days = Number(value);
  if (!Number.isFinite(days)) return DEFAULT_DAYS;
  return Math.min(Math.max(Math.round(days), 1), 3650);
};

// How many days of dashcam clips the owner keeps.
export default function useClipRetention() {
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.ClipSettings.filter({}, { sort: "-created_date", limit: 1 });
      const record = page.items?.[0];
      if (!record) return;
      setRecordId(record.id);
      setDays(clamp(record.retention_days));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (next) => {
    const value = clamp(next);
    setDays(value);
    setSaving(true);
    try {
      if (recordId) {
        await base44.entities.ClipSettings.update(recordId, { retention_days: value });
      } else {
        const created = await base44.entities.ClipSettings.create({ retention_days: value });
        setRecordId(created.id);
      }
    } finally {
      setSaving(false);
    }
    return value;
  };

  return { days, save, saving, loading };
}