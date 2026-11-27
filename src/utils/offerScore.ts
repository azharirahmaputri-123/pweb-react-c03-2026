// [ORANG 3] Skor Offer Comparator.
// Total = (Normalisasi Gaji x 50%) + (Skor Mode x 25%) + (Skill Match % x 25%)
import type { OfferScoreBreakdown, WorkMode } from "../types";

export const MODE_SCORE: Record<WorkMode, number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

/** Normalisasi gaji ke 0-100 (gaji / gaji tertinggi di antara 2 offer * 100). */
export function normalizeSalary(_salary: number, _maxSalary: number): number {
  // TODO
  throw new Error("TODO: normalizeSalary");
}

export function calcOfferScore(
  _salary: number,
  _maxSalary: number,
  _mode: WorkMode,
  _skillMatch: number
): OfferScoreBreakdown {
  // TODO
  throw new Error("TODO: calcOfferScore");
}
