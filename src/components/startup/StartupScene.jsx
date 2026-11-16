import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { VAN_RENDER_URL } from "@/lib/startupStages";

const EASE = [0.22, 1, 0.36, 1];

const RING_ONE = {
  border: "3px solid #18c9ff",
  boxShadow: "0 0 18px #00d9ff, 0 0 70px #008cff, inset 0 0 24px #00d9ff",
  filter: "drop-shadow(0 0 10px #00e6ff)",
};

// One continuous scene for the three reference states. The mark, wordmark and
// energy rings persist and interpolate between them — nothing is swapped.
export default function StartupScene({ phase }) {
  const company = phase >= 1; // TPMCS lettering
  const intro = phase >= 2; // PRESENTS, TransitOS, the van
  const booting = phase >= 3;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 75% 60% at 50% 82%, #0a2451 0%, #030c22 54%, #01040d 100%)",
      }}
      animate={{ opacity: booting ? 0 : 1 }}
      transition={{ duration: 0.55 }}
    >
      {/* soft aura */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          inset: "-45%",
          background:
            "conic-gradient(from 20deg at 50% 50%, transparent 0deg, rgba(0,76,255,0.22) 48deg, transparent 88deg, rgba(104,31,255,0.3) 132deg, transparent 170deg, rgba(0,207,255,0.17) 235deg, transparent 300deg)",
          filter: "blur(95px)",
        }}
        animate={{ rotate: 360, scale: intro ? 1.1 : 1 }}
        transition={{
          rotate: { duration: 16, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.2, ease: EASE },
        }}
      />

      {/* radial light rays */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 85%, rgba(46,186,255,0.10) 0deg, transparent 2deg, transparent 12deg)",
          maskImage: "linear-gradient(transparent 25%, black 100%)",
          WebkitMaskImage: "linear-gradient(transparent 25%, black 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: intro ? 0.35 : 0.8 }}
        transition={{ duration: 0.9 }}
      />

      {/* illuminated floor */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "120vw",
          height: "44vh",
          bottom: "-30vh",
          left: "-10vw",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,200,255,0.33) 0%, rgba(0,125,255,0.13) 38%, transparent 70%)",
          transform: "perspective(500px) rotateX(68deg)",
          boxShadow: "0 -10px 70px rgba(0,186,255,0.13)",
        }}
      />

      {/* wide cyan energy ring */}
      <motion.div
        className="pointer-events-none absolute left-1/2"
        style={{ x: "-50%", top: "73%" }}
        initial={{ width: "8vw", height: "2vw", opacity: 0 }}
        animate={{
          width: intro ? "78vw" : company ? "70vw" : "46vw",
          height: intro ? "17vw" : company ? "15vw" : "10vw",
          opacity: 1,
        }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <div className="h-full w-full rounded-[50%]" style={RING_ONE} />
      </motion.div>

      {/* thin purple outer ring */}
      <motion.div
        className="pointer-events-none absolute left-1/2"
        style={{ x: "-50%", top: "73%" }}
        animate={{
          width: intro ? "88vw" : "90vw",
          height: "20vw",
          opacity: company ? 0.85 : 0,
        }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <div
          className="h-full w-full rounded-[50%] border border-[#6938ff]"
          style={{ boxShadow: "0 0 30px rgba(113,53,255,0.35)" }}
        />
      </motion.div>

      {/* purple / cyan orbit around the vehicle */}
      <motion.div
        className="pointer-events-none absolute left-1/2 rounded-[50%] border-t-[3px] border-b-2 border-t-[#743dff] border-b-[#00bfff]"
        style={{ x: "-50%", y: "-50%", top: "54%", width: "96vw", height: "310px", filter: "drop-shadow(0 0 12px #6c2aff)" }}
        animate={{ opacity: intro ? 1 : 0, rotate: [-13, 347] }}
        transition={{
          opacity: { duration: 0.9 },
          rotate: { duration: 14, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* the mark and wordmark: one group that travels upward and shrinks */}
      <motion.div
        className="absolute inset-x-0 flex justify-center"
        animate={{ top: intro ? "3vh" : "21vh" }}
        transition={{ duration: 1.15, ease: EASE }}
      >
        <motion.div
          className="flex flex-col items-center"
          style={{ transformOrigin: "top center" }}
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: intro ? 0.42 : 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.15, ease: EASE }}
        >
          <motion.img
            src="/branding/tpmcs-logo.svg"
            alt="TPMCS"
            className="w-auto"
            style={{
              height: "clamp(135px, 29vh, 235px)",
              filter:
                "drop-shadow(0 0 20px rgba(4,191,255,0.6)) drop-shadow(0 0 45px rgba(33,75,255,0.4))",
            }}
            animate={{ y: [0, -11, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="mt-[18px] font-extrabold uppercase text-white"
            style={{
              fontSize: "clamp(30px, 6vw, 55px)",
              letterSpacing: "0.36em",
              paddingLeft: "0.36em",
              textShadow: "0 0 24px rgba(163,223,255,0.33)",
            }}
            animate={{ opacity: company ? 1 : 0, y: company ? 0 : 10 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            TPMCS
          </motion.span>
        </motion.div>
      </motion.div>

      {/* PRESENTS · TransitOS · descriptor · van */}
      <motion.div
        className="absolute inset-x-0 top-[17vh] flex flex-col items-center px-4 text-center"
        animate={{ opacity: intro ? 1 : 0, y: intro ? 0 : 24 }}
        transition={{ duration: 0.8, delay: intro ? 0.2 : 0, ease: EASE }}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-300/70" />
          <span
            className="uppercase text-[#d5e4f3]"
            style={{ fontSize: "clamp(12px, 1.7vw, 19px)", letterSpacing: "0.65em", paddingLeft: "0.65em" }}
          >
            Presents
          </span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-300/70" />
        </div>

        <h1
          className="mt-3 flex items-baseline italic text-white"
          style={{
            fontSize: "clamp(48px, 9vw, 96px)",
            letterSpacing: "-0.075em",
            fontWeight: 850,
            lineHeight: 1.05,
            textShadow: "0 0 24px rgba(137,166,255,0.47), 0 3px 0 #62779b",
          }}
        >
          <span>Transit</span>
          <span className="text-[#00e6ff]" style={{ textShadow: "0 0 20px rgba(0,191,255,0.6)" }}>
            OS
          </span>
        </h1>

        <p
          className="mt-1 uppercase text-white"
          style={{ fontSize: "clamp(10px, 1.5vw, 16px)", letterSpacing: "0.19em" }}
        >
          Intelligent Vehicle Operating System
        </p>

        <motion.div
          className="relative mt-2 flex items-center justify-center"
          style={{ width: "min(83vw, 610px)", height: "clamp(140px, 30vh, 280px)" }}
          animate={{ opacity: intro ? 1 : 0, y: intro ? 0 : 30 }}
          transition={{ duration: 0.8, delay: intro ? 0.45 : 0, ease: EASE }}
        >
          <span
            className="pointer-events-none absolute inset-x-0 bottom-[5%] top-[20%] rounded-[50%] blur-[16px]"
            style={{ background: "radial-gradient(ellipse, rgba(0,217,255,0.3), transparent 65%)" }}
          />
          <Image
            src={VAN_RENDER_URL}
            alt="White high-rise cargo van"
            fittingType="fit"
            className="relative h-full w-full object-contain mix-blend-screen [mask-image:radial-gradient(closest-side,black_78%,transparent_100%)]"
            style={{
              filter:
                "drop-shadow(0 12px 8px rgba(0,0,0,0.6)) drop-shadow(0 0 23px rgba(0,202,255,0.53))",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}