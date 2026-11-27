// [ORANG 2] Filter gabungan pipeline
import type { ApplicationStatus, PipelineSort } from "../types";

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

const STATUS_OPTIONS: Array<{ value: ApplicationStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "Semua Status" },
  { value: "WISHLIST", label: "Wishlist" },
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "GHOSTED", label: "Ghosted" },
];

export default function PipelineFilters({ value, onChange }: PipelineFiltersProps) {
  return (
    <div className="card pipeline-filters">
      <div className="pipeline-filters-row">
        <input
          type="search"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Cari perusahaan atau posisi… (tekan /)"
          aria-label="Cari lamaran di pipeline"
        />

        <select
          value={value.status}
          onChange={(e) =>
            onChange({ ...value, status: e.target.value as ApplicationStatus | "ALL" })
          }
          aria-label="Filter status lamaran"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as PipelineSort })}
          aria-label="Urutkan pipeline"
        >
          <option value="terbaru">Terbaru Diperbarui</option>
          <option value="interview-terdekat">Jadwal Interview Terdekat</option>
          <option value="offer-tertinggi">Offer Tertinggi</option>
        </select>

        <label className="checkbox-pill">
          <input
            type="checkbox"
            checked={value.onlyGhosting}
            onChange={(e) => onChange({ ...value, onlyGhosting: e.target.checked })}
          />
          <span>Hanya Rawan Ghosting</span>
        </label>
      </div>
    </div>
  );
}
