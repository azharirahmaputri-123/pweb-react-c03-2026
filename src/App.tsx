// [ORANG 3 - integrator] Semua state "global" hidup di sini lalu dioper via props
// (tidak boleh Redux/Zustand/dll).
import { useEffect, useRef, useState } from "react";
import type {
  ActivityLog,
  Application,
  ApplicationStatus,
  ChecklistItem,
  JobListing,
  WorkMode,
} from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useApplications, type NewApplicationInput } from "./hooks/useApplications";
import { useUndoDelete } from "./hooks/useUndoDelete";
import { findInterviewConflicts } from "./utils/schedule";
import { calcDashboardStats } from "./utils/stats";
import { validateNewSkill } from "./utils/skillMatch";
import { isDuplicateApplication } from "./utils/duplicate";
import { jobToNewApplication } from "./utils/jobMapper";
import Navbar, { type TabKey } from "./components/Navbar";
import ConflictBanner from "./components/ConflictBanner";
import StatsCards from "./components/StatsCards";
import ExplorePage from "./components/ExplorePage";
import Pipeline from "./components/Pipeline";
import ApplicationDetail from "./components/ApplicationDetail";
import OfferComparator from "./components/OfferComparator";
import ApplicationForm from "./components/ApplicationForm";
import UndoToast from "./components/UndoToast";
import "./styles/app.css";

const VALID_STATUSES: ReadonlySet<ApplicationStatus> = new Set([
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "GHOSTED",
]);

const VALID_WORK_MODES: ReadonlySet<WorkMode> = new Set(["Remote", "Hybrid", "Onsite"]);

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === "string");
}

function isChecklistItem(val: unknown): val is ChecklistItem {
  return (
    isRecord(val) &&
    typeof val.id === "string" &&
    typeof val.text === "string" &&
    typeof val.done === "boolean"
  );
}

function isActivityLog(val: unknown): val is ActivityLog {
  return (
    isRecord(val) &&
    typeof val.id === "string" &&
    typeof val.timestamp === "string" &&
    typeof val.message === "string"
  );
}

