import { useEffect } from "react";
import { Activity, BatteryCharging, Droplets, Thermometer, Wifi, ShieldCheck, Truck } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

// Public design preview only. No authenticated APIs, user records, cameras, or hardware commands.
const cards = [
  { label: "Battery", value: "82%", icon: BatteryCharging, detail: "Demo reading" },
  { label: "Cabin temperature", value: "72°F", icon: Thermometer, detail: "Demo reading" },
  { label: "Fresh water", value: "68%", icon: Droplets, detail: "Demo reading" },
  { label: "Vehicle status", value: "Parked", icon: Truck, detail: "Simulation" },
  { label: "Connectivity", value: "Online", icon: Wifi, detail: "Simulated" },
  { label: "System health", value: "Normal", icon: Activity, detail: "Simulation" },
];

export function LoginPage() {
  useEffect(() => {
    if (window.location.hostname === "transit.hastenload.com") window.location.replace("/");
  }, []);
  return (
    <main className="min-h-screen bg-[#020a14] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-cyan-900/50 pb-5">
          <div className="flex items-center gap-3">
            <BrandMark variant="light" className="h-12 w-12 rounded-xl" />
            <div><h1 className="text-2xl font-bold tracking-tight">TransitOS</h1><p className="text-sm text-slate-400">Ford Transit Smart Camper</p></div>
          </div>
          <span className="rounded-full border border-cyan-700/60 bg-cyan-950/40 px-4 py-2 text-sm text-cyan-300">Public design preview · No login</span>
        </header>
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-cyan-400">TransitOS dashboard preview</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Your smart camper, at a glance.</h2>
          <p className="mt-3 max-w-3xl text-slate-400">Explore the interface without an account. All values below are illustrative, not live vehicle data. Real equipment controls and private records are unavailable in this public preview.</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-300"><ShieldCheck size={18} /> Read-only · Simulation only</div>
        </section>
        <section aria-label="Demo vehicle status" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, detail }) => (
            <article key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="mb-5 flex items-center justify-between text-slate-400"><span>{label}</span><Icon className="text-cyan-400" size={22} /></div>
              <p className="text-3xl font-semibold">{value}</p>
              <p className="mt-2 text-xs text-slate-500">{detail}</p>
            </article>
          ))}
        </section>
        <p className="mt-8 text-center text-sm text-slate-500">TransitOS development preview. Production authentication and private vehicle data remain protected.</p>
      </div>
    </main>
  );
}