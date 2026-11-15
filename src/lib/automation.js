import { MODES } from "@/lib/van";

export const TRIGGERS = {
  schedule: { label: "On a schedule", field: "time" },
  battery_below: { label: "House battery below", field: "number", threshold: 25, suffix: "%" },
  fresh_water_below: { label: "Fresh water below", field: "number", threshold: 20, suffix: "%" },
  propane_below: { label: "Propane below", field: "number", threshold: 15, suffix: "%" },
  temp_above: { label: "Cabin warms above", field: "number", threshold: 78, suffix: "°F" },
  temp_below: { label: "Cabin drops below", field: "number", threshold: 60, suffix: "°F" },
  mode_change: { label: "Mode changes to", field: "mode" },
};

export const triggerMeta = (id) => TRIGGERS[id] ?? TRIGGERS.schedule;

export const ACTIONS = [
  { id: "climate_on", label: "Climate on" },
  { id: "climate_off", label: "Climate off" },
  { id: "lights_on", label: "Lights on" },
  { id: "lights_off", label: "Lights off" },
  { id: "lock_all", label: "Lock all" },
  { id: "unlock_all", label: "Unlock all" },
  { id: "pump_on", label: "Pump on" },
  { id: "pump_off", label: "Pump off" },
];

const ACTION_LABELS = Object.fromEntries(ACTIONS.map((action) => [action.id, action.label]));

export const actionLabels = (actions = []) => actions.map((id) => ACTION_LABELS[id] ?? id);

export const modeLabel = (id) => MODES.find((mode) => mode.id === id)?.label ?? id;

export function formatTime(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 === 0 ? 12 : hours % 12}:${String(minutes || 0).padStart(2, "0")} ${suffix}`;
}

export function describeAutomation(automation = {}) {
  const meta = triggerMeta(automation.trigger);
  const threshold = automation.threshold ?? meta.threshold;
  switch (automation.trigger) {
    case "schedule":
      return `Every day at ${formatTime(automation.run_time)}`;
    case "battery_below":
      return `When the battery drops below ${threshold}%`;
    case "fresh_water_below":
      return `When fresh water drops below ${threshold}%`;
    case "propane_below":
      return `When propane drops below ${threshold}%`;
    case "temp_above":
      return `When the cabin climbs above ${threshold}°F`;
    case "temp_below":
      return `When the cabin drops below ${threshold}°F`;
    case "mode_change":
      return `When the van switches to ${modeLabel(automation.mode)}`;
    default:
      return "Custom rule";
  }
}