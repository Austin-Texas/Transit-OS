import { Fan, Lightbulb } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import { openAlerts } from "@/lib/van";
import DashHeader from "./DashHeader";
import SideRail from "./SideRail";
import VanStage from "./VanStage";
import LocksPanel from "./LocksPanel";
import QuickDock from "./QuickDock";
import StatStrip from "./StatStrip";
import PhysicalToggle from "./PhysicalToggle";

export default function HomeScreen() {
  const van = useVanDashboard();
  const { status, alerts } = van;

  if (!status) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 bg-background px-6 text-center">
        <div className="flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-2.5">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-blue" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">Waiting for van telemetry</span>
        </div>
        <p className="max-w-sm text-[11px] leading-relaxed text-white/30">
          No readings have arrived yet. Once your hub posts to the telemetry endpoint, live values appear here
          automatically.
        </p>
      </div>
    );
  }

  const faultCount = openAlerts(alerts).length;
  const lightsOn = status.lights_on !== false;
  const ventOn = (status.climate_mode ?? "auto") !== "off";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <DashHeader interiorTemp={status.climate_temp} />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 xl:flex-row xl:overflow-hidden">
        <div className="hidden xl:block">
          <SideRail />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <VanStage
            cabinTemp={status.cabin_temp}
            vehicleName={status.vehicle_name}
            trim={status.trim}
            photoUri={status.van_photo_uri}
            onPhoto={(uri) => van.update({ van_photo_uri: uri })}
          />
          <StatStrip status={status} faultCount={faultCount} />

          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <PhysicalToggle
              icon={Lightbulb}
              label="Cabin lights"
              sub={lightsOn ? `On · ${Math.round(status.light_level ?? 70)}% brightness` : "All zones off"}
              checked={lightsOn}
              onChange={(value) => van.update({ lights_on: value })}
            />
            <PhysicalToggle
              icon={Fan}
              label="Ventilation"
              sub={ventOn ? "Fan running · auto" : "Fan stopped"}
              checked={ventOn}
              onChange={(value) => van.update({ climate_mode: value ? "auto" : "off" })}
              tone="green"
            />
          </div>
        </div>

        <LocksPanel locked={status.locks_locked} />
      </div>

      <QuickDock />
    </div>
  );
}