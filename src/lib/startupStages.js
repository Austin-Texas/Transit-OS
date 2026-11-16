// Timeline for the cinematic TransitOS boot sequence (milliseconds).
// One continuous scene: symbol, company reveal, presents + vehicle, then the
// initialization panel, then the dashboard.
export const STARTUP_STAGES = [
  { id: "symbol", at: 0 },
  { id: "brand", at: 1400 },
  { id: "presents", at: 2900 },
  { id: "boot", at: 4400 },
];

export const STARTUP_TOTAL_MS = 6400;
export const STARTUP_EXIT_MS = 700;

// Realistic rendered white high-roof cargo van (no badges).
export const VAN_RENDER_URL =
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/c53e64f5f_generated_image.png";