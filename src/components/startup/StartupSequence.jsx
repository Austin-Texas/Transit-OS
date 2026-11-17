import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TpmcsSplash from "./TpmcsSplash";
import { STARTUP_CHECKS, runStartupChecks } from "@/lib/startupReadiness";

const MIN_HOLD = 3600;
const MAX_BOOT_WAIT = 15000;
const FADE_MS = 900;

const INITIAL = Object.fromEntries(STARTUP_CHECKS.map((item) => [item.id, "pending"]));
const TERMINAL = new Set(["ready", "offline", "simulated", "error"]);

// The brand splash the app opens on: it holds while the real readiness probes
// run, then fades into the dashboard.
export default function StartupSequence({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [checks, setChecks] = useState(INITIAL);
  const [fading, setFading] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const controller = new AbortController();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const started = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - started), 60);
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
  const readyToLeave = (complete || elapsed >= MAX_BOOT_WAIT) && elapsed >= MIN_HOLD;

  useEffect(() => {
    if (readyToLeave) setFading(true);
  }, [readyToLeave]);

  useEffect(() => {
    if (!fading) return undefined;
    const timer = setTimeout(() => onDoneRef.current?.(), FADE_MS);
    return () => clearTimeout(timer);
  }, [fading]);

  return (
    <motion.div
      className="fixed inset-0 z-[80]"
      initial={false}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
      role="status"
      aria-label="TPMCS startup"
    >
      <TpmcsSplash />
      <button
        className="absolute bottom-6 right-6 text-[10.5px] font-medium uppercase tracking-[0.28em] text-white/30 transition hover:text-white/70"
        type="button"
        onClick={() => setFading(true)}
      >
        Skip
      </button>
    </motion.div>
  );
}