import { useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGateError, requireSignedIn } from "@/components/auth/AuthGate";
import DashcamWatcher from "@/components/settings/DashcamWatcher";
import StartupSequence from "@/components/startup/StartupSequence";

export const Route = createFileRoute("/_authed")({
  ssr: false,
  beforeLoad: requireSignedIn,
  errorComponent: AuthGateError,
  component: AuthedLayout,
});

function AuthedLayout() {
  const [booting, setBooting] = useState(true);

  return (
    <>
      {import.meta.env.VITE_PUBLIC_DEMO !== "true" ? <DashcamWatcher /> : null}
      <Outlet />
      {booting ? <StartupSequence onDone={() => setBooting(false)} /> : null}
    </>
  );
}