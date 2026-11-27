// [ORANG 2] Halaman War Room Pipeline
import { useState, useMemo } from "react";
import type { Application } from "../types";
import { isGhostingRisk } from "../utils/ghosting";
import PipelineFilters, { type PipelineFilterState } from "./PipelineFilters";
import ApplicationCard from "./ApplicationCard";
import "./pipeline.css";

export interface PipelineProps {
  applications: Application[];
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onSimulate: (id: string) => void;
  onDelete: (app: Application) => void;
}

export default function Pipeline({
  applications,
  kaptenSkills,
  onOpen,
  onSimulate,
  onDelete,
}: PipelineProps) {
  const [filterState, setFilterState] = useState<PipelineFilterState>({
    query: "",
    status: "ALL",
    onlyGhosting: false,
    sort: "terbaru",
  });

  const filteredAndSorted = useMemo(() => {
    let result = [...applications];

    // Filter query (pencarian posisi atau perusahaan)
    if (filterState.query.trim()) {
      const q = filterState.query.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q)
      );
    }

    // Filter status
    if (filterState.status !== "ALL") {
      result = result.filter((app) => app.status === filterState.status);
    }

    // Filter hanya rawan ghosting
    if (filterState.onlyGhosting) {
      result = result.filter((app) => isGhostingRisk(app));
    }

    // Sorting
    result.sort((a, b) => {
      if (filterState.sort === "terbaru") {
        return (
          new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime()
        );
      }
      if (filterState.sort === "interview-terdekat") {
        const timeA = a.interviewDateTime
          ? new Date(a.interviewDateTime).getTime()
          : Infinity;
        const timeB = b.interviewDateTime
          ? new Date(b.interviewDateTime).getTime()
          : Infinity;
        return timeA - timeB;
      }
      if (filterState.sort === "offer-tertinggi") {
        const salaryA = a.salaryOffer || 0;
        const salaryB = b.salaryOffer || 0;
        return salaryB - salaryA;
      }
      return 0;
    });

    return result;
  }, [applications, filterState]);

  return (
    <div className="wr-container" data-component="Pipeline">
      <PipelineFilters value={filterState} onChange={setFilterState} />

      {filteredAndSorted.length === 0 ? (
        <div className="wr-card" style={{ textAlign: "center", padding: "48px 16px", color: "#64748b" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
          <h4 style={{ margin: "0 0 4px", color: "#1e293b" }}>Tidak Ada Lamaran</h4>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Tidak ada data lamaran yang cocok dengan filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="wr-grid">
          {filteredAndSorted.map((app) => (
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
    </div>
  );
}
