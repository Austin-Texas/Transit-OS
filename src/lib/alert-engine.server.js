import { evaluateAlertConditions, ownsAlert } from "@/lib/alert-rules";

// Watches the live readings and keeps the Alert records in step with them:
// one open alert per condition, refreshed while it lasts, closed once the
// reading is back in range. Alerts raised by other sources are left alone.
export async function syncAlerts(entities) {
  const [vanPage, cameras, openPage] = await Promise.all([
    entities.VanStatus.filter({}, { sort: "-created_date", limit: 1 }),
    entities.Camera.list("created_date", 20),
    entities.Alert.filter({ alert_key: { $regex: "^auto:" } }, { sort: "-created_date", limit: 50 }),
  ]);

  const conditions = evaluateAlertConditions(vanPage.items?.[0], cameras);
  const open = openPage.items ?? [];

  const pending = new Map(open.map((alert) => [alert.alert_key, alert]));
  const creates = [];
  const updates = [];
  let resolved = 0;

  for (const condition of conditions) {
    const existing = pending.get(condition.key);
    if (!existing) {
      creates.push({
        alert_key: condition.key,
        title: condition.title,
        detail: condition.detail,
        severity: condition.severity,
        status: "open",
        occurred_at: new Date().toISOString(),
      });
      continue;
    }
    pending.delete(condition.key);
    if (existing.detail !== condition.detail || existing.severity !== condition.severity) {
      updates.push({ id: existing.id, detail: condition.detail, severity: condition.severity });
    }
  }

  // Anything still pending no longer applies: the reading recovered.
  for (const stale of pending.values()) {
    if (!ownsAlert(stale)) continue;
    updates.push({ id: stale.id, status: "resolved" });
    resolved += 1;
  }

  if (creates.length) await entities.Alert.bulkCreate(creates);
  if (updates.length) await entities.Alert.bulkUpdate(updates);

  return { raised: creates.length, resolved, open: conditions.length };
}