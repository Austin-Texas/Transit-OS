import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import CameraStill from "./CameraStill";
import { cn } from "@/lib/utils";

const isRemote = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

// Resolves whatever the camera holds (a hub-pushed URL or a private upload) and
// falls back to the awaiting-snapshot frame when there is nothing to show.
export default function CameraSnapshot({ camera, compact = false, className }) {
  const source = camera.snapshot_url;
  const [signed, setSigned] = useState(null);

  useEffect(() => {
    setSigned(null);
    if (!source || isRemote(source)) return;
    let active = true;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: source, expires_in: 3600 })
      .then(({ signed_url }) => {
        if (active) setSigned(signed_url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [source]);

  const src = isRemote(source) ? source : signed;
  if (!src) return <CameraStill compact={compact} />;

  const live = camera.status !== "offline";

  return (
    <Image
      src={src}
      alt={compact ? "" : `${camera.name} feed`}
      fittingType="fill"
      className={cn(
        "h-full w-full",
        camera.night_vision && (compact ? "contrast-125 grayscale" : "brightness-110 contrast-125 grayscale"),
        !live && "opacity-40",
        className
      )}
    />
  );
}