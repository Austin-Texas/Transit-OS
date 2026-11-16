import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

// A low field of glowing blue data nodes along the bottom of the frame.
const NODES = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 37 + 9) % 100,
  bottom: (i * 11) % 22,
  size: 2 + (i % 3),
  delay: (i % 8) * 0.16,
}));

// Stage 5 — the initialization panel: product name, a glass progress card and
// the data-node field below it.
export default function StageBoot() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const duration = 780;
    const tick = (now) => {
      const ratio = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - ratio, 1.9);
      setProgress(Math.round(eased * 100));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full max-w-[520px]">
        <motion.h2
          className="flex items-baseline justify-center text-[30px] font-semibold tracking-tight sm:text-[40px]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white">Transit</span>
          <span className="text-cyan-300">OS</span>
        </motion.h2>
        <motion.p
          className="mt-2 text-center text-[9px] uppercase tracking-[0.42em] text-white/50 sm:text-[10px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          System Initialization
        </motion.p>

        <motion.div
          className="relative mt-6 overflow-hidden rounded-[20px] border border-white/10 bg-[#0b1020]/70 p-5 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.95),0_-16px_50px_-30px_rgba(0,240,255,0.45)] backdrop-blur-2xl"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                className="grid place-items-center"
              >
                <Settings className="h-4 w-4 text-cyan-300" strokeWidth={2.1} />
              </motion.span>
            </span>
            <p className="truncate text-[12.5px] text-white/80">Initializing TransitOS...</p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/10">
              <div
                className="h-full rounded-full transition-[width] duration-100 ease-linear"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #7000ff, #00c2ff 55%, #7df9ff)",
                  boxShadow: "0 0 18px rgba(0,240,255,0.8)",
                }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-[12px] font-semibold tabular-nums text-cyan-200">
              {progress}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* foreground data nodes */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden">
        {NODES.map((node, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-cyan-300"
            style={{
              left: `${node.left}%`,
              bottom: `${node.bottom}%`,
              width: node.size,
              height: node.size,
              boxShadow: "0 0 10px rgba(0,240,255,0.95)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 2.6, delay: node.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}