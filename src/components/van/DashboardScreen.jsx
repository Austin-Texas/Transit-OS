import { useState } from "react";
import { toast } from "sonner";
import useVanDashboard from "@/hooks/useVanDashboard";
import TopBar from "./TopBar";
import VanPanel from "./VanPanel";
import ClimateCard from "./ClimateCard";
import WaterCard from "./WaterCard";
import LpgCard from "./LpgCard";
import PowerCard from "./PowerCard";
import CabinCard from "./CabinCard";
import VehicleCard from "./VehicleCard";
import AlertsPanel from "./AlertsPanel";
import QuickModes from "./QuickModes";
import BottomNav from "./BottomNav";
import SettingsDialog from "./SettingsDialog";
import DiagnosticsDialog from "./DiagnosticsDialog";

export default function DashboardScreen() {
  const van = useVanDashboard();
  const [navActive, setNavActive] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [resyncing, setResyncing] = useState(false);

  const { status, alerts, loading, diagnostics } = van;

  const handleNav = (item) => {
    setNavActive(item.id);
    if (!item.target) {
      toast(`${item.label} isn't connected yet`, {
        description: "This module is planned for the next TransitOS release.",
      });
      return;
    }
    if (item.target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleResync = async () => {
    setResyncing(true);
    await van.refresh();
    setResyncing(false);
    toast.success("Status re-synced with the van hub");
  };

  if (loading || !status) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-neon/25 bg-white/[0.04] px-5 py-2.5">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-neon" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">Connecting to van</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />

      <main className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col gap-4 px-3 py-4 lg:px-6 lg:py-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(230px,0.95fr)_minmax(430px,1.75fr)_minmax(258px,1fr)]">
          <VanPanel status={status} />

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ClimateCard temp={status.climate_temp} set={status.climate_set} onAdjust={van.adjustClimate} />
              <WaterCard status={status} />
              <LpgCard percent={Number(status.lpg_percent)} gallons={status.lpg_gallons} />
              <PowerCard percent={Number(status.battery_percent)} />
              <CabinCard temp={status.cabin_temp} />
              <VehicleCard
                odometer={status.odometer}
                alertCount={alerts.filter((alert) => alert.status !== "resolved").length}
                onDiagnostics={() => setDiagnosticsOpen(true)}
              />
            </div>
          </div>

          <AlertsPanel
            alerts={alerts}
            onResolve={(alert) => van.resolveAlert(alert.id)}
            onDiagnostics={() => setDiagnosticsOpen(true)}
          />
        </div>

        <QuickModes active={status.active_mode} onSelect={van.setMode} />
      </main>

      <BottomNav active={navActive} onSelect={handleNav} />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        status={status}
        onResync={handleResync}
        resyncing={resyncing}
      />
      <DiagnosticsDialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen} results={diagnostics} />
    </div>
  );
}