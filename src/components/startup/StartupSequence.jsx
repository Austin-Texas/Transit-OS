import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STAGES, STARTUP_EXIT_MS, STARTUP_TOTAL_MS } from "@/lib/startupStages";
import StageBoot from "./StageBoot";
import ReferenceFrames from "./ReferenceFrames";

// The cinematic startup: the approved nine-frame artwork plays the intro, then
// the initialization interface, then a fade into the dashboard.
export default function StartupSequence({ onDone }) {
  const [phase, setPhase] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reduced) {
      const timer = setTimeout(() => setClosing(true), 900);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const beacons = STAGES.slice(1).map((stage, index) =>
      setTimeout(() => setPhase(index + 1), stage.at * 1000),
    );
    const timer = setTimeout(() => setClosing(true), STARTUP_TOTAL_MS);

    return () => {
      beacons.forEach(clearTimeout);
      clearTimeout(timer);
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
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: STARTUP_EXIT_MS / 1000, ease: "easeInOut" }}
    >
      {phase < 4 ? <ReferenceFrames /> : null}

      <motion.div
        className="absolute inset-0 bg-[#01040d]/92"
        initial={false}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: phase >= 4 ? "auto" : "none" }}
      >
        {phase >= 4 ? <StageBoot /> : null}
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