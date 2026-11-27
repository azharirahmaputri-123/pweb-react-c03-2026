// [ORANG 2] Kartu lamaran di pipeline
import type { Application } from "../types";
import { isGhostingRisk } from "../utils/ghosting";
import { calcSkillMatch } from "../utils/skillMatch";
import MatchBadge from "./MatchBadge";
import "./pipeline.css";

export interface ApplicationCardProps {
  app: Application;
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onSimulate: (id: string) => void; // tombol Simulasi +15 Hari (hanya APPLIED/SCREENING)
  onDelete: (app: Application) => void;
}

export default function ApplicationCard({
  app,
  kaptenSkills,
  onOpen,
  onSimulate,
  onDelete,
}: ApplicationCardProps) {
  const isGhosting = isGhostingRisk(app);
  const matchScore = calcSkillMatch(kaptenSkills, app.requiredSkills);

  const totalChecklist = app.checklist.length;
  const completedChecklist = app.checklist.filter((item) => item.done).length;
  const canSimulate = app.status === "APPLIED" || app.status === "SCREENING";

  const getStatusBadgeStyle = () => {
    switch (app.status) {
      case "OFFER":
        return { background: "#dcfce7", color: "#15803d", border: "1px solid #86efac" };
      case "INTERVIEW":
        return { background: "#e0f2fe", color: "#0369a1", border: "1px solid #7dd3fc" };
      case "SCREENING":
      case "APPLIED":
        return { background: "#fef9c3", color: "#a16207", border: "1px solid #fde047" };
      case "REJECTED":
      case "GHOSTED":
        return { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" };
      default:
        return { background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" };
    }
  };

  return (
    <article className="wr-card wr-card-hover" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <div>
            <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#0f172a" }}>{app.company}</h4>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              {app.role} • <span style={{ fontWeight: 500 }}>{app.workMode}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <MatchBadge score={matchScore} />
            <span className="wr-pill" style={getStatusBadgeStyle()}>
              {app.status}
            </span>
          </div>
        </header>

        {/* Informasi Ringkas */}
        <div style={{ fontSize: "13px", color: "#475569", display: "flex", flexDirection: "column", gap: "6px", margin: "14px 0" }}>
          {app.cvVersion && (
            <div>
              <span style={{ color: "#94a3b8" }}>Versi CV: </span>
              <strong>{app.cvVersion}</strong>
            </div>
          )}
          {app.interviewDateTime && (
            <div style={{ background: "#f0fdfa", padding: "6px 10px", borderRadius: "8px", border: "1px solid #ccfbf1" }}>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>📅 Jadwal Interview: </span>
              <span style={{ color: "#115e59" }}>{app.interviewDateTime.replace("T", " ")}</span>
            </div>
          )}
          {app.salaryOffer !== undefined && app.salaryOffer > 0 && (
            <div>
              <span style={{ color: "#94a3b8" }}>Uang Saku / Gaji: </span>
              <strong style={{ color: "#0f766e" }}>Rp {app.salaryOffer.toLocaleString("id-ID")}</strong>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
            <span style={{ color: "#94a3b8" }}>Progress Persiapan:</span>
            <span style={{ fontWeight: 600, color: completedChecklist === totalChecklist && totalChecklist > 0 ? "#16a34a" : "#334155" }}>
              {completedChecklist}/{totalChecklist} tugas
            </span>
          </div>
          {isGhosting && (
            <div style={{ marginTop: "6px" }}>
              <span className="wr-pill wr-pill-ghosting">
                👻 Rawan Ghosting (&gt;14 hari tanpa kabar)
              </span>
            </div>
          )}
        </div>
      </div>

      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px", marginTop: "12px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="wr-btn wr-btn-outline"
            onClick={() => onOpen(app.id)}
          >
            Lihat Detail
          </button>
          {canSimulate && (
            <button
              type="button"
              className="wr-btn wr-btn-outline"
              onClick={() => onSimulate(app.id)}
              title="Simulasi memundurkan waktu 15 hari untuk uji ghosting"
            >
              +15 Hari
            </button>
          )}
        </div>
        <button
          type="button"
          className="wr-btn wr-btn-danger"
          onClick={() => onDelete(app)}
          title="Hapus lamaran"
        >
          Hapus
        </button>
      </footer>
    </article>
  );
}
