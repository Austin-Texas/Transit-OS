import { useId } from "react";

// Two overlapping chevrons, cyan into violet, as in the brand lockup.
export default function TpmcsMark({ className = "" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg viewBox="0 0 64 54" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}chev`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#22e6ff" />
          <stop offset="52%" stopColor="#3ba7ff" />
          <stop offset="100%" stopColor="#8a2be2" />
        </linearGradient>
      </defs>
      <path d="M0 2 L15 2 L35 27 L15 52 L0 52 L20 27 Z" fill={`url(#${uid}chev)`} />
      <path d="M24 2 L39 2 L59 27 L39 52 L24 52 L44 27 Z" fill={`url(#${uid}chev)`} opacity="0.82" />
    </svg>
  );
}