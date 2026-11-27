// [ORANG 2] Modal/panel detail lamaran
import { useEffect } from "react";
import { AlertCircle, Trash2, X } from "lucide-react";
import type { Application } from "../types";
import type { UseApplicationsResult } from "../hooks/useApplications";
import { isGhostingRisk } from "../utils/ghosting";
import { calcSkillMatch } from "../utils/skillMatch";
import { formatDateTime, formatRupiah } from "../utils/format";
import MatchBadge from "./MatchBadge";
import StatusTransition from "./StatusTransition";
import ChecklistPanel from "./ChecklistPanel";
import ActivityLogPanel from "./ActivityLogPanel";
import InterviewPrep from "./InterviewPrep";

export interface ApplicationDetailProps {
  app: Application;
  kaptenSkills: string[];
  actions: Pick<
    UseApplicationsResult,
    "changeStatus" | "simulateDays" | "addChecklist" | "toggleChecklist" | "removeChecklist" | "addNote"
  >;
  onDelete: (app: Application) => void;
  onClose: () => void;
}

export default function ApplicationDetail({
  app,
  kaptenSkills,
  actions,
  onDelete,
  onClose,
}: ApplicationDetailProps) {
  const ghosting = isGhostingRisk(app);
  const matchScore = calcSkillMatch(kaptenSkills, app.requiredSkills);
  const canSimulate = app.status === "APPLIED" || app.status === "SCREENING";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleDelete() {
    onDelete(app);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="modal detail-modal">
        <header className="detail-modal-header">
          <div>
            <h3 id="detail-modal-title">
              {app.role} — {app.company}
            </h3>
            <div className="row detail-meta-chips">
              <span className={`status-pill status-${app.status.toLowerCase()}`}>{app.status}</span>
              <span className="chip">{app.workMode}</span>
              <MatchBadge score={matchScore} />
              {app.cvVersion && <span className="chip">CV: {app.cvVersion}</span>}
              {app.interviewDateTime && (
                <span className="chip">Interview: {formatDateTime(app.interviewDateTime)}</span>
              )}
              {typeof app.salaryOffer === "number" && app.salaryOffer > 0 && (
                <span className="chip">Offer: {formatRupiah(app.salaryOffer)}</span>
              )}
            </div>
            {ghosting && (
              <div className="ghosting-badge" style={{ marginTop: 8 }}>
                <AlertCircle size={14} aria-hidden="true" />
                <span>Rawan Ghosting (&gt; 14 hari tanpa update)</span>
              </div>
            )}
          </div>

          <div className="row">
            {canSimulate && (
              <button
                type="button"
                className="btn btn-warning-outline"
                onClick={() => actions.simulateDays(app.id, 15)}
              >
                Simulasi +15 Hari
              </button>
            )}
            <button type="button" className="btn btn-danger-outline" onClick={handleDelete}>
              <Trash2 size={14} aria-hidden="true" />
              <span>Hapus</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Tutup detail lamaran"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="detail-grid">
          <div className="detail-col">
            <StatusTransition
              app={app}
              onChange={(to, payload) => actions.changeStatus(app.id, to, payload)}
            />
            <ChecklistPanel
              items={app.checklist}
              onAdd={(text) => actions.addChecklist(app.id, text)}
              onToggle={(itemId) => actions.toggleChecklist(app.id, itemId)}
              onRemove={(itemId) => actions.removeChecklist(app.id, itemId)}
            />
          </div>

          <div className="detail-col">
            <InterviewPrep />
            <ActivityLogPanel
              logs={app.activityLogs}
              onAddNote={(msg) => actions.addNote(app.id, msg)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
