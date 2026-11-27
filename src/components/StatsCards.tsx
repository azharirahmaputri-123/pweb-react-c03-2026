// [ORANG 3] Kartu statistik (derived state)
import type { DashboardStats } from "../types";

export interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    { label: "TOTAL LAMARAN", val: stats.totalLamaran, sub: "di pipeline" },
    { label: "RESPONSE RATE", val: `${stats.responseRate}%`, sub: "sudah direspons" },
    { label: "INTERVIEW RATE", val: `${stats.interviewRate}%`, sub: "masuk interview/offer" },
    { label: "RAWAN GHOSTING", val: stats.rawanGhosting, sub: ">14 hari tanpa kabar", isDanger: stats.rawanGhosting > 0 },
    { label: "OFFER DITERIMA", val: stats.totalOffer, sub: "siap dibanding", isSuccess: stats.totalOffer > 0 },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="wr-card"
          style={{
            padding: "12px 14px",
            background: it.isDanger ? "#fef2f2" : "#ffffff",
            borderColor: it.isDanger ? "#fecaca" : "#e2e8f0",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 600, color: it.isDanger ? "#dc2626" : "#64748b" }}>
            {it.label}
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: it.isDanger ? "#b91c1c" : it.isSuccess ? "#16a34a" : "#0f172a",
              margin: "4px 0",
            }}
          >
            {it.val}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{it.sub}</div>
        </div>
      ))}
    </div>
  );
}
