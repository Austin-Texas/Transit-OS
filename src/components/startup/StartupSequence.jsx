import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STARTUP_EXIT_MS, STARTUP_STAGES, STARTUP_TOTAL_MS } from "@/lib/startupStages";
import StartupScene from "./StartupScene";
import StageBoot from "./StageBoot";

// The full cinematic startup: one continuous scene, then the initialization
// panel, then a fade into the dashboard. Runs once per page load.
export default function StartupSequence({ onDone }) {
  const [phase, setPhase] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = reduced
      ? []
      : STARTUP_STAGES.slice(1).map((entry, index) =>
          setTimeout(() => setPhase(index + 1), entry.at),
        );
    const closeTimer = setTimeout(() => setClosing(true), reduced ? 700 : STARTUP_TOTAL_MS);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(closeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!closing) return undefined;
    const timer = setTimeout(() => {
      setGone(true);
      doneRef.current?.();
    }, STARTUP_EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing]);

  if (gone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden bg-[#01040d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: STARTUP_EXIT_MS / 1000, ease: "easeInOut" }}
    >
      <StartupScene phase={phase} />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {phase >= 3 ? <StageBoot /> : null}
      </motion.div>

      <button
        type="button"
        onClick={() => setClosing(true)}
        className="absolute bottom-5 right-5 z-20 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/45 backdrop-blur-xl transition hover:border-white/25 hover:text-white/80"
      >
        Skip intro
      </button>
    </motion.div>
  );
}