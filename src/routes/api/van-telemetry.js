import { createFileRoute } from "@tanstack/react-router";
import { secrets } from "base44:runtime";
import { syncAlerts } from "@/lib/alert-engine.server";
import { pushRaisedAlerts } from "@/lib/notify.server";

const NUMERIC = [
  "battery_voltage",
  "battery_percent",
  "solar_w",
  "load_w",
  "climate_temp",
  "climate_set",
  "cabin_temp",
  "exterior_temp",
  "humidity",
  "fresh_water",
  "gray_water",
  "black_water",
  "lpg_percent",
  "lpg_gallons",
  "odometer",
  "light_level",
  "heat_pad_temp_f",
  "heat_pad_target_f",
  "heat_pad_watts",
];

const BOOLEAN = ["lights_on", "locks_locked", "water_pump_on", "tank_heater_fault"];
const TEXT = ["vehicle_name", "trim", "vin"];

// Camera motion the hub detected, so the dashcam can save a clip of the moment.
const readMotion = (value) => {
  if (!Array.isArray(value) || value.length > 10) return null;
  const stamps = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return null;
    const camera = typeof entry.camera === "string" ? entry.camera.trim() : "";
    if (!camera || camera.length > 120) return null;
    const at = entry.at ? new Date(entry.at) : new Date();
    if (Number.isNaN(at.getTime())) return null;
    stamps.push({ camera, at: at.toISOString() });
  }
  return stamps;
};

const ENUMS = {
  active_mode: ["camping", "sleeping", "driving", "away", "custom"],
  climate_mode: ["auto", "eco", "boost", "off"],
  heat_pad_state: ["heating", "holding", "idle", "fault"],
};

// Heat pad readings the controller reports: state, plate temperature, set point
// and draw. The fault flag the dashboard watches is derived from the state, so
// the 3D underbody and the alerts always agree with the vehicle.
const PAD_KEYS = ["heat_pad_state", "heat_pad_temp_f", "heat_pad_target_f", "heat_pad_watts"];

// The van hub pushes readings here; the dashboard picks them up in real time.
export const Route = createFileRoute("/api/van-telemetry")({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const expected = secrets.get("VAN_TELEMETRY_TOKEN");
        if (!expected) {
          return Response.json({ error: "Telemetry token is not configured" }, { status: 503 });
        }

        const provided = request.headers.get("x-van-token") ?? "";
        if (provided !== expected) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let payload;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Body must be JSON" }, { status: 400 });
        }
        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
          return Response.json({ error: "Body must be a JSON object" }, { status: 400 });
        }

        const motion = payload.camera_motion === undefined ? [] : readMotion(payload.camera_motion);
        if (motion === null) {
          return Response.json(
            { error: "camera_motion must be up to 10 entries of { camera, at }" },
            { status: 400 }
          );
        }

        const patch = {};

        for (const key of NUMERIC) {
          if (payload[key] === undefined || payload[key] === null) continue;
          const value = Number(payload[key]);
          if (!Number.isFinite(value)) {
            return Response.json({ error: `${key} must be a number` }, { status: 400 });
          }
          patch[key] = value;
        }

        for (const key of BOOLEAN) {
          if (payload[key] === undefined) continue;
          if (typeof payload[key] !== "boolean") {
            return Response.json({ error: `${key} must be true or false` }, { status: 400 });
          }
          patch[key] = payload[key];
        }

        for (const key of TEXT) {
          if (payload[key] === undefined) continue;
          if (typeof payload[key] !== "string" || payload[key].length > 120) {
            return Response.json({ error: `${key} must be text under 120 characters` }, { status: 400 });
          }
          patch[key] = payload[key];
        }

        for (const [key, allowed] of Object.entries(ENUMS)) {
          if (payload[key] === undefined) continue;
          if (!allowed.includes(payload[key])) {
            return Response.json({ error: `${key} must be one of ${allowed.join(", ")}` }, { status: 400 });
          }
          patch[key] = payload[key];
        }

        if (payload.heat_pad_reported_at !== undefined && payload.heat_pad_reported_at !== null) {
          const at = new Date(payload.heat_pad_reported_at);
          if (Number.isNaN(at.getTime())) {
            return Response.json({ error: "heat_pad_reported_at must be an ISO date" }, { status: 400 });
          }
          patch.heat_pad_reported_at = at.toISOString();
        }

        const padReported = PAD_KEYS.some((key) => patch[key] !== undefined);
        if (patch.heat_pad_state !== undefined) {
          patch.tank_heater_fault = patch.heat_pad_state === "fault";
        }
        if (padReported && patch.heat_pad_reported_at === undefined) {
          patch.heat_pad_reported_at = new Date().toISOString();
        }

        if (!Object.keys(patch).length && !motion.length) {
          return Response.json({ error: "No known readings in payload" }, { status: 400 });
        }

        const base44 = context.getBase44();

        // Motion lands on the camera records first, so the alert rules and the
        // dashcam both see the moment.
        const triggered = [];
        if (motion.length) {
          const cameras = await base44.asServiceRole.entities.Camera.list("created_date", 50);
          for (const stamp of motion) {
            const match =
              cameras.find((camera) => camera.id === stamp.camera) ??
              cameras.find((camera) => (camera.name ?? "").toLowerCase() === stamp.camera.toLowerCase());
            if (!match || match.motion_alerts === false) continue;
            await base44.asServiceRole.entities.Camera.update(match.id, {
              last_motion: stamp.at,
              status: "live",
            });
            triggered.push(match.name);
          }
        }

        let saved = null;
        if (Object.keys(patch).length) {
          const vanPage = await base44.asServiceRole.entities.VanStatus.filter({}, { sort: "-created_date", limit: 1 });
          const van = vanPage.items?.[0];
          saved = van
            ? await base44.asServiceRole.entities.VanStatus.update(van.id, patch)
            : await base44.asServiceRole.entities.VanStatus.create(patch);
        }

        // Every reading that carries power or tank data lands in the history the charts draw.
        const reading = { recorded_at: new Date().toISOString() };
        for (const key of [
          "battery_percent",
          "battery_voltage",
          "solar_w",
          "load_w",
          "fresh_water",
          "gray_water",
          "black_water",
          "lpg_percent",
        ]) {
          if (patch[key] !== undefined) reading[key] = patch[key];
        }
        const hasHistory = Object.keys(reading).length > 1;
        if (hasHistory) {
          await base44.asServiceRole.entities.EnergyReading.create(reading);
        }

        // Every reading re-runs the alert rules, so a critical value is flagged
        // even when nobody has the dashboard open.
        let alerts = null;
        let push = null;
        try {
          alerts = await syncAlerts(base44.asServiceRole.entities);
          // New critical and warning alerts go straight to the owner's phone.
          push = await pushRaisedAlerts(base44.asServiceRole, alerts.created ?? []);
        } catch (error) {
          console.error("alert sync failed", error);
        }

        return Response.json({
          ok: true,
          id: saved?.id ?? null,
          updated: Object.keys(patch),
          motion: triggered,
          history: hasHistory,
          alerts: alerts ? { raised: alerts.raised, resolved: alerts.resolved, open: alerts.open } : null,
          push,
        });
      },
    },
  },
});