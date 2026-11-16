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

// Stage 5 — the initialization panel, matched to the approved composition.
export default function StageBoot() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const duration = 900;
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
      className="relative flex h-full w-full flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1
        className="flex items-baseline italic text-white"
        style={{
          fontSize: "clamp(48px, 9vw, 96px)",
          letterSpacing: "-0.075em",
          fontWeight: 850,
          lineHeight: 1.15,
          textShadow: "0 0 24px rgba(137,166,255,0.47), 0 3px 0 #62779b",
        }}
      >
        <span>Transit</span>
        <span className="text-[#00e6ff]" style={{ textShadow: "0 0 20px rgba(0,191,255,0.6)" }}>
          OS
        </span>
      </h1>

      <p
        className="uppercase"
        style={{
          fontSize: "clamp(13px, 2vw, 20px)",
          letterSpacing: "0.27em",
          margin: "10px 0 34px",
        }}
      >
        System Initialization
      </p>

      <div
        className="w-full text-left"
        style={{
          maxWidth: "min(90vw, 520px)",
          padding: "22px 28px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #11375bdf, #071a32ed)",
          border: "1px solid #20caff9c",
          boxShadow: "0 0 25px rgba(0,186,255,0.2), inset 0 0 25px rgba(0,157,255,0.08)",
        }}
      >
        <div className="flex items-center" style={{ gap: "14px", fontSize: "clamp(14px, 2vw, 21px)" }}>
          <motion.span
            className="grid shrink-0 place-items-center text-[#68e7ff]"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Settings style={{ width: 34, height: 34 }} strokeWidth={1.7} />
          </motion.span>
          <span className="truncate">Initializing TransitOS...</span>
        </div>

        <div className="flex items-center" style={{ gap: "14px", marginTop: "20px" }}>
          <div
            className="flex-1 overflow-hidden"
            style={{
              height: "16px",
              borderRadius: "20px",
              background: "#09223a",
              border: "1px solid #205477",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: "20px",
                background: "linear-gradient(90deg, #0aa6f9, #2cf8fa)",
                boxShadow: "0 0 18px #0fefff",
                transition: "width .08s linear",
              }}
            />
          </div>
          <strong className="tabular-nums" style={{ minWidth: "45px", fontSize: "19px" }}>
            {progress}%
          </strong>
        </div>
      </div>

      <small style={{ fontSize: "10px", letterSpacing: "0.12em", marginTop: "23px", color: "#9bb5cd" }}>
        DEMO STARTUP · VEHICLE HARDWARE NOT CONNECTED
      </small>

      {/* foreground data nodes */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden">
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