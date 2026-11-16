// Every automation-owned alert key starts with this prefix, so the watcher only
// ever creates, updates or closes alerts it raised itself.
const PREFIX = "auto:";

const num = (value) => (value === null || value === undefined || value === "" ? null : Number(value));

const round = (value) => Math.round(value);

const MOTION_WINDOW_MS = 10 * 60 * 1000;

// Turns the latest van readings and camera motion stamps into the alert
// conditions the dashboard should be showing right now.
export function evaluateAlertConditions(status, cameras = [], now = Date.now()) {
  if (!status) return [];
  const conditions = [];

  const battery = num(status.battery_percent);
  if (battery !== null && Number.isFinite(battery)) {
    if (battery < 15) {
      conditions.push({
        key: `${PREFIX}battery_critical`,
        severity: "critical",
        title: "House battery critically low",
        detail: `${round(battery)}% left · connect shore power or cut loads now`,
      });
    } else if (battery < 30) {
      const solar = num(status.solar_w);
      conditions.push({
        key: `${PREFIX}battery_low`,
        severity: "warning",
        title: "House battery low",
        detail: `${round(battery)}% left${Number.isFinite(solar) ? ` · solar ${round(solar)} W` : ""}`,
      });
    }
  }

  const water = num(status.fresh_water);
  if (water !== null && Number.isFinite(water) && water < 15) {
    conditions.push({
      key: `${PREFIX}fresh_water_low`,
      severity: "warning",
      title: "Fresh water low",
      detail: `${round(water)}% left · refill before the next stop`,
    });
  }

  const propane = num(status.lpg_percent);
  if (propane !== null && Number.isFinite(propane) && propane < 15) {
    const gallons = num(status.lpg_gallons);
    conditions.push({
      key: `${PREFIX}propane_low`,
      severity: "warning",
      title: "Propane low",
      detail: `${round(propane)}% left${Number.isFinite(gallons) ? ` · ${gallons.toFixed(1)} gal` : ""}`,
    });
  }

  const cabin = num(status.cabin_temp);
  if (cabin !== null && Number.isFinite(cabin)) {
    if (cabin >= 95) {
      conditions.push({
        key: `${PREFIX}cabin_hot`,
        severity: "critical",
        title: "Cabin overheating",
        detail: `${round(cabin)}°F inside · start climate now`,
      });
    } else if (cabin <= 35) {
      conditions.push({
        key: `${PREFIX}cabin_cold`,
        severity: "critical",
        title: "Cabin near freezing",
        detail: `${round(cabin)}°F inside · pipes and tanks at risk`,
      });
    }
  }

  // Motion the van hub stamped on a camera in the last few minutes.
  for (const camera of cameras) {
    if (!camera?.last_motion || camera.motion_alerts === false) continue;
    const detected = new Date(camera.last_motion).getTime();
    if (!Number.isFinite(detected) || detected < now - MOTION_WINDOW_MS) continue;
    conditions.push({
      key: `${PREFIX}motion:${camera.id}`,
      severity: "critical",
      title: `Motion detected · ${camera.name}`,
      detail: `${camera.location ?? "Camera"} · open the live feed`,
    });
  }

  return conditions;
}

export const ownsAlert = (alert) => typeof alert?.alert_key === "string" && alert.alert_key.startsWith(PREFIX);