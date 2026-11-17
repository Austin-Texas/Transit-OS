import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

// The van as a 3D studio render. Every labelled point on the body is a tap
// target that opens the module responsible for that system.
export const VAN_RENDER =
  "https://media.base44.com/images/public/6afa3d27af32e7eb7d4b7f76/4a5e625b9_generated_image.png";

const PINS = [
  { key: "climate", label: "Climate", top: "24%", left: "45%" },
  { key: "cabin", label: "Cabin", top: "44%", left: "32%" },
  { key: "engine", label: "Engine", top: "60%", left: "71%" },
  { key: "battery", label: "Power", top: "72%", left: "52%" },
  { key: "water_tank", label: "Water", top: "76%", left: "25%" },
];

export default function Van3DImageStage({ onPick, className }) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <Image
        src={VAN_RENDER}
        alt="Ford Transit camper van, 3D view"
        fittingType="fill"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_72%_at_50%_46%,transparent_46%,rgba(2,6,11,0.55)_100%)]" />

      {PINS.map((pin) => (
        <button
          key={pin.key}
          type="button"
          onClick={() => onPick?.(pin.key)}
          style={{ top: pin.top, left: pin.left }}
          aria-label={`Open ${pin.label}`}
          className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-ios-teal/40 bg-ink-950/80 py-1 pl-1.5 pr-2.5 backdrop-blur transition hover:border-ios-teal hover:bg-ink-950/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-teal/70"
        >
          <span className="relative grid h-3.5 w-3.5 shrink-0 place-items-center">
            <span className="absolute inset-0 animate-soft-pulse rounded-full bg-ios-teal/40" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-ios-teal" />
          </span>
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 group-hover:text-white">
            {pin.label}
          </span>
        </button>
      ))}
    </div>
  );
}