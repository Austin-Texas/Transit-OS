// Warm interior light spilling over the dashboard while the cabin lights are
// on. The brightness follows the dimmer saved on the van record.
export default function CabinGlow({ status }) {
  const on = status?.lights_on !== false;
  const level = Math.max(0, Math.min(100, Number(status?.light_level ?? 70))) / 100;
  const strength = on ? 0.1 + level * 0.34 : 0;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700 ease-out"
      style={{
        opacity: strength,
        backgroundImage: [
          "radial-gradient(52% 40% at 18% 4%, rgba(255,186,104,0.5), transparent 72%)",
          "radial-gradient(46% 34% at 82% 8%, rgba(255,214,154,0.4), transparent 74%)",
          "radial-gradient(72% 44% at 50% 104%, rgba(255,152,62,0.34), transparent 76%)",
        ].join(","),
      }}
    />
  );
}