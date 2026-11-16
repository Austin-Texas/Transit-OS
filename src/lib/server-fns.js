import { createServerFn } from "@tanstack/react-start";
import { requireUser } from "@/lib/auth-middleware";
import { syncAlerts } from "@/lib/alert-engine.server";
import { purgeOldClips } from "@/lib/clip-retention.server";

// Re-runs the alert rules against the latest readings (the van hub does this
// on every telemetry push too; the dashboard calls it so motion stamps and
// manual changes are picked up immediately).
export const syncVanAlerts = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const result = await syncAlerts(context.getBase44().entities);
    return { raised: result.raised, resolved: result.resolved, open: result.open };
  });

// The Clear old clips button: removes every dashcam clip beyond the saved
// retention window, the same cleanup the nightly workflow runs.
export const purgeOldSurroundClips = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    if (context.user?.role !== "admin") {
      throw Object.assign(new Error("Only an admin can clear the clip library"), { status: 403 });
    }
    return purgeOldClips(context.getBase44().asServiceRole.entities);
  });