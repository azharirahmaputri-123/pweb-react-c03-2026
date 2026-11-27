// [ORANG 1] Wrapper state Loading-Error-Empty
import type { ReactNode } from "react";
import type { FetchState } from "../types";

export interface AsyncStateProps {
  state: FetchState;
  errorMessage: string | null;
  isEmpty: boolean;
  onRetry: () => void;
  onFallback: () => void;
  children: ReactNode;
}

export default function AsyncState({ state, errorMessage, isEmpty, onRetry, onFallback, children }: AsyncStateProps) {
  if (state === "idle" || state === "loading") {
    return <div className="state" role="status">Memuat lowongan…</div>;
  }
  if (state === "error") {
    return (
      <div className="state state-error" role="alert">
        <p>{errorMessage ?? "Gagal memuat lowongan."}</p>
        <button type="button" onClick={onRetry}>Coba Lagi</button>{" "}
        <button type="button" onClick={onFallback}>Pakai Data Lokal</button>
      </div>
    );
  }
  if (isEmpty) {
    return <div className="state">Tidak ada lowongan yang cocok. Coba ubah kata kunci atau filter.</div>;
  }
  return <>{children}</>;
}
