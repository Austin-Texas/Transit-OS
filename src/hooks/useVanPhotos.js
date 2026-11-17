import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const isRemote = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

function useResolved(uri) {
  const [url, setUrl] = useState(() => (isRemote(uri) ? uri : null));

  useEffect(() => {
    if (!uri) {
      setUrl(null);
      return undefined;
    }
    if (isRemote(uri)) {
      setUrl(uri);
      return undefined;
    }
    let active = true;
    setUrl(null);
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: uri, expires_in: 3600 })
      .then(({ signed_url }) => {
        if (active) setUrl(signed_url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uri]);

  return url;
}

// The owner's own photos of the van: the exterior shot skins the flanks, the
// cabin shot lines the living space. Private uploads are signed on demand, so
// the 3D stage gets a plain URL either way.
export default function useVanPhotos(status) {
  const exterior = useResolved(status?.van_photo_uri);
  const cabin = useResolved(status?.cabin_photo_uri);
  return { exterior, cabin };
}