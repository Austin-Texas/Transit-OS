import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { toast } from "sonner";
import ModuleCard from "@/components/dash/ModuleCard";

// Placeholder readings until the van hub is connected: the owner types the real
// levels here whenever they have them, and a live telemetry push replaces them.
const FIELDS = [
  { key: "battery_percent", label: "Battery (%)", placeholder: "94", max: 100 },
  { key: "battery_voltage", label: "Battery (V)", placeholder: "13.1", decimal: true },
  { key: "fresh_water", label: "Fresh water (%)", placeholder: "100", max: 100 },
  { key: "gray_water", label: "Gray water (%)", placeholder: "0", max: 100 },
  { key: "black_water", label: "Black water (%)", placeholder: "0", max: 100 },
  { key: "lpg_percent", label: "Propane (%)", placeholder: "24", max: 100 },
  { key: "fuel_percent", label: "Fuel (%)", placeholder: "64", max: 100 },
  { key: "solar_w", label: "Solar (W)", placeholder: "0" },
];

const toNumber = (value, field) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const clamped = field.max !== undefined ? Math.min(field.max, Math.max(0, parsed)) : parsed;
  return field.decimal ? Math.round(clamped * 10) / 10 : Math.round(clamped);
};

export default function VanReadings({ status, onUpdate }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!status) return;
    setForm(
      Object.fromEntries(FIELDS.map((field) => [field.key, status[field.key] ?? ""]))
    );
  }, [status?.id]);

  const save = async () => {
    const patch = {};
    FIELDS.forEach((field) => {
      const next = toNumber(form[field.key], field);
      if (next !== null) patch[field.key] = next;
    });
    if (!Object.keys(patch).length) {
      toast.error("Enter at least one reading");
      return;
    }
    setSaving(true);
    try {
      await onUpdate(patch);
      toast.success("Readings updated");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModuleCard title="Current readings" icon={Activity}>
      <p className="mb-2.5 rounded-lg border border-warn/35 bg-warn/[0.06] px-2.5 py-2 text-[10px] leading-relaxed text-white/50">
        Placeholder values until your van hub is connected. Type your real levels here any time. Live telemetry from
        the hub replaces them automatically.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-[9px] uppercase tracking-[0.14em] text-white/35">{field.label}</span>
            <input
              type="number"
              inputMode={field.decimal ? "decimal" : "numeric"}
              step={field.decimal ? "0.1" : "1"}
              value={form[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
              className="w-full rounded-lg border border-line/80 bg-surface-raised px-2.5 py-1.5 font-mono text-[11.5px] text-white outline-none transition placeholder:text-white/20 focus:border-sys-blue/60"
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-sys-blue/45 bg-sys-blue/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sys-blue transition hover:bg-sys-blue/20 disabled:opacity-50"
      >
        {saving ? "Saving" : "Update readings"}
      </button>
    </ModuleCard>
  );
}