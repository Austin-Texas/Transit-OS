import DashHeader from "./DashHeader";
import SideRail from "./SideRail";
import QuickDock from "./QuickDock";

export default function ModuleShell({ title, subtitle, meta, status, children }) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-background">
      <DashHeader interiorTemp={status?.climate_temp ?? 72} />

      <div className="flex min-h-0 flex-1 gap-3 overflow-y-auto px-3 py-2.5 lg:overflow-hidden lg:px-4 lg:py-3">
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

      <QuickDock />
    </div>
  );
}