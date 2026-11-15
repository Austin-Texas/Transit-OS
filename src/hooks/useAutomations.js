import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// Automation rules stored on the van hub and followed live by the dashboard.
export default function useAutomations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.Automation.filter({}, { sort: "created_date", limit: 50 });
      setItems(page.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(
    () =>
      base44.entities.Automation.subscribe((event) => {
        const record = event.data;
        if (!record?.id) return;
        if (event.type === "delete") {
          setItems((prev) => prev.filter((item) => item.id !== record.id));
          return;
        }
        setItems((prev) =>
          prev.some((item) => item.id === record.id)
            ? prev.map((item) => (item.id === record.id ? record : item))
            : [...prev, record]
        );
      }),
    []
  );

  const create = async (data) => {
    const record = await base44.entities.Automation.create({ ...data, enabled: true });
    setItems((prev) => (prev.some((item) => item.id === record.id) ? prev : [...prev, record]));
    return record;
  };

  const update = async (id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    await base44.entities.Automation.update(id, patch);
  };

  const remove = async (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await base44.entities.Automation.delete(id);
  };

  return { items, loading, create, update, remove, refresh: load };
}