import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import { openAlerts } from "@/lib/van";
import { siteWarnings } from "@/lib/siteWarnings";
import DashHeader from "./DashHeader";
import SideRail from "./SideRail";
import VanStage from "./VanStage";
import LocksPanel from "./LocksPanel";
import QuickDock from "./QuickDock";
import StatStrip from "./StatStrip";
import WaterLevels from "./WaterLevels";
import PhysicalToggle from "./PhysicalToggle";
import ClimateControl from "./ClimateControl";
import AlertStrip from "./AlertStrip";
import VehicleAlertToast from "./VehicleAlertToast";

const RANK = { critical: 0, warning: 1, info: 2 };

export default function HomeScreen() {
  const van = useVanDashboard();
  const { status, alerts } = van;
  const [focus, setFocus] = useState(null);
  const seen = useRef(null);

  const warnings = useMemo(() => siteWarnings(status), [status]);

  // The stage turns itself to whichever side raised a new problem.
  useEffect(() => {
    const sided = [
      ...alerts.filter(
        (alert) => alert.status !== "resolved" && (alert.side === "left" || alert.side === "right")
      ),
      ...warnings,
    ];

    if (!sided.length) {
      seen.current = new Set();
      return;
    }

    if (seen.current === null) {
      seen.current = new Set(sided.map((item) => item.id));
      const urgent = [...sided].sort((a, b) => (RANK[a.severity] ?? 3) - (RANK[b.severity] ?? 3))[0];
      setFocus({ id: urgent.id, side: urgent.side, zone: urgent.zone, title: urgent.title });
      return;
    }

    const fresh = sided.find((item) => !seen.current.has(item.id));
    sided.forEach((item) => seen.current.add(item.id));
    if (fresh) setFocus({ id: fresh.id, side: fresh.side, zone: fresh.zone, title: fresh.title });
  }, [alerts, warnings]);

  // Once the fault is gone the van swings back to its open view.
  useEffect(() => {
    if (!focus?.id) return;
    const stillThere =
      alerts.some((alert) => alert.id === focus.id && alert.status !== "resolved") ||
      warnings.some((warning) => warning.id === focus.id);
    if (!stillThere) setFocus(null);
  }, [alerts, warnings, focus]);

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
  const locate = (item) => setFocus({ id: item.id, side: item.side, zone: item.zone, title: item.title });

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-background">
      <DashHeader interiorTemp={status.climate_temp} />
      <VehicleAlertToast alerts={alerts} warnings={warnings} onLocate={locate} />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-2.5 lg:flex-row lg:overflow-hidden lg:px-4 lg:py-3">
        <div className="hidden lg:block">
          <SideRail />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:min-h-0">
          <VanStage
            cabinTemp={status.cabin_temp ?? status.climate_temp}
            vehicleName={status.vehicle_name}
            trim={status.trim}
            odometer={status.odometer}
            warnings={warnings}
            focus={focus}
            onClearFocus={() => setFocus(null)}
          />
          <StatStrip status={status} faultCount={faultCount} warnings={warnings} />
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[308px] lg:overflow-y-auto lg:pr-0.5 xl:w-[336px]">
          <AlertStrip alerts={alerts} onResolve={van.resolveAlert} onFocus={locate} />
          <WaterLevels status={status} />
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
          <LocksPanel locked={status.locks_locked} />
        </aside>
      </div>

      <QuickDock />
    </div>
  );
}