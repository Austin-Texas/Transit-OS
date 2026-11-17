import { openAlerts } from "@/lib/van";
import { serviceState } from "@/lib/maintenance";
import { TIRE_MIN_PSI } from "@/lib/siteWarnings";

const num = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const serviceTone = (state) => (state.due ? "alert" : state.soon ? "warn" : "ok");

const serviceLabel = (state) => (state.due ? "Service due" : state.soon ? "Due soon" : "OK");

// One row per system the owner expects to see on a health sheet. Anything the
// van cannot measure yet says so instead of showing an invented reading.
export function healthRows({ status, alerts = [], maintenance = [] }) {
  const active = openAlerts(alerts);
  const engineAlert = active.find((alert) => /misfire|engine|p0\d|emission|oil/i.test(alert.title ?? ""));
  const code = engineAlert?.title?.match(/P0\d{3}/i)?.[0];

  const tires = ["tire_fl", "tire_fr", "tire_rl", "tire_rr"]
    .map((key) => num(status?.[key]))
    .filter((value) => value !== null);
  const lowTire = tires.length ? Math.min(...tires) : null;

  const volts = num(status?.battery_voltage);
  const charge = num(status?.battery_percent);
  const odometer = num(status?.odometer);

  const brakes = maintenance.find((item) => item.category === "brakes");
  const oil = maintenance.find((item) => /oil/i.test(item.name ?? ""));
  const brakeState = brakes ? serviceState(brakes, odometer) : null;
  const oilState = oil ? serviceState(oil, odometer) : null;

  return [
    {
      label: "Engine",
      value: engineAlert ? (code ?? "Check engine") : "OK",
      tone: engineAlert ? "alert" : "ok",
    },
    { label: "Transmission", value: "No sensor", tone: "muted" },
    {
      label: "Battery",
      value: charge === null ? "No report" : `${Math.round(charge)}%`,
      tone: charge === null ? "muted" : charge < 30 ? "alert" : "ok",
    },
    {
      label: "Alternator",
      value: volts === null ? "No report" : `${volts.toFixed(1)} V`,
      tone: volts === null ? "muted" : volts < 12.4 ? "alert" : "ok",
    },
    {
      label: "Tire pressure",
      value: lowTire === null ? "No report" : `Lowest ${lowTire.toFixed(0)} PSI`,
      tone: lowTire === null ? "muted" : lowTire < TIRE_MIN_PSI ? "alert" : "ok",
    },
    {
      label: "Brakes",
      value: brakeState ? serviceLabel(brakeState) : "Not tracked",
      tone: brakeState ? serviceTone(brakeState) : "muted",
    },
    {
      label: "Oil life",
      value: oilState ? `${Math.max(0, Math.round((1 - oilState.progress) * 100))}%` : "Not tracked",
      tone: oilState ? (oilState.due || oilState.soon ? "warn" : "ok") : "muted",
    },
    { label: "DEF / Emissions", value: "No sensor", tone: "muted" },
  ];
}