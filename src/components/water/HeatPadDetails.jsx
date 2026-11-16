import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TANK_CAPACITY_GAL, gallons, gallonsFrom } from "@/lib/van";
import { cn } from "@/lib/utils";

function Row({ label, value, tone = "text-white" }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 py-1.5 last:border-0">
      <span className="text-[9.5px] uppercase tracking-[0.14em] text-white/35">{label}</span>
      <span className={cn("text-right font-mono text-[10.5px] font-semibold", tone)}>{value}</span>
    </div>
  );
}

// What the red dot on the underbody opens: the state of the heat pad bonded to
// the spare-tire fresh water tank, in plain terms.
export default function HeatPadDetails({ open, onOpenChange, status }) {
  const fault = status?.tank_heater_fault === true;
  const fresh = Number(status?.fresh_water ?? 0);
  const freshGal = gallonsFrom(fresh, TANK_CAPACITY_GAL.fresh_water);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-line bg-surface text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            {fault ? (
              <AlertTriangle className="h-4 w-4 text-alert" strokeWidth={2.2} />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-ok" strokeWidth={2.2} />
            )}
            Fresh water heat pad
          </DialogTitle>
          <DialogDescription className="text-[11px] leading-relaxed text-white/45">
            Pad bonded to the fresh tank carried in the spare-tire cradle, under the left rear of the van.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "rounded-xl border px-3 py-2.5",
            fault ? "border-alert/55 bg-alert/10" : "border-ok/45 bg-ok/10"
          )}
        >
          <p
            className={cn(
              "text-[9.5px] font-semibold uppercase tracking-[0.16em]",
              fault ? "text-alert" : "text-ok"
            )}
          >
            {fault ? "Sensor reports a failure" : "Sensor nominal"}
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-white/65">
            {fault
              ? "The pad is not drawing power and the heater controller has stopped answering, so the tank is unprotected against freezing."
              : "The pad is drawing power and cycling with the tank thermostat, keeping the tank above freezing."}
          </p>
        </div>

        <div>
          <Row label="Pad" value={fault ? "No response" : "Heating · cycling"} tone={fault ? "text-alert" : "text-ok"} />
          <Row label="Heater controller" value={fault ? "Offline" : "Online"} tone={fault ? "text-alert" : "text-ok"} />
          <Row label="Location" value="Spare-tire cradle · left rear" />
          <Row
            label="Fresh tank"
            value={`${Math.round(fresh)}% · ${gallons(freshGal)}`}
            tone="text-sys-blue"
          />
        </div>

        <p className="rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[10.5px] leading-relaxed text-white/45">
          {fault
            ? "Drain the fresh tank or keep the cabin furnace running overnight, then check the pad connector under the cradle. The alert clears on its own once the pad answers again."
            : "No action needed. The pad is watched on every telemetry push and raises an alert if it stops answering."}
        </p>
      </DialogContent>
    </Dialog>
  );
}