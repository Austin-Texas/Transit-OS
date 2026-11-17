import { Car, Wrench } from "lucide-react";
import useMaintenance from "@/hooks/useMaintenance";
import { miles } from "@/lib/van";
import { healthRows } from "@/lib/vehicleHealth";
import { cn } from "@/lib/utils";

const TONE = { ok: "text-ok", warn: "text-warn", alert: "text-alert", muted: "text-white/30" };
const DOT = { ok: "bg-ok", warn: "bg-warn", alert: "bg-alert", muted: "bg-white/20" };

// The left column: what the van is, and one line per system it can report on.
export default function VehicleHealth({ status, alerts = [], onRun }) {
  const { items } = useMaintenance();
  const rows = healthRows({ status, alerts, maintenance: items });
  const problems = rows.filter((row) => row.tone === "warn" || row.tone === "alert").length;

  return (
    <section className="glass relative flex flex-col rounded-[26px] p-4">
      <span className="sheen" aria-hidden="true" />

      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-white/10 text-ios-teal ring-1 ring-inset ring-white/10">
          <Car className="h-[18px] w-[18px]" strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-white">{status.vehicle_name}</p>
          <p className="truncate text-[11px] text-white/40">{status.trim}</p>
        </div>
      </div>

      <dl className="mt-3 flex flex-col">
        {[
          ["VIN", status.vin ?? "—"],
          ["Odometer", `${miles(status.odometer)} mi`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-1.5 last:border-0"
          >
            <dt className="text-[10.5px] uppercase tracking-[0.12em] text-white/30">{label}</dt>
            <dd className="truncate font-mono text-[11px] text-white/55">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between gap-2">
        <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">Vehicle health</h2>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            problems ? "bg-alert/15 text-alert" : "bg-ok/15 text-ok"
          )}
        >
          {problems ? `Attention (${problems})` : "Nominal"}
        </span>
      </div>

      <ul className="mt-1 flex flex-1 flex-col">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-2 border-b border-white/[0.06] py-[7px] last:border-0"
          >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[row.tone])} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[12px] text-white/60">{row.label}</span>
            <span className={cn("shrink-0 text-[11.5px] font-semibold", TONE[row.tone])}>{row.value}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onRun}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-[14px] bg-ios-blue px-3 py-2.5 text-[12px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(10,132,255,1)] transition hover:bg-ios-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-teal/70"
      >
        <Wrench className="h-3.5 w-3.5" strokeWidth={2.1} />
        Run diagnostics
      </button>
    </section>
  );
}