import { useCallback, useEffect, useRef, useState } from "react";

// Browser speech recognition, kept in one place so the microphone button only
// deals with listening, hearing and turning it off again.
export default function useSpeechRecognition({ onTranscript }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const recognition = useRef(null);
  const handler = useRef(onTranscript);
  handler.current = onTranscript;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return undefined;

    const instance = new Recognition();
    instance.lang = "en-US";
    instance.continuous = false;
    instance.interimResults = true;
    instance.maxAlternatives = 1;

    instance.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      handler.current?.({ interim: interim.trim(), final: final.trim() });
    };

    instance.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access is blocked. Allow it in your browser, then tap the microphone again.");
      } else if (event.error === "no-speech") {
        setError("I did not hear anything. Tap the microphone and speak.");
      } else if (event.error !== "aborted") {
        setError(`Voice input stopped: ${event.error}.`);
      }
    };

    instance.onend = () => setListening(false);

    recognition.current = instance;
    setSupported(true);

    return () => {
      instance.onresult = null;
      instance.onerror = null;
      instance.onend = null;
      try {
        instance.abort();
      } catch (abortError) {
        /* already stopped */
      }
      recognition.current = null;
    };
  }, []);

  const start = useCallback(() => {
    setError(null);
    if (!recognition.current) {
      setError("Voice input isn't supported in this browser. Type the command instead.");
      return;
    }
    try {
      recognition.current.start();
      setListening(true);
    } catch (startError) {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recognition.current?.stop();
    } catch (stopError) {
      /* already stopped */
    }
    setListening(false);
  }, []);

  return { supported, listening, error, start, stop };
}