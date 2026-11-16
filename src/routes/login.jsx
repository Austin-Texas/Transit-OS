import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/components/auth/LoginPage";

export const Route = createFileRoute("/login")({
  ssr: false,
  beforeLoad: () => {
    if (import.meta.env.VITE_PUBLIC_DEMO === "true") throw redirect({ to: "/", replace: true });
  },
  component: LoginPage,
});
