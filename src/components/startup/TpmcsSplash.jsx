import "./TpmcsSplash.css";

// A fixed set of dust motes so the server and the browser render the same
// field (random positions would break hydration).
const DUST = [
  { x: 12, y: 18, s: 2, o: 0.5, delay: 0, dur: 11 },
  { x: 22, y: 62, s: 1.5, o: 0.35, delay: 1.4, dur: 13 },
  { x: 31, y: 33, s: 2.5, o: 0.4, delay: 2.6, dur: 15 },
  { x: 41, y: 12, s: 1.5, o: 0.55, delay: 0.6, dur: 12 },
  { x: 48, y: 74, s: 2, o: 0.3, delay: 3.1, dur: 16 },
  { x: 56, y: 26, s: 1.5, o: 0.45, delay: 1.9, dur: 10 },
  { x: 63, y: 54, s: 2, o: 0.4, delay: 4.2, dur: 14 },
  { x: 71, y: 16, s: 2.5, o: 0.5, delay: 2.2, dur: 12 },
  { x: 78, y: 44, s: 1.5, o: 0.35, delay: 0.9, dur: 17 },
  { x: 86, y: 68, s: 2, o: 0.4, delay: 3.6, dur: 13 },
  { x: 91, y: 28, s: 1.5, o: 0.5, delay: 5.1, dur: 11 },
  { x: 17, y: 84, s: 2, o: 0.3, delay: 2.9, dur: 15 },
  { x: 36, y: 92, s: 1.5, o: 0.28, delay: 4.7, dur: 16 },
  { x: 59, y: 88, s: 2, o: 0.32, delay: 1.2, dur: 14 },
  { x: 82, y: 90, s: 1.5, o: 0.3, delay: 3.3, dur: 15 },
  { x: 7, y: 46, s: 1.5, o: 0.4, delay: 5.4, dur: 12 },
  { x: 95, y: 60, s: 2, o: 0.35, delay: 2.4, dur: 13 },
  { x: 27, y: 8, s: 1.5, o: 0.45, delay: 6.1, dur: 11 },
  { x: 68, y: 82, s: 1.5, o: 0.3, delay: 4.4, dur: 16 },
  { x: 52, y: 40, s: 2, o: 0.25, delay: 0.3, dur: 18 },
];

// The TPMCS brand splash: mirrored chevron mark, spaced wordmark, a glowing
// rule, and the light field rising from the floor of the frame.
export default function TpmcsSplash() {
  return (
    <div className="tpm">
      <div className="tpm__rays" aria-hidden="true" />
      <div className="tpm__floor" aria-hidden="true" />

      <div className="tpm__dust" aria-hidden="true">
        {DUST.map((mote, index) => (
          <i
            key={index}
            style={{
              left: `${mote.x}%`,
              top: `${mote.y}%`,
              width: `${mote.s}px`,
              height: `${mote.s}px`,
              opacity: mote.o,
              animationDelay: `${mote.delay}s`,
              animationDuration: `${mote.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="tpm__lockup">
        <img className="tpm__mark" src="/branding/tpmcs-logo.svg" alt="" aria-hidden="true" />
        <div className="tpm__word">TPMCS</div>
        <div className="tpm__rule" aria-hidden="true" />
      </div>
    </div>
  );
}