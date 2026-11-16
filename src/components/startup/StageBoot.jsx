import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

const STEPS = ["Preparing interface", "Loading dashboard modules", "Restoring simulated session"];

// Stage 5 — glass initialization panel. Progress is the app booting only.
export default function StageBoot() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const duration = 1450;
    const tick = (now) => {
      const ratio = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - ratio, 2.1);
      setProgress(Math.round(eased * 100));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length))];

  return (
    <motion.div
      key="boot"
      className="w-full max-w-[520px]"
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.03 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_-20px_60px_-30px_rgba(0,240,255,0.5),0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-7">
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
        <span className="pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
        <span className="pointer-events-none absolute -right-16 top-8 h-36 w-36 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative flex items-baseline justify-between gap-3">
          <h2 className="flex items-baseline text-[26px] font-semibold tracking-tight text-white sm:text-[30px]">
            Transit<span className="text-cyan-300">OS</span>
          </h2>
          <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-white/35">System initialization</span>
        </div>

        <div className="relative mt-6 h-[10px] w-full overflow-hidden rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7000ff, #00c2ff 55%, #7df9ff)",
              boxShadow: "0 0 20px rgba(0,240,255,0.75)",
            }}
          />
        </div>

        <div className="relative mt-4 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2 text-[11.5px] text-white/55">
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}>
              <Cpu className="h-3.5 w-3.5 text-cyan-300" strokeWidth={2.2} />
            </motion.span>
            <span className="truncate">{step}…</span>
          </span>
          <span className="font-mono text-[13px] font-semibold tabular-nums text-cyan-200">{progress}%</span>
        </div>

        <p className="relative mt-5 border-t border-white/[0.07] pt-3 text-[9.5px] uppercase tracking-[0.22em] text-white/25">
          Simulated environment · no vehicle hardware connected
        </p>
      </div>
    </motion.div>
  );
}