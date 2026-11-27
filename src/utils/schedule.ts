// [ORANG 2] Deteksi bentrok jadwal interview. Input = SELURUH data (bukan hasil filter).
import type { Application, InterviewConflict } from "../types";

export const CONFLICT_THRESHOLD_MINUTES = 60;

/** Semua pasangan lamaran INTERVIEW yang selisih waktunya < 60 menit. */
export function findInterviewConflicts(_apps: Application[]): InterviewConflict[] {
  // TODO
  throw new Error("TODO: findInterviewConflicts");
}
