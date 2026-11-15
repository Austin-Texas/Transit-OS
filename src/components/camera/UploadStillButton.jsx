import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

export default function UploadStillButton({ onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      await onUploaded(file_uri);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] transition",
          "border-sys-blue bg-sys-blue/15 text-sys-blue hover:bg-sys-blue/25 disabled:opacity-60"
        )}
      >
        {busy ? (
          <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
        ) : (
          <ImagePlus className="h-3 w-3" strokeWidth={2} />
        )}
        {busy ? "Saving" : "Photo"}
      </button>
    </>
  );
}