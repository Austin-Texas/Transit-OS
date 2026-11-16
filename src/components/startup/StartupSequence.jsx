import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STARTUP_CHECKS, runStartupChecks } from "@/lib/startupReadiness";
import "./StartupLive.css";

const MIN_VISUAL_MS = 5200;
const EXIT_MS = 550;
const initial = Object.fromEntries(STARTUP_CHECKS.map(check => [check.id, "pending"]));
const isTerminal = status => ["ready", "offline", "simulated", "error"].includes(status);

export default function StartupSequence({ onDone }) {
  const [checks, setChecks] = useState(initial);
  const [elapsed, setElapsed] = useState(0);
  const [closing, setClosing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const checksRef = useRef(initial);
  const startRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    setReducedMotion(reduced);
    startRef.current = performance.now();
    const interval = window.setInterval(() => setElapsed(performance.now() - startRef.current), 60);
    const update = (id, status) => {
      if (controller.signal.aborted) return;
      checksRef.current = { ...checksRef.current, [id]: status };
      setChecks(checksRef.current);
    };
    runStartupChecks(update, controller.signal).catch(() => {
      if (!controller.signal.aborted) update("application", "error");
    });
    return () => {
      controller.abort();
      window.clearInterval(interval);
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  const requiredComplete = STARTUP_CHECKS.filter(check => check.required)
    .every(check => isTerminal(checks[check.id]));
  const optionalComplete = STARTUP_CHECKS.filter(check => !check.required)
    .every(check => isTerminal(checks[check.id]));
  const allComplete = requiredComplete && optionalComplete;
  const minDuration = reducedMotion ? 1000 : MIN_VISUAL_MS;
  const canExit = elapsed >= minDuration && allComplete;
  useEffect(() => {
    if (!canExit || closing) return;
    setClosing(true);
  }, [canExit, closing]);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => doneRef.current?.(), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  const readyCount = STARTUP_CHECKS.filter(check => isTerminal(checks[check.id])).length;
  const progress = Math.round((readyCount / STARTUP_CHECKS.length) * 100);
  const stage = reducedMotion ? 3 : elapsed < 1300 ? 0 : elapsed < 2500 ? 1 : elapsed < 3900 ? 2 : 3;
  const mode = useMemo(() => {
    if (checks.controller === "ready" && checks.sensors === "ready") return "VEHICLE CONNECTED";
    if (checks.controller === "simulated" || checks.sensors === "simulated") return "SIMULATION MODE";
    return "WEB LAB · VEHICLE HARDWARE OFFLINE";
  }, [checks.controller, checks.sensors]);

  return (
    <motion.section className={"transit-live transit-live--stage-" + stage} role="status" aria-label="TransitOS startup"
      initial={false} animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000 }}>
      <div className="transit-live__halo" aria-hidden="true" />
      <div className="transit-live__rays" aria-hidden="true" />
      <div className="transit-live__ring transit-live__ring--outer" aria-hidden="true" />
      <div className="transit-live__ring transit-live__ring--inner" aria-hidden="true" />
      <div className="transit-live__scene">
        <div className={"transit-live__brand transit-live__brand--stage-" + stage}>
          <img src="/branding/tpmcs-logo.svg" alt="TPMCS original company logo" />
          <strong>TPMCS</strong>
        </div>
        <div className={"transit-live__product " + (stage >= 2 ? "transit-live__product--shown" : "")}>
          <p>TPMCS PRESENTS</p>
          <h1>Transit<span>OS</span></h1>
          <small>INTELLIGENT VEHICLE OPERATING SYSTEM</small>
        </div>
        <div className={"transit-live__vehicle " + (stage >= 2 ? "transit-live__vehicle--shown" : "")} aria-hidden={stage < 2}>
          <img src="/branding/transit-van.svg" alt="" />
          <div className="transit-live__vehicle-shadow" />
        </div>
        <div className={"transit-live__diagnostics " + (stage === 3 ? "transit-live__diagnostics--shown" : "")}>
          <h2>System Initialization</h2>
          <div className="transit-live__checks">
            {STARTUP_CHECKS.map(check => (
              <div className="transit-live__check" key={check.id}>
                <span>{check.label}</span>
                <span className={"transit-live__state transit-live__state--" + checks[check.id]}>{checks[check.id]}</span>
              </div>
            ))}
          </div>
          <div className="transit-live__progress" aria-label={"Startup checks completed: " + progress + "%"}>
            <span style={{ width: progress + "%" }} />
          </div>
          <div className="transit-live__mode">{mode}</div>
          {!allComplete && <small>Checking application and available interfaces…</small>}
        </div>
      </div>
      <div className="transit-live__footer">TPMCS · TRANSITOS · LIVE STARTUP</div>
      <button type="button" className="transit-live__skip" onClick={() => setClosing(true)}>Skip intro</button>
    </motion.section>
  );
}
