import { createFileRoute } from "@tanstack/react-router";
import DashboardScreen from "@/components/van/DashboardScreen";

export const Route = createFileRoute("/_authed/")({
  head: () => ({
    meta: [
      { title: "TransitOS — Main Dashboard" },
      { name: "description", content: "Live status for power, water, propane, climate, cabin and vehicle diagnostics." },
    ],
  }),
  component: DashboardScreen,
});