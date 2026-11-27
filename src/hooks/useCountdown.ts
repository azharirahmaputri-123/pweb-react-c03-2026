// [ORANG 3] Countdown timer untuk Interview Prep (default 120 detik).
import { useCallback, useEffect, useState } from "react";

export interface UseCountdownResult {
  secondsLeft: number;
  isRunning: boolean;
  toggle: () => void; // Start / Pause
  reset: () => void; // balik ke 02:00
}

export function useCountdown(initialSeconds: number): UseCountdownResult {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
    }
  }, [isRunning, secondsLeft]);

  const toggle = useCallback(() => {
    if (!isRunning && secondsLeft === 0) {
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  }, [isRunning, secondsLeft, initialSeconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  return { secondsLeft, isRunning, toggle, reset };
}
