import { heatPad } from "@/lib/heatPad";
import { TANK_CAPACITY_GAL, gallonsFrom, miles } from "@/lib/van";
import { cn } from "@/lib/utils";

// The System Diagram (3D) picker: each entry turns the wireframe van to that
// part of the vehicle and lists the readings that belong to it.
const VIEWS = [
  { id: "full", label: "Full Vehicle", hint: "Chassis, cabin, utilities", side: null, zone: null, dot: "bg-ios-teal" },
  { id: "drivetrain", label: "Drivetrain", hint: "Engine, tires, fuel", side: "right", zone: "front", dot: "bg-ios-blue" },
  { id: "electrical", label: "Electrical", hint: "House bank, solar", side: "left", zone: "underbody", dot: "bg-warn" },
  { id: "water", label: "Water & Plumbing", hint: "Fresh, gray, black, heat pad", side: "left", zone: "rear", dot: "bg-ios-teal" },
  { id: "lpg", label: "LPG / Gas", hint: "Propane tank", side: "left", zone: "fuel", dot: "bg-alert" },
  { id: "climate", label: "HVAC / Climate", hint: "Cabin air", side: "right", zone: null, dot: "bg-ios-green" },
  { id: "interior", label: "Interior (Cabin)", hint: "Living space", side: "left", zone: null, dot: "bg-ios-purple" },
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
                  "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left ring-1 ring-inset transition duration-200",
                  isActive
                    ? "bg-ios-blue/20 text-white ring-ios-blue/40"
                    : "bg-white/[0.04] text-white/55 ring-white/[0.07] hover:bg-white/[0.08] hover:text-white/85"
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full transition",
                    isActive ? view.dot : "bg-white/20",
                    isActive && "ring-2 ring-white/25"
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold leading-tight">{view.label}</span>
                  <span className="block truncate text-[11px] text-white/35">{view.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dl className="rounded-2xl bg-white/[0.04] px-3 py-2 ring-1 ring-inset ring-white/[0.07]">
        {readingsFor(active, status).map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2 border-b border-white/[0.06] py-1.5 last:border-0">
            <dt className="truncate text-[11.5px] font-medium text-white/40">{label}</dt>
            <dd className="shrink-0 text-[11.5px] font-semibold text-white/85">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}