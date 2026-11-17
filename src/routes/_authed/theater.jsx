import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Film, MonitorPlay, ShieldAlert } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";

export const Route = createFileRoute("/_authed/theater")({
  head: () => ({ meta: [{ title: "TransitOS — Theater" }, { name: "description", content: "Streaming service shortcuts for parked entertainment." }] }),
  component: TheaterPage,
});

const SERVICES = [
  { name: "Netflix", url: "https://www.netflix.com/", tone: "from-red-600/25 to-red-950/10" },
  { name: "YouTube", url: "https://www.youtube.com/", tone: "from-red-500/20 to-neutral-950/10" },
  { name: "Disney+", url: "https://www.disneyplus.com/", tone: "from-blue-600/25 to-blue-950/10" },
  { name: "Prime Video", url: "https://www.primevideo.com/", tone: "from-sky-600/25 to-sky-950/10" },
];

function TheaterPage() {
  const { status } = useVanDashboard();
  return (
    <ModuleShell title="Theater" subtitle="Your entertainment hub — watch only while parked" status={status}>
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-800/70 via-[#10131e] to-[#060910] p-6 shadow-[0_22px_55px_-22px_rgba(0,0,0,0.95)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-white/10 p-3 shadow-lg"><MonitorPlay className="h-7 w-7 text-white" /></span>
          <div><h2 className="text-xl font-bold tracking-tight text-white">TransitOS Theater</h2><p className="text-sm text-white/50">Choose a streaming service to open its official site.</p></div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <a key={service.name} href={service.url} target="_blank" rel="noopener noreferrer"
              className={`group flex min-h-[145px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br ${service.tone} p-5 shadow-[0_12px_25px_rgba(0,0,0,0.5)] transition hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_32px_rgba(0,0,0,0.7)]`}>
              <Film className="h-6 w-6 text-white/70" />
              <span className="flex items-center justify-between text-lg font-semibold text-white">{service.name}<ExternalLink className="h-4 w-4 text-white/50 group-hover:text-white" /></span>
            </a>
          ))}
        </div>
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-white/50"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />For passengers or when safely parked. Streaming requires internet access and may require a subscription. DRM-protected video may not play through screen mirroring.</p>
      </section>
    </ModuleShell>
  );
}
