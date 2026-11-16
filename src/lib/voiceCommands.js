import { MODES, TANK_CAPACITY_GAL, gallonsFrom, miles, openAlerts } from "@/lib/van";

const has = (text, words) => new RegExp(`\\b(${words.join("|")})\\b`).test(text);

const firstNumber = (text) => {
  const match = String(text).match(/-?\d{1,3}/);
  return match ? Number(match[0]) : null;
};

// Turns a spoken sentence into the same actions the buttons run, plus the
// confirmation line the dashboard shows back to the owner.
export function interpretCommand(raw, { status = {}, alerts = [], diagnostics = [] } = {}) {
  const said = String(raw ?? "")
    .toLowerCase()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!said) return { reply: "I did not catch that. Tap the microphone and try again.", action: null };

  // Moving between the main dashboard and diagnostics hands-free.
  const moving = has(said, ["go", "open", "navigate", "switch", "show", "take me", "back", "page"]);
  if (has(said, ["diagnostic", "diagnostics"]) && moving) {
    return { reply: "Opening diagnostics.", action: { type: "navigate", value: "/diagnostics" } };
  }
  if (has(said, ["dashboard", "home screen", "main screen", "home page"]) || /(go|back|take me) home/.test(said)) {
    return { reply: "Opening the main dashboard.", action: { type: "navigate", value: "/" } };
  }

  if (has(said, ["pump"])) {
    const off = has(said, ["off", "stop"]);
    return {
      reply: off ? "Water pump is off." : "Water pump is on.",
      action: { type: "pump", value: !off },
    };
  }

  if (has(said, ["light", "lights", "lamp", "lamps"])) {
    const off = has(said, ["off", "out", "dark"]);
    if (off || has(said, ["on", "up", "bright", "enable"])) {
      return {
        reply: off ? "Cabin lights are off." : "Cabin lights are on.",
        action: { type: "lights", value: !off },
      };
    }
    return {
      reply: `Cabin lights are ${status.lights_on === false ? "off" : "on"} at ${Math.round(status.light_level ?? 70)}%.`,
      action: null,
    };
  }

  if (
    has(said, ["temperature", "temp", "thermostat", "degrees", "heat", "heater", "climate"]) &&
    !has(said, ["mode"])
  ) {
    const value = firstNumber(said);
    if (value !== null && value >= 40 && value <= 100) {
      const target = Math.min(90, Math.max(50, value));
      return { reply: `Climate set to ${target}°F.`, action: { type: "climate", value: target } };
    }
    if (has(said, ["warmer", "up", "higher", "raise"])) {
      return { reply: "Raising the set point by 2°F.", action: { type: "climateDelta", value: 2 } };
    }
    if (has(said, ["cooler", "colder", "down", "lower"])) {
      return { reply: "Lowering the set point by 2°F.", action: { type: "climateDelta", value: -2 } };
    }
    return {
      reply: `Interior is ${Math.round(status.climate_temp ?? 72)}°F with the set point at ${Math.round(
        status.climate_set ?? 72
      )}°F.`,
      action: null,
    };
  }

  const mode = MODES.find((item) => said.includes(item.id));
  if (mode && !has(said, ["water", "battery"])) {
    return { reply: `Switched to ${mode.label} mode.`, action: { type: "mode", value: mode.id } };
  }

  if (has(said, ["diagnostic", "diagnostics", "scan", "check the van"])) {
    const issues = diagnostics.filter((row) => row.state !== "ok").length;
    return {
      reply: issues
        ? `Diagnostics complete. ${issues} system${issues > 1 ? "s" : ""} ${
            issues > 1 ? "need" : "needs"
          } attention, opening the report.`
        : "Diagnostics complete. Every system reports nominal.",
      action: { type: "diagnostics" },
    };
  }

  if (has(said, ["alert", "alerts", "warning", "warnings", "fault", "faults", "problem", "problems"])) {
    const active = openAlerts(alerts);
    return {
      reply: active.length
        ? `You have ${active.length} active alert${active.length > 1 ? "s" : ""}. ${active[0].title}.`
        : "No active alerts. Everything is clear.",
      action: { type: "alerts" },
    };
  }

  if (has(said, ["water", "fresh", "tank", "tanks", "gray", "grey", "black"])) {
    const fresh = Number(status.fresh_water ?? 0);
    const gray = Number(status.gray_water ?? 0);
    const black = Number(status.black_water ?? 0);
    return {
      reply: `Fresh water ${Math.round(fresh)}%, about ${gallonsFrom(fresh, TANK_CAPACITY_GAL.fresh_water).toFixed(
        1
      )} gallons. Gray ${Math.round(gray)}%, black ${Math.round(black)}%.`,
      action: null,
    };
  }

  if (has(said, ["battery", "power", "charge", "solar", "volt", "voltage"])) {
    return {
      reply: `House battery ${Math.round(status.battery_percent ?? 0)}% at ${Number(
        status.battery_voltage ?? 0
      ).toFixed(1)} volts. Solar is bringing in ${Math.round(status.solar_w ?? 0)} watts with ${Math.round(
        status.load_w ?? 0
      )} watts of load.`,
      action: null,
    };
  }

  if (has(said, ["propane", "lpg", "gas"])) {
    return {
      reply: `Propane at ${Math.round(status.lpg_percent ?? 0)}%, ${Number(status.lpg_gallons ?? 0).toFixed(1)} gallons left.`,
      action: null,
    };
  }

  if (has(said, ["lock", "locks", "locked", "unlock", "unlocked"])) {
    const wantsUnlock = /unlock/.test(said);
    const wantsLock = /lock (the|all|everything|doors|lockers|cabinets|it|them)/.test(said);
    if (wantsUnlock) return { reply: "All lockers and doors are unlocked.", action: { type: "locks", value: false } };
    if (wantsLock) return { reply: "All lockers and doors locked.", action: { type: "locks", value: true } };
    return {
      reply:
        status.locks_locked === false
          ? "The lockers and doors are unlocked."
          : "The lockers and doors are locked.",
      action: null,
    };
  }

  if (has(said, ["odometer", "mileage", "miles"])) {
    return { reply: `${miles(status.odometer)} miles on the van.`, action: null };
  }

  if (
    has(said, [
      "status",
      "system check",
      "how is the van",
      "how's the van",
      "how is everything",
      "how's everything",
      "vehicle status",
      "overview",
    ])
  ) {
    const active = openAlerts(alerts);
    const issues = diagnostics.filter((row) => row.state !== "ok").length;
    const readings = [
      `Interior ${Math.round(status.climate_temp ?? 72)} degrees`,
      `battery ${Math.round(status.battery_percent ?? 0)} percent`,
      `fresh water ${Math.round(status.fresh_water ?? 0)} percent`,
      `propane ${Math.round(status.lpg_percent ?? 0)} percent`,
    ].join(", ");
    const tail = active.length
      ? `${active.length} active alert${active.length > 1 ? "s" : ""}. ${active[0].title}.`
      : issues
        ? `${issues} system${issues > 1 ? "s" : ""} flagged in diagnostics.`
        : "All systems nominal.";
    return { reply: `${readings}. ${tail}`, action: null };
  }

  return {
    reply:
      "I can open the dashboard or diagnostics, check system status, show alerts, switch modes, set the climate, turn the lights or pump on and off, lock the van, or report water, battery and propane levels.",
    action: null,
  };
}

// Examples shown while the microphone panel is idle.
export const VOICE_EXAMPLES = [
  "Go to diagnostics",
  "Open the dashboard",
  "Check system status",
  "How much fresh water do I have?",
  "Turn the cabin lights on",
  "Set the temperature to 72 degrees",
  "Show me active alerts",
];