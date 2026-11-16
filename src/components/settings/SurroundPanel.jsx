import { Orbit } from "lucide-react";
import ModuleCard from "@/components/dash/ModuleCard";
import useCameraSources from "@/hooks/useCameraSources";
import useSurroundClips from "@/hooks/useSurroundClips";
import SurroundView from "./SurroundView";
import SurroundRecorder from "./SurroundRecorder";
import SurroundClips from "./SurroundClips";
import ClipRetention from "./ClipRetention";

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
            Drag to look around the van. The dashcam is armed while TransitOS is open: when a camera reports motion a 360°
            clip saves here on its own, and you can record one any time. Clips are stored privately, so only your account
            can open them.
          </p>
        </div>

        <div className="min-w-0">
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-white/40">Clip library</p>
          <SurroundClips clips={clips} />
          <ClipRetention onPurged={clips.reload} />
        </div>
      </div>
    </ModuleCard>
  );
}