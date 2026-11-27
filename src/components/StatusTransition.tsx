// [ORANG 2] Pindah status sesuai state machine
import { useState } from "react";
import type {
  Application,
  ApplicationStatus,
  TransitionPayload,
  TransitionResult,
  WorkMode,
} from "../types";
import { getNextStatuses } from "../utils/stateMachine";
import "./pipeline.css";

export interface StatusTransitionProps {
  app: Application;
  onChange: (to: ApplicationStatus, payload: TransitionPayload) => TransitionResult;
}

export default function StatusTransition({ app, onChange }: StatusTransitionProps) {
  const nextStatuses = getNextStatuses(app.status);

  const [selectedTarget, setSelectedTarget] = useState<ApplicationStatus | null>(null);
  const [cvVersion, setCvVersion] = useState(app.cvVersion || "");
  const [appliedDate, setAppliedDate] = useState(
    app.appliedDate || new Date().toISOString().split("T")[0]
  );
  const [interviewDateTime, setInterviewDateTime] = useState(app.interviewDateTime || "");
  const [salaryOffer, setSalaryOffer] = useState<number | "">(app.salaryOffer || "");
  const [workMode, setWorkMode] = useState<WorkMode>(app.workMode || "Remote");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectStatus = (status: ApplicationStatus) => {
    setSelectedTarget(status);
    setErrorMessage(null);
  };

  const handleConfirm = () => {
    if (!selectedTarget) return;

    const payload: TransitionPayload = {};

    if (selectedTarget === "APPLIED") {
      payload.cvVersion = cvVersion;
      payload.appliedDate = appliedDate;
    } else if (selectedTarget === "INTERVIEW") {
      payload.interviewDateTime = interviewDateTime;
    } else if (selectedTarget === "OFFER") {
      payload.salaryOffer = typeof salaryOffer === "number" ? salaryOffer : Number(salaryOffer);
      payload.workMode = workMode;
    }

    const result = onChange(selectedTarget, payload);
    if (!result.ok) {
      setErrorMessage(result.error || "Gagal mengubah status.");
    } else {
      setSelectedTarget(null);
      setErrorMessage(null);
    }
  };

  if (nextStatuses.length === 0) {
    return (
      <div className="wr-card" style={{ background: "#f8fafc" }}>
        <h4 style={{ margin: "0 0 6px", fontSize: "15px" }}>Tahap Seleksi</h4>
        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
          Status saat ini adalah <strong>{app.status}</strong> (Status Final). Tidak ada transisi status lanjutan.
        </p>
      </div>
    );
  }

  return (
    <div className="wr-card">
      <h4 style={{ margin: "0 0 10px", fontSize: "15px", color: "#0f172a" }}>
        Pindahkan Status Lamaran
      </h4>

      {/* Grid tombol status pilihan seperti template selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px", marginBottom: "12px" }}>
        {nextStatuses.map((st) => {
          const isActive = selectedTarget === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => handleSelectStatus(st)}
              className={`wr-selector-box ${isActive ? "wr-selector-box-active" : ""}`}
            >
              <div style={{ fontWeight: 600, fontSize: "13px", color: isActive ? "#0f766e" : "#1e293b" }}>
                {st}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                Pindah ke {st}
              </div>
            </button>
          );
        })}
      </div>

      {selectedTarget && (
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginTop: "8px" }}>
          {selectedTarget === "APPLIED" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                  Versi CV *
                </label>
                <input
                  type="text"
                  placeholder="misal: CV_Frontend_v2.pdf"
                  value={cvVersion}
                  onChange={(e) => setCvVersion(e.target.value)}
                  className="wr-input"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                  Tanggal Melamar *
                </label>
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="wr-input"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}

          {selectedTarget === "INTERVIEW" && (
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                Jadwal Interview (Tanggal & Jam) *
              </label>
              <input
                type="datetime-local"
                value={interviewDateTime}
                onChange={(e) => setInterviewDateTime(e.target.value)}
                className="wr-input"
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </div>
          )}

          {selectedTarget === "OFFER" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                  Nominal Uang Saku / Gaji (Rp) *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="misal: 4500000"
                  value={salaryOffer}
                  onChange={(e) =>
                    setSalaryOffer(e.target.value ? Number(e.target.value) : "")
                  }
                  className="wr-input"
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                  Mode Kerja *
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="wr-input"
                  style={{ width: "100%" }}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
            </div>
          )}

          {errorMessage && (
            <div style={{ color: "#dc2626", fontSize: "13px", marginBottom: "10px", background: "#fef2f2", padding: "6px 10px", borderRadius: "8px" }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleConfirm}
              className="wr-btn wr-btn-primary"
            >
              Konfirmasi Pindah ke {selectedTarget}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTarget(null);
                setErrorMessage(null);
              }}
              className="wr-btn wr-btn-outline"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
