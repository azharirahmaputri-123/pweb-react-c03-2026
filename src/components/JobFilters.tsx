// [ORANG 1] Search, filter, sort, toggle sumber
import type { DataSource, ExploreSort } from "../types";

export interface JobFiltersProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  category: string;
  categories: string[];
  onCategoryChange: (v: string) => void;
  sort: ExploreSort;
  onSortChange: (v: ExploreSort) => void;
  source: DataSource;
  onSourceChange: (v: DataSource) => void;
}

export default function JobFilters(p: JobFiltersProps) {
  return (
    <div className="card">
      <div className="row">
        <input
          type="search"
          value={p.keyword}
          onChange={(e) => p.onKeywordChange(e.target.value)}
          placeholder="Cari posisi atau perusahaan…"
          aria-label="Cari lowongan"
        />
        <select value={p.category} onChange={(e) => p.onCategoryChange(e.target.value)} aria-label="Filter kategori">
          <option value="ALL">Semua Kategori</option>
          {p.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={p.sort} onChange={(e) => p.onSortChange(e.target.value as ExploreSort)} aria-label="Urutkan">
          <option value="match-tertinggi">Match Tertinggi</option>
          <option value="default">Urutan Asli</option>
        </select>
      </div>
      <fieldset className="row">
        <legend>Sumber Data Lowongan</legend>
        <label>
          <input type="radio" name="source" checked={p.source === "live"} onChange={() => p.onSourceChange("live")} /> Remotive API (Live)
        </label>
        <label>
          <input type="radio" name="source" checked={p.source === "local"} onChange={() => p.onSourceChange("local")} /> Dataset Magang ID (Lokal)
        </label>
      </fieldset>
    </div>
  );
}
