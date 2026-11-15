import { useEffect, useRef, useState } from "react";
import { Image as ImagePlus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

const isRemote = (value) => typeof value === "string" && /^https?:\/\//i.test(value);

// Shows a photo the owner uploaded (private file, signed on demand) and lets
// them swap it in place. Falls back to the bundled render until then.
export default function VanPhoto({ uri, fallback, alt, className, style, onPhoto, buttonPosition = "bottom" }) {
  const inputRef = useRef(null);
  const [signed, setSigned] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSigned(null);
    if (!uri || isRemote(uri)) return;
    let active = true;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: uri, expires_in: 3600 })
      .then(({ signed_url }) => {
        if (active) setSigned(signed_url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uri]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      await onPhoto(file_uri);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Image
        src={isRemote(uri) ? uri : signed ?? fallback}
        alt={alt}
        fittingType="fill"
        className={className}
        style={style}
      />

      {onPhoto ? (
        <>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "absolute z-20 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur transition hover:border-neon/60 hover:text-white disabled:opacity-60",
              buttonPosition === "top" ? "right-3 top-3" : "bottom-3 right-3"
            )}
          >
            <ImagePlus className="h-3 w-3" strokeWidth={2} />
            {busy ? "Saving" : uri ? "Replace photo" : "Add photo"}
          </button>
        </>
      ) : null}
    </>
  );
}