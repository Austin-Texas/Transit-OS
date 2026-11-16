import { motion } from "framer-motion";

// Stage 3 — TPMCS presents TransitOS, metallic type with a cyan OS.
export default function StagePresents() {
  return (
    <motion.div
      key="presents"
      className="flex w-full flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="text-[11px] font-medium uppercase tracking-[0.5em] text-white/55 sm:text-[13px]"
        initial={{ opacity: 0, letterSpacing: "0.9em" }}
        animate={{ opacity: 1, letterSpacing: "0.5em" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        TPMCS Presents
      </motion.p>

      <div className="relative mt-4 flex items-center justify-center gap-4 sm:gap-6">
        <motion.span
          className="h-px w-10 sm:w-24"
          style={{ background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.9))" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        />
        <motion.h2
          className="relative flex items-baseline text-[46px] font-semibold leading-none tracking-[-0.03em] sm:text-[76px]"
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">Transit</span>
          <span
            className="bg-gradient-to-b from-cyan-200 via-cyan-400 to-cyan-600 bg-clip-text text-transparent"
            style={{ filter: "drop-shadow(0 0 26px rgba(0,240,255,0.55))" }}
          >
            OS
          </span>
        </motion.h2>
        <motion.span
          className="h-px w-10 sm:w-24"
          style={{ background: "linear-gradient(270deg, transparent, rgba(112,0,255,0.9))" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        />
      </div>

      <motion.p
        className="mt-4 text-[9px] uppercase tracking-[0.38em] text-cyan-100/45 sm:text-[10px]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
      >
        Intelligent Vehicle Operating System
      </motion.p>
    </motion.div>
  );
}