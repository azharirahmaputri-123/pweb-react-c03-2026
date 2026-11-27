// [ORANG 2] Filter gabungan pipeline
import type { ChangeEvent } from "react";
import type { ApplicationStatus, PipelineSort } from "../types";
import "./pipeline.css";

export interface PipelineFilterState {
  query: string;
  status: ApplicationStatus | "ALL";
  onlyGhosting: boolean;
  sort: PipelineSort;
}

export interface PipelineFiltersProps {
  value: PipelineFilterState;
  onChange: (next: PipelineFilterState) => void;
}

export default function PipelineFilters({ value, onChange }: PipelineFiltersProps) {
  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, query: e.target.value });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, status: e.target.value as ApplicationStatus | "ALL" });
  };

  const handleGhostingToggle = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, onlyGhosting: e.target.checked });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, sort: e.target.value as PipelineSort });
  };

  return (
    <div className="wr-filter-bar">
      <div style={{ flex: 1, minWidth: "260px" }}>
        <input
          type="search"
          placeholder="🔍 Cari posisi atau perusahaan..."
          value={value.query}
          onChange={handleQueryChange}
          className="wr-input"
          style={{ width: "100%", maxWidth: "340px" }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
        <select
          value={value.status}
          onChange={handleStatusChange}
          className="wr-input"
          style={{ cursor: "pointer" }}
        >
          <option value="ALL">Semua Status</option>
          <option value="WISHLIST">WISHLIST</option>
          <option value="APPLIED">APPLIED</option>
          <option value="SCREENING">SCREENING</option>
          <option value="INTERVIEW">INTERVIEW</option>
          <option value="OFFER">OFFER</option>
          <option value="REJECTED">REJECTED</option>
          <option value="GHOSTED">GHOSTED</option>
        </select>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            cursor: "pointer",
            background: value.onlyGhosting ? "#fef2f2" : "#f8fafc",
            padding: "8px 12px",
            borderRadius: "10px",
            border: value.onlyGhosting ? "1px solid #fecaca" : "1px solid #cbd5e1",
            color: value.onlyGhosting ? "#dc2626" : "#334155",
            fontWeight: value.onlyGhosting ? 600 : "normal",
          }}
        >
          <input
            type="checkbox"
            checked={value.onlyGhosting}
            onChange={handleGhostingToggle}
          />
          👻 Hanya Rawan Ghosting
        </label>

        <select
          value={value.sort}
          onChange={handleSortChange}
          className="wr-input"
          style={{ cursor: "pointer" }}
        >
          <option value="terbaru">Terbaru Diperbarui</option>
          <option value="interview-terdekat">Jadwal Interview Terdekat</option>
          <option value="offer-tertinggi">Offer Tertinggi</option>
        </select>
      </div>
    </div>
  );
}
