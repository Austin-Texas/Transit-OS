import { createFileRoute } from "@tanstack/react-router";
import { Archive, BedDouble, Boxes, Camera, DoorClosed, Lock, ShieldCheck } from "lucide-react";
import useVanDashboard from "@/hooks/useVanDashboard";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";
import ToggleRow from "@/components/dash/ToggleRow";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/security")({
  head: () => ({
    meta: [
      { title: "TransitOS — Security" },
      { name: "description", content: "Locks, doors and camera status for your camper." },
    ],
  }),
  component: SecurityPage,
});

const LOCKERS = [
  { name: "Cabinet · Kitchen", icon: Archive },
  { name: "Cabinet · Upper L", icon: Archive },
  { name: "Cabinet · Upper R", icon: Archive },
  { name: "Locker · Bed", icon: BedDouble },
  { name: "Drawer · Storage", icon: Boxes },
  { name: "Rear Door", icon: DoorClosed },
];

const CAMERAS = [
  { name: "Rear camera", detail: "Exterior · 1080p" },
  { name: "Side camera", detail: "Passenger side · 1080p" },
  { name: "Cabin camera", detail: "Interior · 720p" },
];

function SecurityPage() {
  const van = useVanDashboard();
  const { status } = van;

  if (!status) return <ModuleShell title="Security" />;

  const locked = status.locks_locked !== false;

  return (
    <ModuleShell
      title="Security"
      subtitle="Locks, entries and cameras"
      status={status}
      meta={
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]",
            locked ? "border-ok/45 bg-ok/10 text-ok" : "border-alert/45 bg-alert/10 text-alert"
          )}
        >
          <Lock className="h-3 w-3" strokeWidth={2.2} />
          {locked ? "All locked" : "Unlocked"}
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <ModuleCard title="Master lock" icon={ShieldCheck}>
          <ToggleRow
            icon={Lock}
            label="Lock all compartments"
            sub={locked ? "6 of 6 secured" : "Access is open"}
            checked={locked}
            onChange={(value) => van.update({ locks_locked: value })}
          />
        </ModuleCard>

        <ModuleCard title="Compartments" icon={Archive}>
          <ul className="flex flex-col gap-2">
            {LOCKERS.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="flex items-center justify-between gap-3 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-white/35" strokeWidth={1.8} />
                  <span className="truncate text-[11.5px] text-white/75">{name}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em]",
                    locked ? "text-ok/80" : "text-alert"
                  )}
                >
                  {locked ? "Locked" : "Open"}
                </span>
              </li>
            ))}
          </ul>
        </ModuleCard>

        <ModuleCard title="Cameras" icon={Camera} className="lg:col-span-2">
          <ul className="grid gap-2 sm:grid-cols-3">
            {CAMERAS.map((camera) => (
              <li
                key={camera.name}
                className="flex items-center justify-between gap-2 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[11.5px] font-medium text-white">{camera.name}</span>
                  <span className="block truncate text-[9.5px] text-white/35">{camera.detail}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-sys-red" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">Live</span>
                </span>
              </li>
            ))}
          </ul>
        </ModuleCard>
      </div>
    </ModuleShell>
  );
}