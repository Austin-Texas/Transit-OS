import { motion } from "framer-motion";

// Pulsing neon rings on the metallic floor plane.
export default function FloorRings({ className = "", color = "0, 240, 255", count = 3, delay = 0 }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute inset-0 rounded-[50%] border"
          style={{
            borderColor: `rgba(${color}, 0.5)`,
            boxShadow: `0 0 34px rgba(${color}, 0.4), inset 0 0 26px rgba(${color}, 0.22)`,
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, 1.2], opacity: [0.85, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, delay: index * 1.1 + delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}