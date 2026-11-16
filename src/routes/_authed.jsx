import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import DashcamWatcher from "@/components/settings/DashcamWatcher";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  beforeLoad: requireSignedIn,
  errorComponent: AuthGateError,
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <>
      <DashcamWatcher />
      <Outlet />
    </>
  );
}