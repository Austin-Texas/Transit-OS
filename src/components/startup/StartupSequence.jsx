import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STARTUP_CHECKS, runStartupChecks } from "@/lib/startupReadiness";
import "./StartupPremium.css";

const initial = Object.fromEntries(STARTUP_CHECKS.map(check => [check.id, "pending"]));
const settled = status => ["ready", "offline", "simulated", "error"].includes(status);
const BEATS = [0, 1300, 2800, 4300, 6000];
const PROGRESS_START = 6000;
const PROGRESS_DURATION = 6500;
const MIN_DURATION = PROGRESS_START + PROGRESS_DURATION + 1100;
const EXIT_DURATION = 1200;

export default function StartupSequence({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [checks, setChecks] = useState(initial);
  const [closing, setClosing] = useState(false);
  const completed = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    const controller = new AbortController();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const began = performance.now();
    let raf;
    const tick = now => { setElapsed(now - began); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    runStartupChecks((id, status) => {
      if (!controller.signal.aborted) setChecks(previous => ({ ...previous, [id]: status }));
    }, controller.signal).catch(() => {
      if (!controller.signal.aborted) setChecks(previous => ({ ...previous, application: "error", controller: "offline", sensors: "offline" }));
    });
    return () => {
      controller.abort();
      cancelAnimationFrame(raf);
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  const stage = elapsed < BEATS[1] ? 0 : elapsed < BEATS[2] ? 1 : elapsed < BEATS[3] ? 2 : elapsed < BEATS[4] ? 3 : 4;
  const finished = STARTUP_CHECKS.every(item => settled(checks[item.id]));
  const ready = STARTUP_CHECKS.filter(item => settled(checks[item.id])).length;
  // Real checks are tracked independently; the display eases in over time so\n  // fast checks never make the progress bar jump or disappear immediately.\n  const checkPercent = Math.round(ready / STARTUP_CHECKS.length * 100);\n  const animationPercent = Math.round(Math.min(1, Math.max(0, (elapsed - PROGRESS_START) / PROGRESS_DURATION)) * 100);\n  const progress = Math.min(checkPercent, animationPercent);
  useEffect(() => {
    if (!completed.current && finished && elapsed >= MIN_DURATION) {
      completed.current = true;
      setClosing(true);
    }
  }, [finished, elapsed]);
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => onDoneRef.current?.(), EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [closing]);
  const hardware = checks.controller === "ready" && checks.sensors === "ready"
    ? "VEHICLE HARDWARE CONNECTED"
    : checks.controller === "simulated" || checks.sensors === "simulated"
      ? "SIMULATION MODE" : "WEB LAB · HARDWARE OFFLINE";

  return (
    <motion.div className={`tp-cinema tp-cinema--${stage}`} initial={false}
      animate={{ opacity: closing ? 0 : 1 }} transition={{ duration: EXIT_DURATION / 1000, ease: "easeInOut" }}
      role="status" aria-label="TPMCS TransitOS cinematic startup">
      <div className="tp-cinema__grain" aria-hidden="true" />
      <div className="tp-cinema__atmosphere" aria-hidden="true" />
      <div className="tp-cinema__floor" aria-hidden="true" />
      <div className="tp-cinema__beams" aria-hidden="true"><i/><i/><i/><i/><i/></div>
      <div className="tp-cinema__ring" aria-hidden="true"><i/><i/><i/></div>
      <div className="tp-cinema__streak tp-cinema__streak--blue" aria-hidden="true" />
      <div className="tp-cinema__streak tp-cinema__streak--violet" aria-hidden="true" />
      <div className="tp-cinema__brand">
        <img className="tp-cinema__symbol" src="/branding/tpmcs-logo.svg" alt="TPMCS company logo" />
        <div className="tp-cinema__company">TPMCS</div>
      </div>
      <div className="tp-cinema__presentation">
        <div className="tp-cinema__presented-by"><img src="/branding/tpmcs-logo.svg" alt="" /><span>TPMCS</span></div>
        <div className="tp-cinema__presents"><i/>PRESENTS<i/></div>
        <h1>Transit<span>OS</span></h1>
        <p>INTELLIGENT VEHICLE OPERATING SYSTEM</p>
      </div>
      <div className="tp-cinema__initialize">
        <h2>Transit<span>OS</span></h2>
        <p>SYSTEM INITIALIZATION</p>
        <div className="tp-cinema__init-panel">
          <div className="tp-cinema__init-label"><span className="tp-cinema__gear" aria-hidden="true">⚙</span><span>Initializing TransitOS...</span></div>
          <div className="tp-cinema__progress-row"><div className="tp-cinema__progress-track"><div style={{ width: progress + "%" }} /></div><strong>{progress}%</strong></div>
          <div className="tp-cinema__checks">
            {STARTUP_CHECKS.map(item => <div key={item.id}><span>{item.label}</span><b className={"tp-cinema__check--" + checks[item.id]}>{checks[item.id]}</b></div>)}
          </div>
          <small>{hardware}</small>
        </div>
      </div>
      <div className="tp-cinema__footer"><span>TPMCS / TRANSITOS</span><span>INTELLIGENT SYSTEM STARTUP</span></div>
      <button className="tp-cinema__skip" type="button" onClick={() => setClosing(true)}>Skip intro</button>
    </motion.div>
  );
}
