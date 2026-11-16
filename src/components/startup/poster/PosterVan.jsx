import { useId } from "react";

// The flat, clean side-profile cargo van from the brand frame: white body,
// slate windows, a red tail light, a cyan head light and a cyan edge glow.
export default function PosterVan({ className = "" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const body = "M22 90 L22 44 Q22 28 38 28 L188 28 L236 58 L262 66 L262 90 Z";

  return (
    <svg viewBox="0 0 284 142" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="52%" stopColor="#eef4fb" />
          <stop offset="100%" stopColor="#c1d2e4" />
        </linearGradient>
        <linearGradient id={`${uid}glass`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b536e" />
          <stop offset="100%" stopColor="#212f3e" />
        </linearGradient>
        <radialGradient id={`${uid}ground`}>
          <stop offset="0%" stopColor="#2ae4ff" stopOpacity="0.85" />
          <stop offset="58%" stopColor="#1b9dff" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#1b9dff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>

      <ellipse cx="142" cy="126" rx="138" ry="13" fill={`url(#${uid}ground)`} />

      <g filter={`url(#${uid}glow)`} opacity="0.85">
        <path d={body} fill="none" stroke="#5be9ff" strokeWidth="2.4" />
      </g>

      <path d={body} fill={`url(#${uid}body)`} />

      <path d="M196 40 L226 60 L226 74 L196 74 Z" fill={`url(#${uid}glass)`} />
      <rect x="148" y="36" width="38" height="38" rx="3" fill={`url(#${uid}glass)`} />

      <rect x="24" y="62" width="5" height="14" rx="1.5" fill="#e8483f" />
      <g filter={`url(#${uid}glow)`}>
        <rect x="248" y="68" width="11" height="7" rx="2" fill="#38f4ff" />
      </g>
      <rect x="248" y="68" width="11" height="7" rx="2" fill="#9df8ff" />

      {[74, 224].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="104" r="16" fill="#2b3746" />
          <circle cx={cx} cy="104" r="8" fill="#0d1116" />
        </g>
      ))}
    </svg>
  );
}