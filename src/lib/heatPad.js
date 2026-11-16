import { clockTime } from "@/lib/van";

// What the vehicle's heat pad controller last reported, in the form every
// surface needs: the 3D underbody, the water cards and the alert detail.
const STATES = {
  heating: { label: "Heating", tone: "text-warn" },
  holding: { label: "Holding", tone: "text-ok" },
  idle: { label: "Idle", tone: "text-white/55" },
};

const number = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function heatPad(status) {
  const stateKey = typeof status?.heat_pad_state === "string" ? status.heat_pad_state : null;
  const fault = status?.tank_heater_fault === true || stateKey === "fault";
  const known = fault || Boolean(STATES[stateKey]);
  const temp = number(status?.heat_pad_temp_f);
  const reported = status?.heat_pad_reported_at;

  return {
    key: fault ? "fault" : STATES[stateKey] ? stateKey : "unknown",
    fault,
    known: known || temp !== null || Boolean(reported),
    label: fault ? "Fault" : STATES[stateKey]?.label ?? "No report",
    tone: fault ? "text-alert" : STATES[stateKey]?.tone ?? "text-white/45",
    temp,
    target: number(status?.heat_pad_target_f),
    watts: number(status?.heat_pad_watts),
    reportedAt: reported ? clockTime(reported) : null,
  };
}

// One line for the model tooltip and the small status pills.
export function heatPadLine(pad) {
  const parts = [];
  if (pad.temp !== null) parts.push(`${pad.temp.toFixed(1)}°F`);
  if (pad.target !== null) parts.push(`target ${pad.target.toFixed(0)}°F`);
  if (pad.watts !== null) parts.push(`${pad.watts.toFixed(0)} W`);
  if (pad.reportedAt) parts.push(`reported ${pad.reportedAt}`);
  return parts.join(" · ");
}