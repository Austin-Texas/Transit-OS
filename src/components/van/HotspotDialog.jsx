import { Activity, BatteryCharging, Droplet, Thermometer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { heatPad } from "@/lib/heatPad";
import { TANK_CAPACITY_GAL, gallonsFrom } from "@/lib/van";
import { cn } from "@/lib/utils";

const PANELS = {
  water_tank: {
    title: "Fresh water tank",
    Icon: Droplet,
    tone: "text-sys-blue",
    description: "Fresh tank carried in the spare-tire cradle, under the left rear of the van.",
  },
  battery: {
    title: "House battery",
    Icon: BatteryCharging,
    tone: "text-sys-green",
    description: "House bank strapped to the floor between the chassis rails.",
  },
  heat_pad: {
    title: "Tank heat pad",
    Icon: Thermometer,
    tone: "text-warn",
    description: "Pad bonded to the fresh tank under the left rear of the van.",
  },
};

function readings(hotspot, status) {
  if (hotspot === "water_tank") {
    const level = Number(status?.fresh_water ?? 0);
    const pad = heatPad(status);
    return [
      {
        label: "Level",
        value: `${Math.round(level)}%`,
        tone: level <= 20 ? "text-alert" : "text-sys-blue",
      },
      { label: "Volume", value: `${gallonsFrom(level, TANK_CAPACITY_GAL.fresh_water).toFixed(1)} gal` },
      { label: "Tank size", value: `${TANK_CAPACITY_GAL.fresh_water} gal` },
      { label: "Water pump", value: status?.water_pump_on ? "Running" : "Off" },
      {
        label: "Tank heater",
        value: pad.fault ? "Fault" : pad.label,
        tone: pad.tone,
      },
    ];
  }

  if (hotspot === "battery") {
    const percent = Number(status?.battery_percent ?? 0);
    const solar = Number(status?.solar_w ?? 0);
    const load = Number(status?.load_w ?? 0);
    const net = solar - load;
    return [
      {
        label: "State of charge",
        value: `${Math.round(percent)}%`,
        tone: percent <= 30 ? "text-alert" : "text-sys-green",
      },
      { label: "Voltage", value: `${Number(status?.battery_voltage ?? 0).toFixed(1)} V` },
      { label: "Solar input", value: `${Math.round(solar)} W` },
      { label: "House load", value: `${Math.round(load)} W` },
      {
        label: "Net",
        value: `${net >= 0 ? "+" : ""}${Math.round(net)} W`,
        tone: net >= 0 ? "text-sys-green" : "text-warn",
      },
    ];
  }

  const pad = heatPad(status);
  const level = Number(status?.fresh_water ?? 0);
  return [
    { label: "State", value: pad.fault ? "No response" : pad.label, tone: pad.tone },
    {
      label: "Pad temp",
      value: pad.temp !== null ? `${pad.temp.toFixed(1)}°F` : "—",
      tone: pad.fault ? "text-alert" : "text-white",
    },
    { label: "Set point", value: pad.target !== null ? `${pad.target.toFixed(0)}°F` : "—" },
    { label: "Draw", value: pad.watts !== null ? `${pad.watts.toFixed(0)} W` : "—" },
    { label: "Reported", value: pad.reportedAt ?? "—" },
    { label: "Tank above it", value: `${Math.round(level)}%` },
  ];
}

function summary(hotspot, status) {
  if (hotspot === "water_tank") {
    const level = Number(status?.fresh_water ?? 0);
    return level <= 20
      ? { text: "Low", tone: "border-alert/50 bg-alert/10 text-alert" }
      : { text: "Normal", tone: "border-ok/45 bg-ok/10 text-ok" };
  }
  if (hotspot === "battery") {
    const percent = Number(status?.battery_percent ?? 0);
    return percent <= 30
      ? { text: "Low", tone: "border-alert/50 bg-alert/10 text-alert" }
      : { text: "Normal", tone: "border-ok/45 bg-ok/10 text-ok" };
  }
  const pad = heatPad(status);
  if (pad.fault) return { text: "Fault", tone: "border-alert/50 bg-alert/10 text-alert" };
  if (!pad.known) return { text: "No report", tone: "border-line bg-surface-raised text-white/50" };
  return { text: pad.label, tone: "border-ok/45 bg-ok/10 text-ok" };
}

// Opened by tapping a part on the 3D van: its state plus the sensor readings
// the hub last reported for it.
export default function HotspotDialog({ hotspot, status, onClose }) {
  if (!hotspot) return null;
  const panel = PANELS[hotspot] ?? PANELS.heat_pad;
  const chip = summary(hotspot, status);
  const Icon = panel.Icon;

  return (
    <Dialog open onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent className="max-w-sm border-line bg-surface text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[14px] font-semibold tracking-tight">
            <Icon className={cn("h-4 w-4", panel.tone)} strokeWidth={2.2} />
            {panel.title}
            <span
              className={cn(
                "ml-auto rounded-full border px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em]",
                chip.tone
              )}
            >
              {chip.text}
            </span>
          </DialogTitle>
          <DialogDescription className="text-[10.5px] leading-relaxed text-white/45">
            {panel.description}
          </DialogDescription>
        </DialogHeader>

        <div>
          {readings(hotspot, status).map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-3 border-b border-line/60 py-1.5 last:border-0"
            >
              <span className="text-[9.5px] uppercase tracking-[0.14em] text-white/35">{row.label}</span>
              <span className={cn("text-right font-mono text-[10.5px] font-semibold text-white", row.tone)}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <p className="flex items-center gap-1.5 rounded-xl border border-line/80 bg-surface-raised px-3 py-2 text-[9.5px] leading-relaxed text-white/40">
          <Activity className="h-3 w-3 shrink-0 text-sys-blue" strokeWidth={2.2} />
          Readings refresh on every telemetry push from the van hub.
        </p>
      </DialogContent>
    </Dialog>
  );
}