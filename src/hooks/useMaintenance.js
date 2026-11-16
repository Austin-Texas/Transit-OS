import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export const today = () => new Date().toISOString().slice(0, 10);

// The tracked parts: loaded once, kept in step with every add, edit and
// service the owner records.
export default function useMaintenance() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.MaintenanceItem.filter(
        {},
        { sort: "created_date", limit: 200 }
      );
      setItems(page.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (values) => {
    const created = await base44.entities.MaintenanceItem.create(values);
    setItems((prev) => [...prev, created]);
    return created;
  };

  const update = async (id, values) => {
    const saved = await base44.entities.MaintenanceItem.update(id, values);
    setItems((prev) => prev.map((item) => (item.id === id ? saved : item)));
    return saved;
  };

  const remove = async (id) => {
    await base44.entities.MaintenanceItem.delete(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const markServiced = (item, odometer) =>
    update(item.id, {
      last_service_miles: Number.isFinite(Number(odometer)) ? Number(odometer) : item.last_service_miles,
      last_service_date: today(),
    });

  return { items, loading, create, update, remove, markServiced, refresh: load };
}