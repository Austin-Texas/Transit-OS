import { AlertTriangle, CheckCircle2, CircleHelp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TANK_CAPACITY_GAL, gallons, gallonsFrom } from "@/lib/van";
import { heatPad } from "@/lib/heatPad";
import { cn } from "@/lib/utils";

function Row({ label, value, tone = "text-white" }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 py-1.5 last:border-0">
      <span className="text-[9.5px] uppercase tracking-[0.14em] text-white/35">{label}</span>
      <span className={cn("text-right font-mono text-[10.5px] font-semibold", tone)}>{value}</span>
    </div>
  );
}

// What the red dot on the underbody opens: the last readings the heat pad
// controller sent for the spare-tire fresh water tank.
export default function HeatPadDetails({ open, onOpenChange, status }) {
  const pad = heatPad(status);
  const fresh = Number(status?.fresh_water ?? 0);
  const freshGal = gallonsFrom(fresh, TANK_CAPACITY_GAL.fresh_water);

  const Icon = pad.fault ? AlertTriangle : pad.known ? CheckCircle2 : CircleHelp;
  const banner = pad.fault
    ? "border-alert/55 bg-alert/10"
    : pad.known
      ? "border-ok/45 bg-ok/10"
      : "border-line bg-surface-raised";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-line bg-surface text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Icon
              className={cn("h-4 w-4", pad.fault ? "text-alert" : pad.known ? "text-ok" : "text-white/45")}
              strokeWidth={2.2}
            />
            Fresh water heat pad
          </DialogTitle>
          <DialogDescription className="text-[11px] leading-relaxed text-white/45">
            Pad bonded to the fresh tank carried in the spare-tire cradle, under the left rear of the van.
          </DialogDescription>
        </DialogHeader>

        <div className={cn("rounded-xl border px-3 py-2.5", banner)}>
          <p
            className={cn(
              "text-[9.5px] font-semibold uppercase tracking-[0.16em]",
              pad.fault ? "text-alert" : pad.known ? "text-ok" : "text-white/45"
            )}
          >
            {pad.fault ? "Controller reports a failure" : pad.known ? `Controller reports ${pad.label.toLowerCase()}` : "No report from the controller"}
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-white/65">
            {pad.fault
              ? "The pad stopped answering, so the tank is unprotected against freezing."
              : pad.known
                ? pad.key === "heating"
                  ? "The pad is drawing power to bring the tank back to its set point."
                  : pad.key === "holding"
                    ? "The pad is holding its set point, keeping the tank above freezing."
                    : "The pad is switched off by the controller."
                : "The hub has not sent pad readings yet, so the model shows the pad as unknown rather than guessing."}
          </p>
        </div>

        <div>
          <Row label="State" value={pad.fault ? "No response" : pad.label} tone={pad.tone} />
          <Row
            label="Pad temp"
            value={pad.temp !== null ? `${pad.temp.toFixed(1)}°F` : "—"}
            tone={pad.fault ? "text-alert" : "text-white"}
          />
          <Row label="Set point" value={pad.target !== null ? `${pad.target.toFixed(0)}°F` : "—"} />
          <Row label="Draw" value={pad.watts !== null ? `${pad.watts.toFixed(0)} W` : "—"} />
          <Row label="Reported" value={pad.reportedAt ?? "—"} />
          <Row label="Location" value="Spare-tire cradle · left rear" />
          <Row label="Fresh tank" value={`${Math.round(fresh)}% · ${gallons(freshGal)}`} tone="text-sys-blue" />
        </div>

        <p className="rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[10.5px] leading-relaxed text-white/45">
          {pad.fault
            ? "Drain the fresh tank or keep the cabin furnace running overnight, then check the pad connector under the cradle. The alert clears on its own once the controller reports again."
            : "Readings refresh on every telemetry push. The model's pad colour follows the state the controller reports, and turns red when it stops answering."}
        </p>
      </DialogContent>
    </Dialog>
  );
}