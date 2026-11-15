import {
  BatteryLow,
  Clock,
  Droplets,
  Flame,
  Pencil,
  Repeat,
  Snowflake,
  Thermometer,
  Trash2,
} from "lucide-react";
import { actionLabels, describeAutomation } from "@/lib/automation";
import { cn } from "@/lib/utils";

const TRIGGER_ICONS = {
  schedule: Clock,
  battery_below: BatteryLow,
  fresh_water_below: Droplets,
  propane_below: Flame,
  temp_above: Thermometer,
  temp_below: Snowflake,
  mode_change: Repeat,
};

export default function AutomationRule({ automation, editing, onToggle, onEdit, onDelete }) {
  const enabled = automation.enabled !== false;
  const Icon = TRIGGER_ICONS[automation.trigger] ?? Clock;
  const labels = actionLabels(automation.actions ?? []);

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2.5 transition",
        editing ? "border-sys-blue/70 bg-sys-blue/10" : "border-line/80 bg-surface-raised",
        !enabled && "opacity-60"
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
          enabled ? "bg-sys-blue/15 text-sys-blue" : "bg-white/[0.04] text-white/40"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-medium text-white">{automation.name}</p>
        <p className="truncate text-[10px] text-white/40">{describeAutomation(automation)}</p>
        {labels.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {labels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-line/80 px-2 py-0.5 text-[9.5px] text-white/45"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`${enabled ? "Pause" : "Activate"} ${automation.name}`}
          onClick={() => onToggle(!enabled)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            enabled ? "bg-sys-blue" : "bg-white/15"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
              enabled ? "left-[22px]" : "left-0.5"
            )}
          />
        </button>

        <button
          type="button"
          aria-label={`Edit ${automation.name}`}
          onClick={onEdit}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line/80 text-white/45 transition hover:border-white/25 hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={1.9} />
        </button>

        <button
          type="button"
          aria-label={`Delete ${automation.name}`}
          onClick={onDelete}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line/80 text-white/45 transition hover:border-alert/60 hover:text-alert"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
        </button>
      </div>
    </li>
  );
}