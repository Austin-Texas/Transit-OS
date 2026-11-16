import { useRef, useState } from "react";
import { BedDouble, ImagePlus, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import ModuleCard from "@/components/dash/ModuleCard";
import VanPhoto from "@/components/van/VanPhoto";
import PhotoGrade from "@/components/van/PhotoGrade";
import { base44 } from "@/api/base44Client";
import { CABIN_IMAGE, VAN_IMAGE } from "@/lib/van";

const SLOTS = [
  { key: "van_photo_uri", label: "Van exterior", fallback: VAN_IMAGE, icon: Truck },
  { key: "cabin_photo_uri", label: "Cabin interior", fallback: CABIN_IMAGE, icon: BedDouble },
];

function PhotoRow({ slot, uri, onUpdate }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const Icon = slot.icon;

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
      await onUpdate({ [slot.key]: file_uri });
      toast.success(`${slot.label} photo updated`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await onUpdate({ [slot.key]: null });
      toast.success(`${slot.label} photo removed`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-line/80 bg-surface-raised p-2.5">
      <div className="relative h-[62px] w-[92px] shrink-0 overflow-hidden rounded-lg border photo-slot">
        <VanPhoto uri={uri} fallback={slot.fallback} alt={slot.label} className="absolute inset-0 h-full w-full object-cover" />
        <PhotoGrade />
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
          <Icon className="h-3 w-3 text-sys-blue" strokeWidth={2.2} />
          {slot.label}
        </p>
        <p className="mt-0.5 text-[9.5px] text-white/35">{uri ? "Your photo in use" : "Using the default render"}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={upload} />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sys-blue/45 bg-sys-blue/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-sys-blue transition hover:bg-sys-blue/20 disabled:opacity-50"
          >
            <ImagePlus className="h-3 w-3" strokeWidth={2.2} />
            {busy ? "Saving" : uri ? "Replace" : "Upload"}
          </button>
          <button
            type="button"
            disabled={busy || !uri}
            onClick={remove}
            className="inline-flex items-center gap-1.5 rounded-lg border border-alert/40 bg-alert/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-alert transition hover:bg-alert/20 disabled:opacity-40"
          >
            <Trash2 className="h-3 w-3" strokeWidth={2.2} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PhotoSlots({ status, onUpdate }) {
  return (
    <ModuleCard title="Photos" icon={ImagePlus}>
      <div className="grid gap-2">
        {SLOTS.map((slot) => (
          <PhotoRow key={slot.key} slot={slot} uri={status[slot.key]} onUpdate={onUpdate} />
        ))}
      </div>
      <p className="mt-2 text-[9.5px] leading-relaxed text-white/30">
        Photos show on the dashboard and camper views. They are stored privately and only loaded for you.
      </p>
    </ModuleCard>
  );
}