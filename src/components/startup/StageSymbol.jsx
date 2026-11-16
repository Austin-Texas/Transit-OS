import { motion } from "framer-motion";
import TpmcsMark from "./TpmcsMark";
import FloorRings from "./FloorRings";

// Stage 1 — the mark emerges over a bright circular platform, blue flares
// cutting across a black reflective surface.
export default function StageSymbol() {
  return (
    <motion.div
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative grid place-items-center">
        <motion.span
          className="pointer-events-none absolute h-[380px] w-[380px] rounded-full blur-[70px] sm:h-[460px] sm:w-[460px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.42), rgba(74,58,255,0.26) 52%, transparent 74%)",
          }}
          animate={{ opacity: [0.55, 1, 0.55], scale: [0.94, 1.06, 0.94] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.span
          className="pointer-events-none absolute h-[2px] w-[300px] rounded-full sm:w-[520px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(150,215,255,0.95), transparent)",
            boxShadow: "0 0 26px rgba(90,170,255,0.8)",
          }}
          initial={{ scaleX: 0.2, opacity: 0 }}
          animate={{ scaleX: 1, opacity: [0, 0.85, 0.4] }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <motion.span
          className="pointer-events-none absolute h-[80px] w-[300px] rounded-full blur-[24px] sm:w-[420px]"
          style={{ background: "radial-gradient(closest-side, rgba(74,130,255,0.45), transparent)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          style={{ perspective: 900 }}
          initial={{ scale: 0.55, opacity: 0, rotateX: 26, y: 18 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <TpmcsMark className="relative h-[130px] w-[156px] sm:h-[176px] sm:w-[212px]" />
        </motion.div>
      </div>

      {/* the bright platform and its rings */}
      <div className="relative mt-4 h-24 w-[300px] sm:w-[420px]">
        <span
          className="absolute inset-x-[10%] top-1/2 h-16 -translate-y-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(190,250,255,0.9), rgba(0,240,255,0.45) 45%, rgba(74,58,255,0.2) 70%, transparent 82%)",
            filter: "blur(9px)",
          }}
        />
        <motion.span
          className="absolute inset-x-[24%] top-1/2 h-4 -translate-y-1/2 rounded-[50%] bg-cyan-100/80 blur-[5px]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloorRings className="inset-x-[12%] top-1/2 h-16 -translate-y-1/2" color="0, 240, 255" count={3} />
      </div>
    </motion.div>
  );
}