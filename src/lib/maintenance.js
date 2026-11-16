const DAY_MS = 24 * 3600 * 1000;

export const PART_CATEGORIES = [
  { value: "engine", label: "Engine" },
  { value: "brakes", label: "Brakes" },
  { value: "tires", label: "Tires" },
  { value: "fluids", label: "Fluids" },
  { value: "coach", label: "Coach" },
  { value: "electrical", label: "Electrical" },
  { value: "safety", label: "Safety" },
];

const num = (value) =>
  value === null || value === undefined || value === "" ? null : Number(value);

const positive = (value) => {
  const parsed = num(value);
  return parsed !== null && Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const formatMiles = (value) => `${Math.round(Number(value) || 0).toLocaleString("en-US")} mi`;

// How far a part is through its service interval, read from the odometer and
// the date it was last serviced. A part alerts the moment either limit passes.
export function serviceState(item, odometer, now = Date.now()) {
  const intervalMiles = positive(item?.interval_miles);
  const intervalDays = positive(item?.interval_days);
  const lastMiles = num(item?.last_service_miles);
  const odometerMiles = num(odometer);

  const usedMiles =
    intervalMiles !== null && lastMiles !== null && odometerMiles !== null
      ? odometerMiles - lastMiles
      : null;
  const milesLeft = usedMiles !== null ? intervalMiles - usedMiles : null;

  const lastDate = item?.last_service_date ? new Date(item.last_service_date) : null;
  const elapsedDays =
    intervalDays !== null && lastDate && !Number.isNaN(lastDate.getTime())
      ? Math.floor((now - lastDate.getTime()) / DAY_MS)
      : null;
  const daysLeft = elapsedDays !== null ? intervalDays - elapsedDays : null;

  const milesShare = intervalMiles !== null && usedMiles !== null ? usedMiles / intervalMiles : 0;
  const daysShare = intervalDays !== null && elapsedDays !== null ? elapsedDays / intervalDays : 0;
  const progress = Math.max(0, Math.min(1, Math.max(milesShare, daysShare)));

  const due = (milesLeft !== null && milesLeft <= 0) || (daysLeft !== null && daysLeft <= 0);
  const soon =
    !due && ((milesLeft !== null && milesLeft <= 500) || (daysLeft !== null && daysLeft <= 30));

  return {
    intervalMiles,
    intervalDays,
    milesLeft,
    daysLeft,
    progress,
    due,
    soon,
    status: due ? "due" : soon ? "soon" : "ok",
  };
}

// The one line the list and the alert detail share.
export function remainingText(state) {
  if (state.due) {
    const parts = [];
    if (state.milesLeft !== null) {
      parts.push(state.milesLeft < 0 ? `${formatMiles(-state.milesLeft)} over` : "mileage reached");
    }
    if (state.daysLeft !== null) {
      parts.push(state.daysLeft < 0 ? `${-state.daysLeft}d over` : "date reached");
    }
    return parts.length ? parts.join(" · ") : "due now";
  }

  const parts = [];
  if (state.milesLeft !== null) parts.push(`${formatMiles(state.milesLeft)} left`);
  if (state.daysLeft !== null) parts.push(`${state.daysLeft}d left`);
  return parts.length ? parts.join(" · ") : "no interval set";
}

export function intervalText(item) {
  const parts = [];
  if (positive(item?.interval_miles) !== null) parts.push(`every ${formatMiles(item.interval_miles)}`);
  if (positive(item?.interval_days) !== null) parts.push(`every ${item.interval_days}d`);
  return parts.length ? parts.join(" or ") : "interval not set";
}