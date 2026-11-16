import { createFileRoute } from "@tanstack/react-router";
import { requireUserRoute } from "@/lib/auth-middleware";
import { syncAlerts } from "@/lib/alert-engine.server";
import { pushRaisedAlerts } from "@/lib/notify.server";

// Runs from the "Maintenance Watch" workflow every morning, so a part that came
// due is raised and pushed even if the van hub has not reported since. Telemetry
// keeps the same alerts in step in between; each alert is only pushed once.
export const Route = createFileRoute("/api/maintenance-watch")({
  server: {
    middleware: [requireUserRoute],
    handlers: {
      POST: async ({ context }) => {
        if (context.user?.role !== "admin") {
          return Response.json({ error: "Admins only" }, { status: 403 });
        }

        const base44 = context.getBase44().asServiceRole;
        const alerts = await syncAlerts(base44.entities);
        const push = await pushRaisedAlerts(base44, alerts.created ?? []);

        return Response.json({
          ok: true,
          raised: alerts.raised,
          resolved: alerts.resolved,
          open: alerts.open,
          push,
        });
      },
    },
  },
});