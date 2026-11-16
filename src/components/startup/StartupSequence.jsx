import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { STARTUP_EXIT_MS, STARTUP_TOTAL_MS } from "@/lib/startupStages";
import StartupWebGL from "./StartupWebGL";
import StageBoot from "./StageBoot";
import ReferenceFrames from "./ReferenceFrames";

// The cinematic startup: a WebGL scene for the symbol, the reveal and the van,
// then the initialization interface, then a fade into the dashboard.
export default function StartupSequence({ onDone }) {
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState("webgl");
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (reduced) {
      setMode("static");
      const timer = setTimeout(() => setClosing(true), 900);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const timer = setTimeout(() => setClosing(true), STARTUP_TOTAL_MS);
    return () => {
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

  if (mode === "static") {
    return (
      <motion.div
        className="fixed inset-0 z-[130] grid place-items-center bg-[#01040d]"
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: STARTUP_EXIT_MS / 1000 }}
      >
        <div className="flex flex-col items-center gap-6">
          <img src="/branding/tpmcs-logo.svg" alt="TPMCS" className="h-40 w-auto" />
          <span className="text-[13px] font-semibold uppercase tracking-[0.4em] text-white/70">TransitOS</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden bg-[#01040d]"
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: STARTUP_EXIT_MS / 1000, ease: "easeInOut" }}
    >
      <StartupWebGL
        onStage={setStage}
        onFail={() => {
          setMode("static");
          setClosing(true);
        }}
      />

      {stage < 4 ? <ReferenceFrames /> : null}

      <motion.div
        className="absolute inset-0 bg-[#01040d]/92"
        initial={false}
        animate={{ opacity: stage >= 4 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ pointerEvents: stage >= 4 ? "auto" : "none" }}
      >
        {stage >= 4 ? <StageBoot /> : null}
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