// [ORANG 3] Navigasi antar halaman
export type TabKey = "explore" | "pipeline" | "offers";

export interface NavbarProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  pipelineCount: number;
  offerCount: number;
  onAddClick: () => void;
}

export default function Navbar({
  activeTab,
  onChange,
  pipelineCount,
  offerCount,
  onAddClick,
}: NavbarProps) {
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        marginBottom: "16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            background: "#0f766e",
            color: "#ffffff",
            fontWeight: 700,
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          AM
        </div>
        <strong style={{ fontSize: "16px", color: "#0f172a" }}>Aku Mw Magang</strong>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={() => onChange("explore")}
          className={`wr-btn ${activeTab === "explore" ? "wr-btn-primary" : "wr-btn-outline"}`}
        >
          🔍 Eksplorasi Lowongan
        </button>
        <button
          type="button"
          onClick={() => onChange("pipeline")}
          className={`wr-btn ${activeTab === "pipeline" ? "wr-btn-primary" : "wr-btn-outline"}`}
        >
          💼 War Room Pipeline ({pipelineCount})
        </button>
        <button
          type="button"
          onClick={() => onChange("offers")}
          className={`wr-btn ${activeTab === "offers" ? "wr-btn-primary" : "wr-btn-outline"}`}
        >
          🏆 Bandingkan Offer ({offerCount})
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={onAddClick}
          className="wr-btn wr-btn-primary"
          style={{ background: "#0284c7" }}
        >
          + Catat Lamaran Manual
        </button>
      </div>
    </nav>
  );
}
