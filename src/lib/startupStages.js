// Shared timing for the cinematic startup. Target timings, overlapped in the
// scene so movement never stops between beats.
export const STARTUP_TOTAL_MS = 8000;
export const STARTUP_EXIT_MS = 650;

export const STAGES = [
  { id: "symbol", at: 0.0 },
  { id: "company", at: 1.5 },
  { id: "presents", at: 2.5 },
  { id: "vehicle", at: 4.0 },
  { id: "boot", at: 6.5 },
];

export const LOGO_SVG_URL = "/branding/tpmcs-logo.svg";

// Returns the stage index for a given elapsed time in seconds.
export function stageAt(seconds) {
  if (seconds < 1.5) return 0;
  if (seconds < 2.5) return 1;
  if (seconds < 4.0) return 2;
  if (seconds < 6.5) return 3;
  return 4;
}