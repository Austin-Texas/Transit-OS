import { useEffect, useState } from "react";
import "./TransitStartup.css";

/**
 * Visual-only boot sequence for the public demo. It makes no hardware claims.
 * Mounted at the application root so internal route navigation does not replay it.
 */
export default function TransitStartup({ children }) {
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const started = performance.now();
    let timer;
    const tick = () => {
      const ms = performance.now() - started;
      setElapsed(ms);
      if (ms < 5000) timer = window.setTimeout(tick, 70);
    };
    tick();
    const loaded = () => setReady(true);
    if (document.readyState === "complete") loaded();
    else window.addEventListener("load", loaded, { once: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("load", loaded); };
  }, []);
  const done = elapsed >= 5000 && ready;
  return (
    <>
      <div className={done ? "transit-app transit-app--visible" : "transit-app transit-app--hidden"} aria-hidden={!done} inert={!done ? true : undefined}>{children}</div>
      {!done && (
        <div className="transit-startup" role="status" aria-live="off" aria-label="TransitOS starting">
          <div className="transit-startup__ambient" aria-hidden="true" />
          <div className="transit-startup__center">
            <div className={"transit-startup__brand " + (elapsed < 1000 ? "transit-startup__brand--intro" : "")}>
              <img src="/branding/tpmcs-logo.svg" alt="TPMCS company symbol" />
              <strong>TPMCS</strong>
            </div>
            {elapsed >= 2000 && elapsed < 4000 && <div className="transit-startup__present"><span>PRESENTS</span><h1>Transit<span>OS</span></h1></div>}
            {elapsed >= 3000 && elapsed < 4000 && <div className="transit-startup__van"><img src="/branding/transit-van.svg" alt="White unbranded cargo van illustration" /></div>}
            {elapsed >= 4000 && <div className="transit-startup__loading">
              <h1>Transit<span>OS</span></h1>
              <p>{ready ? "Preparing dashboard…" : "Loading application…"}</p>
              <div className="transit-startup__track" aria-hidden="true"><div style={{ width: `${Math.min(100, ((elapsed - 4000) / 1000) * 100)}%` }} /></div>
              <small>{ready && elapsed >= 5000 ? "Opening dashboard…" : "Visual startup demonstration · No vehicle hardware connected"}</small>
            </div>}
          </div>
          <div className="transit-startup__foot">TPMCS · TRANSITOS</div>
        </div>
      )}
    </>
  );
}
