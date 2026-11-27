// [ORANG 2] Riwayat aktivitas
import { useState, type FormEvent } from "react";
import type { ActivityLog } from "../types";
import "./pipeline.css";

export interface ActivityLogPanelProps {
  logs: ActivityLog[];
  onAddNote: (message: string) => void;
}

export default function ActivityLogPanel({ logs, onAddNote }: ActivityLogPanelProps) {
  const [note, setNote] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    onAddNote(note.trim());
    setNote("");
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="wr-card">
      <header style={{ marginBottom: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "15px", color: "#0f172a" }}>Riwayat Aktivitas</h4>
      </header>

      {/* Input catatan manual */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        <input
          type="text"
          placeholder="Tulis catatan perkembangan..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="wr-input"
          style={{ flex: 1, fontSize: "13px" }}
        />
        <button type="submit" className="wr-btn wr-btn-outline" style={{ fontSize: "12px" }}>
          Simpan
        </button>
      </form>

      {/* Timeline List Modern */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxHeight: "220px",
          overflowY: "auto",
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "#94a3b8", fontSize: "13px" }}>
            Belum ada aktivitas tercatat.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{
                borderLeft: "2px solid #0d9488",
                paddingLeft: "10px",
                fontSize: "13px",
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: "11px" }}>
                {formatDate(log.timestamp)}
              </div>
              <div style={{ color: "#334155", marginTop: "2px" }}>{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
