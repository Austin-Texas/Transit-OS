import { siteWarnings } from "@/lib/siteWarnings";
import { openAlerts } from "@/lib/van";

// Where on the van an alert's part sits, so the 3D stage can point at it.
const zoneFor = (title = "") => {
  if (/misfire|engine|p0\d|transmission/i.test(title)) return "front";
  if (/tire|wheel/i.test(title)) return "rear";
  if (/heat pad|water|tank|pump/i.test(title)) return "underbody";
  if (/propane|lpg|gas|fuel/i.test(title)) return "fuel";
  return "body";
};

// The pins and callouts drawn on the diagnostics stage: live telemetry warnings
// plus the open alerts, which the reference layout calls out over the van.
export function stageWarnings(status, alerts = []) {
  const telemetry = siteWarnings(status);
  const fromAlerts = openAlerts(alerts).map((alert) => ({
    id: `alert:${alert.id}`,
    title: alert.title,
    detail: alert.detail,
    side: alert.side === "left" ? "left" : "right",
    zone: zoneFor(alert.title),
    severity: alert.severity,
  }));

  const hasTireAlert = fromAlerts.some((warning) => /tire/i.test(warning.title ?? ""));
  const telemetryPins = hasTireAlert
    ? telemetry.filter((warning) => !String(warning.id).startsWith("tire_"))
    : telemetry;

  return [...telemetryPins, ...fromAlerts];
}