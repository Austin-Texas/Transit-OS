import { Archive, BedDouble, Boxes, DoorClosed, Lock, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCKERS = [
  { name: "Cabinet · Kitchen", icon: Archive },
  { name: "Cabinet · Upper L", icon: Archive },
  { name: "Cabinet · Upper R", icon: Archive, warning: true },
  { name: "Locker · Bed", icon: BedDouble },
  { name: "Drawer · Storage", icon: Boxes },
  { name: "Rear Door", icon: DoorClosed },
];

export default function LocksPanel() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-2.5 rounded-2xl border border-line/80 bg-surface p-3 xl:w-[258px]">
      <div className="flex items-center gap-2.5 rounded-xl border border-sys-green/45 bg-sys-green/[0.06] px-3 py-2.5">
        <Lock className="h-4 w-4 text-sys-green" strokeWidth={2} />
        <span className="text-[12px] font-semibold text-sys-green">All Locked ({LOCKERS.length})</span>
      </div>

      <ul className="flex flex-col">
        {LOCKERS.map(({ name, icon: Icon, warning }) => (
          <li
            key={name}
            className={cn(
              "flex items-center justify-between gap-2 rounded-lg px-2 py-2",
              warning && "bg-sys-red/[0.08] ring-1 ring-inset ring-sys-red/25"
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Icon className={cn("h-3.5 w-3.5 shrink-0", warning ? "text-sys-red" : "text-white/35")} strokeWidth={1.8} />
              <span className={cn("truncate text-[11.5px]", warning ? "text-sys-red" : "text-white/70")}>{name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              {warning ? <TriangleAlert className="h-3 w-3 text-sys-red" strokeWidth={2.4} /> : null}
              <Lock className={cn("h-3.5 w-3.5", warning ? "text-sys-red" : "text-sys-green")} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}