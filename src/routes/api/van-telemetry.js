import { createFileRoute } from "@tanstack/react-router";
import { secrets } from "base44:runtime";

const NUMERIC = [
  "battery_voltage",
  "battery_percent",
  "solar_w",
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
];

const BOOLEAN = ["lights_on", "locks_locked", "water_pump_on"];
const TEXT = ["vehicle_name", "trim", "vin"];

const ENUMS = {
  active_mode: ["camping", "sleeping", "driving", "away", "custom"],
  climate_mode: ["auto", "eco", "boost", "off"],
};

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

        if (!Object.keys(patch).length) {
          return Response.json({ error: "No known readings in payload" }, { status: 400 });
        }

        const base44 = context.getBase44();
        const vanPage = await base44.asServiceRole.entities.VanStatus.filter({}, { sort: "-created_date", limit: 1 });
        const van = vanPage.items?.[0];

        const saved = van
          ? await base44.asServiceRole.entities.VanStatus.update(van.id, patch)
          : await base44.asServiceRole.entities.VanStatus.create(patch);

        return Response.json({ ok: true, id: saved.id, updated: Object.keys(patch) });
      },
    },
  },
});