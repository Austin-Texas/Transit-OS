import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { VAN_RENDER_URL } from "@/lib/startupStages";
import TpmcsMark from "./TpmcsMark";

// Stage 4 — the white van on a wet, reflective platform, ringed in purple and
// cyan light, with the small mark, product name and descriptor beneath.
export default function StageVehicle() {
  return (
    <motion.div
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full max-w-[760px]">
        <motion.span
          className="absolute inset-x-[8%] bottom-[6%] h-[36%] rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,240,255,0.34), rgba(112,0,255,0.22) 58%, transparent 80%)",
            filter: "blur(26px)",
          }}
          initial={{ opacity: 0, scaleX: 0.55 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7 }}
        />

        {/* intense purple and cyan rings encircling the vehicle */}
        {[
          { color: "0, 240, 255", box: "inset-x-[6%] bottom-[12%] h-[24%]", delay: 0.1 },
          { color: "112, 0, 255", box: "inset-x-[0%] bottom-[7%] h-[30%]", delay: 0.3 },
          { color: "0, 240, 255", box: "inset-x-[12%] bottom-[15%] h-[20%]", delay: 0.5 },
        ].map((ring) => (
          <motion.span
            key={ring.box}
            className={`pointer-events-none absolute ${ring.box} rounded-[50%] border`}
            style={{ borderColor: `rgba(${ring.color}, 0.5)`, boxShadow: `0 0 50px rgba(${ring.color}, 0.45)` }}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: [0, 0.9, 0.4], scale: [0.82, 1.05, 1.12] }}
            transition={{ duration: 2.2, delay: ring.delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 70, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={VAN_RENDER_URL}
            alt="White high-roof cargo van"
            fittingType="fit"
            className="relative h-[168px] w-full object-contain mix-blend-screen [mask-image:radial-gradient(closest-side,black_70%,transparent_100%)] sm:h-[248px]"
          />
          {/* wet-surface reflection */}
          <Image
            src={VAN_RENDER_URL}
            alt=""
            aria-hidden="true"
            fittingType="fit"
            className="pointer-events-none absolute inset-x-0 top-full h-[80px] w-full -scale-y-100 object-contain opacity-20 blur-[2px] mix-blend-screen [mask-image:linear-gradient(to_bottom,black,transparent_60%)] sm:h-[110px]"
          />
        </motion.div>
      </div>

      <motion.div
        className="relative mt-1 flex flex-col items-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <TpmcsMark className="h-[26px] w-[32px]" />
        <div className="mt-2 flex items-baseline text-[26px] font-semibold tracking-tight sm:text-[32px]">
          <span className="text-white">Transit</span>
          <span className="text-cyan-300">OS</span>
        </div>
        <p className="mt-2 text-[8.5px] uppercase tracking-[0.4em] text-white/45 sm:text-[9.5px]">
          Intelligent Vehicle Operating System
        </p>
      </motion.div>
    </motion.div>
  );
}