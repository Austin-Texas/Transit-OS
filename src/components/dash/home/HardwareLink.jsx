import { PlugZap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

// Readings that need hardware which may not be installed yet. Anything the hub
// has not reported is called out here, so nothing on the dashboard pretends to
// be a live sensor.
const SENSORS = [
  { key: "lpg_percent", label: "Propane gauge" },
  { key: "tire_fl", label: "Tire sensors" },
  { key: "heat_pad_temp_f", label: "Heat pad probe" },
  { key: "solar_w", label: "Solar shunt" },
  { key: "odometer", label: "Odometer feed" },
];

export default function HardwareLink({ status, offline }) {
  const missing = SENSORS.filter((sensor) => status?.[sensor.key] === undefined || status?.[sensor.key] === null);

  return (
    <section className="panel-surface rounded-2xl border border-neon/25 p-4">
      <header className="flex items-center gap-2">
        <Radio className="h-3.5 w-3.5 text-neon/80" strokeWidth={1.9} />
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">Hardware link</h2>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.12em]",
            offline ? "border-alert/45 bg-alert/10 text-alert" : "border-ok/45 bg-ok/10 text-ok"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {offline ? "Offline" : "Online"}
        </span>
      </header>

      <p className="mt-2 text-[10.5px] leading-relaxed text-white/40">
        {missing.length
          ? "These readings have no sensor connected yet and stay empty until the van hub reports them."
          : "Every tracked sensor is reporting to the van hub."}
      </p>

      {missing.length ? (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {missing.map((sensor) => (
            <li
              key={sensor.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white/40"
            >
              <PlugZap className="h-2.5 w-2.5" strokeWidth={2.4} />
              {sensor.label}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}