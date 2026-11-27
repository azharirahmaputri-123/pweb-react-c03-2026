// [ORANG 2] Checklist persiapan (nested)
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { ChecklistItem } from "../types";

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
  const [text, setText] = useState("");
  const doneCount = items.filter((item) => item.done).length;
  const pct = items.length === 0 ? 0 : Math.round((doneCount / items.length) * 100);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  }

  return (
    <section className="card detail-panel">
      <div className="row between">
        <h4>Daftar Persiapan</h4>
        <span className="muted">
          {doneCount} / {items.length} selesai
        </span>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {items.length === 0 ? (
        <p className="muted">Belum ada tugas persiapan. Tambahkan item di bawah.</p>
      ) : (
        <ul className="checklist-list">
          {items.map((item) => (
            <li key={item.id} className="checklist-item">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggle(item.id)}
                />
                <span className={item.done ? "checklist-done" : ""}>{item.text}</span>
              </label>
              <button
                type="button"
                className="icon-btn"
                onClick={() => onRemove(item.id)}
                aria-label={`Hapus tugas ${item.text}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="row add-inline-form">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tambah tugas persiapan baru…"
          aria-label="Tambah tugas persiapan"
        />
        <button type="submit" className="btn btn-primary">
          Tambah
        </button>
      </form>
    </section>
  );
}
