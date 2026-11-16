import { createFileRoute } from "@tanstack/react-router";
import { requireUserRoute } from "@/lib/auth-middleware";
import { purgeOldClips } from "@/lib/clip-retention.server";

// Clears dashcam clips beyond the retention window. The nightly workflow calls
// it as an admin; the Clear old clips button calls it through a server function.
export const Route = createFileRoute("/api/clip-retention")({
  server: {
    middleware: [requireUserRoute],
    handlers: {
      POST: async ({ request, context }) => {
        if (context.user?.role !== "admin") {
          return Response.json({ error: "Only an admin can clear the clip library" }, { status: 403 });
        }

        let body = {};
        try {
          body = await request.json();
        } catch {
          body = {};
        }

        const days = body && body.days !== undefined && body.days !== null ? body.days : undefined;
        const result = await purgeOldClips(context.getBase44().asServiceRole.entities, days);

        return Response.json({ ok: true, ...result });
      },
    },
  },
});