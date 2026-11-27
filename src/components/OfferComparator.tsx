// [ORANG 3] Offer Comparator
import { useMemo, useState } from "react";
import { Award } from "lucide-react";
import type { Application } from "../types";
import { calcOfferScore, MODE_SCORE } from "../utils/offerScore";
import { calcSkillMatch, getMatchedSkills } from "../utils/skillMatch";
import { formatRupiah } from "../utils/format";

export interface OfferComparatorProps {
  applications: Application[];
  kaptenSkills: string[];
}

export default function OfferComparator({
  applications,
  kaptenSkills,
}: OfferComparatorProps) {
  const offers = useMemo(
    () => applications.filter((app) => app.status === "OFFER"),
    [applications]
  );

  const [selectedAId, setSelectedAId] = useState<string>("");
  const [selectedBId, setSelectedBId] = useState<string>("");

  if (offers.length < 2) {
    return (
      <section className="card state">
        <h3>Bandingkan Offer Magang</h3>
        <p className="muted">
          Belum cukup offer untuk dibandingkan (saat ini ada{" "}
          <strong>{offers.length}</strong> lamaran berstatus OFFER). Pindahkan minimal{" "}
          <strong>2 lamaran</strong> ke status OFFER di Pipeline untuk mulai membandingkan.
        </p>
      </section>
    );
  }

  const offerA = offers.find((o) => o.id === selectedAId) ?? offers[0];
  const offerB =
    offers.find((o) => o.id === selectedBId && o.id !== offerA.id) ??
    offers.find((o) => o.id !== offerA.id) ??
    offers[1];

  const salaryA = offerA.salaryOffer ?? 0;
  const salaryB = offerB.salaryOffer ?? 0;
  const maxSalary = Math.max(salaryA, salaryB);

  const skillMatchA = calcSkillMatch(kaptenSkills, offerA.requiredSkills);
  const skillMatchB = calcSkillMatch(kaptenSkills, offerB.requiredSkills);
  const matchedCountA = getMatchedSkills(kaptenSkills, offerA.requiredSkills).length;
  const matchedCountB = getMatchedSkills(kaptenSkills, offerB.requiredSkills).length;

  const scoreA = calcOfferScore(salaryA, maxSalary, offerA.workMode, skillMatchA);
  const scoreB = calcOfferScore(salaryB, maxSalary, offerB.workMode, skillMatchB);

  const isTie = scoreA.total === scoreB.total;
  const aWins = scoreA.total > scoreB.total;
  const bWins = scoreB.total > scoreA.total;

  const cards = [
    {
      label: "Offer A",
      app: offerA,
      salary: salaryA,
      skillMatch: skillMatchA,
      matchedCount: matchedCountA,
      score: scoreA,
      isBest: aWins,
    },
    {
      label: "Offer B",
      app: offerB,
      salary: salaryB,
      skillMatch: skillMatchB,
      matchedCount: matchedCountB,
      score: scoreB,
      isBest: bWins,
    },
  ];

  return (
    <section className="comparator-page">
      <div className="card comparator-header">
        <div>
          <h3>Bandingkan Offer Magang</h3>
          <p className="muted">
            Bobot penilaian: Uang Saku 50% · Mode Kerja 25% · Kecocokan Skill 25%
          </p>
        </div>

        <div className="comparator-selectors">
          <label className="comparator-select-group">
            <span className="muted">Offer A:</span>
            <select
              value={offerA.id}
              onChange={(e) => setSelectedAId(e.target.value)}
              aria-label="Pilih Offer A"
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id} disabled={o.id === offerB.id}>
                  {o.company} — {o.role}
                </option>
              ))}
            </select>
          </label>

          <span className="muted">vs</span>

          <label className="comparator-select-group">
            <span className="muted">Offer B:</span>
            <select
              value={offerB.id}
              onChange={(e) => setSelectedBId(e.target.value)}
              aria-label="Pilih Offer B"
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id} disabled={o.id === offerA.id}>
                  {o.company} — {o.role}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="comparator-grid">
        {cards.map((item) => (
          <article
            key={item.label}
            className={`card offer-card ${item.isBest ? "offer-card-winner" : ""}`}
          >
            <header className="row between">
              <div>
                <h4>{item.app.company}</h4>
                <div className="muted">{item.app.role}</div>
              </div>
              {item.isBest && (
                <span className="badge badge-best">
                  <Award size={14} aria-hidden="true" />
                  <span>Rekomendasi Terbaik</span>
                </span>
              )}
              {isTie && <span className="badge badge-yellow">Skor Seri</span>}
            </header>

            <dl className="offer-breakdown">
              <div className="offer-row">
                <dt className="muted">Uang Saku / Bulan</dt>
                <dd className="offer-val">{formatRupiah(item.salary)}</dd>
                <dd className="offer-pts">{item.score.salaryScore.toFixed(1)} / 50</dd>
              </div>
              <div className="offer-row">
                <dt className="muted">Mode Kerja</dt>
                <dd className="offer-val">
                  {item.app.workMode} ({MODE_SCORE[item.app.workMode]})
                </dd>
                <dd className="offer-pts">{item.score.modeScore.toFixed(1)} / 25</dd>
              </div>
              <div className="offer-row">
                <dt className="muted">Kecocokan Skill</dt>
                <dd className="offer-val">
                  {item.skillMatch}% ({item.matchedCount} dari {item.app.requiredSkills.length} skill)
                </dd>
                <dd className="offer-pts">{item.score.skillScore.toFixed(1)} / 25</dd>
              </div>
            </dl>

            <footer className="offer-total">
              <span>TOTAL SKOR BERBOBOT</span>
              <strong>{item.score.total.toFixed(1)}</strong>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
