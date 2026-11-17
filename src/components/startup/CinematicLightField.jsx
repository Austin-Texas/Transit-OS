import { useEffect, useRef } from "react";

// GPU-friendly cinematic light field: layered particles, atmospheric beams and
// an optional perspective-projected luminous floor. The parent owns the
// timeline and passes how strong the field should be.
export default function CinematicLightField({ intensity = 1, floor = false }) {
  const canvasRef = useRef(null);
  const intensityRef = useRef(intensity);
  const floorRef = useRef(floor);
  intensityRef.current = intensity;
  floorRef.current = floor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let raf = 0;
    const particles = Array.from({ length: 145 }, (_, index) => ({
      angle: (index * 2.3999632297) % (Math.PI * 2),
      distance: ((index * 73) % 101) / 101,
      phase: (index * 17) % 79,
      radius: 0.4 + (index % 4) * 0.32,
    }));

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    const started = performance.now();

    function draw(now) {
      const t = (now - started) / 1000;
      const strength = intensityRef.current;
      const cx = width / 2;
      const horizon = height * 0.79;
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "screen";
      context.globalAlpha = strength;

      const halo = context.createRadialGradient(cx, horizon, 0, cx, horizon, width * 0.57);
      halo.addColorStop(0, "rgba(0,218,255,.25)");
      halo.addColorStop(0.16, "rgba(0,100,255,.14)");
      halo.addColorStop(0.55, "rgba(17,35,118,.045)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);

      for (let i = 0; i < 28; i++) {
        const angle = -Math.PI + (i / 27) * Math.PI;
        const reach = Math.min(width, height * 1.5);
        const x = cx + Math.cos(angle) * reach;
        const y = horizon + Math.sin(angle) * reach * 0.86;
        const brightness = 0.018 + 0.035 * (0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.3));
        context.beginPath();
        context.moveTo(cx, horizon);
        context.lineTo(x, y);
        context.strokeStyle = `rgba(10,157,255,${brightness})`;
        context.lineWidth = 1 + (i % 4);
        context.stroke();
      }

      if (floorRef.current) {
        const rows = 23;
        const columns = 65;
        for (let row = 0; row < rows; row++) {
          const depth = (row + 1) / rows;
          const baseY = horizon + Math.pow(depth, 1.65) * (height - horizon + 32);
          const spread = width * (0.23 + depth * 0.54);
          for (let col = 0; col < columns; col++) {
            const xNorm = (col / (columns - 1)) * 2 - 1;
            const x = cx + xNorm * spread;
            const wave = Math.sin(xNorm * 8.5 + t * 1.55 + row * 0.19) * (7 + depth * 11);
            const ripple = Math.cos(xNorm * 13 - t * 1.05 + row * 0.13) * 4;
            const y = baseY + wave + ripple;
            const glow = 0.35 + 0.42 * Math.pow(Math.sin(xNorm * 5.5 + t * 1.3 + row * 0.1), 2);
            context.beginPath();
            context.arc(x, y, 0.55 + depth * 1.45, 0, Math.PI * 2);
            context.fillStyle = `rgba(0,183,255,${glow})`;
            context.fill();
          }
        }
      }

      for (const particle of particles) {
        const distance = particle.distance * Math.min(width, height) * 0.65;
        const x = cx + Math.cos(particle.angle) * distance;
        const y = horizon - Math.abs(Math.sin(particle.angle)) * distance * 0.95;
        const flicker = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 0.8 + particle.phase));
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(58,192,255,${flicker})`;
        context.fill();
      }

      context.restore();
      if (!motion.matches) raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="cin__light-field" aria-hidden="true" />;
}