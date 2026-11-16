import { heatPad } from "@/lib/heatPad";
import { TANK_CAPACITY_GAL, gallonsFrom, miles } from "@/lib/van";
import { cn } from "@/lib/utils";

// The System Diagram (3D) picker: each entry turns the wireframe van to that
// part of the vehicle and lists the readings that belong to it.
const VIEWS = [
  { id: "full", label: "Full Vehicle", hint: "Chassis, cabin, utilities", side: null, zone: null },
  { id: "drivetrain", label: "Drivetrain", hint: "Engine, tires, fuel", side: "right", zone: "front" },
  { id: "electrical", label: "Electrical", hint: "House bank, solar", side: "left", zone: "underbody" },
  { id: "water", label: "Water & Plumbing", hint: "Fresh, gray, black, heat pad", side: "left", zone: "rear" },
  { id: "lpg", label: "LPG / Gas", hint: "Propane tank", side: "left", zone: "fuel" },
  { id: "climate", label: "HVAC / Climate", hint: "Cabin air", side: "right", zone: null },
  { id: "interior", label: "Interior (Cabin)", hint: "Living space", side: "left", zone: null },
];

export const DIAGRAM_VIEWS = VIEWS;

export function viewFocus(id) {
  const view = VIEWS.find((item) => item.id === id) ?? VIEWS[0];
  return {
    viewId: view.id,
    id: `view:${view.id}`,
    side: view.side,
    zone: view.zone,
    title: view.label,
  };
}

function readingsFor(id, status = {}) {
  const pad = heatPad(status);
  switch (id) {
    case "drivetrain":
      return [
        ["Odometer", `${miles(status.odometer)} mi`],
        ["Fuel", `${Math.round(Number(status.fuel_percent ?? 0))}%`],
        ["Front tires", `${Number(status.tire_fl ?? 0).toFixed(0)} / ${Number(status.tire_fr ?? 0).toFixed(0)} PSI`],
      ];
    case "electrical":
      return [
        ["House battery", `${Math.round(Number(status.battery_percent ?? 0))}%`],
        ["Starter", `${Number(status.battery_voltage ?? 0).toFixed(1)} V`],
        ["Solar / load", `${Math.round(Number(status.solar_w ?? 0))} W / ${Math.round(Number(status.load_w ?? 0))} W`],
      ];
    case "water":
      return [
        [
          "Fresh",
          `${Math.round(Number(status.fresh_water ?? 0))}% · ${gallonsFrom(
            status.fresh_water,
            TANK_CAPACITY_GAL.fresh_water
          ).toFixed(1)} gal`,
        ],
        ["Gray / black", `${Math.round(Number(status.gray_water ?? 0))}% / ${Math.round(Number(status.black_water ?? 0))}%`],
        ["Heat pad", pad.fault ? "Fault" : pad.known ? pad.label : "No report"],
      ];
    case "lpg":
      return [
        ["Propane", `${Math.round(Number(status.lpg_percent ?? 0))}%`],
        ["Remaining", `${Number(status.lpg_gallons ?? 0).toFixed(1)} gal`],
      ];
    case "climate":
      return [
        ["Interior", `${Math.round(Number(status.climate_temp ?? 0))}°F`],
        ["Set point", `${Math.round(Number(status.climate_set ?? 0))}°F`],
        ["Mode", status.climate_mode ?? "auto"],
      ];
    case "interior":
      return [
        ["Cabin", `${Math.round(Number(status.cabin_temp ?? status.climate_temp ?? 0))}°F`],
        ["Humidity", `${Math.round(Number(status.humidity ?? 0))}%`],
        ["Mode", status.active_mode ?? "camping"],
      ];
    default:
      return [
        ["Vehicle", status.vehicle_name ?? "Ford Transit"],
        ["Odometer", `${miles(status.odometer)} mi`],
        ["Mode", status.active_mode ?? "camping"],
      ];
  }
}

export default function DiagramViews({ active = "full", onSelect, status }) {
  return (
    <section className="flex flex-col gap-2">
      <ul className="flex flex-col gap-1.5">
        {VIEWS.map((view) => {
          const isActive = active === view.id;
          return (
            <li key={view.id}>
              <button
                type="button"
                onClick={() => onSelect(view.id)}
                aria-pressed={isActive}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors",
                  isActive
                    ? "border-neon/60 bg-neon/10 text-white"
                    : "border-line/70 bg-surface text-white/55 hover:border-neon/30 hover:text-white/85"
                )}
              >
                <span
                  className={cn(
                    "h-6 w-6 shrink-0 rounded-md border",
                    isActive ? "border-neon/60 bg-neon/20" : "border-white/10 bg-white/[0.03]"
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10.5px] font-semibold leading-tight">{view.label}</span>
                  <span className="block truncate text-[8.5px] uppercase tracking-[0.1em] text-white/30">
                    {view.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dl className="rounded-xl border border-line/70 bg-surface-raised px-2.5 py-2">
        {readingsFor(active, status).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2 border-b border-white/[0.05] py-1 last:border-0">
            <dt className="truncate text-[8.5px] uppercase tracking-[0.12em] text-white/30">{label}</dt>
            <dd className="shrink-0 font-mono text-[10px] text-white/80">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}