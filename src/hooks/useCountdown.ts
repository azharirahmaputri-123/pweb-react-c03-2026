// [ORANG 3] Countdown timer untuk Interview Prep (default 120 detik).
import { useState, useEffect, useRef } from "react";

export interface UseCountdownResult {
  secondsLeft: number;
  isRunning: boolean;
  toggle: () => void; // Start / Pause
  reset: () => void; // balik ke 02:00
}

export function useCountdown(initialSeconds: number = 120): UseCountdownResult {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Wajib cleanup: clearInterval agar timer berhenti bersih saat unmount / pause
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, secondsLeft]);

  const toggle = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  };

  return {
    secondsLeft,
    isRunning,
    toggle,
    reset,
  };
}
