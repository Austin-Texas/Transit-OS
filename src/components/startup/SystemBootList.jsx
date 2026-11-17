import { STARTUP_CHECKS } from "@/lib/startupReadiness";

// Plain-language names for the real readiness checks in startupReadiness.
const LABELS = {
  document: "Interface shell",
  assets: "Brand assets",
  application: "Dashboard core",
  controller: "Vehicle controller",
  sensors: "Vehicle sensors",
};

const STATE_TEXT = {
  pending: "queued",
  checking: "checking",
  ready: "online",
  simulated: "simulated",
  offline: "offline",
  error: "error",
};

// Rows reveal one by one as the initialization scene plays, each carrying the
// status its probe actually reported.
export default function SystemBootList({ checks, elapsed }) {
  return (
    <ul className="cin__rows">
      {STARTUP_CHECKS.map((item, index) => {
        const status = checks[item.id] ?? "pending";
        const shown = elapsed >= 420 + index * 260;
        return (
          <li
            key={item.id}
            className={`cin__row is-${status}${shown ? " is-shown" : ""}`}
          >
            <span className="cin__dot" />
            <span>{LABELS[item.id] ?? item.label}</span>
            <span className="cin__state">{STATE_TEXT[status] ?? status}</span>
          </li>
        );
      })}
    </ul>
  );
}