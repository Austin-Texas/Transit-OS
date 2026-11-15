import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ACTIONS, TRIGGERS, triggerMeta } from "@/lib/automation";
import { MODES } from "@/lib/van";
import { cn } from "@/lib/utils";

const EMPTY = { name: "", trigger: "schedule", run_time: "22:00", mode: "sleeping", threshold: "", actions: [] };

const FIELD =
  "w-full rounded-lg border border-line bg-surface-raised px-2.5 py-2 text-[12px] text-white outline-none transition focus:border-sys-blue/70";
const LABEL = "mb-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40";

export default function AutomationForm({ editing, onSubmit, onCancel }) {
  const [draft, setDraft] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setError("");
    if (!editing) {
      setDraft(EMPTY);
      return;
    }
    setDraft({
      name: editing.name ?? "",
      trigger: editing.trigger ?? "schedule",
      run_time: editing.run_time ?? "22:00",
      mode: editing.mode ?? "sleeping",
      threshold: editing.threshold ?? "",
      actions: editing.actions ?? [],
    });
  }, [editing]);

  const meta = triggerMeta(draft.trigger);
  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const toggleAction = (id) =>
    set({
      actions: draft.actions.includes(id)
        ? draft.actions.filter((action) => action !== id)
        : [...draft.actions, id],
    });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError("Give the automation a name.");
      return;
    }
    if (!draft.actions.length) {
      setError("Pick at least one action.");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name,
        trigger: draft.trigger,
        actions: draft.actions,
        run_time: meta.field === "time" ? draft.run_time || "22:00" : null,
        mode: meta.field === "mode" ? draft.mode : null,
        threshold: meta.field === "number" ? Number(draft.threshold || meta.threshold) : null,
      });
      setDraft(EMPTY);
    } catch (err) {
      setError(err?.message ?? "Could not save the automation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className={LABEL} htmlFor="automation-name">
          Name
        </label>
        <input
          id="automation-name"
          className={FIELD}
          value={draft.name}
          maxLength={60}
          placeholder="Night watch"
          onChange={(event) => set({ name: event.target.value })}
        />
      </div>

      <div>
        <label className={LABEL} htmlFor="automation-trigger">
          When
        </label>
        <select
          id="automation-trigger"
          className={cn(FIELD, "appearance-none")}
          value={draft.trigger}
          onChange={(event) => set({ trigger: event.target.value })}
        >
          {Object.entries(TRIGGERS).map(([id, trigger]) => (
            <option key={id} value={id} className="bg-surface-raised">
              {trigger.label}
            </option>
          ))}
        </select>
      </div>

      {meta.field === "time" ? (
        <div>
          <label className={LABEL} htmlFor="automation-time">
            Time
          </label>
          <input
            id="automation-time"
            type="time"
            className={FIELD}
            value={draft.run_time}
            onChange={(event) => set({ run_time: event.target.value })}
          />
        </div>
      ) : null}

      {meta.field === "number" ? (
        <div>
          <label className={LABEL} htmlFor="automation-threshold">
            Threshold ({meta.suffix})
          </label>
          <input
            id="automation-threshold"
            type="number"
            className={FIELD}
            value={draft.threshold}
            placeholder={String(meta.threshold)}
            onChange={(event) => set({ threshold: event.target.value })}
          />
        </div>
      ) : null}

      {meta.field === "mode" ? (
        <div>
          <label className={LABEL} htmlFor="automation-mode">
            Mode
          </label>
          <select
            id="automation-mode"
            className={cn(FIELD, "appearance-none")}
            value={draft.mode}
            onChange={(event) => set({ mode: event.target.value })}
          >
            {MODES.map((mode) => (
              <option key={mode.id} value={mode.id} className="bg-surface-raised">
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <span className={LABEL}>Then</span>
        <div className="flex flex-wrap gap-1.5">
          {ACTIONS.map((action) => {
            const selected = draft.actions.includes(action.id);
            return (
              <button
                key={action.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleAction(action.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition",
                  selected
                    ? "border-sys-blue bg-sys-blue/15 text-white"
                    : "border-line bg-surface-raised text-white/55 hover:border-white/25"
                )}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? <p className="text-[10.5px] text-alert">{error}</p> : null}

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={saving}
          className="h-9 flex-1 rounded-lg bg-sys-blue text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-950 hover:bg-sys-blue/90"
        >
          {saving ? "Saving…" : editing ? "Save changes" : "Add automation"}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="h-9 rounded-lg border border-line px-3 text-[11px] font-medium text-white/55 hover:text-white"
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}