// Pushes freshly raised alerts to the owner's phone so a critical reading is
// never missed while away from the van. Each alert is pushed once — the
// notified_at stamp stops the next telemetry sample from repeating it.
const PUSH_SEVERITIES = ["critical", "warning"];
const MAX_PER_CYCLE = 5;

// Tapping the notification lands on the screen that explains the reading.
const actionPath = (alertKey = "") => {
  if (alertKey.includes("battery")) return { action_label: "Battery", action_url: "/electrical" };
  if (alertKey.includes("water") || alertKey.includes("tank")) return { action_label: "Tanks", action_url: "/water" };
  if (alertKey.includes("propane") || alertKey.includes("lpg")) return { action_label: "Power", action_url: "/electrical" };
  return { action_label: "Open dashboard", action_url: "/" };
};

export async function pushRaisedAlerts(base44, alerts = []) {
  const pending = alerts.filter((alert) => PUSH_SEVERITIES.includes(alert.severity) && alert.id);
  if (!pending.length) return { sent: 0, failed: 0 };

  const users = await base44.entities.User.list();
  if (!users?.length) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  for (const alert of pending.slice(0, MAX_PER_CYCLE)) {
    for (const user of users) {
      try {
        await base44.integrations.Core.SendPushNotification({
          user_id: user.id,
          title: alert.title,
          content: alert.detail || "Open TransitOS for the full reading",
          ...actionPath(alert.alert_key),
        });
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error("push notification failed", error?.message ?? error);
      }
    }

    await base44.entities.Alert.update(alert.id, { notified_at: new Date().toISOString() });
  }

  return { sent, failed };
}