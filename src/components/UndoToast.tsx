// [ORANG 3] Toast undo delete


export interface UndoToastProps {
  toast: { message: string; secondsLeft: number } | null;
  onUndo: () => void;
}

export default function UndoToast(_props: UndoToastProps) {
  // TODO: jika toast null -> return null; tampilkan pesan + tombol Undo (Ns)
  return <div data-component="UndoToast">TODO: UndoToast</div>;
}
