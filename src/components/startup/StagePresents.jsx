import { motion } from "framer-motion";
import TpmcsMark from "./TpmcsMark";

// Stage 3 — small mark, PRESENTS between two rules, then the product name.
export default function StagePresents() {
  return (
    <motion.div
      className="relative flex w-full flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* purple and blue streaks arcing behind the type */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <motion.span
          className="absolute h-[210px] w-[560px] rounded-[50%] border-t-2 border-cyan-300/45 blur-[2px] sm:w-[760px]"
          style={{ rotate: "-7deg" }}
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.span
          className="absolute h-[230px] w-[600px] rounded-[50%] border-b-2 border-violet-400/45 blur-[2px] sm:w-[800px]"
          style={{ rotate: "8deg" }}
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TpmcsMark className="h-[42px] w-[52px] sm:h-[54px] sm:w-[66px]" />
      </motion.div>

      <motion.div
        className="relative mt-7 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.12 }}
      >
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-cyan-200/80 sm:w-24" />
        <span className="text-[10px] font-medium uppercase tracking-[0.62em] text-white/70 sm:text-[12px]">
          Presents
        </span>
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-cyan-200/80 sm:w-24" />
      </motion.div>

      <motion.h2
        className="relative mt-4 flex items-baseline text-[54px] font-semibold leading-none tracking-[-0.03em] sm:text-[86px]"
        initial={{ opacity: 0, y: 16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">Transit</span>
        <span
          className="bg-gradient-to-b from-cyan-200 via-cyan-400 to-cyan-600 bg-clip-text text-transparent"
          style={{ filter: "drop-shadow(0 0 26px rgba(0,240,255,0.6))" }}
        >
          OS
        </span>
      </motion.h2>
    </motion.div>
  );
}