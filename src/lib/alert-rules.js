import { heatPad } from "@/lib/heatPad";
import { formatMiles, remainingText, serviceState } from "@/lib/maintenance";

// Every automation-owned alert key starts with this prefix, so the watcher only
// ever creates, updates or closes alerts it raised itself.
const PREFIX = "auto:";

const num = (value) => (value === null || value === undefined || value === "" ? null : Number(value));

const round = (value) => Math.round(value);

const MOTION_WINDOW_MS = 10 * 60 * 1000;

// Turns the latest van readings and camera motion stamps into the alert
// conditions the dashboard should be showing right now.
export function evaluateAlertConditions(status, cameras = [], now = Date.now(), maintenance = [], modules = []) {
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
  if (water !== null && Number.isFinite(water)) {
    if (water <= 5) {
      conditions.push({
        key: `${PREFIX}fresh_water_critical`,
        severity: "critical",
        title: "Fresh water critical",
        detail: `${round(water)}% left · refill now`,
      });
    } else if (water < 15) {
      conditions.push({
        key: `${PREFIX}fresh_water_low`,
        severity: "warning",
        title: "Fresh water low",
        detail: `${round(water)}% left · refill before the next stop`,
      });
    }
  }

  const gray = num(status.gray_water);
  if (gray !== null && Number.isFinite(gray) && gray >= 95) {
    conditions.push({
      key: `${PREFIX}gray_water_critical`,
      severity: "critical",
      title: "Gray tank critical",
      detail: `${round(gray)}% full · drain it now`,
    });
  } else if (gray !== null && Number.isFinite(gray) && gray > 85) {
    conditions.push({
      key: `${PREFIX}gray_water_full`,
      severity: "warning",
      title: "Gray tank nearly full",
      detail: `${round(gray)}% full · plan a dump station before it backs up`,
    });
  }

  const black = num(status.black_water);
  if (black !== null && Number.isFinite(black) && black >= 95) {
    conditions.push({
      key: `${PREFIX}black_water_critical`,
      severity: "critical",
      title: "Black tank critical",
      detail: `${round(black)}% full · empty it now`,
    });
  } else if (black !== null && Number.isFinite(black) && black > 85) {
    conditions.push({
      key: `${PREFIX}black_water_full`,
      severity: "warning",
      title: "Black tank nearly full",
      detail: `${round(black)}% full · empty at the next station`,
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

  // The heat pad under the spare-tire fresh tank stopped answering: either the
  // hub's fault flag is set or the controller reported the fault state itself.
  if (heatPad(status).fault) {
    conditions.push({
      key: `${PREFIX}tank_heater_fault`,
      severity: "warning",
      title: "Fresh water heat pad fault",
      detail: "Pad under the spare-tire tank · sensor not responding",
      side: "left",
    });
  }

  // Tracked parts whose mileage or day limit has passed.
  const odometer = num(status.odometer);
  for (const item of maintenance) {
    const state = serviceState(item, odometer, now);
    if (!state.due) continue;
    conditions.push({
      key: `${PREFIX}maintenance:${item.id}`,
      severity: "warning",
      title: `${item.name} due for service`,
      detail: `${remainingText(state)}${Number.isFinite(odometer) ? ` · odometer ${formatMiles(odometer)}` : ""}`,
    });
  }

  // Installed modules that stopped answering or are limping. Only live hardware
  // counts: a registry entry that was never commissioned is not a fault.
  for (const module of modules) {
    if (!module?.module_id || module.environment !== "live") continue;
    const offline = module.connection_status === "offline";
    if (!offline && module.connection_status !== "degraded") continue;
    const seenAt = module.last_seen ? new Date(module.last_seen) : null;
    const signal = num(module.rssi);
    conditions.push({
      key: `${PREFIX}module:${module.module_id}`,
      severity: offline ? "critical" : "warning",
      title: `${module.name ?? module.module_id} ${offline ? "offline" : "degraded"}`,
      detail: [
        module.location,
        module.model,
        seenAt && Number.isFinite(seenAt.getTime())
          ? `last seen ${seenAt.toISOString().slice(0, 16).replace("T", " ")} UTC`
          : "never reported",
        !offline && signal !== null ? `signal ${round(signal)} dBm` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    });
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
      ...(camera.side === "left" || camera.side === "right" ? { side: camera.side } : {}),
    });
  }

  return conditions;
}

export const ownsAlert = (alert) => typeof alert?.alert_key === "string" && alert.alert_key.startsWith(PREFIX);