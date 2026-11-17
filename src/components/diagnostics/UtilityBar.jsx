import { Link } from "@tanstack/react-router";
import { ArrowUpDown, BatteryMedium, Flame, Snowflake, Sun, Waves } from "lucide-react";
import ArcGauge from "@/components/van/ArcGauge";
import { TANK_CAPACITY_GAL, gallonsFrom } from "@/lib/van";
import { cn } from "@/lib/utils";

const pct = (value) => Math.max(0, Math.min(100, Number(value) || 0));
const round = (value) => Math.round(Number(value) || 0);

function Tile({ to, label, icon: Icon, children }) {
  return (
    <Link
      to={to}
      className="glass group flex min-w-0 flex-col gap-1.5 rounded-[20px] px-3 py-2.5 transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ios-teal/60"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">{label}</span>
        <Icon className="h-3.5 w-3.5 shrink-0 text-white/25 transition group-hover:text-white/45" strokeWidth={1.9} />
      </span>
      {children}
    </Link>
  );
}

function TankBar({ label, value, tone }) {
  const level = pct(value);
  return (
    <span className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span className="relative h-8 w-2 overflow-hidden rounded-full bg-white/10">
        <span
          className={cn("absolute inset-x-0 bottom-0 rounded-full", tone)}
          style={{ height: `${level}%` }}
          aria-hidden="true"
        />
      </span>
      <span className="text-[8.5px] font-semibold uppercase tracking-[0.1em] text-white/30">{label}</span>
      <span className="text-[10px] font-semibold text-white/80 tabular-nums">{round(value)}%</span>
    </span>
  );
}

// The utility strip under the stage: one glanceable tile per coach system, each
// opening the module that owns it.
export default function UtilityBar({ status }) {
  const solar = round(status.solar_w);
  const load = round(status.load_w);
  const volts = Number(status.battery_voltage) || 0;
  const netAmps = volts ? (load - solar) / volts : 0;
  const acOn = (status.climate_mode ?? "auto") !== "off";
  const heaterOn = Number(status.climate_set ?? 0) > Number(status.climate_temp ?? 0);

  const pitch = Number(status.level_pitch);
  const roll = Number(status.level_roll);
  const leveled = Number.isFinite(pitch) && Number.isFinite(roll) ? Math.abs(pitch) < 1 && Math.abs(roll) < 1 : null;

  return (
    <section aria-label="Utility systems" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7">
      <Tile to="/climate" label="Climate (Cabin)" icon={Snowflake}>
        <span className="text-[17px] font-semibold leading-none text-white">
          {round(status.climate_temp ?? 0)}°F
        </span>
        <span className="text-[10px] text-white/35">Set: {round(status.climate_set ?? 0)}°F</span>
      </Tile>

      <Tile to="/water" label="Water tanks" icon={Waves}>
        <span className="flex items-end justify-between gap-1">
          <TankBar label="F" value={status.fresh_water} tone="bg-ios-teal" />
          <TankBar label="G" value={status.gray_water} tone="bg-ios-blue" />
          <TankBar label="B" value={status.black_water} tone="bg-ios-indigo" />
        </span>
      </Tile>

      <Tile to="/lpg" label="LPG / Propane" icon={Flame}>
        <span className="flex items-center gap-2.5">
          <ArcGauge value={pct(status.lpg_percent)} size={36} thickness={5} mode="ring" color="#ff9f0a">
            <span className="text-[10px] font-semibold text-white">{round(status.lpg_percent)}%</span>
          </ArcGauge>
          <span className="min-w-0">
            <span className="block text-[10.5px] font-semibold text-white/80">
              {Number(status.lpg_gallons ?? 0).toFixed(1)} gal
            </span>
            <span className="block text-[9.5px] text-white/30">remaining</span>
          </span>
        </span>
      </Tile>

      <Tile to="/electrical" label="Power system" icon={BatteryMedium}>
        <span className="text-[17px] font-semibold leading-none text-white">
          {round(status.battery_percent)}%
        </span>
        <span className="truncate text-[10px] text-white/35 tabular-nums">
          {volts.toFixed(1)} V · {netAmps >= 0 ? "-" : "+"}
          {Math.abs(netAmps).toFixed(1)} A
        </span>
      </Tile>

      <Tile to="/electrical" label="Solar" icon={Sun}>
        <span className="text-[17px] font-semibold leading-none text-white">{solar} W</span>
        <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => {
            const filled = index < Math.round((solar / 800) * 10);
            return (
              <span
                key={index}
                className={cn("w-full rounded-sm", filled ? "bg-ios-green" : "bg-white/10")}
                style={{ height: `${25 + index * 8}%` }}
              />
            );
          })}
        </span>
      </Tile>

      <Tile to="/climate" label="AC / Heater" icon={Snowflake}>
        <span className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9.5px] font-semibold",
              acOn ? "bg-ios-teal/20 text-ios-teal" : "bg-white/10 text-white/35"
            )}
          >
            AC: {acOn ? "ON" : "OFF"}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[9.5px] font-semibold",
              heaterOn ? "bg-warn/20 text-warn" : "bg-white/10 text-white/35"
            )}
          >
            Heater: {heaterOn ? "ON" : "OFF"}
          </span>
        </span>
        <span className="text-[10px] capitalize text-white/35">{status.climate_mode ?? "auto"} mode</span>
      </Tile>

      <Tile to="/leveling" label="Leveling" icon={ArrowUpDown}>
        <span
          className={cn(
            "text-[13px] font-semibold leading-none",
            leveled === null ? "text-white/35" : leveled ? "text-ok" : "text-warn"
          )}
        >
          {leveled === null ? "No sensor" : leveled ? "Level" : "Off level"}
        </span>
        <span className="truncate text-[10px] text-white/30 tabular-nums">
          {leveled === null ? "Controller offline" : `${pitch.toFixed(1)}° / ${roll.toFixed(1)}°`}
        </span>
      </Tile>
    </section>
  );
}