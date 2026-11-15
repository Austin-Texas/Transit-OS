import { useEffect, useState } from "react";

const format = (date) => ({
  time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }),
  date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
});

export default function Clock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const stamp = now ? format(now) : { time: "--:--", date: "—" };

  return (
    <div className="hidden text-right leading-tight sm:block">
      <p className="font-mono text-[11px] font-medium text-white/90">{stamp.time}</p>
      <p className="text-[9.5px] text-white/40">{stamp.date}</p>
    </div>
  );
}