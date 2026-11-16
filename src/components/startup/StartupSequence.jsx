import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STARTUP_EXIT_MS, STARTUP_TOTAL_MS } from "@/lib/startupStages";
import StageBoot from "./StageBoot";
import ReferenceFrames from "./ReferenceFrames";

// Only ONE visual source is displayed at a time. The previous WebGL layer
// was visible beneath the artwork and produced the oversized ring/van.
export default function StartupSequence({ onDone }) {
  const [elapsed, setElapsed] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    setReducedMotion(reduced);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const start = performance.now();
    let interval;
    if (!reduced) {
      interval = window.setInterval(() => {
        setElapsed(performance.now() - start);
      }, 50);
    }
    const timer = window.setTimeout(() => setClosing(true), reduced ? 900 : STARTUP_TOTAL_MS);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  useEffect(() => {
    if (!closing) return undefined;
    const timer = window.setTimeout(() => {
      setGone(true);
      doneRef.current?.();
    }, STARTUP_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  if (gone) return null;
  const booting = elapsed >= 6500;
  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden bg-[#010817]"
      initial={false}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: STARTUP_EXIT_MS / 1000, ease: "easeInOut" }}
    >
      {reducedMotion ? (
        <div className="absolute inset-0 grid place-items-center">
          <img src="/branding/tpmcs-logo.svg" alt="TPMCS" className="h-36 w-auto" />
        </div>
      ) : booting ? (
        <StageBoot />
      ) : (
        <ReferenceFrames elapsed={elapsed} />
      )}
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
