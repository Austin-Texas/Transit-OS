import { useEffect, useState } from "react";
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
  // Pixel-locked 1791 x 831 reference layout, scaled uniformly to the 10-inch screen.
  const [screenSize, setScreenSize] = useState(() => ({ width: typeof window === "undefined" ? 1791 : window.innerWidth, height: typeof window === "undefined" ? 831 : window.innerHeight }));
  useEffect(() => {
    const resize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const displayScale = Math.min(screenSize.width / 1791, screenSize.height / 831);
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
    <div className="overflow-hidden" style={{ width: screenSize.width, height: screenSize.height }}>
      <div className="flex flex-col" style={{ width: 1791, height: 831, transform: `scale(${displayScale})`, transformOrigin: "top left" }}>
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />

      <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-4 px-5 py-5">
        <div className="grid h-[601px] items-stretch gap-4 grid-cols-[435px_811px_463px]">
          <VanPanel status={status} />

          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid flex-1 auto-rows-fr gap-4 grid-cols-2">
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
            <QuickModes active={status.active_mode} onSelect={van.setMode} />
          </div>

          <AlertsPanel
            alerts={alerts}
            onResolve={(alert) => van.resolveAlert(alert.id)}
            onDiagnostics={() => setDiagnosticsOpen(true)}
          />
        </div>

      </main>

      {/* Navigation remains available in code for later detail pages; the reference main screen has no bottom navigation. */}

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        status={status}
        onResync={handleResync}
        resyncing={resyncing}
      />
      <DiagnosticsDialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen} results={diagnostics} />
      </div>
    </div>
  );
}