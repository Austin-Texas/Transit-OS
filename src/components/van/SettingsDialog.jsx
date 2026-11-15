import { RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { miles } from "@/lib/van";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-2 last:border-0">
      <span className="text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</span>
      <span className="font-mono text-[11.5px] text-white/85">{value}</span>
    </div>
  );
}

export default function SettingsDialog({ open, onOpenChange, status, onResync, resyncing }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neon/25 bg-ink-900 text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-semibold tracking-tight">Vehicle settings</DialogTitle>
          <DialogDescription className="text-[11px] text-white/40">
            Synced with the TransitOS hub over Bluetooth Low Energy.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1">
          <Row label="Vehicle" value={`${status.vehicle_name} · ${status.trim}`} />
          <Row label="VIN" value={status.vin} />
          <Row label="Odometer" value={`${miles(status.odometer)} mi`} />
          <Row label="House battery" value={`${status.battery_percent}% · ${Number(status.battery_voltage).toFixed(1)} V`} />
          <Row label="Active mode" value={status.active_mode} />
        </div>

        <button
          type="button"
          onClick={onResync}
          disabled={resyncing}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-neon/40 bg-neon/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neon transition hover:bg-neon/20 disabled:opacity-50"
        >
          <RefreshCw className={resyncing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} strokeWidth={2} />
          {resyncing ? "Syncing" : "Re-sync status"}
        </button>
      </DialogContent>
    </Dialog>
  );
}