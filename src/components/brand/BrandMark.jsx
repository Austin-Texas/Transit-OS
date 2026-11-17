import { cn } from "@/lib/utils";

// The official TPMCS mark, always centered in its tile and scaled to the same
// proportion, so every header on every screen shows it the same way.
const VARIANTS = {
  glass: "rounded-[13px] bg-white/[0.06] ring-1 ring-inset ring-white/[0.1] shadow-[0_10px_24px_-16px_rgba(0,0,0,0.95)]",
  light: "rounded-[14px] bg-white/[0.09] ring-1 ring-inset ring-white/[0.14]",
  neon: "rounded-xl border border-neon/35 bg-neon/[0.07] shadow-[0_0_22px_-8px_rgba(0,240,255,1)]",
};

export default function BrandMark({ variant = "glass", className = "h-10 w-10" }) {
  return (
    <span className={cn("grid shrink-0 place-items-center overflow-hidden", VARIANTS[variant], className)}>
      <img
        src="/branding/tpmcs-logo.svg"
        alt="TPMCS"
        draggable={false}
        className="h-[68%] w-[68%] object-contain"
      />
    </span>
  );
}