import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// Cameras registered on the van hub, kept in sync with the dashboard.
export default function useCameras() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.Camera.filter({}, { sort: "created_date", limit: 20 });
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
      base44.entities.Camera.subscribe((event) => {
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

  const update = async (id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    await base44.entities.Camera.update(id, patch);
  };

  return { items, loading, update, refresh: load };
}