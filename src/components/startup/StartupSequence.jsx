import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CinematicLightField from "./CinematicLightField";
import { STARTUP_CHECKS, runStartupChecks } from "@/lib/startupReadiness";
import "./StartupPremium.css";

const INITIAL = Object.fromEntries(STARTUP_CHECKS.map(item => [item.id, "pending"]));
const TERMINAL = new Set(["ready", "offline", "simulated", "error"]);
const MOVIE_LENGTH = 9000;
const MAX_BOOT_WAIT = 15000;
const FADE_MS = 1000;

export default function StartupSequence({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [checks, setChecks] = useState(INITIAL);
  const [closing, setClosing] = useState(false);
  const completed = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const controller = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const started = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - started), 50);
    runStartupChecks((id, status) => {
      if (!controller.signal.aborted) setChecks(previous => ({ ...previous, [id]: status }));
    }, controller.signal).catch(() => {
      if (!controller.signal.aborted) {
        setChecks(previous => Object.fromEntries(STARTUP_CHECKS.map(item =>
          [item.id, TERMINAL.has(previous[item.id]) ? previous[item.id] : "offline"])));
      }
    });
    return () => {
      controller.abort();
      clearInterval(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const stage = elapsed < 750 ? 0 : elapsed < 2250 ? 1 : elapsed < 3750 ? 2
    : elapsed < 4500 ? 3 : elapsed < 5250 ? 4 : elapsed < 6750 ? 5
    : elapsed < 8250 ? 6 : 7;
  const complete = STARTUP_CHECKS.every(item => TERMINAL.has(checks[item.id]));
  const readyCount = STARTUP_CHECKS.filter(item => TERMINAL.has(checks[item.id])).length;
  const visualProgress = Math.min(100, Math.max(0, (elapsed - 6750) / 1500 * 100));
  const progress = Math.round(Math.min(visualProgress, readyCount / STARTUP_CHECKS.length * 100));
  const timedOut = elapsed >= MAX_BOOT_WAIT;
  useEffect(() => {
    if (!completed.current && elapsed >= MOVIE_LENGTH && (complete || timedOut)) {
      completed.current = true;
      setClosing(true);
    }
  }, [elapsed, complete, timedOut]);
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => onDoneRef.current?.(), FADE_MS);
    return () => clearTimeout(timer);
  }, [closing]);

  const hardware = checks.controller === "ready" && checks.sensors === "ready"
    ? "VEHICLE SYSTEMS CONNECTED"
    : "VEHICLE HARDWARE OFFLINE · WEB LAB MODE";

  return (
    <motion.div className={`tp-movie tp-movie--${stage}`} initial={false}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      role="status" aria-label="TPMCS TransitOS startup">
      <CinematicLightField stage={stage} />
      <div className="tp-movie__veil" aria-hidden="true" />
      <div className="tp-movie__flare" aria-hidden="true" />
      <div className="tp-movie__tagline">POWERING A SMARTER TOMORROW</div>
      <div className="tp-movie__identity">
        <img src="/branding/tpmcs-logo.svg" alt="TPMCS company logo" />
        <div className="tp-movie__company">TPMCS</div>
        <div className="tp-movie__presents"><i />PRESENTS<i /></div>
      </div>
      <div className="tp-movie__product">
        <h1>Transit<span>OS</span></h1>
        <p>INTELLIGENT VEHICLE OPERATING SYSTEM</p>
      </div>
      <div className="tp-movie__initializing">
        <h2>Initializing Transit<span>OS</span>...</h2>
        <div className="tp-movie__progress"><div style={{ width: progress + "%" }} /></div>
        <strong>{progress}%</strong>
        <div className="tp-movie__tasks">
          {STARTUP_CHECKS.map(item => <div key={item.id}>
            <span className="tp-movie__task-icon">◇</span>
            <span>{item.label}</span>
            <small>{checks[item.id]}</small>
          </div>)}
        </div>
        <div className="tp-movie__hardware">{hardware}</div>
      </div>
      <div className="tp-movie__ready">
        <div className="tp-movie__check">✓</div>
        <h2>Transit<span>OS</span></h2>
        <p>READY</p>
      </div>
      <button className="tp-movie__skip" type="button" onClick={() => setClosing(true)}>Skip intro</button>
    </motion.div>
  );
}
