import { Orbit } from "lucide-react";
import ModuleCard from "@/components/dash/ModuleCard";
import useCameraSources from "@/hooks/useCameraSources";
import useSurroundClips from "@/hooks/useSurroundClips";
import SurroundView from "./SurroundView";
import SurroundRecorder from "./SurroundRecorder";
import SurroundClips from "./SurroundClips";

// Tesla-style surround: pan around the van and keep recorded 360° clips.
export default function SurroundPanel({ cameras = [] }) {
  const sources = useCameraSources(cameras);
  const clips = useSurroundClips();
  const urls = sources.map((source) => source.url);

  return (
    <ModuleCard
      title="360° surround"
      icon={Orbit}
      action={
        <span className="font-mono text-[10px] text-white/35">
          {sources.length} {sources.length === 1 ? "camera" : "cameras"}
        </span>
      }
    >
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SurroundView sources={sources}>
            <SurroundRecorder urls={urls} onSaved={clips.reload} />
          </SurroundView>
          <p className="mt-1.5 text-[9px] leading-relaxed text-white/30">
            Drag the view to look around the van, then record a 10-second 360° clip. Clips are stored privately and only
            load for you.
          </p>
        </div>

        <div className="min-w-0">
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40">Recorded clips</p>
          <SurroundClips clips={clips} />
        </div>
      </div>
    </ModuleCard>
  );
}