import { cn } from "@/lib/utils";
import { useBootReady } from "@/lib/bootSignal";

// Each dashboard surface comes up a beat after the previous one, like the
// cabin lights switching on zone by zone behind the startup film.
export default function CabinIgnite({ index = 0, className, children }) {
  const booted = useBootReady();
  return (
    <div
      className={cn(
        "transition-all duration-[900ms] ease-out",
        booted ? "translate-y-0 opacity-100 blur-none" : "translate-y-3 opacity-0 blur-[6px]",
        className,
      )}
      style={{ transitionDelay: `${120 + index * 90}ms` }}
    >
      {children}
    </div>
  );
}