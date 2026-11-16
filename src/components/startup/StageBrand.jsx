import { motion } from "framer-motion";
import TpmcsMark from "./TpmcsMark";
import FloorRings from "./FloorRings";

// Stage 2 — the company wordmark, lit from below by an energy ring.
export default function StageBrand() {
  return (
    <motion.div
      key="brand"
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.04 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <TpmcsMark className="h-12 w-12 sm:h-14 sm:w-14" />
      </motion.div>

      <div className="relative mt-6">
        <motion.h1
          className="relative bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-[42px] font-semibold leading-none tracking-[0.36em] text-transparent sm:text-[64px] sm:tracking-[0.42em]"
          initial={{ opacity: 0, letterSpacing: "0.9em", y: 10 }}
          animate={{ opacity: 1, letterSpacing: "0.36em", y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          TPMCS
        </motion.h1>
        <span
          className="pointer-events-none absolute inset-0 -z-10 select-none text-center text-[42px] font-semibold tracking-[0.36em] text-cyan-300/30 blur-xl sm:text-[64px]"
          aria-hidden="true"
        >
          TPMCS
        </span>
      </div>

      <motion.div
        className="relative mt-8 h-5 w-[260px] sm:w-[340px]"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.15 }}
      >
        <span
          className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.9), rgba(112,0,255,0.9), transparent)" }}
        />
        <FloorRings className="-inset-x-6 -top-4 h-12" color="112, 0, 255" count={2} delay={0.2} />
      </motion.div>

      <motion.p
        className="mt-3 text-[9px] uppercase tracking-[0.42em] text-white/35 sm:text-[10px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Advanced Vehicle Systems
      </motion.p>
    </motion.div>
  );
}