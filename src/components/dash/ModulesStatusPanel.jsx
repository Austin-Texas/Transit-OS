import { Cpu } from "lucide-react";
import Panel from "@/components/van/Panel";
import { cn } from "@/lib/utils";

const STATE = {
  online: { label: "Online", tone: "bg-ios-green/15 text-ios-green" },
  degraded: { label: "Degraded", tone: "bg-ios-orange/15 text-ios-orange" },
  offline: { label: "Offline", tone: "bg-ios-pink/15 text-ios-pink" },
};

const seen = (iso) => {
  if (!iso) return "never reported";
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return "never reported";
  return `seen ${at.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" })} UTC`;
};

// The van itself and every module in the registry, with the state each one last
// reported. Live changes arrive through the realtime subscription.
export default function ModulesStatusPanel({ status, modules = [], offline }) {
  const online = modules.filter((module) => module.connection_status === "online").length;

  return (
    <Panel
      title="Vehicle modules"
      icon={Cpu}
      accent="text-ios-teal"
      to="/devices"
      action={
        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-white/60">
          {online}/{modules.length} online
        </span>
      }
    >
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.05] px-3 py-2.5 ring-1 ring-inset ring-white/[0.08]">
        <span className="min-w-0">
          <span className="block truncate text-[12.5px] font-semibold text-white">{status?.vehicle_name}</span>
          <span className="block truncate text-[10.5px] text-white/40">
            {status?.trim} · {status?.active_mode}
          </span>
        </span>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            offline ? STATE.offline.tone : STATE.online.tone
          )}
        >
          {offline ? STATE.offline.label : STATE.online.label}
        </span>
      </div>

      <ul className="mt-2 flex flex-col">
        {modules.length ? (
          modules.slice(0, 6).map((module) => {
            const state = STATE[module.connection_status] ?? STATE.offline;
            return (
              <li
                key={module.id}
                className="flex items-center justify-between gap-2.5 border-b border-white/[0.07] py-2 last:border-0"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-medium text-white/85">
                    {module.name ?? module.module_id}
                  </span>
                  <span className="block truncate text-[10px] text-white/35">
                    {module.location ?? module.model} · {seen(module.last_seen)}
                  </span>
                </span>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", state.tone)}>
                  {state.label}
                </span>
              </li>
            );
          })
        ) : (
          <li className="py-2 text-[11.5px] leading-snug text-white/35">
            No expansion modules in the registry yet. Register them in the device hub.
          </li>
        )}
      </ul>

      {modules.length > 6 ? (
        <p className="mt-2 text-[10.5px] text-white/30">+{modules.length - 6} more in the device hub</p>
      ) : null}
    </Panel>
  );
}