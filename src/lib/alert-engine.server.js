import { evaluateAlertConditions, ownsAlert } from "@/lib/alert-rules";

// Watches the live readings and keeps the Alert records in step with them:
// one open alert per condition, refreshed while it lasts, closed once the
// reading is back in range. Alerts raised by other sources are left alone.
export async function syncAlerts(entities) {
  const [vanPage, cameras, maintenance, modules, openPage] = await Promise.all([
    entities.VanStatus.filter({}, { sort: "-created_date", limit: 1 }),
    entities.Camera.list("created_date", 20),
    entities.MaintenanceItem.list("created_date", 200),
    // A caller who may not read the registry still gets every other rule.
    entities.Module.list("created_date", 100).catch(() => []),
    entities.Alert.filter({ alert_key: { $regex: "^auto:" } }, { sort: "-created_date", limit: 50 }),
  ]);

  const conditions = evaluateAlertConditions(
    vanPage.items?.[0],
    cameras,
    Date.now(),
    maintenance,
    modules
  );
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
        ...(condition.side ? { side: condition.side } : {}),
      });
      continue;
    }
    pending.delete(condition.key);
    if (
      existing.detail !== condition.detail ||
      existing.severity !== condition.severity ||
      (condition.side && existing.side !== condition.side)
    ) {
      updates.push({
        id: existing.id,
        detail: condition.detail,
        severity: condition.severity,
        ...(condition.side ? { side: condition.side } : {}),
      });
    }
  }

  // Anything still pending no longer applies: the reading recovered.
  for (const stale of pending.values()) {
    if (!ownsAlert(stale)) continue;
    updates.push({ id: stale.id, status: "resolved" });
    resolved += 1;
  }

  const created = creates.length ? await entities.Alert.bulkCreate(creates) : [];
  if (updates.length) await entities.Alert.bulkUpdate(updates);

  return { raised: creates.length, created, resolved, open: conditions.length };
}