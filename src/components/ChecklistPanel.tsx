// [ORANG 2] Checklist persiapan (nested)
import { useState, type FormEvent } from "react";
import type { ChecklistItem } from "../types";
import "./pipeline.css";

export interface ChecklistPanelProps {
  items: ChecklistItem[];
  onAdd: (text: string) => void;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export default function ChecklistPanel({
  items,
  onAdd,
  onToggle,
  onRemove,
}: ChecklistPanelProps) {
  const [inputText, setInputText] = useState("");

  const total = items.length;
  const completed = items.filter((i) => i.done).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAdd(inputText.trim());
    setInputText("");
  };

  return (
    <div className="wr-card">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h4 style={{ margin: 0, fontSize: "15px", color: "#0f172a" }}>Daftar Persiapan</h4>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
          {completed} / {total} selesai ({progressPercent}%)
        </span>
      </header>

      {/* Modern Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "7px",
          backgroundColor: "#e2e8f0",
          borderRadius: "9999px",
          overflow: "hidden",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            backgroundColor: progressPercent === 100 ? "#10b981" : "#0f766e",
            borderRadius: "9999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* List Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px", maxHeight: "200px", overflowY: "auto" }}>
        {items.length === 0 ? (
          <div style={{ color: "#94a3b8", fontSize: "13px", padding: "8px 0" }}>
            Belum ada checklist persiapan.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "10px",
                background: item.done ? "#f8fafc" : "#ffffff",
                border: "1px solid #e2e8f0",
                transition: "all 0.15s",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  flex: 1,
                  textDecoration: item.done ? "line-through" : "none",
                  color: item.done ? "#94a3b8" : "#1e293b",
                  fontSize: "13px",
                }}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggle(item.id)}
                  style={{ accentColor: "#0f766e" }}
                />
                <span>{item.text}</span>
              </label>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                title="Hapus tugas"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Form tambah checklist */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Tambah tugas persiapan baru..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="wr-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="wr-btn wr-btn-primary">
          Tambah
        </button>
      </form>
    </div>
  );
}
