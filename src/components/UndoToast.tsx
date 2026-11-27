// [ORANG 3] Toast undo delete
export interface UndoToastProps {
  toast: { message: string; secondsLeft: number } | null;
  onUndo: () => void;
}

export default function UndoToast({ toast, onUndo }: UndoToastProps) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        background: "#1e293b",
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: "10px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        zIndex: 9999,
        fontSize: "14px",
      }}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={onUndo}
        style={{
          background: "#38bdf8",
          color: "#0f172a",
          border: "none",
          borderRadius: "6px",
          padding: "5px 12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Undo ({toast.secondsLeft}d)
      </button>
    </div>
  );
}
