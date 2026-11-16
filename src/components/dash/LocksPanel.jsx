import { Archive, BedDouble, Boxes, DoorClosed, Lock, Unlock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCKERS = [
  { name: "Cabinet · Kitchen", icon: Archive },
  { name: "Cabinet · Upper L", icon: Archive },
  { name: "Cabinet · Upper R", icon: Archive },
  { name: "Locker · Bed", icon: BedDouble },
  { name: "Drawer · Storage", icon: Boxes },
  { name: "Rear Door", icon: DoorClosed },
];

export default function LocksPanel({ locked = true }) {
  const Icon = locked ? Lock : Unlock;
  return (
    <aside className="flex w-full shrink-0 flex-col gap-2.5 rounded-2xl border border-line/80 bg-surface p-3 lg:w-[228px] lg:overflow-y-auto xl:w-[258px]">
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-3 py-2.5",
          locked
            ? "border border-sys-green/45 bg-sys-green/[0.06]"
            : "border border-alert/45 bg-alert/[0.07]"
        )}
      >
        <Icon className={cn("h-4 w-4", locked ? "text-sys-green" : "text-alert")} strokeWidth={2} />
        <span className={cn("text-[12px] font-semibold", locked ? "text-sys-green" : "text-alert")}>
          {locked ? `All Locked (${LOCKERS.length})` : `Unlocked (${LOCKERS.length})`}
        </span>
      </div>

      <ul className="flex flex-col">
        {LOCKERS.map(({ name, icon: LockerIcon }) => (
          <li key={name} className="flex items-center justify-between gap-2 rounded-lg px-2 py-2">
            <span className="flex min-w-0 items-center gap-2">
              <LockerIcon className="h-3.5 w-3.5 shrink-0 text-white/35" strokeWidth={1.8} />
              <span className="truncate text-[11.5px] text-white/70">{name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              {!locked ? <TriangleAlert className="h-3 w-3 text-alert" strokeWidth={2.4} /> : null}
              <Icon className={cn("h-3.5 w-3.5", locked ? "text-sys-green" : "text-alert")} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}