import { useEffect, useState } from "react";
import { ArrowRight, Mic, Send, Sparkles, X } from "lucide-react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { VOICE_EXAMPLES } from "@/lib/voiceCommands";
import { cn } from "@/lib/utils";

// The microphone on the dashboard: listens, shows what it heard, runs the
// command and reports back what TransitOS did.
export default function VoiceControl({ onSubmit }) {
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState(null);
  const [typed, setTyped] = useState("");

  const run = (text) => {
    const answer = onSubmit(text);
    setReply(answer);
    return answer;
  };

  const speech = useSpeechRecognition({
    onTranscript: ({ interim, final }) => {
      if (interim) setHeard(interim);
      if (final) {
        setHeard(final);
        run(final);
      }
    },
  });

  useEffect(() => {
    if (speech.error) setReply(null);
  }, [speech.error]);

  const panelOpen = speech.listening || Boolean(heard) || Boolean(reply) || Boolean(speech.error);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[86px] z-40 flex flex-col items-end gap-2 px-3 sm:bottom-[92px] sm:px-4">
      {panelOpen ? (
        <div className="pointer-events-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-neon/35 bg-ink-950/95 shadow-[0_24px_60px_-28px_rgba(0,240,255,0.75)] backdrop-blur-xl">
          <header className="flex items-center gap-2 border-b border-white/[0.07] px-3.5 py-2">
            <Sparkles className="h-3.5 w-3.5 text-neon" strokeWidth={2} />
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/55">
              {speech.listening ? "Listening" : "Voice control"}
            </span>
            {speech.listening ? (
              <span className="ml-1 flex items-end gap-[2px]">
                {[0, 1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className="w-[2px] animate-soft-pulse rounded-full bg-neon"
                    style={{ height: `${6 + bar * 3}px`, animationDelay: `${bar * 120}ms` }}
                  />
                ))}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                speech.stop();
                setHeard("");
                setReply(null);
              }}
              aria-label="Close voice control"
              className="ml-auto rounded p-1 text-white/35 transition hover:text-white"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.4} />
            </button>
          </header>

          <div className="space-y-2.5 px-3.5 py-3">
            {speech.error ? (
              <p className="rounded-lg border border-warn/40 bg-warn/10 px-2.5 py-2 text-[10.5px] leading-relaxed text-warn">
                {speech.error}
              </p>
            ) : null}

            {heard ? (
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.18em] text-white/30">You said</p>
                <p className="mt-0.5 text-[12px] leading-snug text-white">“{heard}”</p>
              </div>
            ) : null}

            {reply ? (
              <div className="rounded-lg border border-neon/30 bg-neon/[0.07] px-2.5 py-2">
                <p className="text-[8.5px] uppercase tracking-[0.18em] text-neon/70">TransitOS</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-white/85">{reply}</p>
              </div>
            ) : null}

            {!speech.supported ? (
              <form
                className="flex items-center gap-1.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  const text = typed.trim();
                  if (!text) return;
                  setHeard(text);
                  setTyped("");
                  run(text);
                }}
              >
                <input
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                  placeholder="Type a command…"
                  aria-label="Type a voice command"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white placeholder:text-white/25 focus:border-neon/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send command"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-neon/40 bg-neon/15 text-neon"
                >
                  <Send className="h-3.5 w-3.5" strokeWidth={2.2} />
                </button>
              </form>
            ) : null}

            {!heard && !reply && !speech.error ? (
              <div>
                <p className="text-[8.5px] uppercase tracking-[0.18em] text-neon/70">Try saying</p>
                <ul className="mt-1.5 space-y-1">
                  {VOICE_EXAMPLES.slice(0, 4).map((example) => (
                    <li key={example} className="flex items-start gap-1.5 text-[10.5px] leading-snug text-white/45">
                      <ArrowRight className="mt-[3px] h-2.5 w-2.5 shrink-0 text-neon/60" strokeWidth={2.6} />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (speech.listening) {
            speech.stop();
            return;
          }
          setHeard("");
          setReply(null);
          speech.start();
        }}
        aria-label={speech.listening ? "Stop listening" : "Start voice control"}
        aria-pressed={speech.listening}
        className={cn(
          "pointer-events-auto inline-flex items-center gap-2 rounded-full border px-4 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] shadow-[0_18px_40px_-18px_rgba(0,240,255,0.9)] backdrop-blur transition",
          speech.listening
            ? "border-neon bg-neon/25 text-white"
            : "border-neon/55 bg-ink-950/90 text-neon hover:border-neon hover:bg-neon/15"
        )}
      >
        <span className="relative grid h-6 w-6 place-items-center">
          {speech.listening ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-neon/40" />
          ) : null}
          <Mic className="relative h-4 w-4" strokeWidth={2.2} />
        </span>
        {speech.listening ? "Listening" : "Voice"}
      </button>
    </div>
  );
}