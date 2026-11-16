import { motion } from "framer-motion";
import TpmcsMark from "./poster/TpmcsMark";
import PosterVan from "./poster/PosterVan";
import PosterBackdrop from "./poster/PosterBackdrop";

const EASE = [0.22, 1, 0.36, 1];

// The brand frame, exactly as the reference: mark, lockup, wordmark and the
// van on its halo. One composition that builds up beat by beat.
export default function StartupPoster({ phase }) {
  const symbol = phase < 1;
  const lockup = phase >= 1;
  const reveal = phase >= 2;
  const van = phase >= 3;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 44%, #0d2544 0%, #071427 46%, #040a14 78%, #02060d 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: van ? 1 : 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <PosterBackdrop />
      </motion.div>

      {/* the mark alone, on the dark */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={false}
        animate={{ opacity: symbol ? 1 : 0, scale: symbol ? 1 : 1.22 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="relative">
          <div
            className="absolute -inset-20 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(34,214,255,0.32), transparent 68%)" }}
          />
          <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
            <TpmcsMark className="h-[96px] w-auto drop-shadow-[0_0_42px_rgba(34,214,255,0.6)]" />
          </motion.div>
        </div>
      </motion.div>

      {/* brand lockup */}
      <motion.div
        className="absolute left-1/2 top-[8%] flex -translate-x-1/2 flex-col items-center gap-3"
        initial={false}
        animate={{ opacity: lockup ? 1 : 0, y: lockup ? 0 : 16 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <TpmcsMark className="h-[26px] w-auto drop-shadow-[0_0_18px_rgba(34,214,255,0.5)]" />
          <span className="pr-[0.34em] text-[22px] font-semibold tracking-[0.34em] text-white">TPMCS</span>
        </div>
        <motion.span
          initial={false}
          animate={{ opacity: reveal ? 1 : 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="pr-[0.55em] text-[10px] font-semibold uppercase tracking-[0.55em] text-white/55"
        >
          Presents
        </motion.span>
      </motion.div>

      {/* wordmark and tagline */}
      <motion.div
        className="absolute left-1/2 top-[27%] flex w-full -translate-x-1/2 flex-col items-center px-6 text-center"
        initial={false}
        animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 22 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="relative">
          <div
            className="absolute -inset-x-24 -inset-y-10 blur-3xl"
            style={{ background: "radial-gradient(55% 120% at 50% 55%, rgba(0,196,255,0.34), transparent 72%)" }}
          />
          <h1 className="relative text-[clamp(30px,5.6vw,62px)] font-bold leading-none tracking-[-0.02em] text-white">
            Transit
            <span className="text-[#00e6ff]" style={{ textShadow: "0 0 28px rgba(0,230,255,0.7)" }}>
              OS
            </span>
          </h1>
        </div>
        <motion.p
          initial={false}
          animate={{ opacity: van ? 1 : 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-5 pr-[0.4em] text-[clamp(8px,1vw,11px)] font-medium uppercase tracking-[0.4em] text-white/70"
        >
          Intelligent vehicle operating system
        </motion.p>
      </motion.div>

      {/* the van, sitting on its halo */}
      <motion.div
        className="absolute bottom-[11%] left-1/2 w-[min(56vw,560px)] -translate-x-1/2"
        initial={false}
        animate={{ opacity: van ? 1 : 0, y: van ? 0 : 30, scale: van ? 1 : 0.95 }}
        transition={{ duration: 1.5, ease: EASE }}
      >
        <PosterVan className="h-auto w-full" />
      </motion.div>
    </div>
  );
}