import { useState } from "react";
import { base44 } from "@/api/base44Client";
import DashHeader from "./DashHeader";
import SideRail from "./SideRail";
import AppDock from "./AppDock";
import VoiceControl from "./home/VoiceControl";
import useVanVoice from "@/hooks/useVanVoice";

export default function ModuleShell({ title, subtitle, meta, status, voiceHandler, children }) {
  const [voiceSignal, setVoiceSignal] = useState(0);

  // Pages that bring their own richer voice handler (diagnostics) pass it in;
  // every other screen gets one that reads and writes through the van record.
  const fallbackVoice = useVanVoice({
    status,
    alerts: [],
    diagnostics: [],
    update: (patch) => (status?.id ? base44.entities.VanStatus.update(status.id, patch) : Promise.resolve()),
    setMode: (mode) =>
      status?.id ? base44.entities.VanStatus.update(status.id, { active_mode: mode }) : Promise.resolve(),
    adjustClimate: (delta) => {
      const next = Math.min(90, Math.max(50, Number(status?.climate_set ?? 72) + delta));
      return status?.id
        ? base44.entities.VanStatus.update(status.id, { climate_set: next, climate_temp: next })
        : Promise.resolve();
    },
  });

  const handleCommand = voiceHandler ?? fallbackVoice;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <DashHeader interiorTemp={status?.climate_temp ?? 72} />

      <div className="flex min-h-0 flex-1 gap-3 overflow-y-auto px-3 pb-[156px] pt-2.5 lg:overflow-hidden lg:px-4 lg:pb-[156px] lg:pt-3">
        <div className="hidden lg:block">
          <SideRail />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:overflow-y-auto lg:pr-1">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-[19px] font-semibold tracking-tight text-white">{title}</h1>
              {subtitle ? <p className="truncate text-[11.5px] text-white/40">{subtitle}</p> : null}
            </div>
            {meta}
          </div>

          {children ?? (
            <div className="flex items-center gap-3 self-start rounded-full border border-line bg-surface px-5 py-2.5">
              <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-blue" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">Waiting for telemetry</span>
            </div>
          )}
        </div>
      </div>

      {/* Pinned to the viewport, so it never moves while the page scrolls. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/92 px-3 pb-2 pt-3 backdrop-blur-2xl sm:px-4">
        <AppDock status={status} onVoice={status ? () => setVoiceSignal((value) => value + 1) : undefined} />
      </div>

      {status ? <VoiceControl onSubmit={handleCommand} startSignal={voiceSignal} /> : null}
    </div>
  );
}