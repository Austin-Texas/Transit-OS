import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const isRemote = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

// Playable URLs for each camera still, so the surround view and its recording
// use the same sources the feeds show.
export default function useCameraSources(cameras = []) {
  const signature = cameras.map((camera) => `${camera.id}:${camera.snapshot_url ?? ""}`).join("|");
  const [sources, setSources] = useState([]);

  useEffect(() => {
    let active = true;

    const resolve = async (camera) => {
      const value = camera.snapshot_url;
      if (!value) return null;
      if (isRemote(value)) return { id: camera.id, name: camera.name, side: camera.side, url: value };
      try {
        const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: value, expires_in: 3600 });
        return { id: camera.id, name: camera.name, side: camera.side, url: signed_url };
      } catch {
        return null;
      }
    };

    Promise.all(cameras.map(resolve)).then((list) => {
      if (active) setSources(list.filter(Boolean));
    });

    return () => {
      active = false;
    };
  }, [signature]);

  return sources;
}