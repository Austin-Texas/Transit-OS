import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import useVanDashboard from "@/hooks/useVanDashboard";
import useVanVoice from "@/hooks/useVanVoice";
import ModuleShell from "@/components/dash/ModuleShell";
import VanStage from "@/components/dash/VanStage";
import DiagnosticsDialog from "@/components/van/DiagnosticsDialog";
import DiagramViews, { viewFocus } from "@/components/van/DiagramViews";
import VehicleHealth from "@/components/diagnostics/VehicleHealth";
import DiagnosticsAlerts from "@/components/diagnostics/DiagnosticsAlerts";
import SystemDiagram from "@/components/diagnostics/SystemDiagram";
import UtilityBar from "@/components/diagnostics/UtilityBar";
import { stageWarnings } from "@/lib/alertMarkers";

export const Route = createFileRoute("/_authed/diagnostics")({
  head: () => ({
    meta: [
      { title: "TransitOS — Diagnostics" },
      {
        name: "description",
        content: "Explore your van in 3D: drivetrain, utilities and live faults, plus OBD-II health checks.",
      },
    ],
  }),
  component: DiagnosticsPage,
});

function DiagnosticsPage() {
  const van = useVanDashboard();
  const { status, alerts, diagnostics } = van;
  const [focus, setFocus] = useState(null);
  const [testsOpen, setTestsOpen] = useState(false);

  const warnings = useMemo(() => stageWarnings(status, alerts), [status, alerts]);

  const handleCommand = useVanVoice({
    status,
    alerts,
    diagnostics,
    update: van.update,
    setMode: van.setMode,
    adjustClimate: van.adjustClimate,
    onDiagnostics: () => setTestsOpen(true),
  });

  if (!status) return <ModuleShell title="Diagnostics" />;

  const locate = (alert) =>
    setFocus({
      viewId: null,
      id: alert.id,
      side: alert.side,
      zone: "side",
      title: alert.title,
    });

  const selectView = (id) => setFocus(id === "full" ? null : viewFocus(id));

  return (
    <ModuleShell bare status={status} voiceHandler={handleCommand}>
      <div className="grid items-stretch gap-3 xl:grid-cols-[268px_minmax(0,1fr)_278px]">
        <div className="order-2 flex min-w-0 flex-col gap-3 xl:order-1">
          <VehicleHealth status={status} alerts={alerts} onRun={() => setTestsOpen(true)} />
          <DiagnosticsAlerts alerts={alerts} onLocate={locate} onResolve={van.resolveAlert} />
        </div>

        <div className="order-1 flex min-h-[360px] min-w-0 flex-col lg:min-h-[430px] xl:order-2">
          <VanStage
            cabinTemp={status.cabin_temp ?? status.climate_temp}
            vehicleName={status.vehicle_name}
            trim={status.trim}
            warnings={warnings}
            focus={focus}
            status={status}
            onClearFocus={() => setFocus(null)}
          />
        </div>

        <SystemDiagram active={focus?.viewId ?? "full"} onSelect={selectView} status={status} />
      </div>

      <UtilityBar status={status} />

      <DiagnosticsDialog open={testsOpen} onOpenChange={setTestsOpen} results={diagnostics} />
    </ModuleShell>
  );
}