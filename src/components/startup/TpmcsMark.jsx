// The TPMCS mark: two interlocking angular forms that read as a stylised T —
// the left blade cyan, the right blade royal blue, with a deep extruded edge
// and a soft neon bloom behind them.
export default function TpmcsMark({ className = "" }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tpmcs-cyan" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#b9fdff" />
          <stop offset="45%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#0bb6d6" />
        </linearGradient>
        <linearGradient id="tpmcs-blue" x1="0.2" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8c96ff" />
          <stop offset="50%" stopColor="#4a3aff" />
          <stop offset="100%" stopColor="#241a9e" />
        </linearGradient>
        <linearGradient id="tpmcs-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="tpmcs-bloom" x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* extruded depth behind both blades */}
      <g opacity="0.55" transform="translate(4 6)">
        <path d="M60 14 H20 L8 26 V40 H48 V82 H60 Z" fill="#040915" />
        <path d="M60 14 H100 L112 26 V40 H72 V82 H60 Z" fill="#040915" />
      </g>

      <g filter="url(#tpmcs-bloom)">
        {/* right blade — royal blue, locked a step lower */}
        <path d="M60 19 H100 L112 31 V45 H72 V87 H60 Z" fill="url(#tpmcs-blue)" />
        {/* left blade — cyan, sits over the seam */}
        <path d="M60 14 H20 L8 26 V40 H48 V82 H60 Z" fill="url(#tpmcs-cyan)" />
        <path
          d="M20 14 H60 V40 H8"
          fill="none"
          stroke="url(#tpmcs-edge)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}