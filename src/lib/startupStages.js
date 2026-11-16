// Timeline for the cinematic TransitOS boot sequence (milliseconds).
// One second per beat, exactly as storyboarded: symbol, brand, presents,
// vehicle, initialization, then the dashboard.
export const STARTUP_STAGES = [
  { id: "symbol", at: 0 },
  { id: "brand", at: 1000 },
  { id: "presents", at: 2000 },
  { id: "vehicle", at: 3000 },
  { id: "boot", at: 4000 },
];

export const STARTUP_TOTAL_MS = 5000;
export const STARTUP_EXIT_MS = 650;

// Rendered white high-roof cargo van used on the vehicle stage.
export const VAN_RENDER_URL =
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/c53e64f5f_generated_image.png";