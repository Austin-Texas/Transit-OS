import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, Droplets, Lightbulb, Moon, Thermometer, Wind } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import Metric from "@/components/dash/Metric";
import ToggleRow from "@/components/dash/ToggleRow";
import { Slider } from "@/components/ui/slider";
import VanPhoto from "@/components/van/VanPhoto";
import { CABIN_IMAGE } from "@/lib/van";

export const Route = createFileRoute("/_authed/camper")({
  head: () => ({
    meta: [
      { title: "TransitOS — Camper" },
      { name: "description", content: "Cabin lighting, sleep comfort and interior air for the living space." },
    ],
  }),
  component: CamperPage,
});

function CamperPage() {
  const van = useVanDashboard();
  const { status } = van;
  const [level, setLevel] = useState(null);

  if (!status) return <ModuleShell title="Camper" />;

  const brightness = level ?? Number(status.light_level ?? 70);
  const lightsOn = status.lights_on !== false;
  // The cabin preview follows the dimmer: bright at 100%, dim low, dark when the lights are off.
  const luminance = lightsOn ? 0.3 + 0.7 * (brightness / 100) : 0.1;

  return (
    <ModuleShell title="Camper" subtitle="Living space, lighting and sleep comfort" status={status}>
      <div className="grid gap-3 lg:grid-cols-3">
        <section className="relative overflow-hidden rounded-2xl border border-line/80 bg-surface lg:col-span-2">
          <div className="relative h-[240px] w-full shadow-[inset_0_0_90px_rgba(2,10,20,0.9)]">
            <VanPhoto
              uri={status.cabin_photo_uri}
              fallback={CABIN_IMAGE}
              alt="Camper van cabin interior"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: `brightness(${luminance})`, transition: "filter 140ms linear" }}
              onPhoto={(uri) => van.update({ cabin_photo_uri: uri })}
              buttonPosition="top"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-warn mix-blend-soft-light"
              style={{ opacity: lightsOn ? 0.04 + (brightness / 100) * 0.14 : 0, transition: "opacity 140ms linear" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
            {/* Neon grade: cool cyan in the highlights, deep ink at the edges, so any photo sits in the same palette. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neon/10 via-transparent to-sys-blue/10 mix-blend-screen" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_35%,rgba(2,10,20,0.75)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <div>
                <p className="text-[9.5px] uppercase tracking-[0.2em] text-white/45">Cabin</p>
                <p className="mt-1 font-mono text-[24px] font-semibold leading-none text-white">
                  {Math.round(status.cabin_temp)}°F
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                  lightsOn ? "border-ok/45 bg-ok/10 text-ok" : "border-white/20 bg-black/30 text-white/60"
                }`}
              >
                <Lightbulb className="h-3 w-3" strokeWidth={2.2} />
                {lightsOn ? "Lights on" : "Lights off"}
              </span>
            </div>
          </div>
        </section>

        <ModuleCard title="Lighting" icon={Lightbulb}>
          <div className="flex flex-col gap-3">
            <ToggleRow
              icon={Moon}
              label="Cabin lights"
              sub={lightsOn ? "Warm LED · on" : "All zones off"}
              checked={lightsOn}
              onChange={(value) => van.update({ lights_on: value })}
            />
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/40">Brightness</span>
                <span className="font-mono text-[11px] text-white/85">{brightness}%</span>
              </div>
              <Slider
                value={[brightness]}
                min={0}
                max={100}
                step={5}
                disabled={!lightsOn}
                onValueChange={([value]) => setLevel(value)}
                onValueCommit={([value]) => {
                  setLevel(null);
                  van.update({ light_level: value });
                }}
              />
            </div>
          </div>
        </ModuleCard>

        <ModuleCard title="Comfort" icon={Thermometer} className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric icon={Thermometer} label="Cabin" value={`${Math.round(status.cabin_temp)}°F`} />
            <Metric icon={BedDouble} label="Main cabin" value={`${Math.round(status.climate_temp)}°F`} tone="text-sys-green" />
            <Metric icon={Wind} label="Humidity" value={`${status.humidity ?? 0}%`} tone="text-white/50" />
            <Metric icon={Droplets} label="Exterior" value={`${Math.round(status.exterior_temp ?? 0)}°F`} tone="text-white/50" />
          </div>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}