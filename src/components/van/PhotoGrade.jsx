import { cn } from "@/lib/utils";

// The shared neon glassmorphism grading every photo surface in TransitOS uses:
// cool cyan in the highlights, deep ink vignette at the edges, a lit top edge.
export default function PhotoGrade({ className }) {
  return (
    <>
      <span
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-tr from-neon/10 via-transparent to-sys-blue/10 mix-blend-screen",
          className
        )}
      />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_40%,rgba(2,10,20,0.78)_100%)]" />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
    </>
  );
}