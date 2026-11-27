// [ORANG 2] Halaman War Room Pipeline
import { useMemo, useState } from "react";
import type { Application } from "../types";
import { isGhostingRisk } from "../utils/ghosting";
import PipelineFilters, { type PipelineFilterState } from "./PipelineFilters";
import ApplicationCard from "./ApplicationCard";

export interface PipelineProps {
  applications: Application[];
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onSimulate: (id: string) => void;
  onDelete: (app: Application) => void;
}

const INITIAL_FILTERS: PipelineFilterState = {
  query: "",
  status: "ALL",
  onlyGhosting: false,
  sort: "terbaru",
};

export default function Pipeline({
  applications,
  kaptenSkills,
  onOpen,
  onSimulate,
  onDelete,
}: PipelineProps) {
  const [filters, setFilters] = useState<PipelineFilterState>(INITIAL_FILTERS);

  const visibleApplications = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    const filtered = applications.filter((app) => {
      if (filters.status !== "ALL" && app.status !== filters.status) return false;
      if (filters.onlyGhosting && !isGhostingRisk(app)) return false;
      if (
        q !== "" &&
        !app.company.toLowerCase().includes(q) &&
        !app.role.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (filters.sort === "interview-terdekat") {
        const tA = a.interviewDateTime ? Date.parse(a.interviewDateTime) : Number.POSITIVE_INFINITY;
        const tB = b.interviewDateTime ? Date.parse(b.interviewDateTime) : Number.POSITIVE_INFINITY;
        const safeA = Number.isNaN(tA) ? Number.POSITIVE_INFINITY : tA;
        const safeB = Number.isNaN(tB) ? Number.POSITIVE_INFINITY : tB;
        if (safeA !== safeB) return safeA - safeB;
      } else if (filters.sort === "offer-tertinggi") {
        const sA = a.salaryOffer ?? -1;
        const sB = b.salaryOffer ?? -1;
        if (sA !== sB) return sB - sA;
      }
      return Date.parse(b.lastUpdatedAt) - Date.parse(a.lastUpdatedAt);
    });

    return sorted;
  }, [applications, filters]);

  return (
    <section className="pipeline-page">
      <PipelineFilters value={filters} onChange={setFilters} />

      <div className="pipeline-summary row between">
        <span className="muted">
          Menampilkan {visibleApplications.length} dari {applications.length} lamaran
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="card state">
          Belum ada lamaran tersimpan. Simpan lowongan dari tab Eksplorasi atau klik{" "}
          <strong>+ Catat Lamaran</strong>.
        </div>
      ) : visibleApplications.length === 0 ? (
        <div className="card state">
          Tidak ada lamaran yang cocok dengan filter aktif.
        </div>
      ) : (
        <div className="pipeline-grid">
          {visibleApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              kaptenSkills={kaptenSkills}
              onOpen={onOpen}
              onSimulate={onSimulate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
