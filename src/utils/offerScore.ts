// [ORANG 3] Skor Offer Comparator.
// Total = (Normalisasi Gaji x 50%) + (Skor Mode x 25%) + (Skill Match % x 25%)
import type { OfferScoreBreakdown, WorkMode } from "../types";

export const MODE_SCORE: Record<WorkMode, number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

/** Normalisasi gaji ke 0-100 (gaji / gaji tertinggi di antara 2 offer * 100). */
export function normalizeSalary(salary: number, maxSalary: number): number {
  if (maxSalary <= 0 || salary <= 0) return 0;
  return Math.min(100, Math.round((salary / maxSalary) * 100));
}

export function calcOfferScore(
  salary: number,
  maxSalary: number,
  mode: WorkMode,
  skillMatch: number
): OfferScoreBreakdown {
  const normSalary = normalizeSalary(salary, maxSalary);
  const modeVal = MODE_SCORE[mode] ?? 50;
  const matchVal = Math.max(0, Math.min(100, skillMatch));

  // Bobot: Gaji 50%, Mode 25%, Skill Match 25%
  const salaryScore = Number(((normSalary * 50) / 100).toFixed(1));
  const modeScore = Number(((modeVal * 25) / 100).toFixed(1));
  const skillScore = Number(((matchVal * 25) / 100).toFixed(1));

  const total = Number((salaryScore + modeScore + skillScore).toFixed(1));

  return {
    salaryScore,
    modeScore,
    skillScore,
    total,
  };
}
