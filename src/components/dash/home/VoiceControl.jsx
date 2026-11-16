import { useEffect, useState } from "react";
import { ArrowRight, Mic, Send, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { VOICE_EXAMPLES } from "@/lib/voiceCommands";
import { cn } from "@/lib/utils";

// The microphone on the dashboard: listens, shows what it heard, runs the
// command and reports back what TransitOS did.
export default function VoiceControl({ onSubmit }) {
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState(null);
  const [typed, setTyped] = useState("");
  const [spoken, setSpoken] = useState(true);

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

  // Replies are read back aloud, so a command can be given and confirmed
  // without looking at the screen.
  useEffect(() => {
    if (!reply || !spoken) return undefined;
    if (typeof window === "undefined" || !window.speechSynthesis) return undefined;
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.rate = 1.02;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return undefined;
  }, [reply, spoken]);

  const panelOpen = speech.listening || Boolean(heard) || Boolean(reply) || Boolean(speech.error);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[96px] z-40 flex flex-col items-end gap-2 px-3 sm:bottom-[104px] sm:px-4">
      {panelOpen ? (
        <div className="glass pointer-events-auto w-full max-w-[350px] overflow-hidden rounded-[24px]">
          <header className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-2.5">
            <Sparkles className="h-4 w-4 text-ios-teal" strokeWidth={2} />
            <span className="text-[12.5px] font-semibold text-white/75">
              {speech.listening ? "Listening…" : "Voice control"}
            </span>
            {speech.listening ? (
              <span className="ml-0.5 flex items-end gap-[2px]">
                {[0, 1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className="w-[2.5px] animate-soft-pulse rounded-full bg-ios-teal"
                    style={{ height: `${7 + bar * 3}px`, animationDelay: `${bar * 120}ms` }}
                  />
                ))}
              </span>
            ) : null}
            <span className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (spoken) window.speechSynthesis?.cancel();
                  setSpoken((value) => !value);
                }}
                aria-label={spoken ? "Mute spoken replies" : "Unmute spoken replies"}
                aria-pressed={spoken}
                className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                {spoken ? (
                  <Volume2 className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <VolumeX className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  speech.stop();
                  window.speechSynthesis?.cancel();
                  setHeard("");
                  setReply(null);
                }}
                aria-label="Close voice control"
                className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </span>
          </header>

          <div className="space-y-2.5 px-4 py-3.5">
            {speech.error ? (
              <p className="rounded-xl bg-ios-orange/15 px-3 py-2 text-[11.5px] leading-relaxed text-ios-orange">
                {speech.error}
              </p>
            ) : null}

            {heard ? (
              <div>
                <p className="text-[10.5px] font-medium text-white/35">You said</p>
                <p className="mt-0.5 text-[13px] leading-snug text-white">“{heard}”</p>
              </div>
            ) : null}

            {reply ? (
              <div className="rounded-xl bg-ios-teal/[0.12] px-3 py-2">
                <p className="text-[10.5px] font-semibold text-ios-teal">TransitOS</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-white/85">{reply}</p>
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
                  className="min-w-0 flex-1 rounded-full bg-white/[0.08] px-3.5 py-2 text-[12px] text-white placeholder:text-white/30 ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-white/25"
                />
                <button
                  type="submit"
                  aria-label="Send command"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ios-blue text-white transition hover:brightness-110"
                >
                  <Send className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </form>
            ) : null}

            {!heard && !reply && !speech.error ? (
              <div>
                <p className="text-[10.5px] font-semibold text-ios-teal">Try saying</p>
                <ul className="mt-1.5 space-y-1">
                  {VOICE_EXAMPLES.slice(0, 4).map((example) => (
                    <li key={example} className="flex items-start gap-1.5 text-[12px] leading-snug text-white/50">
                      <ArrowRight className="mt-[3px] h-3 w-3 shrink-0 text-ios-teal" strokeWidth={2.6} />
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
          "glass pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-3 text-[12.5px] font-semibold transition duration-200 active:scale-[0.98]",
          speech.listening
            ? "bg-ios-pink/25 text-white"
            : "text-white/85 hover:bg-white/[0.12]"
        )}
        style={speech.listening ? { boxShadow: "0 18px 44px -20px rgba(255,55,95,0.9)" } : undefined}
      >
        <span className="relative grid h-6 w-6 place-items-center">
          {speech.listening ? <span className="absolute inset-0 animate-ping rounded-full bg-ios-pink/50" /> : null}
          <Mic className={cn("relative h-4 w-4", speech.listening ? "text-white" : "text-ios-teal")} strokeWidth={2.2} />
        </span>
        {speech.listening ? "Listening" : "Voice"}
      </button>
    </div>
  );
}