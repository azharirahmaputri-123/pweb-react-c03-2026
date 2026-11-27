// [ORANG 3] Undo Delete 5 detik. ID setTimeout disimpan di useRef.
import { useCallback, useEffect, useRef, useState } from "react";
import type { Application } from "../types";

export interface UseUndoDeleteResult {
  toast: { message: string; secondsLeft: number } | null;
  deleteWithUndo: (app: Application) => void;
  undo: () => void;
}

const UNDO_SECONDS = 5;

export function useUndoDelete(
  onRemove: (id: string) => void,
  onRestore: (app: Application) => void
): UseUndoDeleteResult {
  const [toast, setToast] = useState<{ message: string; secondsLeft: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAppRef = useRef<Application | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const deleteWithUndo = useCallback(
    (app: Application) => {
      clearTimers();
      onRemove(app.id);
      pendingAppRef.current = app;
      setToast({
        message: `Lamaran ${app.company} telah dihapus.`,
        secondsLeft: UNDO_SECONDS,
      });

      intervalRef.current = setInterval(() => {
        setToast((prev) =>
          prev && prev.secondsLeft > 1
            ? { ...prev, secondsLeft: prev.secondsLeft - 1 }
            : prev
        );
      }, 1000);

      timerRef.current = setTimeout(() => {
        clearTimers();
        pendingAppRef.current = null;
        setToast(null);
      }, UNDO_SECONDS * 1000);
    },
    [clearTimers, onRemove]
  );

  const undo = useCallback(() => {
    clearTimers();
    if (pendingAppRef.current) {
      onRestore(pendingAppRef.current);
      pendingAppRef.current = null;
    }
    setToast(null);
  }, [clearTimers, onRestore]);

  return { toast, deleteWithUndo, undo };
}
