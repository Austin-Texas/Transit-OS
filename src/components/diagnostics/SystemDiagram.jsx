import DiagramViews from "@/components/van/DiagramViews";

// The right column: the 3D view picker and the readings that belong to it.
export default function SystemDiagram({ active, onSelect, status }) {
  return (
    <section className="glass relative flex flex-col rounded-[26px] p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">System diagram (3D)</h2>
        <span className="text-[10px] text-white/25">tap to turn</span>
      </div>
      <div className="mt-2 flex flex-1 flex-col">
        <DiagramViews active={active} onSelect={onSelect} status={status} />
      </div>
    </section>
  );
}