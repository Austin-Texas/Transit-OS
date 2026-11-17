import { useEffect, useState } from "react";

// A tiny client-side signal: the startup film has finished, so the dashboard
// can light its surfaces up as the overlay fades away.
let booted = false;
const listeners = new Set();

export function markBooted() {
  if (booted) return;
  booted = true;
  listeners.forEach((listener) => listener());
}

export function useBootReady() {
  const [ready, setReady] = useState(booted);
  useEffect(() => {
    if (ready) return undefined;
    const listener = () => setReady(true);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [ready]);
  return ready;
}