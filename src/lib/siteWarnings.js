import { heatPad } from "@/lib/heatPad";

export const TIRE_MIN_PSI = 40;
export const FUEL_MIN_PERCENT = 15;
export const FUEL_CAPACITY_GAL = 25;

const TIRES = [
  { key: "tire_fl", label: "Front left tire", side: "left", zone: "front" },
  { key: "tire_fr", label: "Front right tire", side: "right", zone: "front" },
  { key: "tire_rl", label: "Rear left tire", side: "left", zone: "rear" },
  { key: "tire_rr", label: "Rear right tire", side: "right", zone: "rear" },
];

// Turns raw readings into warnings tied to the side of the van they sit on,
// so the stage can turn to the fault and light that flank red.
export function siteWarnings(status) {
  if (!status) return [];
  const found = [];

  TIRES.forEach((tire) => {
    const psi = Number(status[tire.key]);
    if (!Number.isFinite(psi) || psi >= TIRE_MIN_PSI) return;
    found.push({
      id: tire.key,
      title: `${tire.label} pressure low`,
      detail: `${psi.toFixed(0)} PSI · min ${TIRE_MIN_PSI} PSI`,
      side: tire.side,
      zone: tire.zone,
      severity: psi < TIRE_MIN_PSI - 6 ? "critical" : "warning",
    });
  });

  const fuel = Number(status.fuel_percent);
  if (Number.isFinite(fuel) && fuel < FUEL_MIN_PERCENT) {
    found.push({
      id: "fuel_level",
      title: "Fuel level low",
      detail: `${fuel.toFixed(0)}% · about ${Math.round((fuel / 100) * FUEL_CAPACITY_GAL)} gal left`,
      side: "left",
      zone: "fuel",
      severity: fuel < 7 ? "critical" : "warning",
    });
  }

  const pad = heatPad(status);
  if (pad.fault) {
    found.push({
      id: "tank_heater",
      title: "Fresh water heat pad fault",
      detail: pad.temp !== null
        ? `Pad beneath the spare-tire tank · last read ${pad.temp.toFixed(1)}°F`
        : "Pad beneath the spare-tire tank · not responding",
      side: "left",
      zone: "underbody",
      severity: "warning",
    });
  }

  return found;
}

export const tires = (status) =>
  TIRES.map((tire) => ({ ...tire, psi: Number(status?.[tire.key]) })).filter((tire) =>
    Number.isFinite(tire.psi)
  );