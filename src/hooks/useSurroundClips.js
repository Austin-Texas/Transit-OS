import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// Saved 360° surround clips, newest first.
export default function useSurroundClips() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.SurroundClip.filter({}, { sort: "-recorded_at", limit: 12 });
      setItems(page.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    setItems((prev) => prev.filter((clip) => clip.id !== id));
    await base44.entities.SurroundClip.delete(id);
  };

  return { items, loading, reload: load, remove };
}