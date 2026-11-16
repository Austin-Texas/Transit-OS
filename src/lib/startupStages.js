// Timeline for the cinematic TransitOS boot sequence (milliseconds).
export const STARTUP_STAGES = [
  { id: "symbol", at: 0 },
  { id: "brand", at: 1200 },
  { id: "presents", at: 2300 },
  { id: "vehicle", at: 3400 },
  { id: "boot", at: 5000 },
];

export const STARTUP_TOTAL_MS = 6700;
export const STARTUP_EXIT_MS = 700;

// Rendered white high-roof cargo van used on the vehicle stage.
export const VAN_RENDER_URL =
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/c53e64f5f_generated_image.png";