import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PART_CATEGORIES } from "@/lib/maintenance";

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const blank = (odometer) => ({
  name: "",
  category: "engine",
  interval_miles: "",
  interval_days: "",
  last_service_miles: odometer ?? "",
  last_service_date: new Date().toISOString().slice(0, 10),
  notes: "",
});

const initial = (item, odometer) =>
  item
    ? {
        name: item.name ?? "",
        category: item.category ?? "engine",
        interval_miles: item.interval_miles ?? "",
        interval_days: item.interval_days ?? "",
        last_service_miles: item.last_service_miles ?? "",
        last_service_date: item.last_service_date ?? "",
        notes: item.notes ?? "",
      }
    : blank(odometer);

export default function MaintenanceForm({ item, odometer, onClose, onSave }) {
  const [values, setValues] = useState(() => initial(item, odometer));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (event) => setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!values.name.trim()) {
      setError("Give the part a name.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        category: values.category,
        interval_miles: toNumber(values.interval_miles),
        interval_days: toNumber(values.interval_days),
        last_service_miles: toNumber(values.last_service_miles),
        last_service_date: values.last_service_date || null,
        notes: values.notes.trim(),
      });
    } catch (saveError) {
      setError("Could not save this part. Try again.");
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="max-w-md border-line bg-surface">
        <DialogHeader>
          <DialogTitle className="text-[14px] text-white">
            {item ? "Edit part" : "Track a part"}
          </DialogTitle>
          <DialogDescription className="text-[10.5px] text-white/40">
            Service limits are checked against your odometer and the date of the last service.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-2.5">
          <div>
            <Label htmlFor="part-name" className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">
              Part
            </Label>
            <Input
              id="part-name"
              value={values.name}
              onChange={set("name")}
              placeholder="Engine oil & filter"
              className="mt-1 h-8 bg-ink-900/60 text-[11.5px]"
            />
          </div>

          <div>
            <Label className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">Category</Label>
            <Select
              value={values.category}
              onValueChange={(value) => setValues((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-1 h-8 bg-ink-900/60 text-[11.5px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-line bg-surface">
                {PART_CATEGORIES.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[11.5px]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="interval-miles" className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">
                Every (mi)
              </Label>
              <Input
                id="interval-miles"
                inputMode="numeric"
                value={values.interval_miles}
                onChange={set("interval_miles")}
                placeholder="10000"
                className="mt-1 h-8 bg-ink-900/60 text-[11.5px]"
              />
            </div>
            <div>
              <Label htmlFor="interval-days" className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">
                Every (days)
              </Label>
              <Input
                id="interval-days"
                inputMode="numeric"
                value={values.interval_days}
                onChange={set("interval_days")}
                placeholder="365"
                className="mt-1 h-8 bg-ink-900/60 text-[11.5px]"
              />
            </div>
            <div>
              <Label htmlFor="last-miles" className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">
                Last at (mi)
              </Label>
              <Input
                id="last-miles"
                inputMode="numeric"
                value={values.last_service_miles}
                onChange={set("last_service_miles")}
                placeholder="9500"
                className="mt-1 h-8 bg-ink-900/60 text-[11.5px]"
              />
            </div>
            <div>
              <Label htmlFor="last-date" className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">
                Last on
              </Label>
              <Input
                id="last-date"
                type="date"
                value={values.last_service_date}
                onChange={set("last_service_date")}
                className="mt-1 h-8 bg-ink-900/60 text-[11.5px]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="part-notes" className="text-[9.5px] uppercase tracking-[0.14em] text-white/40">
              Notes
            </Label>
            <Input
              id="part-notes"
              value={values.notes}
              onChange={set("notes")}
              placeholder="Part number, torque spec, filter size"
              className="mt-1 h-8 bg-ink-900/60 text-[11.5px]"
            />
          </div>

          {error ? <p className="text-[10px] text-alert">{error}</p> : null}

          <DialogFooter className="gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-[11px] text-white/50">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="text-[11px]">
              {saving ? "Saving…" : item ? "Save part" : "Add part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}