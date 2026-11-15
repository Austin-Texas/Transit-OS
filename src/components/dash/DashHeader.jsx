import { useEffect, useState } from "react";
import { Bluetooth, Car, Thermometer, Wifi } from "lucide-react";

function useTime() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function DashHeader({ interiorTemp }) {
  const now = useTime();
  const time = now
    ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })
    : "--:--";

  return (
    <header className="flex h-[56px] shrink-0 items-center justify-between border-b border-line/70 px-4">
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-sys-blue/15 ring-1 ring-sys-blue/50">
          <Car className="h-4 w-4 text-sys-blue" strokeWidth={1.8} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Transit<span className="text-sys-blue">OS</span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-white/65">
        <Wifi className="h-4 w-4" strokeWidth={1.9} />
        <Bluetooth className="h-4 w-4" strokeWidth={1.9} />
        <span className="font-mono text-[12px] tabular-nums text-white/85">{time}</span>
        <span className="flex items-center gap-1.5">
          <Thermometer className="h-4 w-4" strokeWidth={1.9} />
          <span className="font-mono text-[12px] text-white/85">{Math.round(interiorTemp)}°F</span>
        </span>
      </div>
    </header>
  );
}