function isValidApplication(val: unknown): val is Application {
  if (!isRecord(val)) return false;
  if (
    typeof val.id !== "string" ||
    typeof val.company !== "string" ||
    typeof val.role !== "string" ||
    typeof val.lastUpdatedAt !== "string"
  ) {
    return false;
  }
  if (typeof val.workMode !== "string" || !VALID_WORK_MODES.has(val.workMode as WorkMode)) {
    return false;
  }
  if (
    typeof val.status !== "string" ||
    !VALID_STATUSES.has(val.status as ApplicationStatus)
  ) {
    return false;
  }
  if (!isStringArray(val.requiredSkills)) return false;
  if (!Array.isArray(val.checklist) || !val.checklist.every(isChecklistItem)) return false;
  if (!Array.isArray(val.activityLogs) || !val.activityLogs.every(isActivityLog)) return false;
  return true;
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("explore");
  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>("kaptenSkills", [
    "React",
    "TypeScript",
    "CSS",
  ]);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);

  const {
    applications,
    addApplication,
    restoreApplication,
    removeApplication,
    replaceApplications,
    changeStatus,
    simulateDays,
    addChecklist,
    toggleChecklist,
    removeChecklist,
    addNote,
  } = useApplications();

  const { toast, deleteWithUndo, undo } = useUndoDelete(
    removeApplication,
    restoreApplication
  );

  // Derived state: selalu dihitung dari seluruh data (bukan hasil filter / useState terpisah)
  const conflicts = findInterviewConflicts(applications);
  const stats = calcDashboardStats(applications);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "info" | "error"; text: string } | null>(null);

  const appContainerRef = useRef<HTMLDivElement>(null);

  const selectedApp = applications.find((app) => app.id === selectedId) ?? null;

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  // Bonus shortcut "/" untuk fokus ke search bar aktif memakai useRef
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (showForm || selectedId !== null) return;
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }
      const searchInput = appContainerRef.current?.querySelector<HTMLInputElement>(
        'input[type="search"]'
      );
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForm, selectedId]);

  function handleAddSkill(rawSkill: string): string | null {
    const error = validateNewSkill(kaptenSkills, rawSkill);
    if (error !== null) return error;
    setKaptenSkills((prev) => [...prev, rawSkill.trim()]);
    return null;
  }

  function handleRemoveSkill(skill: string) {
    setKaptenSkills((prev) => prev.filter((item) => item !== skill));
  }

  function handleSaveJob(job: JobListing) {
    if (isDuplicateApplication(applications, job.company_name, job.title)) return;
    addApplication(jobToNewApplication(job));
    setFeedback({
      type: "info",
      text: `Lowongan "${job.title}" di ${job.company_name} disimpan ke Wishlist.`,
    });
  }

  function handleCreateManual(input: NewApplicationInput) {
    addApplication(input);
    setShowForm(false);
    setFeedback({
      type: "info",
      text: `Lamaran ${input.role} di ${input.company} berhasil dicatat.`,
    });
  }

  function handleExportJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      kaptenSkills,
      applications,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aku-mw-magang-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ type: "info", text: "Backup JSON berhasil diunduh." });
  }

  function handleImportJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result ?? ""));
        let nextApps: unknown;
        let nextSkills: unknown;

        if (Array.isArray(parsed)) {
          nextApps = parsed;
        } else if (isRecord(parsed)) {
          nextApps = parsed.applications;
          nextSkills = parsed.kaptenSkills;
        }

        if (!Array.isArray(nextApps) || !nextApps.every(isValidApplication)) {
          setFeedback({
            type: "error",
            text: "Format file JSON tidak valid. Pastikan berisi data lamaran yang benar.",
          });
          return;
        }

        replaceApplications(nextApps);
        if (isStringArray(nextSkills) && nextSkills.length > 0) {
          setKaptenSkills(nextSkills);
        }
        setSelectedId(null);
        setFeedback({
          type: "info",
          text: `Berhasil mengimpor ${nextApps.length} lamaran dari backup JSON.`,
        });
      } catch {
        setFeedback({
          type: "error",
          text: "Gagal membaca file JSON. Periksa isi file backup kamu.",
        });
      }
    };
    reader.readAsText(file);
  }

  return (
    <div ref={appContainerRef}>
      <Navbar
        activeTab={tab}
        onChange={setTab}
        pipelineCount={applications.length}
        offerCount={stats.totalOffer}
        onAddClick={() => setShowForm(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      <main className="app-container">
        {feedback && (
          <div
            className={`feedback-banner ${
              feedback.type === "error" ? "feedback-banner-error" : ""
            }`}
            role="status"
          >
            <span>{feedback.text}</span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setFeedback(null)}
              aria-label="Tutup notifikasi"
            >
              ×
            </button>
          </div>
        )}

        <ConflictBanner conflicts={conflicts} />
        <StatsCards stats={stats} />

        {tab === "explore" && (
          <ExplorePage
            kaptenSkills={kaptenSkills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            applications={applications}
            onSaveJob={handleSaveJob}
          />
        )}

        {tab === "pipeline" && (
          <Pipeline
            applications={applications}
            kaptenSkills={kaptenSkills}
            onOpen={setSelectedId}
            onSimulate={(id) => simulateDays(id, 15)}
            onDelete={deleteWithUndo}
          />
        )}

        {tab === "offers" && (
          <OfferComparator applications={applications} kaptenSkills={kaptenSkills} />
        )}
      </main>

      {selectedApp && (
        <ApplicationDetail
          app={selectedApp}
          kaptenSkills={kaptenSkills}
          actions={{
            changeStatus,
            simulateDays,
            addChecklist,
            toggleChecklist,
            removeChecklist,
            addNote,
          }}
          onDelete={deleteWithUndo}
          onClose={() => setSelectedId(null)}
        />
      )}

      {showForm && (
        <ApplicationForm
          applications={applications}
          onSubmit={handleCreateManual}
          onCancel={() => setShowForm(false)}
        />
      )}

      <UndoToast toast={toast} onUndo={undo} />
    </div>
  );
}
