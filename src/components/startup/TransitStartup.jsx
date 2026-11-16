import { useEffect, useState } from "react";
import "./TransitStartup.css";

const MINIMUM_MS = 5500;
const STAGES = ["symbol", "company", "presents", "vehicle", "initializing"];

/** Full-page cinematic visual sequence. No claims of vehicle hardware connectivity. */
export default function TransitStartup({ children }) {
  const [elapsed, setElapsed] = useState(0);
  const [documentReady, setDocumentReady] = useState(false);

  useEffect(() => {
    const started = performance.now();
    let timer;
    const tick = () => {
      const ms = performance.now() - started;
      setElapsed(ms);
      if (ms < MINIMUM_MS) timer = window.setTimeout(tick, 40);
    };
    const onLoad = () => setDocumentReady(true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    tick();
    return () => { window.clearTimeout(timer); window.removeEventListener("load", onLoad); };
  }, []);

  const complete = elapsed >= MINIMUM_MS && documentReady;
  const stage = STAGES[Math.min(4, Math.floor(elapsed / 1000))];
  const percent = Math.min(100, Math.max(0, Math.round((elapsed - 4000) / 15)));
  return (
    <>
      <div className={complete ? "transit-app transit-app--visible" : "transit-app transit-app--hidden"} aria-hidden={!complete} inert={!complete ? true : undefined}>{children}</div>
      {!complete && (
        <section className={"transit-startup transit-startup--" + stage} role="status" aria-label="TPMCS TransitOS visual startup sequence">
          <div className="transit-startup__aura" aria-hidden="true" />
          <div className="transit-startup__rays" aria-hidden="true" />
          <div className="transit-startup__floor" aria-hidden="true" />
          <div className="transit-startup__ring transit-startup__ring--one" aria-hidden="true" />
          <div className="transit-startup__ring transit-startup__ring--two" aria-hidden="true" />
          <div className="transit-startup__orbit" aria-hidden="true" />
          <div className="transit-startup__content">
            {elapsed < 2000 && (
              <div className="transit-startup__logo-scene" key={stage}>
                <img src="/branding/tpmcs-logo.svg" alt="TPMCS original company symbol" />
                {elapsed >= 1000 && <div className="transit-startup__company">TPMCS</div>}
              </div>
            )}
            {elapsed >= 2000 && elapsed < 4000 && (
              <div className="transit-startup__reveal" key={stage}>
                <div className="transit-startup__mini-brand"><img src="/branding/tpmcs-logo.svg" alt="" /><strong>TPMCS</strong></div>
                <div className="transit-startup__presents">PRESENTS</div>
                <h1 className="transit-startup__title">Transit<span>OS</span></h1>
                {elapsed >= 3000 && <>
                  <p className="transit-startup__tagline">INTELLIGENT VEHICLE OPERATING SYSTEM</p>
                  <div className="transit-startup__vehicle"><div className="transit-startup__vehicle-glow" /><img src="/branding/transit-van.svg" alt="White unbranded high-roof cargo van" /></div>
                </>}
              </div>
            )}
            {elapsed >= 4000 && (
              <div className="transit-startup__initialize" key="initialize">
                <h1 className="transit-startup__title">Transit<span>OS</span></h1>
                <p className="transit-startup__initial-label">SYSTEM INITIALIZATION</p>
                <div className="transit-startup__panel">
                  <div className="transit-startup__panel-heading"><span className="transit-startup__gear" aria-hidden="true">⚙</span><span>{documentReady ? "Preparing TransitOS…" : "Loading dashboard…"}</span></div>
                  <div className="transit-startup__progress-row"><div className="transit-startup__progress"><div style={{ width: percent + "%" }} /></div><strong>{percent}%</strong></div>
                </div>
                <small className="transit-startup__disclaimer">DEMO STARTUP · VEHICLE HARDWARE NOT CONNECTED</small>
              </div>
            )}
          </div>
          <div className="transit-startup__bottom">TPMCS <span>•</span> TRANSITOS</div>
        </section>
      )}
    </>
  );
}
