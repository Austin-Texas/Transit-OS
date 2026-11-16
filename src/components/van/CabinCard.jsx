import { BedDouble, Lightbulb, Lock } from "lucide-react";
import VanPhoto from "@/components/van/VanPhoto";
import { Switch } from "@/components/ui/switch";
import { CABIN_IMAGE } from "@/lib/van";
import { cn } from "@/lib/utils";

function ControlRow({ icon: Icon, label, sub, checked, onChange, tone = "text-ok" }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.06] py-1.5 last:border-0">
      <Icon className={cn("h-3.5 w-3.5 shrink-0", checked ? tone : "text-white/30")} strokeWidth={2} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-medium text-white/85">{label}</span>
        <span className="block truncate text-[8.5px] uppercase tracking-[0.12em] text-white/30">{sub}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

// Cabin card: the interior photo plus the two controls used most while parked.
export default function CabinCard({
  temp,
  photoUri,
  onPhoto,
  lightsOn = false,
  locksLocked = true,
  onLights,
  onLocks,
}) {
  return (
    <section
      id="card-cabin"
      className="panel-surface photo-slot relative flex flex-col overflow-hidden rounded-2xl border transition-colors duration-300"
    >
      <div className="relative h-[124px] w-full shrink-0">
        <VanPhoto
          uri={photoUri}
          fallback={CABIN_IMAGE}
          alt="Camper van cabin interior"
          className="absolute inset-0 h-full w-full object-cover"
          onPhoto={onPhoto}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-ink-950/55" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3">
          <div className="flex items-center gap-2">
            <BedDouble className="h-3.5 w-3.5 text-neon/80" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Cabin</span>
          </div>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.14em]",
              locksLocked ? "border-ok/40 bg-ok/10 text-ok" : "border-warn/45 bg-warn/10 text-warn"
            )}
          >
            {locksLocked ? "Secured" : "Unlocked"}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
          <div>
            <p className="font-mono text-[15px] font-semibold leading-none text-white">{Math.round(temp)}°F</p>
            <p className="mt-1 text-[9.5px] text-white/45">Interior · cabin</p>
          </div>
        </div>
      </div>

      <div className="px-3.5 py-2">
        <ControlRow
          icon={Lightbulb}
          label="Cabin lights"
          sub={lightsOn ? "On" : "All zones off"}
          checked={lightsOn}
          onChange={onLights}
          tone="text-neon"
        />
        <ControlRow
          icon={Lock}
          label="Lockers & doors"
          sub={locksLocked ? "Locked" : "Unlocked"}
          checked={locksLocked}
          onChange={onLocks}
        />
      </div>
    </section>
  );
}