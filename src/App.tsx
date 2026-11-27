// [ORANG 3 - integrator] Semua state "global" hidup di sini lalu dioper via props
// (tidak boleh Redux/Zustand/dll). Aktifkan blok wiring di bawah SETELAH hook masing-masing selesai,
// supaya `npm run dev` tetap jalan selama pengerjaan.
import { useState } from "react";
import Navbar, { type TabKey } from "./components/Navbar";

export default function App() {
  const [tab, setTab] = useState<TabKey>("explore");

  /* ===== WIRING (aktifkan bertahap) =====
  const [kaptenSkills, setKaptenSkills] = useLocalStorage<string[]>("kaptenSkills", ["React","TypeScript","CSS"]);  // O3 hook, O1 pakai
  const { applications, ...appActions } = useApplications();                                                       // O3 (+O2)
  const { toast, deleteWithUndo, undo } = useUndoDelete(appActions.removeApplication, appActions.restoreApplication); // O3
  const conflicts = findInterviewConflicts(applications);   // dari SELURUH data
  const stats = calcDashboardStats(applications);           // derived, bukan useState
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  ======================================= */

  return (
    <div>
      <Navbar
        activeTab={tab}
        onChange={setTab}
        pipelineCount={0}
        offerCount={0}
        onAddClick={() => {}}
      />
      {/* TODO: <ConflictBanner conflicts={conflicts} /> (selalu tampil) */}
      {/* TODO: <StatsCards stats={stats} /> */}
      {tab === "explore" && <div>TODO: Eksplorasi (SkillProfile + JobFilters + AsyncState + JobCard)</div>}
      {tab === "pipeline" && <div>TODO: &lt;Pipeline /&gt; + &lt;ApplicationDetail /&gt;</div>}
      {tab === "offers" && <div>TODO: &lt;OfferComparator /&gt;</div>}
      {/* TODO: <ApplicationForm /> (modal) dan <UndoToast /> */}
    </div>
  );
}
