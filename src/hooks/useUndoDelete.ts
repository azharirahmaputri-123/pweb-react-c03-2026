// [ORANG 3] Undo Delete 5 detik. ID setTimeout disimpan di useRef.
import { useState, useRef, useEffect } from "react";
import type { Application } from "../types";

export interface UseUndoDeleteResult {
  toast: { message: string; secondsLeft: number } | null;
  deleteWithUndo: (app: Application) => void;
  undo: () => void;
}

export function useUndoDelete(
  onRemove: (id: string) => void,
  onRestore: (app: Application) => void
): UseUndoDeleteResult {
  const [deletedApp, setDeletedApp] = useState<Application | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(5);

  const timeoutRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  // Bersihkan timer saat hook di-unmount
  useEffect(() => {
    return () => clearTimers();
  }, []);

  const deleteWithUndo = (app: Application) => {
    // Jika ada aksi hapus berturut-turut < 5 detik, bersihkan timer lama
    clearTimers();

    // Langsung hapus dari state utama
    onRemove(app.id);

    // Simpan referensi lamaran yang dihapus
    setDeletedApp(app);
    setSecondsLeft(5);

    // Countdown detik toast (5, 4, 3, 2, 1)
    countdownIntervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current !== null) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Timeout final setelah 5 detik
    timeoutRef.current = window.setTimeout(() => {
      setDeletedApp(null);
      clearTimers();
    }, 5000);
  };

  const undo = () => {
    if (deletedApp) {
      onRestore(deletedApp);
      setDeletedApp(null);
      clearTimers();
    }
  };

  const toast = deletedApp
    ? {
        message: `Lamaran "${deletedApp.company}" telah dihapus.`,
        secondsLeft,
      }
    : null;

  return {
    toast,
    deleteWithUndo,
    undo,
  };
}
