import { useEffect, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import { openAlerts } from "@/lib/van";
import DashHeader from "./DashHeader";
import SideRail from "./SideRail";
import VanStage from "./VanStage";
import LocksPanel from "./LocksPanel";
import QuickDock from "./QuickDock";
import StatStrip from "./StatStrip";
import WaterLevels from "./WaterLevels";
import TrendChart from "./TrendChart";
import PhysicalToggle from "./PhysicalToggle";
import ClimateControl from "./ClimateControl";
import AlertStrip from "./AlertStrip";

const RANK = { critical: 0, warning: 1, info: 2 };
const byUrgency = (a, b) => (RANK[a.severity] ?? 3) - (RANK[b.severity] ?? 3);

export default function HomeScreen() {
  const van = useVanDashboard();
  const { status, alerts } = van;
  const [focus, setFocus] = useState(null);
  const seenAlerts = useRef(null);

  // The stage turns to a side on its own whenever a side-aware alert appears.
  useEffect(() => {
    const sided = alerts.filter((alert) => alert.side && alert.status !== "resolved");

    if (seenAlerts.current === null) {
      seenAlerts.current = new Set(sided.map((alert) => alert.id));
      const urgent = [...sided].sort(byUrgency)[0];
      if (urgent) setFocus({ id: urgent.id, side: urgent.side, title: urgent.title });
      return;
    }

    const fresh = sided.find((alert) => !seenAlerts.current.has(alert.id));
    sided.forEach((alert) => seenAlerts.current.add(alert.id));
    if (fresh) setFocus({ id: fresh.id, side: fresh.side, title: fresh.title });
  }, [alerts]);

  // Once the alert that pulled the view round is gone, the van returns to its photo.
  useEffect(() => {
    if (!focus?.id) return;
    if (!alerts.some((alert) => alert.id === focus.id && alert.status !== "resolved")) setFocus(null);
  }, [alerts, focus]);

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

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <DashHeader interiorTemp={status.climate_temp} />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-2.5 lg:flex-row lg:overflow-hidden lg:px-4 lg:py-3">
        <div className="hidden lg:block">
          <SideRail />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:min-h-0 lg:gap-3 lg:overflow-y-auto">
          <AlertStrip
            alerts={alerts}
            onResolve={van.resolveAlert}
            onFocus={(alert) => setFocus({ side: alert.side, title: alert.title })}
          />
          <VanStage
            cabinTemp={status.cabin_temp}
            vehicleName={status.vehicle_name}
            trim={status.trim}
            photoUri={status.van_photo_uri}
            focus={focus}
            onClearFocus={() => setFocus(null)}
          />
          <StatStrip status={status} faultCount={faultCount} />
          <WaterLevels status={status} />
          <TrendChart />

          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <PhysicalToggle
              icon={Lightbulb}
              label="Cabin lights"
              sub={lightsOn ? `On · ${Math.round(status.light_level ?? 70)}% brightness` : "All zones off"}
              checked={lightsOn}
              onChange={(value) => van.update({ lights_on: value })}
            />
            <ClimateControl
              temp={status.climate_temp}
              set={status.climate_set ?? 72}
              mode={status.climate_mode}
              onChangeMode={(mode) => van.update({ climate_mode: mode })}
              onAdjust={van.adjustClimate}
            />
          </div>
        </div>

        <LocksPanel locked={status.locks_locked} />
      </div>

      <QuickDock />
    </div>
  );
}