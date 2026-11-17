// Startup checks reflect real browser/application readiness only.
// A hardware probe is optional and must return truthful statuses from a local gateway.
export const STARTUP_CHECKS = [
  { id: "document", label: "Browser document", required: true },
  { id: "assets", label: "TPMCS branding", required: true },
  { id: "application", label: "Dashboard application", required: true },
  { id: "controller", label: "Vehicle controller", required: false },
  { id: "sensors", label: "Vehicle sensors", required: false },
];

function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
function waitForDocument() {
  if (document.readyState !== "loading") return Promise.resolve();
  return new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
}
function preloadLogo() {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve("ready");
    image.onerror = () => resolve("error");
    image.src = "/branding/tpmcs-logo.svg";
  });
}
function probeOptional(path, signal) {
  return fetch(path, { cache: "no-store", signal, headers: { Accept: "application/json" } })
    .then(async response => {
      if (!response.ok) return "offline";
      const data = await response.json();
      // A 200 response is NOT proof that a physical controller is online.
      return data?.connected === true ? "ready" : data?.mode === "simulated" ? "simulated" : "offline";
    })
    .catch(() => "offline");
}
export async function runStartupChecks(report, signal) {
  const update = (id, status) => report(id, status);
  update("document", "checking");
  await waitForDocument();
  if (signal.aborted) return;
  update("document", "ready");
  update("assets", "checking");
  update("assets", await preloadLogo());
  if (signal.aborted) return;
  // The root route and dashboard component are already mounted behind this overlay.
  // This verifies the client app has had an opportunity to paint, not backend readiness.
  update("application", "checking");
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (signal.aborted) return;
  update("application", "ready");
  // These routes are deliberately optional; a missing API is reported offline.
  // A future Pi gateway can implement them without changing the startup UI.
  update("controller", "checking");
  update("sensors", "checking");
  const controller = await Promise.race([probeOptional("/api/vehicle/controller/health", signal), timeout(1600).then(() => "offline")]);
  if (signal.aborted) return;
  update("controller", controller);
  const sensors = await Promise.race([probeOptional("/api/vehicle/sensors/health", signal), timeout(1600).then(() => "offline")]);
  if (signal.aborted) return;
  update("sensors", sensors);
}