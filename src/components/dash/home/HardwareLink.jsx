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
    <section className="glass relative overflow-hidden rounded-[28px] p-5">
      <span className="sheen" aria-hidden="true" />
      <header className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-ios-teal ring-1 ring-inset ring-white/10">
          <Radio className="h-4 w-4" strokeWidth={1.9} />
        </span>
        <h2 className="text-[13px] font-semibold tracking-tight text-white">Hardware link</h2>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            offline ? "bg-ios-pink/15 text-ios-pink" : "bg-ios-green/15 text-ios-green"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {offline ? "Offline" : "Online"}
        </span>
      </header>

      <p className="mt-3 text-[12px] leading-relaxed text-white/45">
        {missing.length
          ? "These readings have no sensor connected yet and stay empty until the van hub reports them."
          : "Every tracked sensor is reporting to the van hub."}
      </p>

      {missing.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {missing.map((sensor) => (
            <li
              key={sensor.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] font-medium text-white/45 ring-1 ring-inset ring-white/[0.08]"
            >
              <PlugZap className="h-3 w-3" strokeWidth={2.4} />
              {sensor.label}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}