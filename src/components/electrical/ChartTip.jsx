export default function ChartTip({ active, payload, label, unit = "" }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-surface px-2.5 py-1.5 shadow-xl">
      <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</p>
      {payload
        .filter((entry) => entry.value !== null && entry.value !== undefined)
        .map((entry) => (
        <p
          key={entry.dataKey}
          className="mt-1 flex items-center gap-1.5 font-mono text-[10.5px] text-white"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color }} />
          {entry.name}: {Math.round(entry.value)}
          {unit}
        </p>
      ))}
    </div>
  );
}