import { useEffect, useState } from "react";
import { orderSources, stitchSurround } from "@/lib/surroundStitch";

// Builds the stitched 360° panorama whenever the camera stills change, and
// keeps the placement order for the side-by-side fallback.
export default function useSurroundPanorama(sources = []) {
  const signature = sources.map((source) => `${source.id}:${source.url}`).join("|");
  const [state, setState] = useState({ panorama: null, ordered: sources, loading: false });

  useEffect(() => {
    const ordered = orderSources(sources);
    if (sources.length < 2) {
      setState({ panorama: null, ordered, loading: false });
      return;
    }

    let active = true;
    // Keep the last panorama on screen while the new stills are stitched.
    setState((previous) => ({ panorama: previous.panorama, ordered, loading: true }));

    stitchSurround(ordered)
      .then((panorama) => {
        if (active) setState({ panorama, ordered, loading: false });
      })
      .catch(() => {
        if (active) setState({ panorama: null, ordered, loading: false });
      });

    return () => {
      active = false;
    };
  }, [signature]);

  return state;
}