import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { VAN_RENDER_URL } from "@/lib/startupStages";

// Stage 4 — the white high-roof van rolls onto an illuminated platform.
export default function StageVehicle() {
  return (
    <motion.div
      key="vehicle"
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(14px)", scale: 1.04 }}
      transition={{ duration: 0.55 }}
    >
      <div className="relative w-full max-w-[780px]">
        <motion.span
          className="absolute inset-x-[10%] bottom-[14%] h-[38%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,240,255,0.34), rgba(112,0,255,0.18) 58%, transparent 80%)",
            filter: "blur(30px)",
          }}
          initial={{ opacity: 0, scaleX: 0.55 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
        />

        {/* energy rings around the platform */}
        {[
          { color: "0, 240, 255", size: "inset-x-[8%] bottom-[10%] h-[26%]", delay: 0.2 },
          { color: "112, 0, 255", size: "inset-x-[2%] bottom-[6%] h-[32%]", delay: 0.45 },
        ].map((ring) => (
          <motion.span
            key={ring.color}
            className={`pointer-events-none absolute ${ring.size} rounded-[50%] border`}
            style={{ borderColor: `rgba(${ring.color}, 0.45)`, boxShadow: `0 0 44px rgba(${ring.color}, 0.35)` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.85, 0.35], scale: [0.8, 1.06, 1.12] }}
            transition={{ duration: 2.6, delay: ring.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 90, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={VAN_RENDER_URL}
            alt="White high-roof cargo van"
            fittingType="fit"
            className="h-[200px] w-full object-contain mix-blend-screen [mask-image:radial-gradient(closest-side,black_72%,transparent_100%)] sm:h-[290px]"
          />

          <motion.span
            className="pointer-events-none absolute inset-y-8 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent blur-md"
            animate={{ x: ["-30%", "260%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          />
          <motion.span
            className="pointer-events-none absolute inset-y-16 left-0 w-1/4 bg-gradient-to-r from-transparent via-violet-300/20 to-transparent blur-md"
            animate={{ x: ["-20%", "320%"] }}
            transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
        </motion.div>
      </div>

      <motion.div
        className="mt-2 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex items-baseline text-[24px] font-semibold tracking-tight text-white sm:text-[30px]">
          Transit<span className="text-cyan-300">OS</span>
        </div>
        <p className="mt-2 text-[8.5px] uppercase tracking-[0.42em] text-white/40 sm:text-[9.5px]">
          Intelligent Vehicle Operating System
        </p>
      </motion.div>
    </motion.div>
  );
}