// [ORANG 2] Modal/panel detail lamaran
import { useState } from "react";
import type { Application } from "../types";
import type { UseApplicationsResult } from "../hooks/useApplications";
import { isGhostingRisk } from "../utils/ghosting";
import { calcSkillMatch } from "../utils/skillMatch";
import MatchBadge from "./MatchBadge";
import StatusTransition from "./StatusTransition";
import ChecklistPanel from "./ChecklistPanel";
import ActivityLogPanel from "./ActivityLogPanel";
import InterviewPrep from "./InterviewPrep";
import "./pipeline.css";

export interface ApplicationDetailProps {
  app: Application;
  kaptenSkills: string[];
  actions: Pick<
    UseApplicationsResult,
    | "changeStatus"
    | "simulateDays"
    | "addChecklist"
    | "toggleChecklist"
    | "removeChecklist"
    | "addNote"
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
  const [activeTab, setActiveTab] = useState<"detail" | "prep">("detail");

  const matchScore = calcSkillMatch(kaptenSkills, app.requiredSkills);
  const isGhosting = isGhostingRisk(app);
  const canSimulate = app.status === "APPLIED" || app.status === "SCREENING";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="wr-card"
        style={{
          width: "min(880px, 95%)",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "24px",
          borderRadius: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid #f1f5f9",
            paddingBottom: "14px",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "20px", color: "#0f172a" }}>
              {app.company}
            </h3>
            <div style={{ fontSize: "14px", color: "#64748b" }}>
              {app.role} • <strong>{app.workMode}</strong>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MatchBadge score={matchScore} />
            <button
              type="button"
              onClick={onClose}
              style={{
                border: "none",
                background: "#f1f5f9",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                fontSize: "16px",
                color: "#64748b",
              }}
            >
              ✕
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("detail")}
            className={`wr-btn ${activeTab === "detail" ? "wr-btn-primary" : "wr-btn-outline"}`}
          >
            📋 Detail &amp; Status Lamaran
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("prep")}
            className={`wr-btn ${activeTab === "prep" ? "wr-btn-primary" : "wr-btn-outline"}`}
          >
            ⏱️ Latihan Interview
          </button>
        </div>

        {activeTab === "detail" ? (
          <div className="wr-modal-grid">
            {/* Kolom Kiri: Form Transisi & Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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

            {/* Kolom Kanan: Summary Card & Activity Log */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Summary Info */}
              <div className="wr-card" style={{ background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "14px", color: "#334155" }}>Ringkasan Lamaran</h4>
                  {canSimulate && (
                    <button
                      type="button"
                      onClick={() => actions.simulateDays(app.id, 15)}
                      className="wr-btn wr-btn-outline"
                      style={{ fontSize: "11px", padding: "4px 8px" }}
                      title="Mundurkan tanggal update 15 hari"
                    >
                      +15 Hari
                    </button>
                  )}
                </div>

                {isGhosting && (
                  <div style={{ marginBottom: "10px" }}>
                    <span className="wr-pill wr-pill-ghosting">
                      👻 Rawan Ghosting (&gt;14 hari)
                    </span>
                  </div>
                )}

                <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px", color: "#475569" }}>
                  <div>
                    <span style={{ color: "#94a3b8" }}>Status: </span>
                    <strong style={{ color: "#0f766e" }}>{app.status}</strong>
                  </div>
                  {app.cvVersion && (
                    <div>
                      <span style={{ color: "#94a3b8" }}>Versi CV: </span>
                      <span>{app.cvVersion}</span>
                    </div>
                  )}
                  {app.appliedDate && (
                    <div>
                      <span style={{ color: "#94a3b8" }}>Tanggal Melamar: </span>
                      <span>{app.appliedDate}</span>
                    </div>
                  )}
                  {app.interviewDateTime && (
                    <div>
                      <span style={{ color: "#94a3b8" }}>Jadwal Interview: </span>
                      <strong>{app.interviewDateTime.replace("T", " ")}</strong>
                    </div>
                  )}
                  {app.salaryOffer !== undefined && app.salaryOffer > 0 && (
                    <div>
                      <span style={{ color: "#94a3b8" }}>Uang Saku / Gaji: </span>
                      <strong style={{ color: "#16a34a" }}>Rp {app.salaryOffer.toLocaleString("id-ID")}</strong>
                    </div>
                  )}
                  <div>
                    <span style={{ color: "#94a3b8" }}>Update Terakhir: </span>
                    <span>{new Date(app.lastUpdatedAt).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              </div>

              {/* Activity Log Panel */}
              <ActivityLogPanel
                logs={app.activityLogs}
                onAddNote={(msg) => actions.addNote(app.id, msg)}
              />
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "12px" }}>
            <InterviewPrep />
          </div>
        )}

        {/* Footer Modal */}
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f1f5f9",
            paddingTop: "16px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            className="wr-btn wr-btn-danger"
            onClick={() => {
              onDelete(app);
              onClose();
            }}
          >
            Hapus Lamaran Ini
          </button>
          <button type="button" className="wr-btn wr-btn-outline" onClick={onClose}>
            Tutup
          </button>
        </footer>
      </div>
    </div>
  );
}
