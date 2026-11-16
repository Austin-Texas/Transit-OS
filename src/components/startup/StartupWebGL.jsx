import { useEffect, useRef } from "react";
import { createStartupScene } from "@/lib/startupScene3d";
import { stageAt } from "@/lib/startupStages";

// Mounts the WebGL scene and drives it from a single requestAnimationFrame
// loop. React only re-renders when the stage changes, never per frame.
export default function StartupWebGL({ onStage, onFail }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(-1);
  const stageHandler = useRef(onStage);
  const failHandler = useRef(onFail);
  stageHandler.current = onStage;
  failHandler.current = onFail;

  useEffect(() => {
    const canvas = canvasRef.current;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

    let scene;
    try {
      scene = createStartupScene({ canvas, lowPower });
    } catch (error) {
      failHandler.current?.();
      return undefined;
    }

    let frame = 0;
    let started = 0;
    const loop = (now) => {
      if (!started) started = now;
      const seconds = (now - started) / 1000;
      scene.update(seconds);
      const stage = stageAt(seconds);
      if (stage !== stageRef.current) {
        stageRef.current = stage;
        stageHandler.current?.(stage);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const resize = () => scene.resize();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      scene.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}