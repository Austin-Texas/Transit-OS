import { useState } from "react";
import { Thermometer } from "lucide-react";
import FordTransit3D from "@/components/van/FordTransit3D";
import ModuleCard from "@/components/dash/ModuleCard";
import HeatPadDetails from "./HeatPadDetails";
import { TANK_CAPACITY_GAL, gallons, gallonsFrom } from "@/lib/van";
import { cn } from "@/lib/utils";

const FOCUS = { id: "tank_heater", side: "left", zone: "underbody", title: "Heat pad" };

function Row({ label, value, tone = "text-white" }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-line/60 py-1.5 last:border-0">
      <span className="text-[9px] uppercase tracking-[0.14em] text-white/35">{label}</span>
      <span className={cn("text-right font-mono text-[10.5px] font-semibold", tone)}>{value}</span>
    </div>
  );
}

// Diagnostic view of the tanks' hardware: the underbody of the 3D van, with the
// heat pad under the spare-tire tank and a red dot when its sensor fails.
export default function TankDiagnostics({ status }) {
  const [open, setOpen] = useState(false);
  const fault = status?.tank_heater_fault === true;
  const fresh = Number(status?.fresh_water ?? 0);
  const freshGal = gallonsFrom(fresh, TANK_CAPACITY_GAL.fresh_water);

  return (
    <div id="diagnostics" className="lg:col-span-3">
    <ModuleCard
      title="Tank diagnostics"
      icon={Thermometer}
      className="lg:col-span-3"
      action={
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.14em]",
            fault ? "border-alert/55 bg-alert/10 text-alert" : "border-ok/45 bg-ok/10 text-ok"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", fault ? "bg-alert" : "bg-ok")} />
          Heat pad {fault ? "fault" : "nominal"}
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_248px]">
        <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-line/80 bg-[radial-gradient(120%_120%_at_50%_-10%,#0d2d40_0%,#061019_52%,#03070c_100%)]">
          <FordTransit3D
            className="absolute inset-0 h-full w-full"
            focus={FOCUS}
            warnings={[]}
            status={status}
            onPick={(hotspot) => hotspot === "heat_pad" && setOpen(true)}
          />

          <p className="pointer-events-none absolute left-3 top-3 z-10 text-[9px] uppercase tracking-[0.18em] text-white/45">
            Underbody · spare-tire fresh tank
          </p>

          {fault ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-alert/70 bg-ink-950/85 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-alert backdrop-blur transition hover:bg-alert/15"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert/70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-alert" />
              </span>
              Heat pad fault · more info
            </button>
          ) : (
            <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-ok/45 bg-ink-950/80 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ok backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-ok" />
              Heat pad nominal
            </span>
          )}

          <p className="pointer-events-none absolute bottom-3 right-3 z-10 text-[8.5px] uppercase tracking-[0.14em] text-white/30">
            Drag to inspect
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="rounded-xl border border-line/80 bg-surface-raised px-3 py-2">
            <p className="mb-1 text-[8.5px] uppercase tracking-[0.16em] text-white/35">Heat pad sensor</p>
            <Row label="Pad" value={fault ? "No response" : "Cycling"} tone={fault ? "text-alert" : "text-ok"} />
            <Row label="Controller" value={fault ? "Offline" : "Online"} tone={fault ? "text-alert" : "text-ok"} />
            <Row label="Mount" value="Spare-tire cradle" />
            <Row label="Fresh tank" value={`${Math.round(fresh)}% · ${gallons(freshGal)}`} tone="text-sys-blue" />
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] transition",
              fault
                ? "border-alert/60 bg-alert/10 text-alert hover:bg-alert/20"
                : "border-line/80 bg-surface-raised text-white/60 hover:border-white/25 hover:text-white"
            )}
          >
            {fault ? "Review the failure" : "Open sensor detail"}
          </button>

          <p className="text-[10px] leading-relaxed text-white/30">
            The pad sits under the fresh tank in the spare-tire carrier. Every telemetry push checks its response and
            lights the red dot on the model when it stops answering.
          </p>
        </div>
      </div>

      <HeatPadDetails open={open} onOpenChange={setOpen} status={status} />
    </ModuleCard>
    </div>
  );
}