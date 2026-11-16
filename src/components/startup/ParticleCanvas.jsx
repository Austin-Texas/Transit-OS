import { useEffect, useRef } from "react";

// Slow drifting motes in cyan and violet; the ambient depth of the boot scene.
export default function ParticleCanvas({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let particles = [];
    const palette = [
      [0, 240, 255],
      [112, 0, 255],
      [140, 233, 255],
    ];

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, (width * height) / 24000)));
      particles = Array.from({ length: count }, () => {
        const color = palette[Math.floor(Math.random() * palette.length)];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.7 + 0.4,
          speed: Math.random() * 0.24 + 0.05,
          sway: Math.random() * 1.4 + 0.3,
          phase: Math.random() * Math.PI * 2,
          color,
        };
      });
    };

    const draw = (time) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -6) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        const drift = Math.sin(time / 1600 + p.phase) * p.sway;
        const twinkle = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(time / 700 + p.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${twinkle})`;
        ctx.arc(p.x + drift, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    seed();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", seed);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", seed);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}