import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import useVanDashboard from "@/hooks/useVanDashboard";
import { openAlerts } from "@/lib/van";
import { siteWarnings } from "@/lib/siteWarnings";
import useVanVoice from "@/hooks/useVanVoice";
import { cn } from "@/lib/utils";
import HomeHeader from "./home/HomeHeader";
import AppDock from "@/components/dash/AppDock";
import VoiceControl from "./home/VoiceControl";
import HardwareLink from "./home/HardwareLink";
import VanPanel from "@/components/van/VanPanel";
import ClimateCard from "@/components/van/ClimateCard";
import WaterCard from "@/components/van/WaterCard";
import LpgCard from "@/components/van/LpgCard";
import PowerCard from "@/components/van/PowerCard";
import CabinCard from "@/components/van/CabinCard";
import VehicleCard from "@/components/van/VehicleCard";
import AlertsPanel from "@/components/van/AlertsPanel";
import DiagnosticsDialog from "@/components/van/DiagnosticsDialog";
import VehicleAlertToast from "./VehicleAlertToast";
import ModulesStatusPanel from "./ModulesStatusPanel";

export default function HomeScreen() {
  const van = useVanDashboard();
  const { status, alerts, diagnostics } = van;
  const navigate = useNavigate();
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [alertsPing, setAlertsPing] = useState(false);
  const [voiceSignal, setVoiceSignal] = useState(0);

  const warnings = useMemo(() => siteWarnings(status), [status]);

  useEffect(() => {
    if (!alertsPing) return undefined;
    const timer = setTimeout(() => setAlertsPing(false), 1800);
    return () => clearTimeout(timer);
  }, [alertsPing]);

  const handleCommand = useVanVoice({
    status,
    alerts,
    diagnostics,
    update: van.update,
    setMode: van.setMode,
    adjustClimate: van.adjustClimate,
    onDiagnostics: () => setDiagnosticsOpen(true),
    onAlerts: () => {
      setAlertsPing(true);
      document.getElementById("home-alerts")?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  });

  if (!status) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <HomeHeader status={null} offline={van.offline} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="glass flex items-center gap-3 rounded-full px-5 py-2.5">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-ios-teal" />
            <span className="text-[12px] font-medium text-white/60">Waiting for van telemetry</span>
          </div>
          <p className="max-w-sm text-[12px] leading-relaxed text-white/35">
            No readings have arrived yet. Once your hub posts to the telemetry endpoint, live values appear here
            automatically.
          </p>
        </div>
      </div>
    );
  }

  const active = openAlerts(alerts);
  const lightsOn = status.lights_on !== false;
  const locked = status.locks_locked !== false;

  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <HomeHeader status={status} offline={van.offline} />
      <VehicleAlertToast alerts={alerts} warnings={warnings} onLocate={() => navigate({ to: "/diagnostics" })} />

      <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-4 px-3 pb-[156px] pt-4 sm:px-4">
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,352px)]">
          <div className="flex min-w-0 flex-col gap-4">
            <VanPanel status={status} offline={van.offline} className="h-[240px] sm:h-[310px] lg:h-[340px]" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ClimateCard
                temp={status.climate_temp ?? 72}
                set={status.climate_set ?? 72}
                mode={status.climate_mode}
                onAdjust={van.adjustClimate}
                onChangeMode={(mode) => van.update({ climate_mode: mode })}
              />
              <WaterCard status={status} />
              <LpgCard percent={Math.round(Number(status.lpg_percent ?? 0))} gallons={Number(status.lpg_gallons ?? 0)} />
              <PowerCard
                percent={Math.round(Number(status.battery_percent ?? 0))}
                voltage={Number(status.battery_voltage ?? 0)}
                solar={Number(status.solar_w ?? 0)}
                load={Number(status.load_w ?? 0)}
              />
              <CabinCard
                temp={status.cabin_temp ?? status.climate_temp ?? 72}
                photoUri={status.cabin_photo_uri}
                lightsOn={lightsOn}
                locksLocked={locked}
                onLights={(value) => van.update({ lights_on: value })}
                onLocks={(value) => van.update({ locks_locked: value })}
              />
              <VehicleCard
                odometer={status.odometer}
                alertCount={active.length + warnings.length}
                topAlert={active[0]?.title ?? warnings[0]?.title}
                onDiagnostics={() => setDiagnosticsOpen(true)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-[92px] lg:self-start">
            <div
              id="home-alerts"
              className={cn(
                "rounded-[26px] transition-shadow",
                alertsPing && "ring-2 ring-ios-blue/70 ring-offset-2 ring-offset-background"
              )}
            >
              <AlertsPanel
                alerts={alerts}
                warnings={warnings}
                onResolve={(alert) => van.resolveAlert(alert.id)}
                onDiagnostics={() => setDiagnosticsOpen(true)}
              />
            </div>
            <ModulesStatusPanel status={status} modules={van.modules} offline={van.offline} />
            <HardwareLink status={status} offline={van.offline} />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/92 px-3 pb-2 pt-3 backdrop-blur-2xl sm:px-4">
        <AppDock status={status} onVoice={() => setVoiceSignal((value) => value + 1)} />
      </div>
      <VoiceControl onSubmit={handleCommand} startSignal={voiceSignal} />
      <DiagnosticsDialog open={diagnosticsOpen} onOpenChange={setDiagnosticsOpen} results={diagnostics} />
    </div>
  );
}