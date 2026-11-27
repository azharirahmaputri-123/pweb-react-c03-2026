// [ORANG 2] Pindah status sesuai state machine
import { useState, type FormEvent } from "react";
import type {
  Application,
  ApplicationStatus,
  TransitionPayload,
  TransitionResult,
  WorkMode,
} from "../types";
import { getNextStatuses } from "../utils/stateMachine";

export interface StatusTransitionProps {
  app: Application;
  onChange: (to: ApplicationStatus, payload: TransitionPayload) => TransitionResult;
}

const MAIN_STEPS: ApplicationStatus[] = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
];

const STEP_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: "1. Wishlist",
  APPLIED: "2. Applied",
  SCREENING: "3. Screening",
  INTERVIEW: "4. Interview",
  OFFER: "5. Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
};

export default function StatusTransition({ app, onChange }: StatusTransitionProps) {
  const nextStatuses = getNextStatuses(app.status);
  const [selectedTarget, setSelectedTarget] = useState<ApplicationStatus | null>(null);
  const [cvVersion, setCvVersion] = useState(app.cvVersion ?? "");
  const [appliedDate, setAppliedDate] = useState(app.appliedDate ?? "");
  const [interviewDateTime, setInterviewDateTime] = useState(app.interviewDateTime ?? "");
  const [salaryOffer, setSalaryOffer] = useState(
    typeof app.salaryOffer === "number" ? String(app.salaryOffer) : ""
  );
  const [workMode, setWorkMode] = useState<WorkMode>(app.workMode);
  const [error, setError] = useState<string | null>(null);

  const activeTarget =
    selectedTarget && nextStatuses.includes(selectedTarget)
      ? selectedTarget
      : (nextStatuses[0] ?? null);

  function handleSelectTarget(status: ApplicationStatus) {
    setSelectedTarget(status);
    setError(null);
    if (status === "OFFER") {
      setWorkMode(app.workMode);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!activeTarget) return;

    const payload: TransitionPayload = {};
    if (activeTarget === "APPLIED") {
      payload.cvVersion = cvVersion;
      payload.appliedDate = appliedDate;
    } else if (activeTarget === "INTERVIEW") {
      payload.interviewDateTime = interviewDateTime;
    } else if (activeTarget === "OFFER") {
      const numericSalary = Number(salaryOffer);
      payload.salaryOffer = Number.isFinite(numericSalary) ? numericSalary : 0;
      payload.workMode = workMode;
    }

    const res = onChange(activeTarget, payload);
    if (!res.ok) {
      setError(res.error ?? "Transisi status tidak valid.");
      return;
    }
    setError(null);
    setSelectedTarget(null);
  }

  return (
    <section className="card detail-panel">
      <h4>Tahap Seleksi</h4>

      <div className="stepper" aria-label="Progres tahap seleksi">
        {MAIN_STEPS.map((step) => {
          const isCurrent = app.status === step;
          const currentIdx = MAIN_STEPS.indexOf(app.status);
          const stepIdx = MAIN_STEPS.indexOf(step);
          const isPassed = currentIdx > stepIdx;
          return (
            <span
              key={step}
              className={`step-chip ${isCurrent ? "step-current" : ""} ${isPassed ? "step-passed" : ""}`}
            >
              {STEP_LABELS[step]}
            </span>
          );
        })}
        {(app.status === "REJECTED" || app.status === "GHOSTED") && (
          <span className={`step-chip step-current status-${app.status.toLowerCase()}`}>
            {STEP_LABELS[app.status]}
          </span>
        )}
      </div>

      {nextStatuses.length === 0 ? (
        <p className="muted">
          Status <strong>{app.status}</strong> bersifat final dan tidak dapat dipindahkan lagi.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="transition-form">
          <div className="row transition-targets">
            <span className="muted">Pindahkan status ke:</span>
            {nextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                className={`btn ${
                  activeTarget === status ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => handleSelectTarget(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {activeTarget === "APPLIED" && (
            <div className="transition-inputs">
              <label className="field">
                Versi CV
                <input
                  type="text"
                  value={cvVersion}
                  onChange={(e) => setCvVersion(e.target.value)}
                  placeholder="Contoh: Kapten-CV-v2.pdf"
                />
              </label>
              <label className="field">
                Tanggal Melamar
                <input
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                />
              </label>
            </div>
          )}

          {activeTarget === "INTERVIEW" && (
            <div className="transition-inputs">
              <label className="field">
                Jadwal Interview
                <input
                  type="datetime-local"
                  value={interviewDateTime}
                  onChange={(e) => setInterviewDateTime(e.target.value)}
                />
              </label>
            </div>
          )}

          {activeTarget === "OFFER" && (
            <div className="transition-inputs">
              <label className="field">
                Nominal Uang Saku / Gaji (Rp)
                <input
                  type="number"
                  min={1}
                  step={50000}
                  value={salaryOffer}
                  onChange={(e) => setSalaryOffer(e.target.value)}
                  placeholder="Contoh: 5500000"
                />
              </label>
              <label className="field">
                Mode Kerja
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </label>
            </div>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="row">
            <button type="submit" className="btn btn-primary">
              Konfirmasi Pindah ke {activeTarget}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
