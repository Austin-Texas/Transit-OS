export const VAN_IMAGE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/aee1c34a6_generated_image.png";
export const VAN_STAGE_IMAGE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/3451656f1_generated_image.png";
export const CABIN_IMAGE = "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/fc43d02d0_generated_image.png";

export const MODES = [
  { id: "camping", label: "Camping" },
  { id: "sleeping", label: "Sleeping" },
  { id: "driving", label: "Driving" },
  { id: "away", label: "Away" },
  { id: "custom", label: "Custom" },
];

// Local sample snapshot, used until the live van records are wired in.
export const SAMPLE_STATUS = {
  vehicle_name: "2023 Transit",
  trim: "High Roof",
  vin: "1FTBR1C8XPK104482",
  active_mode: "camping",
  battery_voltage: 12.6,
  battery_percent: 92,
  climate_temp: 72,
  climate_set: 72,
  cabin_temp: 68,
  fresh_water: 79,
  gray_water: 46,
  black_water: 32,
  lpg_percent: 24,
  lpg_gallons: 6,
  odometer: 12480,
  solar_w: 426,
  exterior_temp: 68,
  humidity: 45,
};

export const SAMPLE_ALERTS = [
  {
    id: "sample-1",
    severity: "critical",
    title: "P0301 Cylinder 1 Misfire",
    detail: "Engine · OBD-II",
    occurred_at: "2026-11-15T10:18:00Z",
    status: "open",
  },
  {
    id: "sample-2",
    severity: "critical",
    title: "Tire Pressure Low",
    detail: "Rear Right · 28 PSI",
    occurred_at: "2026-11-15T10:19:00Z",
    status: "open",
  },
];

export const openAlerts = (alerts = []) => alerts.filter((alert) => alert.status !== "resolved");

export const clockTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

export const miles = (value) => Number(value ?? 0).toLocaleString("en-US");

export function buildDiagnostics(status, alerts) {
  const active = openAlerts(alerts);
  const engine = active.find((alert) => /misfire|p0\d/i.test(alert.title));
  const tire = active.find((alert) => /tire/i.test(alert.title));
  return [
    { label: "Engine / OBD-II", state: engine ? "warn" : "ok", detail: engine ? engine.title : "No stored fault codes" },
    { label: "Tire pressure", state: tire ? "warn" : "ok", detail: tire ? tire.detail : "All four corners in range" },
    {
      label: "House battery",
      state: Number(status.battery_percent) < 30 ? "warn" : "ok",
      detail: `${status.battery_percent}% · ${status.battery_voltage} V`,
    },
    {
      label: "Fresh water",
      state: Number(status.fresh_water) < 20 ? "warn" : "ok",
      detail: `${status.fresh_water}% remaining`,
    },
    {
      label: "Propane",
      state: Number(status.lpg_percent) < 15 ? "warn" : "ok",
      detail: `${status.lpg_percent}% · ${Number(status.lpg_gallons).toFixed(1)} gal`,
    },
  ];
}