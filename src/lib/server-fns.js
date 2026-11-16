import { createServerFn } from "@tanstack/react-start";
import { requireUser } from "@/lib/auth-middleware";
import { syncAlerts } from "@/lib/alert-engine.server";

// Re-runs the alert rules against the latest readings (the van hub does this
// on every telemetry push too; the dashboard calls it so motion stamps and
// manual changes are picked up immediately).
export const syncVanAlerts = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const result = await syncAlerts(context.getBase44().entities);
    return { raised: result.raised, resolved: result.resolved, open: result.open };
  });