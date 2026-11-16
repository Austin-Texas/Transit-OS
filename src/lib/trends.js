export const METRICS = [
  { key: "battery", name: "House battery", short: "Battery", color: "#00f0ff" },
  { key: "fresh", name: "Fresh water", short: "Fresh", color: "#00ff41" },
  { key: "gray", name: "Gray water", short: "Gray", color: "#ff9500" },
  { key: "black", name: "Black water", short: "Black", color: "#ff3b30" },
  { key: "lpg", name: "Propane", short: "LPG", color: "#c084fc" },
];

export const METRIC_KEYS = METRICS.map((metric) => metric.key);

// The analytics window: seven days per step.
export const WINDOW_HOURS = 168;
export const MAX_OFFSET_DAYS = 28;