const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Semicircle ("arc") or full ("ring") progress gauge drawn with a single SVG path. */
export default function ArcGauge({
  value = 0,
  min = 0,
  max = 100,
  size = 104,
  thickness = 8,
  color = "#00f0ff",
  mode = "arc",
  children,
}) {
  const pct = clamp((value - min) / (max - min || 1), 0, 1);
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const ring = mode === "ring";
  const height = ring ? size : size / 2;
  const path = ring
    ? `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius}`
    : `M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`;
  const length = ring ? 2 * Math.PI * radius : Math.PI * radius;

  return (
    <div className="relative shrink-0" style={{ width: size, height }}>
      <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} aria-hidden="true">
        <path d={path} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={thickness} strokeLinecap="round" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - pct)}
          style={{
            transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)",
            filter: `drop-shadow(0 0 5px ${color}aa)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}