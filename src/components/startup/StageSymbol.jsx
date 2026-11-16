import { motion } from "framer-motion";
import TpmcsMark from "./TpmcsMark";
import FloorRings from "./FloorRings";

// Stage 1 — the mark rises out of the dark above a pulsing neon floor.
export default function StageSymbol() {
  return (
    <motion.div
      key="symbol"
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.06 }}
      transition={{ duration: 0.55 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0.52, opacity: 0, rotateX: 30, y: 26 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d", perspective: 900 }}
      >
        <span
          className="absolute inset-[-28%] -z-10 rounded-full blur-[70px]"
          style={{ background: "radial-gradient(circle, rgba(0,240,255,0.34), rgba(112,0,255,0.18) 55%, transparent 72%)" }}
        />
        <TpmcsMark className="h-[168px] w-[168px] sm:h-[228px] sm:w-[228px]" />
        <motion.span
          className="absolute inset-0 overflow-hidden"
          style={{
            maskImage: "linear-gradient(105deg, transparent 38%, black 50%, transparent 62%)",
            WebkitMaskImage: "linear-gradient(105deg, transparent 38%, black 50%, transparent 62%)",
          }}
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
        >
          <span className="block h-full w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        </motion.span>
      </motion.div>

      <div className="relative mt-10 h-20 w-[300px] sm:w-[420px]">
        <span
          className="absolute inset-x-6 top-1/2 h-10 -translate-y-1/2 rounded-[50%] blur-2xl"
          style={{ background: "radial-gradient(closest-side, rgba(0,240,255,0.55), transparent)" }}
        />
        <FloorRings className="inset-x-0 top-1/2 h-16 -translate-y-1/2" color="0, 240, 255" count={3} />
      </div>
    </motion.div>
  );
}