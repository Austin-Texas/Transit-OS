import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import CinematicLightField from "./CinematicLightField";
import VanIgnition from "./VanIgnition";
import SystemBootList from "./SystemBootList";
import { STARTUP_CHECKS, runStartupChecks } from "@/lib/startupReadiness";
import "./StartupCinema.css";

// The six scenes and when each one takes over (milliseconds on one clock).
const SCENES = ["brand", "nameplate", "product", "van", "systems", "ready"];
const SCENE_AT = [0, 1800, 3300, 4900, 7600];
const READY_AT = 13000;
const READY_HOLD = 1500;
const MAX_BOOT_WAIT = 19000;
const FADE_MS = 900;
// Light field strength per scene, so the artwork behind never fights the text.
const LIGHT = [0.5, 0.78, 0.85, 0.5, 0.46, 0.95];
// Systems scene progress is time-driven; a slow probe simply holds the bar.
const PROGRESS_FROM = SCENE_AT[4];

const INITIAL = Object.fromEntries(STARTUP_CHECKS.map((item) => [item.id, "pending"]));
const TERMINAL = new Set(["ready", "offline", "simulated", "error"]);

const sceneMotion = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.015 },
  transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] },
};

export default function StartupSequence({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [checks, setChecks] = useState(INITIAL);
  const [fading, setFading] = useState(false);
  const readySince = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Run the real readiness probes and drive one shared clock.
  useEffect(() => {
    const controller = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const started = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - started), 50);
    runStartupChecks((id, status) => {
      if (!controller.signal.aborted) setChecks((previous) => ({ ...previous, [id]: status }));
    }, controller.signal).catch(() => {
      if (!controller.signal.aborted) {
        setChecks((previous) =>
          Object.fromEntries(
            STARTUP_CHECKS.map((item) => [
              item.id,
              TERMINAL.has(previous[item.id]) ? previous[item.id] : "offline",
            ]),
          ),
        );
      }
    });
    return () => {
      controller.abort();
      clearInterval(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const complete = STARTUP_CHECKS.every((item) => TERMINAL.has(checks[item.id]));
  const timedOut = elapsed >= MAX_BOOT_WAIT;
  const inReady = elapsed >= READY_AT && (complete || timedOut);
  const scene = inReady
    ? 5
    : SCENE_AT.reduce((current, at, index) => (elapsed >= at ? index : current), 0);

  const progress = inReady
    ? 100
    : Math.round(Math.max(0, Math.min(96, ((elapsed - PROGRESS_FROM) / (READY_AT - PROGRESS_FROM)) * 96)));
  const systemsElapsed = Math.max(0, elapsed - PROGRESS_FROM);
  const offlineCount = STARTUP_CHECKS.filter((item) => checks[item.id] === "offline").length;

  useEffect(() => {
    if (!inReady || readySince.current !== null) return undefined;
    readySince.current = performance.now();
    const timer = setTimeout(() => setFading(true), READY_HOLD);
    return () => clearTimeout(timer);
  }, [inReady]);

  useEffect(() => {
    if (!fading) return undefined;
    const timer = setTimeout(() => onDoneRef.current?.(), FADE_MS);
    return () => clearTimeout(timer);
  }, [fading]);

  return (
    <motion.div
      className="cin"
      initial={false}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      role="status"
      aria-label="TransitOS startup sequence"
    >
      <CinematicLightField intensity={LIGHT[scene]} floor={scene >= 3} />
      <div className="cin__wash" aria-hidden="true" />

      <AnimatePresence>
        <motion.div key={SCENES[scene]} className="cin__stage" {...sceneMotion}>
          {scene === 0 && (
            <div className="cin__scene">
              <img className="cin__mark" src="/branding/tpmcs-logo.svg" alt="TPMCS logo" />
              <div className="cin__brand">TPMCS</div>
              <div className="cin__rule">
                <i />
                PRESENTS
                <i />
              </div>
            </div>
          )}

          {scene === 1 && (
            <div className="cin__scene">
              <div className="cin__wordmark">TPMCS</div>
              <div className="cin__tagline">POWERING A SMARTER TOMORROW</div>
            </div>
          )}

          {scene === 2 && (
            <div className="cin__scene cin__product">
              <h1>
                Transit<span>OS</span>
              </h1>
              <p>INTELLIGENT VEHICLE OPERATING SYSTEM</p>
            </div>
          )}

          {scene === 3 && (
            <div className="cin__scene">
              <VanIgnition />
              <motion.div
                className="cin__caption"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4, duration: 0.8 }}
              >
                CABIN ILLUMINATION ONLINE
              </motion.div>
            </div>
          )}

          {scene === 4 && (
            <div className="cin__scene cin__systems">
              <h2>
                SYSTEM <span>INITIALIZATION</span>
              </h2>
              <p className="cin__sub">BRINGING CABIN AND VEHICLE SYSTEMS ONLINE</p>
              <div className="cin__panel">
                <div className={`cin__label${progress >= 99 ? " is-ready" : ""}`}>
                  <span className="cin__pulse" aria-hidden="true" />
                  {progress >= 99 ? "TransitOS ready" : "Initializing TransitOS"}
                </div>
                <div className="cin__bar-row">
                  <div
                    className="cin__bar"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="TransitOS startup progress"
                  >
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <strong className="cin__pct">{progress}%</strong>
                </div>
                <SystemBootList checks={checks} elapsed={systemsElapsed} />
              </div>
            </div>
          )}

          {scene === 5 && (
            <div className="cin__scene cin__ready">
              <motion.div
                className="cin__check"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.3, 1.5, 0.5, 1] }}
              >
                <Check className="h-8 w-8" strokeWidth={2.6} />
              </motion.div>
              <h2>
                SYSTEM <span>READY</span>
              </h2>
              <p>TRANSITOS ONLINE</p>
              {offlineCount > 0 && (
                <div className="cin__note">
                  {offlineCount} vehicle link{offlineCount > 1 ? "s" : ""} offline · local dashboard mode
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button className="cin__skip" type="button" onClick={() => setFading(true)}>
        Skip intro
      </button>
    </motion.div>
  );
}