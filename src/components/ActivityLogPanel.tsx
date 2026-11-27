// [ORANG 2] Riwayat aktivitas
import { useMemo, useState, type FormEvent } from "react";
import type { ActivityLog } from "../types";
import { formatDateTime } from "../utils/format";

export interface ActivityLogPanelProps {
  logs: ActivityLog[];
  onAddNote: (message: string) => void;
}

export default function ActivityLogPanel({ logs, onAddNote }: ActivityLogPanelProps) {
  const [note, setNote] = useState("");

  const orderedLogs = useMemo(
    () =>
      [...logs].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)),
    [logs]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (note.trim() === "") return;
    onAddNote(note);
    setNote("");
  }

  return (
    <section className="card detail-panel">
      <h4>Riwayat Aktivitas</h4>

      <form onSubmit={handleSubmit} className="row add-inline-form">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catat progress atau follow-up manual…"
          aria-label="Catatan aktivitas baru"
        />
        <button type="submit" className="btn btn-secondary">
          Catat
        </button>
      </form>

      {orderedLogs.length === 0 ? (
        <p className="muted">Belum ada riwayat aktivitas.</p>
      ) : (
        <ul className="activity-timeline">
          {orderedLogs.map((log) => (
            <li key={log.id} className="activity-item">
              <div className="muted activity-time">{formatDateTime(log.timestamp)}</div>
              <div>{log.message}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
