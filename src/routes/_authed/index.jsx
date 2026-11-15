import { createFileRoute } from "@tanstack/react-router";
import HomeScreen from "@/components/dash/HomeScreen";

export const Route = createFileRoute("/_authed/")({
  head: () => ({
    meta: [
      { title: "TransitOS — Main Dashboard" },
      { name: "description", content: "Live vehicle, cabin, lock and utility status for your camper." },
    ],
  }),
  component: HomeScreen,
});