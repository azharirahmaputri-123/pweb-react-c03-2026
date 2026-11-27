// [ORANG 1] Halaman Eksplorasi Lowongan (gabungan semua komponen Fitur 1)
import { useMemo, useState } from "react";
import type { Application, ExploreSort, JobListing } from "../types";
import { useJobs } from "../hooks/useJobs";
import { useDebounce } from "../hooks/useDebounce";
import { calcSkillMatch } from "../utils/skillMatch";
import { isDuplicateApplication } from "../utils/duplicate";
import SkillProfile from "./SkillProfile";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";
import AsyncState from "./AsyncState";
import "./explore.css";

export interface ExplorePageProps {
  kaptenSkills: string[];
  onAddSkill: (skill: string) => string | null;
  onRemoveSkill: (skill: string) => void;
  applications: Application[];
  onSaveJob: (job: JobListing) => void;
}

export default function ExplorePage({ kaptenSkills, onAddSkill, onRemoveSkill, applications, onSaveJob }: ExplorePageProps) {
  const { jobs, state, errorMessage, source, setSource, retry, switchToLocal } = useJobs();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState<ExploreSort>("match-tertinggi");
  const debouncedKeyword = useDebounce(keyword, 400);

  const categories = useMemo(() => Array.from(new Set(jobs.map((j) => j.category))).sort(), [jobs]);

  const visible = useMemo(() => {
    const q = debouncedKeyword.trim().toLowerCase();
    const rows = jobs
      .filter((j) => category === "ALL" || j.category === category)
      .filter((j) => q === "" || j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q))
      .map((job) => ({ job, score: calcSkillMatch(kaptenSkills, job.tags) }));
    if (sort === "match-tertinggi") rows.sort((a, b) => b.score - a.score);
    return rows;
  }, [jobs, category, debouncedKeyword, sort, kaptenSkills]);

  return (
    <div className="explore">
      <aside>
        <SkillProfile skills={kaptenSkills} onAdd={onAddSkill} onRemove={onRemoveSkill} />
      </aside>
      <main>
        <JobFilters
          keyword={keyword}
          onKeywordChange={setKeyword}
          category={category}
          categories={categories}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          source={source}
          onSourceChange={setSource}
        />
        <p className="muted">Filter aktif setelah debounce: "{debouncedKeyword}" · {visible.length} lowongan</p>
        <AsyncState state={state} errorMessage={errorMessage} isEmpty={visible.length === 0} onRetry={retry} onFallback={switchToLocal}>
          <div className="grid">
            {visible.map(({ job }) => (
              <JobCard
                key={job.id}
                job={job}
                kaptenSkills={kaptenSkills}
                alreadyApplied={isDuplicateApplication(applications, job.company_name, job.title)}
                onSave={onSaveJob}
              />
            ))}
          </div>
        </AsyncState>
      </main>
    </div>
  );
}
