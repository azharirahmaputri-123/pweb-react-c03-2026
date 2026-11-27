// [ORANG 2] Kartu lamaran di pipeline
import { AlertCircle, Calendar, Clock, FileText, Trash2, Wallet } from "lucide-react";
import type { Application } from "../types";
import { isGhostingRisk } from "../utils/ghosting";
import { calcSkillMatch } from "../utils/skillMatch";
import { formatDateTime, formatRupiah } from "../utils/format";
import MatchBadge from "./MatchBadge";

export interface ApplicationCardProps {
  app: Application;
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onSimulate: (id: string) => void; // tombol Simulasi +15 Hari (hanya APPLIED/SCREENING)
  onDelete: (app: Application) => void;
}

function getInitials(company: string): string {
  const words = company.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "AM";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function ApplicationCard({
  app,
  kaptenSkills,
  onOpen,
  onSimulate,
  onDelete,
}: ApplicationCardProps) {
  const ghosting = isGhostingRisk(app);
  const skillScore = calcSkillMatch(kaptenSkills, app.requiredSkills);
  const doneCount = app.checklist.filter((item) => item.done).length;
  const totalCount = app.checklist.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const canSimulate = app.status === "APPLIED" || app.status === "SCREENING";

  return (
    <article className="card app-card">
      <header className="app-card-header">
        <div className="app-card-title-group">
          <div className="monogram" aria-hidden="true">
            {getInitials(app.company)}
          </div>
          <div>
            <strong className="app-company">{app.company}</strong>
            <div className="muted">{app.workMode}</div>
          </div>
        </div>
        <div className="app-card-badges">
          <span className={`status-pill status-${app.status.toLowerCase()}`}>{app.status}</span>
          <MatchBadge score={skillScore} />
        </div>
      </header>

      <h4 className="app-role">{app.role}</h4>

      {ghosting && (
        <div className="ghosting-badge" role="status">
          <AlertCircle size={14} aria-hidden="true" />
          <span>Rawan Ghosting (&gt; 14 hari tanpa kabar)</span>
        </div>
      )}

      <div className="app-meta-list">
        {app.cvVersion && (
          <div className="app-meta-item">
            <FileText size={14} aria-hidden="true" />
            <span>CV: {app.cvVersion}</span>
          </div>
        )}
        {app.interviewDateTime && (
          <div className="app-meta-item">
            <Calendar size={14} aria-hidden="true" />
            <span>Interview: {formatDateTime(app.interviewDateTime)}</span>
          </div>
        )}
        {typeof app.salaryOffer === "number" && app.salaryOffer > 0 && (
          <div className="app-meta-item">
            <Wallet size={14} aria-hidden="true" />
            <span>Offer: {formatRupiah(app.salaryOffer)}</span>
          </div>
        )}
        <div className="app-meta-item muted">
          <Clock size={14} aria-hidden="true" />
          <span>Update: {formatDateTime(app.lastUpdatedAt)}</span>
        </div>
      </div>

      <div className="app-checklist-summary">
        <div className="row between">
          <span className="muted">Checklist Persiapan</span>
          <span className="muted">
            {doneCount}/{totalCount} selesai
          </span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <footer className="app-card-actions">
        <button type="button" className="btn btn-primary" onClick={() => onOpen(app.id)}>
          Detail
        </button>
        {canSimulate && (
          <button
            type="button"
            className="btn btn-warning-outline"
            onClick={() => onSimulate(app.id)}
          >
            Simulasi +15 Hari
          </button>
        )}
        <button
          type="button"
          className="btn btn-danger-outline"
          onClick={() => onDelete(app)}
          aria-label={`Hapus lamaran ${app.company}`}
        >
          <Trash2 size={14} aria-hidden="true" />
          <span>Hapus</span>
        </button>
      </footer>
    </article>
  );
}
