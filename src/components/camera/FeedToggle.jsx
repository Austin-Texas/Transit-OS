import { cn } from "@/lib/utils";

export default function FeedToggle({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] transition",
        active
          ? "border-sys-blue bg-sys-blue/15 text-sys-blue"
          : "border-line bg-surface text-white/45 hover:text-white/75"
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
      {label}
    </button>
  );
}