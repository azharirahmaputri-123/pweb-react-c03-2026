// [ORANG 1] Kartu lowongan
import type { JobListing } from "../types";
import { calcSkillMatch, getMatchedSkills, getMissingSkills } from "../utils/skillMatch";
import MatchBadge from "./MatchBadge";

export interface JobCardProps {
  job: JobListing;
  kaptenSkills: string[];
  alreadyApplied: boolean;
  onSave: (job: JobListing) => void;
}

export default function JobCard({ job, kaptenSkills, alreadyApplied, onSave }: JobCardProps) {
  // derived state: dihitung ulang tiap render, tidak disimpan di useState
  const score = calcSkillMatch(kaptenSkills, job.tags);
  const matched = getMatchedSkills(kaptenSkills, job.tags);
  const missing = getMissingSkills(kaptenSkills, job.tags);

  return (
    <article className="card job">
      <header className="row between">
        <div>
          <strong>{job.company_name}</strong>
          <div className="muted">{job.candidate_required_location}</div>
        </div>
        <MatchBadge score={score} />
      </header>
      <h4>{job.title}</h4>
      <ul className="chips">
        {matched.map((s) => (
          <li key={`m-${s}`} className="chip chip-ok">{s}</li>
        ))}
        {missing.map((s) => (
          <li key={`x-${s}`} className="chip chip-missing" title="Skill belum dikuasai">{s}</li>
        ))}
      </ul>
      <footer className="row between">
        <span className="muted">{job.salary}</span>
        <button type="button" disabled={alreadyApplied} onClick={() => onSave(job)}>
          {alreadyApplied ? "Sudah Dilamar" : "Simpan ke Wishlist"}
        </button>
      </footer>
    </article>
  );
}
