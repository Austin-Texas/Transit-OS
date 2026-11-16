import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// Saved 360° surround clips, newest first — kept live so clips the dashcam
// saves on its own show up without a reload.
export default function useSurroundClips() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.SurroundClip.filter({}, { sort: "-recorded_at", limit: 20 });
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
      base44.entities.SurroundClip.subscribe((event) => {
        const record = event.data;
        if (!record?.id) return;
        if (event.type === "delete") {
          setItems((prev) => prev.filter((clip) => clip.id !== record.id));
          return;
        }
        setItems((prev) =>
          [record, ...prev.filter((clip) => clip.id !== record.id)].sort(
            (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
          )
        );
      }),
    []
  );

  const remove = async (id) => {
    setItems((prev) => prev.filter((clip) => clip.id !== id));
    await base44.entities.SurroundClip.delete(id);
  };

  return { items, loading, reload: load, remove };
}