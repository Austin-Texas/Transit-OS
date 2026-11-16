// The halo behind the van: a thin violet-to-blue oval, soft light rays
// radiating from behind the vehicle and a wide bloom around the ring.
const RAYS = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  const spread = 0.007 + (i % 3) * 0.003;
  const far = 1000;
  const point = (a, r) => `${(600 + Math.cos(a) * r).toFixed(1)},${(470 + Math.sin(a) * r).toFixed(1)}`;
  return `${point(angle - spread, 110)} ${point(angle - spread, far)} ${point(angle + spread, far)} ${point(angle + spread, 110)}`;
});

export default function PosterBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="posterOval" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.15" />
          <stop offset="35%" stopColor="#8a2be2" stopOpacity="0.95" />
          <stop offset="72%" stopColor="#3b82f6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="posterRayFade">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="34%" stopColor="#000000" />
          <stop offset="66%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <mask id="posterRayMask">
          <rect width="1200" height="800" fill="url(#posterRayFade)" />
        </mask>
        <filter id="posterHalo" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <filter id="posterRingGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <g mask="url(#posterRayMask)" opacity="0.55">
        {RAYS.map((points, index) => (
          <polygon key={index} points={points} fill="#9fd8ff" opacity={index % 2 ? 0.05 : 0.08} />
        ))}
      </g>

      <ellipse
        cx="600"
        cy="420"
        rx="320"
        ry="372"
        fill="none"
        stroke="url(#posterOval)"
        strokeWidth="26"
        opacity="0.28"
        filter="url(#posterHalo)"
      />
      <ellipse cx="600" cy="420" rx="320" ry="372" fill="none" stroke="url(#posterOval)" strokeWidth="2.4" />
      <ellipse
        cx="600"
        cy="420"
        rx="318"
        ry="370"
        fill="none"
        stroke="url(#posterOval)"
        strokeWidth="1.2"
        opacity="0.9"
        filter="url(#posterRingGlow)"
      />
    </svg>
  );
}