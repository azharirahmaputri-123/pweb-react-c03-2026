// [ORANG 3] Undo Delete 5 detik. ID setTimeout disimpan di useRef.
import type { Application } from "../types";

export interface UseUndoDeleteResult {
  toast: { message: string; secondsLeft: number } | null;
  deleteWithUndo: (app: Application) => void;
  undo: () => void;
}

export function useUndoDelete(
  _onRemove: (id: string) => void,
  _onRestore: (app: Application) => void
): UseUndoDeleteResult {
  // TODO: timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  //       hapus 2x berturut-turut -> clearTimeout(timerRef.current) dulu
  throw new Error("TODO: useUndoDelete");
}
