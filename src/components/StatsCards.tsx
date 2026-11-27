// [ORANG 3] Kartu statistik (derived state)
import type { DashboardStats } from "../types";

export interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <section className="stats-grid" aria-label="Statistik lamaran">
      <article className="card stat-card">
        <span className="stat-label">TOTAL LAMARAN</span>
        <strong className="stat-value">{stats.totalLamaran}</strong>
        <span className="muted">Tersimpan di tracker</span>
      </article>

      <article className="card stat-card">
        <span className="stat-label">RESPONSE RATE</span>
        <strong className="stat-value">{stats.responseRate}%</strong>
        <span className="muted">Mendapat respons HR</span>
      </article>

      <article className="card stat-card">
        <span className="stat-label">INTERVIEW RATE</span>
        <strong className="stat-value">{stats.interviewRate}%</strong>
        <span className="muted">Masuk tahap wawancara</span>
      </article>

      <article className={`card stat-card ${stats.rawanGhosting > 0 ? "stat-card-warn" : ""}`}>
        <span className="stat-label">RAWAN GHOSTING</span>
        <strong className={`stat-value ${stats.rawanGhosting > 0 ? "text-danger" : ""}`}>
          {stats.rawanGhosting}
        </strong>
        <span className="muted">&gt; 14 hari tanpa kabar</span>
      </article>

      <article className={`card stat-card ${stats.totalOffer > 0 ? "stat-card-offer" : ""}`}>
        <span className="stat-label">OFFER DITERIMA</span>
        <strong className={`stat-value ${stats.totalOffer > 0 ? "text-success" : ""}`}>
          {stats.totalOffer}
        </strong>
        <span className="muted">
          {stats.totalOffer >= 2 ? "Siap dibandingkan" : "Minimal 2 untuk bandingkan"}
        </span>
      </article>
    </section>
  );
}
