import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STARTUP_CHECKS, runStartupChecks } from "@/lib/startupReadiness";
import "./StartupPremium.css";

const initial = Object.fromEntries(STARTUP_CHECKS.map(item => [item.id, "pending"]));
const finished = value => ["ready", "offline", "simulated", "error"].includes(value);
const MIN_MS = 6500;
const EXIT_MS = 650;

export default function StartupSequence({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [checks, setChecks] = useState(initial);
  const [closing, setClosing] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const started = useRef(0);

  useEffect(() => {
    const abort = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    started.current = performance.now();
    let raf;
    const tick = now => { setElapsed(now - started.current); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    runStartupChecks((id, status) => {
      if (!abort.signal.aborted) setChecks(current => ({ ...current, [id]: status }));
    }, abort.signal).catch(() => {
      if (!abort.signal.aborted) setChecks(current => ({ ...current, application: "error" }));
    });
    return () => {
      abort.abort();
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const complete = STARTUP_CHECKS.every(item => finished(checks[item.id]));
  const ready = STARTUP_CHECKS.filter(item => finished(checks[item.id])).length;
  const stage = elapsed < 1100 ? 0 : elapsed < 2200 ? 1 : elapsed < 3300 ? 2 : elapsed < 4600 ? 3 : 4;
  useEffect(() => {
    if (complete && elapsed >= MIN_MS && !closing) setClosing(true);
  }, [complete, elapsed, closing]);
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => doneRef.current?.(), EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing]);

  const hardware = checks.controller === "ready" && checks.sensors === "ready"
    ? "VEHICLE CONNECTED" : checks.controller === "simulated" || checks.sensors === "simulated"
      ? "SIMULATION MODE" : "WEB LAB · HARDWARE NOT CONNECTED";

  return (
    <motion.div className={"tp-boot tp-boot--" + stage} initial={false}
      animate={{ opacity: closing ? 0 : 1 }} transition={{ duration: EXIT_MS / 1000 }}
      role="status" aria-label="TransitOS startup">
      <div className="tp-boot__grain" aria-hidden="true" />
      <div className="tp-boot__aurora" aria-hidden="true" />
      <div className="tp-boot__horizon" aria-hidden="true" />
      <div className="tp-boot__platform" aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className="tp-boot__center">
        <div className="tp-boot__identity">
          <div className="tp-boot__mark">
            <img src="/branding/tpmcs-logo.svg" alt="TPMCS official logo" />
          </div>
          <span className="tp-boot__company">T P M C S</span>
        </div>
        <div className="tp-boot__title">
          <span className="tp-boot__eyebrow">TPMCS PRESENTS</span>
          <h1>Transit<span>OS</span></h1>
          <p>INTELLIGENT VEHICLE OPERATING SYSTEM</p>
        </div>
        <div className="tp-boot__cinematic" aria-hidden="true">
          <div className="tp-boot__cinematic-orbit tp-boot__cinematic-orbit--cyan" />
          <div className="tp-boot__cinematic-orbit tp-boot__cinematic-orbit--violet" />
          <div className="tp-boot__cinematic-flare" />
          <div className="tp-boot__cinematic-sweep" />
          <span className="tp-boot__cinematic-caption">ENGINEERED BY TPMCS</span>
        </div>
        <div className="tp-boot__status">
          <div className="tp-boot__status-head"><span>INITIALIZING TRANSITOS</span><span>{Math.round(ready / STARTUP_CHECKS.length * 100)}%</span></div>
          <div className="tp-boot__track"><div style={{ width: (ready / STARTUP_CHECKS.length * 100) + "%" }} /></div>
          <div className="tp-boot__checks">
            {STARTUP_CHECKS.map(item => <div key={item.id}>
              <span>{item.label}</span>
              <strong className={"tp-boot__state--" + checks[item.id]}>{checks[item.id]}</strong>
            </div>)}
          </div>
          <small>{hardware}</small>
        </div>
      </div>
      <div className="tp-boot__corner tp-boot__corner--left">TPMCS / TRANSITOS</div>
      <div className="tp-boot__corner tp-boot__corner--right">SYSTEM STARTUP</div>
      <button className="tp-boot__skip" type="button" onClick={() => setClosing(true)}>Skip intro</button>
    </motion.div>
  );
}
