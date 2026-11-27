// [ORANG 3] Navigasi antar halaman
import { useRef, type ChangeEvent } from "react";
import { Download, Moon, Plus, Sun, Upload } from "lucide-react";

export type TabKey = "explore" | "pipeline" | "offers";

export interface NavbarProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  pipelineCount: number;
  offerCount: number;
  onAddClick: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onExportJson?: () => void;
  onImportJson?: (file: File) => void;
}

export default function Navbar({
  activeTab,
  onChange,
  pipelineCount,
  offerCount,
  onAddClick,
  darkMode = false,
  onToggleDarkMode,
  onExportJson,
  onImportJson,
}: NavbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onImportJson) {
      onImportJson(file);
    }
    e.target.value = "";
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-logo" aria-hidden="true">
            AM
          </span>
          <span className="brand-title">Aku Mw Magang</span>
        </div>

        <nav className="navbar-tabs" aria-label="Navigasi utama">
          <button
            type="button"
            className={`nav-tab ${activeTab === "explore" ? "nav-tab-active" : ""}`}
            onClick={() => onChange("explore")}
          >
            Eksplorasi Lowongan
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === "pipeline" ? "nav-tab-active" : ""}`}
            onClick={() => onChange("pipeline")}
          >
            Pipeline Lamaran ({pipelineCount})
          </button>
          <button
            type="button"
            className={`nav-tab ${activeTab === "offers" ? "nav-tab-active" : ""}`}
            onClick={() => onChange("offers")}
          >
            Bandingkan Offer ({offerCount})
          </button>
        </nav>

        <div className="navbar-actions">
          {onExportJson && (
            <button
              type="button"
              className="btn-nav-ghost"
              onClick={onExportJson}
              title="Export backup JSON"
              aria-label="Export backup JSON"
            >
              <Download size={15} aria-hidden="true" />
              <span className="hide-sm">Export</span>
            </button>
          )}
          {onImportJson && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="sr-only"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="btn-nav-ghost"
                onClick={() => fileInputRef.current?.click()}
                title="Import backup JSON"
                aria-label="Import backup JSON"
              >
                <Upload size={15} aria-hidden="true" />
                <span className="hide-sm">Import</span>
              </button>
            </>
          )}
          {onToggleDarkMode && (
            <button
              type="button"
              className="btn-nav-ghost"
              onClick={onToggleDarkMode}
              title={darkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
              aria-label={darkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            >
              {darkMode ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
            </button>
          )}
          <button type="button" className="btn-nav-cta" onClick={onAddClick}>
            <Plus size={15} aria-hidden="true" />
            <span>Catat Lamaran</span>
          </button>
        </div>
      </div>
    </header>
  );
}
