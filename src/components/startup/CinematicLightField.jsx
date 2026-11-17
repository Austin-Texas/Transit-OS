import { useEffect, useRef } from "react";

// GPU-friendly cinematic light field: layered particles, atmospheric beams and
// a perspective-projected luminous floor. Uses the real TPMCS logo separately.
export default function CinematicLightField({ stage }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(stage);
  stageRef.current = stage;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, pixelRatio = 1, raf = 0;
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
      const t = (now - started) / 1500; // Match 1.5x slower cinematic timeline.
      const stageNow = stageRef.current;
      // Match the storyboard: black for the first 0.5s, then energy grows.
      const reveal = Math.max(0, Math.min(1, (t - 0.5) / 0.85));
      const fadeOut = t > 4.45 ? Math.max(0.15, 1 - (t - 4.45) / 1.15) : 1;
      const cx = width / 2;
      const horizon = height * (stageNow === 6 ? 0.77 : 0.79);
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "screen";
      context.globalAlpha = reveal * fadeOut;
      // Soft atmospheric halo behind the TPMCS mark.
      const halo = context.createRadialGradient(cx, horizon, 0, cx, horizon, width * 0.57);
      halo.addColorStop(0, "rgba(0,218,255,.25)");
      halo.addColorStop(0.16, "rgba(0,100,255,.14)");
      halo.addColorStop(0.55, "rgba(17,35,118,.045)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);
      // Rays spread from the luminous floor ring into the dark studio.
      for (let i = 0; i < 28; i++) {
        const angle = -Math.PI + (i / 27) * Math.PI;
        const reach = Math.min(width, height * 1.5);
        const x = cx + Math.cos(angle) * reach;
        const y = horizon + Math.sin(angle) * reach * .86;
        const brightness = (0.018 + .035 * (0.5 + .5 * Math.sin(t * .8 + i * 1.3)));
        context.beginPath();
        context.moveTo(cx, horizon);
        context.lineTo(x, y);
        context.strokeStyle = "rgba(10,157,255," + brightness + ")";
        context.lineWidth = 1 + (i % 4);
        context.stroke();
      }
      // Elliptical energy ring, with multiple bright layered strokes.
      const rx = Math.min(width * .31, 370);
      const ry = Math.max(11, Math.min(height * .052, 37));
      const pulse = 1 + .018 * Math.sin(t * 1.5);
      for (const [thickness, alpha, color] of [[32,.06,"0,154,255"],[16,.13,"0,199,255"],[6,.65,"0,216,255"],[2,.98,"178,251,255"]]) {
        context.beginPath();
        context.ellipse(cx, horizon, rx * pulse, ry * pulse, 0, 0, Math.PI * 2);
        context.strokeStyle = "rgba(" + color + "," + alpha + ")";
        context.lineWidth = thickness;
        context.stroke();
      }
      // Ground reflection beneath the ring.
      const reflection = context.createRadialGradient(cx,horizon+15,3,cx,horizon+15,rx);
      reflection.addColorStop(0,"rgba(0,210,255,.21)");
      reflection.addColorStop(.4,"rgba(0,82,255,.07)");
      reflection.addColorStop(1,"rgba(0,0,0,0)");
      context.fillStyle=reflection;
      context.fillRect(cx-rx,horizon,rx*2,height-horizon);
      // Initialization stage has a luminous dotted perspective grid.
      if (stageNow === 6) {
        for (let row=0;row<20;row++) {
          const depth=(row+1)/20;
          const y=horizon + Math.pow(depth,1.85)*(height-horizon+35);
          const spread=width*(.08+depth*.65);
          for(let col=-27;col<=27;col++){
            const x=cx+col/27*spread;
            const intensity=.15+.3*Math.sin(t*1.2+col*.11+row*.16)**2;
            context.beginPath();
            context.arc(x,y,Math.max(.5,depth*1.6),0,Math.PI*2);
            context.fillStyle="rgba(0,166,255,"+intensity+")";
            context.fill();
          }
        }
      }
      // Slowly drifting points of light.
      for (const particle of particles) {
        const distance = particle.distance * Math.min(width, height) * .65;
        const x = cx + Math.cos(particle.angle) * distance;
        const y = horizon - Math.abs(Math.sin(particle.angle)) * distance * .95;
        const flicker = .15 + .35 * (0.5 + .5 * Math.sin(t * .8 + particle.phase));
        context.beginPath();
        context.arc(x,y,particle.radius,0,Math.PI*2);
        context.fillStyle="rgba(58,192,255,"+flicker+")";
        context.fill();
      }
      context.restore();
      if (!motion.matches) raf=requestAnimationFrame(draw);
    }
    raf=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="tp-movie__light-field" aria-hidden="true" />;
}
