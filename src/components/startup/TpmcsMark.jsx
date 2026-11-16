// The TPMCS chevron mark: two angular blades lit cyan into violet, with an
// extruded edge and a soft neon bloom behind them.
export default function TpmcsMark({ className = "" }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tpmcs-upper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9df9ff" />
          <stop offset="45%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#7000ff" />
        </linearGradient>
        <linearGradient id="tpmcs-lower" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#7000ff" />
          <stop offset="55%" stopColor="#2f8bff" />
          <stop offset="100%" stopColor="#8ff6ff" />
        </linearGradient>
        <linearGradient id="tpmcs-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.15" />
        </linearGradient>
        <filter id="tpmcs-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* extruded back edges */}
      <g opacity="0.55">
        <path d="M14 74 L54 20 L94 74 L74 74 L54 48 L34 74 Z" fill="#06121f" transform="translate(3 4)" />
        <path d="M36 92 L60 58 L84 92 L68 92 L60 79 L52 92 Z" fill="#06121f" transform="translate(3 4)" />
      </g>

      <g filter="url(#tpmcs-bloom)">
        <path d="M14 74 L54 20 L94 74 L74 74 L54 48 L34 74 Z" fill="url(#tpmcs-upper)" />
        <path
          d="M14 74 L54 20 L74 20"
          fill="none"
          stroke="url(#tpmcs-edge)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>

      <g filter="url(#tpmcs-bloom)" opacity="0.95">
        <path d="M36 92 L60 58 L84 92 L68 92 L60 79 L52 92 Z" fill="url(#tpmcs-lower)" />
      </g>
    </svg>
  );
}