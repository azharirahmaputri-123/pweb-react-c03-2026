// [ORANG 3] Offer Comparator
import { useState } from "react";
import type { Application } from "../types";
import { calcOfferScore } from "../utils/offerScore";
import { calcSkillMatch } from "../utils/skillMatch";

export interface OfferComparatorProps {
  applications: Application[];
  kaptenSkills: string[];
}

export default function OfferComparator({
  applications,
  kaptenSkills,
}: OfferComparatorProps) {
  // Hanya ambil lamaran yang berstatus OFFER
  const offerApps = applications.filter((app) => app.status === "OFFER");

  const [selectedAId, setSelectedAId] = useState<string>(
    offerApps[0]?.id || ""
  );
  const [selectedBId, setSelectedBId] = useState<string>(
    offerApps[1]?.id || ""
  );

  if (offerApps.length < 2) {
    return (
      <div className="wr-card" style={{ textAlign: "center", padding: "48px 16px" }}>
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚖️</div>
        <h3 style={{ margin: "0 0 6px", color: "#0f172a" }}>Offer Kurang dari 2</h3>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
          Kapten membutuhkan minimal <strong>2 lamaran berstatus OFFER</strong> untuk membandingkan tawaran magang secara objektif.
          Saat ini baru ada <strong>{offerApps.length}</strong> offer yang diterima.
        </p>
      </div>
    );
  }

  const appA = offerApps.find((a) => a.id === selectedAId) || offerApps[0];
  const appB =
    offerApps.find((a) => a.id === selectedBId) ||
    offerApps.find((a) => a.id !== appA.id) ||
    offerApps[1];

  const salaryA = appA.salaryOffer || 0;
  const salaryB = appB.salaryOffer || 0;
  const maxSalary = Math.max(salaryA, salaryB, 1);

  const matchA = calcSkillMatch(kaptenSkills, appA.requiredSkills);
  const matchB = calcSkillMatch(kaptenSkills, appB.requiredSkills);

  const scoreA = calcOfferScore(salaryA, maxSalary, appA.workMode, matchA);
  const scoreB = calcOfferScore(salaryB, maxSalary, appB.workMode, matchB);

  const isAWinner = scoreA.total >= scoreB.total;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header & Selector */}
      <div className="wr-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#0f172a" }}>
            Bandingkan Tawaran Magang (Offer)
          </h3>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Bobot Penilaian: Gaji (50%) + Mode Kerja (25%) + Kesesuaian Skill (25%)
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block" }}>
              Offer A:
            </label>
            <select
              value={appA.id}
              onChange={(e) => setSelectedAId(e.target.value)}
              className="wr-input"
              style={{ fontSize: "13px" }}
            >
              {offerApps.map((o) => (
                <option key={`a-${o.id}`} value={o.id}>
                  {o.company} - {o.role}
                </option>
              ))}
            </select>
          </div>

          <span style={{ fontWeight: 700, color: "#94a3b8", marginTop: "14px" }}>vs</span>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", display: "block" }}>
              Offer B:
            </label>
            <select
              value={appB.id}
              onChange={(e) => setSelectedBId(e.target.value)}
              className="wr-input"
              style={{ fontSize: "13px" }}
            >
              {offerApps.map((o) => (
                <option key={`b-${o.id}`} value={o.id}>
                  {o.company} - {o.role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Perbandingan 2 Kartu */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Kartu Offer A */}
        <div
          className="wr-card"
          style={{
            border: isAWinner ? "2px solid #0f766e" : "1px solid #e2e8f0",
            position: "relative",
          }}
        >
          {isAWinner && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "#0f766e",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              ⭐ Rekomendasi Terbaik
            </div>
          )}
          <h4 style={{ margin: "0 0 2px", fontSize: "16px", color: "#0f172a" }}>{appA.company}</h4>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            {appA.role} • <strong>{appA.workMode}</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Uang Saku / Gaji:</span>
              <span><strong>Rp {salaryA.toLocaleString("id-ID")}</strong> ({scoreA.salaryScore} / 50)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Mode Kerja:</span>
              <span><strong>{appA.workMode}</strong> ({scoreA.modeScore} / 25)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Kesesuaian Skill:</span>
              <span><strong>{matchA}%</strong> ({scoreA.skillScore} / 25)</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "14px",
              borderTop: "2px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, color: "#475569" }}>TOTAL SKOR BERBOBOT:</span>
            <span style={{ fontSize: "24px", fontWeight: 800, color: isAWinner ? "#0f766e" : "#334155" }}>
              {scoreA.total}
            </span>
          </div>
        </div>

        {/* Kartu Offer B */}
        <div
          className="wr-card"
          style={{
            border: !isAWinner ? "2px solid #0f766e" : "1px solid #e2e8f0",
            position: "relative",
          }}
        >
          {!isAWinner && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "#0f766e",
                color: "#ffffff",
                padding: "3px 10px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              ⭐ Rekomendasi Terbaik
            </div>
          )}
          <h4 style={{ margin: "0 0 2px", fontSize: "16px", color: "#0f172a" }}>{appB.company}</h4>
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
            {appB.role} • <strong>{appB.workMode}</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Uang Saku / Gaji:</span>
              <span><strong>Rp {salaryB.toLocaleString("id-ID")}</strong> ({scoreB.salaryScore} / 50)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Mode Kerja:</span>
              <span><strong>{appB.workMode}</strong> ({scoreB.modeScore} / 25)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
              <span style={{ color: "#64748b" }}>Kesesuaian Skill:</span>
              <span><strong>{matchB}%</strong> ({scoreB.skillScore} / 25)</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "14px",
              borderTop: "2px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, color: "#475569" }}>TOTAL SKOR BERBOBOT:</span>
            <span style={{ fontSize: "24px", fontWeight: 800, color: !isAWinner ? "#0f766e" : "#334155" }}>
              {scoreB.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
