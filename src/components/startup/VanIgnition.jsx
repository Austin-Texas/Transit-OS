import { motion } from "framer-motion";

// Stage 4 artwork: the Transit camper drawing its cabin illumination in.
// Shell, glass and outline settle first, then the ceiling strips light up one
// by one, followed by the warm cabin lamp and the exterior lighting.
const BODY = "M75 205V110Q75 72 115 72H375Q414 72 426 108L455 174H540Q562 174 562 202V244H75Z";
const WINDSCREEN = "M392 89L418 163H472L445 107Q438 91 419 89Z";
const STRIPS = [132, 186, 240, 294];

const fade = (delay, duration, opacity = 1) => ({
  initial: { opacity: 0 },
  animate: { opacity },
  transition: { delay, duration, ease: "easeOut" },
});

export default function VanIgnition() {
  return (
    <svg
      viewBox="0 0 640 300"
      className="cin__van"
      role="img"
      aria-label="Camper van interior lighting initializing"
    >
      <defs>
        <linearGradient id="cin-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12293f" />
          <stop offset="1" stopColor="#050c15" />
        </linearGradient>
        <linearGradient id="cin-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b6f0ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b6f0ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cin-pool">
          <stop offset="0" stopColor="#00c9ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#00c9ff" stopOpacity="0" />
        </radialGradient>
        <filter id="cin-glow" x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* floor pool */}
      <motion.ellipse cx="320" cy="272" rx="252" ry="26" fill="url(#cin-pool)" {...fade(1.1, 1.2, 0.9)} />

      {/* body */}
      <motion.path d={BODY} fill="url(#cin-shell)" {...fade(0, 0.7)} />
      <motion.path
        d={BODY}
        fill="none"
        stroke="#8fe6ff"
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* living-space glass */}
      <motion.rect x="118" y="92" width="236" height="82" rx="9" fill="#071320" {...fade(0.2, 0.7)} />
      <motion.rect
        x="118"
        y="92"
        width="236"
        height="82"
        rx="9"
        fill="#ffca86"
        filter="url(#cin-glow)"
        {...fade(0.9, 1.1, 0.22)}
      />

      {/* ceiling light strips lighting up one by one */}
      {STRIPS.map((x, index) => (
        <motion.rect
          key={x}
          x={x}
          y="101"
          width="42"
          height="6"
          rx="3"
          fill="#ffe9c7"
          filter="url(#cin-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.82] }}
          transition={{ delay: 1 + index * 0.26, duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* warm cabin lamp */}
      <motion.circle cx="152" cy="146" r="9" fill="#ffb457" filter="url(#cin-glow)" {...fade(1.8, 0.8, 0.95)} />
      <motion.rect x="118" y="92" width="236" height="82" rx="9" fill="none" stroke="#ffe0b0" strokeOpacity="0.35" {...fade(1.9, 0.8)} />

      {/* windscreen and dash */}
      <motion.path d={WINDSCREEN} fill="#0a1d30" stroke="#5ec8ea" strokeWidth="2" {...fade(0.4, 0.8)} />
      <motion.path d={WINDSCREEN} fill="#64d2ff" filter="url(#cin-glow)" {...fade(2.1, 0.9, 0.2)} />
      <motion.rect x="404" y="150" width="48" height="5" rx="2.5" fill="#64d2ff" {...fade(2.3, 0.6, 0.85)} />

      {/* headlight beam and lamps */}
      <motion.path d="M560 200 L640 168 L640 252 L560 218 Z" fill="url(#cin-beam)" {...fade(2.2, 0.7)} />
      <motion.rect x="543" y="199" width="20" height="20" rx="5" fill="#d9f7ff" filter="url(#cin-glow)" {...fade(2.2, 0.5)} />
      <motion.rect x="77" y="207" width="12" height="20" fill="#ff6464" filter="url(#cin-glow)" {...fade(2.4, 0.5, 0.9)} />

      {/* wheels */}
      {[182, 470].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="243" r="39" fill="#050b14" stroke="#9daab8" strokeWidth="6" opacity="0.9" />
          <circle cx={cx} cy="243" r="14" fill="#c8d6e3" opacity="0.8" />
        </g>
      ))}

      {/* body sides */}
      <motion.path d="M373 79V244" stroke="#7398af" strokeWidth="2.4" {...fade(0.6, 0.7, 0.9)} />
      <motion.path d="M454 174V243" stroke="#7398af" strokeWidth="2.4" {...fade(0.6, 0.7, 0.9)} />
    </svg>
  );
}