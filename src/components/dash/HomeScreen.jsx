import { useState } from "react";
import { toast } from "sonner";
import useVanDashboard from "@/hooks/useVanDashboard";
import { openAlerts } from "@/lib/van";
import DashHeader from "./DashHeader";
import SideRail from "./SideRail";
import VanStage from "./VanStage";
import LocksPanel from "./LocksPanel";
import QuickDock from "./QuickDock";
import StatStrip from "./StatStrip";
import DiagnosticsDialog from "@/components/van/DiagnosticsDialog";

export default function HomeScreen() {
  const van = useVanDashboard();
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const { status, alerts } = van;

  const handleNav = (item) => {
    if (item.id === "home") return;
    toast(`${item.label} isn't connected yet`, { description: "This module is planned for the next TransitOS release." });
  };

  const handleDock = (item) => {
    if (item.id === "diagnose") {
      setDiagnosticsOpen(true);
      return;
    }
    toast(`${item.label} isn't connected yet`, { description: "This module is planned for the next TransitOS release." });
  };

  if (!status) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-blue" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">Connecting to van</span>
        </div>
      </div>
    );
  }

  const faultCount = openAlerts(alerts).length;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <DashHeader interiorTemp={status.climate_temp} />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 xl:flex-row xl:overflow-hidden">
        <div className="hidden xl:block">
          <SideRail active="home" onSelect={handleNav} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <VanStage
            cabinTemp={status.cabin_temp}
            vehicleName={status.vehicle_name}
            trim={status.trim}
          />
          <StatStrip status={status} faultCount={faultCount} />
        </div>

        <LocksPanel />
      </div>

      <QuickDock onSelect={handleDock} />

      <DiagnosticsDialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen} results={van.diagnostics} />
    </div>
  );
}