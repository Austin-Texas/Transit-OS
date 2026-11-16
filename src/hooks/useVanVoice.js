import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { interpretCommand } from "@/lib/voiceCommands";

// One place where a spoken command becomes the same change the buttons make.
// The dashboard and the diagnostics page both run their voice through here.
export default function useVanVoice({
  status,
  alerts,
  diagnostics,
  update,
  setMode,
  adjustClimate,
  onDiagnostics,
  onAlerts,
}) {
  const navigate = useNavigate();

  return useCallback(
    (text) => {
      const { reply, action } = interpretCommand(text, {
        status,
        alerts: alerts ?? [],
        diagnostics: diagnostics ?? [],
      });
      const run = (promise) => promise?.catch?.(console.error);

      if (action?.type === "navigate") navigate({ to: action.value });
      if (action?.type === "diagnostics") {
        if (onDiagnostics) onDiagnostics();
        else navigate({ to: "/diagnostics" });
      }
      if (action?.type === "alerts") onAlerts?.();
      if (action?.type === "lights") run(update({ lights_on: action.value }));
      if (action?.type === "locks") run(update({ locks_locked: action.value }));
      if (action?.type === "pump") run(update({ water_pump_on: action.value }));
      if (action?.type === "mode") run(setMode(action.value));
      if (action?.type === "climate") {
        run(update({ climate_set: action.value, climate_temp: action.value }));
      }
      if (action?.type === "climateDelta") adjustClimate?.(action.value);

      return reply;
    },
    [navigate, status, alerts, diagnostics, update, setMode, adjustClimate, onDiagnostics, onAlerts]
  );
}