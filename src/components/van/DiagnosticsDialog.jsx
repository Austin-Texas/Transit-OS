import { Activity, Check, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function DiagnosticsDialog({ open, onOpenChange, results }) {
  const issues = results.filter((row) => row.state !== "ok").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neon/25 bg-ink-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Activity className="h-4 w-4 text-neon" strokeWidth={2} />
            System diagnostics
          </DialogTitle>
          <DialogDescription className="text-[11px] text-white/40">
            {issues === 0 ? "All subsystems nominal." : `${issues} subsystem${issues > 1 ? "s" : ""} need attention.`}
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-1 divide-y divide-white/[0.06]">
          {results.map((row) => (
            <li key={row.label} className="flex items-start justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-white/85">{row.label}</p>
                <p className="truncate text-[10px] text-white/40">{row.detail}</p>
              </div>
              <span
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                  row.state === "ok" ? "border-ok/50 bg-ok/10 text-ok" : "border-warn/50 bg-warn/10 text-warn"
                )}
              >
                {row.state === "ok" ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  <TriangleAlert className="h-3 w-3" strokeWidth={2.4} />
                )}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}