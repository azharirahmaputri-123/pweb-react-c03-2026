// [ORANG 3] Skor Offer Comparator.
// Total = (Normalisasi Gaji x 50%) + (Skor Mode x 25%) + (Skill Match % x 25%)
import type { OfferScoreBreakdown, WorkMode } from "../types";

export const MODE_SCORE: Record<WorkMode, number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

const round1 = (value: number): number => Math.round(value * 10) / 10;

/** Normalisasi gaji ke 0-100 (gaji / gaji tertinggi di antara 2 offer * 100). */
export function normalizeSalary(salary: number, maxSalary: number): number {
  if (maxSalary <= 0 || salary <= 0) return 0;
  return (salary / maxSalary) * 100;
}

export function calcOfferScore(
  salary: number,
  maxSalary: number,
  mode: WorkMode,
  skillMatch: number
): OfferScoreBreakdown {
  const rawSalary = normalizeSalary(salary, maxSalary) * 0.5;
  const rawMode = MODE_SCORE[mode] * 0.25;
  const rawSkill = skillMatch * 0.25;

  return {
    salaryScore: round1(rawSalary),
    modeScore: round1(rawMode),
    skillScore: round1(rawSkill),
    total: round1(rawSalary + rawMode + rawSkill),
  };
}
