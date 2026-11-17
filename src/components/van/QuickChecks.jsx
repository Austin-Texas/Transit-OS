import { BatteryMedium, Droplets, Flame, Gauge, Snowflake } from "lucide-react";
import { heatPad } from "@/lib/heatPad";
import { cn } from "@/lib/utils";

// The checks an owner runs most often. Each one is a toggle that turns the
// 3D van to that system, so the reading and the part are seen together.
function checksFor(status) {
  const pad = heatPad(status);
  const tires = ["tire_fl", "tire_fr", "tire_rl", "tire_rr"]
    .map((key) => Number(status?.[key] ?? 0))
    .filter((value) => value > 0);
  const lowTire = tires.length ? Math.min(...tires) : 0;
  const battery = Math.round(Number(status?.battery_percent ?? 0));
  const voltage = Number(status?.battery_voltage ?? 0);
  const fresh = Math.round(Number(status?.fresh_water ?? 0));
  const lpg = Math.round(Number(status?.lpg_percent ?? 0));
  const inside = Math.round(Number(status?.climate_temp ?? 0));
  const setPoint = Math.round(Number(status?.climate_set ?? 0));

  return [
    {
      id: "electrical",
      icon: BatteryMedium,
      label: "Battery health",
      value: `${battery}% · ${voltage.toFixed(1)} V`,
      warn: battery > 0 && battery < 30,
    },
    {
      id: "drivetrain",
      icon: Gauge,
      label: "Tire pressure",
      value: lowTire ? `Lowest ${lowTire.toFixed(0)} PSI` : "No reading",
      warn: lowTire > 0 && lowTire < 35,
      idle: !lowTire,
    },
    {
      id: "water",
      icon: Droplets,
      label: "Water & heat pad",
      value: pad.fault ? "Heat pad fault" : `${fresh}% fresh`,
      warn: pad.fault || fresh < 20,
    },
    {
      id: "lpg",
      icon: Flame,
      label: "Propane",
      value: `${lpg}% · ${Number(status?.lpg_gallons ?? 0).toFixed(1)} gal`,
      warn: lpg < 15,
    },
    {
      id: "climate",
      icon: Snowflake,
      label: "Climate air",
      value: `${inside}°F · set ${setPoint}°F`,
      warn: status?.climate_mode === "off" || Math.abs(inside - setPoint) > 4,
    },
  ];
}

export default function QuickChecks({ active = "full", onToggle, status }) {
  return (
    <section aria-label="Quick diagnostic checks" className="mt-3">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">Quick checks</h3>
        <p className="text-[11px] text-white/30">Toggle one to focus the van on that system</p>
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {checksFor(status).map((check) => {
          const on = active === check.id;
          const Icon = check.icon;
          return (
            <li key={check.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(check.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left ring-1 ring-inset transition duration-200",
                  on
                    ? "bg-white/[0.14] ring-white/25"
                    : "bg-white/[0.04] ring-white/[0.07] hover:bg-white/[0.08]"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    check.warn
                      ? "bg-ios-orange/15 text-ios-orange"
                      : check.idle
                        ? "bg-white/10 text-white/40"
                        : "bg-ios-green/15 text-ios-green"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold leading-tight text-white">
                    {check.label}
                  </span>
                  <span className="block truncate text-[11px] text-white/40">{check.value}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative h-5 w-9 shrink-0 rounded-full transition duration-200",
                    on ? "bg-ios-teal" : "bg-white/15"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200",
                      on ? "left-[18px]" : "left-0.5"
                    )}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}