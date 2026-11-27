// [ORANG 3] Countdown timer untuk Interview Prep (default 120 detik).

export interface UseCountdownResult {
  secondsLeft: number;
  isRunning: boolean;
  toggle: () => void; // Start / Pause
  reset: () => void; // balik ke 02:00
}

export function useCountdown(_initialSeconds: number): UseCountdownResult {
  // TODO: setInterval di useEffect + WAJIB return () => clearInterval(...)
  throw new Error("TODO: useCountdown");
}
