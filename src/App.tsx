// [ORANG 3 - integrator] Wiring seluruh aplikasi
import { useState, useMemo } from "react";
import Navbar, { type TabKey } from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import ConflictBanner from "./components/ConflictBanner";
import ExplorePage from "./components/ExplorePage";
import Pipeline from "./components/Pipeline";
import ApplicationDetail from "./components/ApplicationDetail";
import OfferComparator from "./components/OfferComparator";
import ApplicationForm from "./components/ApplicationForm";
import UndoToast from "./components/UndoToast";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useApplications } from "./hooks/useApplications";
import { useUndoDelete } from "./hooks/useUndoDelete";
import { findInterviewConflicts } from "./utils/schedule";
import { calcDashboardStats } from "./utils/stats";
import { jobToNewApplication } from "./utils/jobMapper";
import type { JobListing } from "./types";

export default function App() {
  const [tab, setTab] = useState<TabKey>("explore");

  // State Kapten Skills dengan useLocalStorage
  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>("kaptenSkills", [
    "React",
    "TypeScript",
    "CSS",
  ]);

  // Hook utama applications
  const {
    applications,
    addApplication,
    restoreApplication,
    removeApplication,
    changeStatus,
    simulateDays,
    addChecklist,
    toggleChecklist,
    removeChecklist,
    addNote,
  } = useApplications();

  // Undo delete hook
  const { toast, deleteWithUndo, undo } = useUndoDelete(
    removeApplication,
    restoreApplication
  );

  // Derived state: bentrok jadwal interview (< 60 menit) dari SELURUH data
  const conflicts = useMemo(
    () => findInterviewConflicts(applications),
    [applications]
  );

  // Derived state: statistik dashboard
  const stats = useMemo(
    () => calcDashboardStats(applications),
    [applications]
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Skill profile handlers
  const handleAddSkill = (skill: string): string | null => {
    const trimmed = skill.trim();
    if (!trimmed) return "Skill tidak boleh kosong.";
    const exists = kaptenSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return "Skill sudah ada.";
    setKaptenSkills([...kaptenSkills, trimmed]);
    return null;
  };

  const handleRemoveSkill = (skill: string) => {
    setKaptenSkills(kaptenSkills.filter((s) => s !== skill));
  };

  // Simpan lowongan dari Fitur 1 (Eksplorasi) ke daftar lamaran (WISHLIST)
  const handleSaveJob = (job: JobListing) => {
    const input = jobToNewApplication(job);
    addApplication(input);
  };

  const selectedApp = applications.find((a) => a.id === selectedId);

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", padding: "16px", minHeight: "100vh" }}>
      <Navbar
        activeTab={tab}
        onChange={setTab}
        pipelineCount={applications.length}
        offerCount={stats.totalOffer}
        onAddClick={() => setShowForm(true)}
      />

      {/* Banner bentrok selalu tampil di atas jika terdeteksi */}
      <ConflictBanner conflicts={conflicts} />

      {/* 5 Kartu Statistik (Derived State) */}
      <StatsCards stats={stats} />

      {/* Konten Halaman */}
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
        <>
          <Pipeline
            applications={applications}
            kaptenSkills={kaptenSkills}
            onOpen={(id) => setSelectedId(id)}
            onSimulate={(id) => simulateDays(id, 15)}
            onDelete={(app) => deleteWithUndo(app)}
          />

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
              onDelete={(app) => deleteWithUndo(app)}
              onClose={() => setSelectedId(null)}
            />
          )}
        </>
      )}

      {tab === "offers" && (
        <OfferComparator
          applications={applications}
          kaptenSkills={kaptenSkills}
        />
      )}

      {/* Modal Tambah Lamaran Manual */}
      {showForm && (
        <ApplicationForm
          applications={applications}
          onSubmit={(data) => {
            addApplication(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Toast Undo Delete (5 Detik) */}
      <UndoToast toast={toast} onUndo={undo} />
    </div>
  );
}
