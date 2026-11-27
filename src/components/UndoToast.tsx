// [ORANG 3] Toast undo delete
export interface UndoToastProps {
  toast: { message: string; secondsLeft: number } | null;
  onUndo: () => void;
}

export default function UndoToast({ toast, onUndo }: UndoToastProps) {
  if (toast === null) return null;

  return (
    <div className="undo-toast" role="status" aria-live="polite">
      <span>{toast.message}</span>
      <button type="button" className="undo-toast-btn" onClick={onUndo}>
        Undo ({toast.secondsLeft}d)
      </button>
    </div>
  );
}
