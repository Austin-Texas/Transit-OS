import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Layers, Scan, Thermometer, Waves, AlertTriangle, CheckCircle2 } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import VanStage from "@/components/dash/VanStage";
import DiagramViews, { viewFocus } from "@/components/van/DiagramViews";
import { openAlerts } from "@/lib/van";

export const Route = createFileRoute("/_authed/digital-twin")({
  head: () => ({ meta: [{ title: "TransitOS — Digital Twin" }] }),
  component: DigitalTwinPage,
});

const views = [
  { id: "full", label: "3D VIEW", icon: Box },
  { id: "systems", label: "SYSTEMS", icon: Layers },
  { id: "xray", label: "X-RAY", icon: Scan },
  { id: "thermal", label: "THERMAL", icon: Thermometer },
  { id: "flow", label: "FLOW", icon: Waves },
];
const pct = (n) => Math.max(0, Math.min(100, Number(n) || 0));
function Stat({ label, value, color = "#00cfff", detail }) {
  const percent = pct(value);
  return <div className="min-w-0 rounded-2xl border border-cyan-400/25 bg-[#071624]/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
    <p className="text-xs font-semibold text-white/85">{label}</p>
    <div className="mt-3 flex items-center gap-3">
      <div className="relative h-14 w-24 shrink-0">
        <svg viewBox="0 0 100 60" className="h-full w-full" aria-hidden="true">
          <path d="M 9 51 A 41 41 0 0 1 91 51" fill="none" stroke="#243345" strokeWidth="8" strokeLinecap="round" pathLength="100"/>
          <path d="M 9 51 A 41 41 0 0 1 91 51" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" pathLength="100" strokeDasharray={`${percent} 100`} style={{filter:`drop-shadow(0 0 5px ${color})`}}/>
        </svg>
      </div>
      <div><p className="text-xl font-bold text-white">{value}%</p><p className="text-[10px] text-white/45">{detail}</p></div>
    </div>
  </div>;
}
function DigitalTwinPage() {
  const van = useVanDashboard();
  const { status, alerts } = van;
  const [view, setView] = useState("full");
  if (!status) return <ModuleShell title="Digital Twin" subtitle="Waiting for vehicle telemetry" />;
  const faults = openAlerts(alerts);
  return <ModuleShell title="2026 FORD TRANSIT — DIGITAL TWIN" subtitle="EXPLORE • DIAGNOSE • STAY ON THE ROAD" status={status}
    meta={<span className="text-xs font-semibold text-cyan-300">TRANSIT-OS</span>}>
    <div className="overflow-hidden rounded-[28px] border border-cyan-400/20 bg-[#030c16] p-3 shadow-[0_24px_65px_rgba(0,0,0,0.75)] sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[155px_minmax(0,1fr)]">
        <nav aria-label="Digital twin views" className="flex gap-2 overflow-x-auto lg:flex-col">
          {views.map(({id,label,icon:Icon})=><button key={id} type="button" onClick={()=>setView(id)}
            aria-pressed={view===id} className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold tracking-wide transition ${view===id ? "border-cyan-300 bg-cyan-500/20 text-white shadow-[0_0_17px_rgba(0,200,255,0.35)]" : "border-cyan-900/70 bg-[#0a1b2b] text-cyan-100/65 hover:bg-cyan-900/30"}`}>
            <Icon className="h-4 w-4"/>{label}
          </button>)}
        </nav>
        <div className="min-w-0 space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#051421] shadow-[inset_0_0_50px_rgba(0,180,255,0.06)]">
            <VanStage focus={view==="full"?null:viewFocus(view)} onClearFocus={()=>setView("full")} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className={faults.length ? "flex items-center gap-2 text-rose-400" : "flex items-center gap-2 text-emerald-400"}>
              {faults.length ? <AlertTriangle className="h-4 w-4"/> : <CheckCircle2 className="h-4 w-4"/>}
              {faults.length ? `${faults.length} active vehicle alert(s)` : "No active vehicle alerts"}
            </span>
            <Link to="/diagnostics" className="rounded-lg border border-cyan-400/40 px-3 py-2 font-semibold text-cyan-300 hover:bg-cyan-400/10">Full diagnostics →</Link>
          </div>
          {view!=="full" && <DiagramViews active={view} onSelect={(id)=>setView(id)} status={status}/>}
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-cyan-400/25 bg-[#071624] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
          <p className="text-xs font-semibold text-white/85">Power</p>
          <p className="mt-3 text-2xl font-bold text-white">{Number(status.battery_voltage ?? 0).toFixed(1)} <span className="text-sm text-white/50">V</span></p>
          <p className="text-xs text-emerald-400">{Math.round(Number(status.solar_w ?? 0))} W solar</p>
          <p className="mt-2 text-sm text-white/80">{Math.round(pct(status.battery_percent))}% battery</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/25 bg-[#071624] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
          <p className="text-xs font-semibold text-white/85">Climate</p>
          <p className="mt-3 text-2xl font-bold text-white">{Math.round(Number(status.climate_temp ?? 0))}°</p>
          <p className="text-xs text-cyan-300">Cabin temperature</p>
        </div>
        <Stat label="Propane" value={Math.round(pct(status.lpg_percent))} color="#ff9f0a" detail={`${Number(status.lpg_gallons ?? 0).toFixed(1)} gal remaining`}/>
        <Stat label="Fresh Water" value={Math.round(pct(status.fresh_percent))} detail="Fresh tank"/>
        <Stat label="Gray Water" value={Math.round(pct(status.gray_percent))} detail="Gray tank"/>
      </div>
      <p className="mt-3 text-[10px] text-white/35">Vehicle view uses the existing digital-twin viewer; visual modes depend on the available model and telemetry. No faults are simulated.</p>
    </div>
  </ModuleShell>;
}
