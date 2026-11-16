import { motion } from "framer-motion";
import TpmcsMark from "./TpmcsMark";

// Stage 2 — the same mark, now with the TPMCS wordmark beneath it.
export default function StageBrand() {
  return (
    <motion.div
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <span
          className="pointer-events-none absolute inset-[-40%] -z-10 rounded-full blur-[46px]"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.3), transparent 70%)" }}
        />
        <TpmcsMark className="h-[92px] w-[112px] sm:h-[118px] sm:w-[142px]" />
      </motion.div>

      <motion.h1
        className="mt-8 text-[38px] font-medium uppercase leading-none tracking-[0.42em] text-white sm:text-[58px] sm:tracking-[0.48em]"
        style={{ textShadow: "0 0 34px rgba(180,240,255,0.35)" }}
        initial={{ opacity: 0, letterSpacing: "0.9em", y: 8 }}
        animate={{ opacity: 1, letterSpacing: "0.42em", y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        TPMCS
      </motion.h1>
    </motion.div>
  );
}