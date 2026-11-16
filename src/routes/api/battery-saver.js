import { createFileRoute } from "@tanstack/react-router";
import { requireUserRoute } from "@/lib/auth-middleware";

const THRESHOLD = 20;

// Runs from the "Battery Saver" workflow every few minutes. When the house
// battery drops below 20%, the climate system is switched to Eco so the van
// stops burning power on comfort while nobody is looking.
export const Route = createFileRoute("/api/battery-saver")({
  server: {
    middleware: [requireUserRoute],
    handlers: {
      POST: async ({ context }) => {
        if (context.user.role !== "admin") {
          return Response.json({ error: "Admins only" }, { status: 403 });
        }

        const base44 = context.getBase44().asServiceRole;
        const page = await base44.entities.VanStatus.filter({}, { sort: "-created_date", limit: 5 });
        const switched = [];

        for (const van of page.items ?? []) {
          const charge = Number(van.battery_percent);
          if (!Number.isFinite(charge) || charge >= THRESHOLD) continue;
          if (van.climate_mode === "eco") continue;

          await base44.entities.VanStatus.update(van.id, { climate_mode: "eco" });
          switched.push({ id: van.id, battery_percent: charge, from: van.climate_mode ?? null });
        }

        return Response.json({ ok: true, threshold: THRESHOLD, switched: switched.length, vehicles: switched });
      },
    },
  },
});