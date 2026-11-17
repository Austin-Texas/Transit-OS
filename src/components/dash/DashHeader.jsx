import { useEffect, useState } from "react";
import { Bluetooth, Thermometer, Wifi } from "lucide-react";
import BrandMark from "@/components/brand/BrandMark";

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
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-black/20 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <BrandMark />
        <span className="text-[16px] font-semibold tracking-tight text-white">
          Transit<span className="text-ios-teal">OS</span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-white/60">
        <Wifi className="h-4 w-4" strokeWidth={1.9} />
        <Bluetooth className="h-4 w-4" strokeWidth={1.9} />
        <span className="text-[12.5px] font-medium tabular-nums text-white/85">{time}</span>
        <span className="flex items-center gap-1.5">
          <Thermometer className="h-4 w-4" strokeWidth={1.9} />
          <span className="text-[12.5px] font-medium text-white/85">{Math.round(interiorTemp)}°F</span>
        </span>
      </div>
    </header>
  );
}