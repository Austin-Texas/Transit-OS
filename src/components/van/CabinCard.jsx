import { BedDouble, Lightbulb, Lock } from "lucide-react";
import VanPhoto from "@/components/van/VanPhoto";
import { Switch } from "@/components/ui/switch";
import { CABIN_IMAGE } from "@/lib/van";
import { cn } from "@/lib/utils";

function ControlRow({ icon: Icon, label, sub, checked, onChange, tone = "text-ios-green" }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.07] py-2.5 last:border-0">
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-inset ring-white/10 transition",
          checked ? tone : "text-white/35"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-white">{label}</span>
        <span className="block truncate text-[11.5px] text-white/40">{sub}</span>
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
      className="glass group relative flex h-full flex-col overflow-hidden rounded-[28px] transition duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_36px_80px_-40px_rgba(0,0,0,1)]"
    >
      <span className="sheen z-10" aria-hidden="true" />
      <div className="relative h-[132px] w-full shrink-0 overflow-hidden">
        <VanPhoto
          uri={photoUri}
          fallback={CABIN_IMAGE}
          alt="Camper van cabin interior"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          onPhoto={onPhoto}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070c] via-[#06070c]/25 to-transparent" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/15 backdrop-blur">
              <BedDouble className="h-4 w-4" strokeWidth={1.9} />
            </span>
            <span className="text-[13px] font-semibold tracking-tight text-white">Cabin</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur",
              locksLocked ? "bg-ios-green/20 text-ios-green" : "bg-ios-orange/20 text-ios-orange"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {locksLocked ? "Secured" : "Unlocked"}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[26px] font-semibold leading-none tracking-tight text-white">
            {Math.round(temp)}
            <span className="align-top text-[13px] font-medium text-white/45">°F</span>
          </p>
          <p className="mt-1.5 text-[11.5px] font-medium text-white/50">Interior temperature</p>
        </div>
      </div>

      <div className="px-4 py-1.5">
        <ControlRow
          icon={Lightbulb}
          label="Cabin lights"
          sub={lightsOn ? "On" : "All zones off"}
          checked={lightsOn}
          onChange={onLights}
          tone="text-ios-teal"
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