import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STARTUP_EXIT_MS, STARTUP_STAGES, STARTUP_TOTAL_MS } from "@/lib/startupStages";
import ParticleCanvas from "./ParticleCanvas";
import StageSymbol from "./StageSymbol";
import StageBrand from "./StageBrand";
import StagePresents from "./StagePresents";
import StageVehicle from "./StageVehicle";
import StageBoot from "./StageBoot";

const VIEWS = [StageSymbol, StageBrand, StagePresents, StageVehicle, StageBoot];

// The full cinematic startup: six short beats, then a fade into the dashboard.
export default function StartupSequence({ onDone }) {
  const [stage, setStage] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const timers = STARTUP_STAGES.slice(1).map((entry, index) => setTimeout(() => setStage(index + 1), entry.at));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const closeTimer = setTimeout(() => setClosing(true), reduced ? 400 : STARTUP_TOTAL_MS);
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

  const Stage = VIEWS[stage];

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden bg-[#03040a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: STARTUP_EXIT_MS / 1000, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 620px at 50% 16%, rgba(0,120,200,0.20), transparent 62%), radial-gradient(780px 540px at 80% 86%, rgba(112,0,255,0.22), transparent 66%), linear-gradient(180deg, #05060d 0%, #03040a 60%, #02030a 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgba(120,220,255,0.55) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(70% 60% at 50% 45%, black, transparent 82%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 45%, black, transparent 82%)",
        }}
      />
      <ParticleCanvas className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "linear-gradient(180deg, transparent, rgba(0,240,255,0.07) 62%, rgba(112,0,255,0.12))" }}
      />

      <div className="relative z-10 h-full w-full">
        <AnimatePresence>
          <div key={stage} className="absolute inset-0 flex items-center justify-center px-5 sm:px-8">
            <Stage />
          </div>
        </AnimatePresence>
      </div>

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