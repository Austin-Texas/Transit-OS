import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Radio, RefreshCw, Save, Settings as SettingsIcon, Truck } from "lucide-react";
import { toast } from "sonner";
import useVanDashboard from "@/hooks/useVanDashboard";
import { useAuth } from "@/lib/AuthContext";
import ModuleShell from "@/components/dash/ModuleShell";
import ModuleCard from "@/components/dash/ModuleCard";

export const Route = createFileRoute("/_authed/settings")({
  head: () => ({
    meta: [
      { title: "TransitOS — Settings" },
      { name: "description", content: "Vehicle details, hub sync and account controls." },
    ],
  }),
  component: SettingsPage,
});

const FIELDS = [
  { key: "vehicle_name", label: "Vehicle", placeholder: "2026 Ford Transit" },
  { key: "trim", label: "Trim", placeholder: "Full Extended High Roof" },
  { key: "vin", label: "VIN", placeholder: "1FTBR1C8XPK104482" },
  { key: "odometer", label: "Odometer (mi)", placeholder: "12480", numeric: true },
];

function SettingsPage() {
  const van = useVanDashboard();
  const { status } = van;
  const { user, logout } = useAuth();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const statusId = status?.id;

  useEffect(() => {
    if (!status) return;
    setForm({
      vehicle_name: status.vehicle_name ?? "",
      trim: status.trim ?? "",
      vin: status.vin ?? "",
      odometer: status.odometer ?? "",
    });
  }, [statusId]);

  if (!status) return <ModuleShell title="Settings" />;

  const save = async () => {
    setSaving(true);
    try {
      await van.update({
        vehicle_name: form.vehicle_name?.trim() || status.vehicle_name,
        trim: form.trim?.trim() || status.trim,
        vin: form.vin?.trim() || status.vin,
        odometer: Number(form.odometer) || Number(status.odometer ?? 0),
      });
      toast.success("Vehicle details saved");
    } finally {
      setSaving(false);
    }
  };

  const resync = async () => {
    setSyncing(true);
    try {
      await van.refresh();
      toast.success("Status re-synced from the hub");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <ModuleShell title="Settings" subtitle="Vehicle details, hub sync and your account" status={status}>
      <div className="grid gap-3 lg:grid-cols-2">
        <ModuleCard title="Vehicle details" icon={Truck}>
          <div className="grid gap-2.5">
            {FIELDS.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1 block text-[9.5px] uppercase tracking-[0.16em] text-white/35">{field.label}</span>
                <input
                  type={field.numeric ? "number" : "text"}
                  value={form[field.key] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                  className="w-full rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 font-mono text-[12px] text-white outline-none transition placeholder:text-white/20 focus:border-sys-blue/60"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-sys-blue/45 bg-sys-blue/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sys-blue transition hover:bg-sys-blue/20 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" strokeWidth={2} />
            {saving ? "Saving" : "Save details"}
          </button>
        </ModuleCard>

        <div className="flex flex-col gap-3">
          <ModuleCard title="Hub" icon={SettingsIcon}>
            <p className="rounded-xl border border-line/80 bg-surface-raised px-3 py-3 text-[11px] leading-relaxed text-white/45">
              TransitOS hub connected over Bluetooth Low Energy. Current mode {status.active_mode}, climate{" "}
              {Math.round(status.climate_set ?? 72)}°F, house battery {status.battery_percent}%.
            </p>
            <button
              type="button"
              onClick={resync}
              disabled={syncing}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:border-white/25 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={syncing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} strokeWidth={2} />
              {syncing ? "Syncing" : "Re-sync status"}
            </button>
          </ModuleCard>

          <ModuleCard title="Live telemetry" icon={Radio}>
            <p className="rounded-xl border border-line/80 bg-surface-raised px-3 py-3 text-[11px] leading-relaxed text-white/45">
              Point your van hub at{" "}
              <code className="font-mono text-[11px] text-sys-blue">POST /api/van-telemetry</code> and send the{" "}
              <code className="font-mono text-[11px] text-white/70">x-van-token</code> header. Every reading it posts
              appears on the dashboard instantly.
            </p>
          </ModuleCard>

          <ModuleCard title="Account" icon={LogOut}>
            <p className="truncate rounded-xl border border-line/80 bg-surface-raised px-3 py-2.5 text-[11.5px] text-white/60">
              {user?.email ?? "Signed in"}
            </p>
            <button
              type="button"
              onClick={() => logout()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-alert/40 bg-alert/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-alert transition hover:bg-alert/20"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
              Sign out
            </button>
          </ModuleCard>
        </div>
      </div>
    </ModuleShell>
  );
}