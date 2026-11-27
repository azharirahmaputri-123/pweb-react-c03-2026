// [ORANG 2] Deteksi bentrok jadwal interview. Input = SELURUH data (bukan hasil filter).
import type { Application, InterviewConflict } from "../types";

export const CONFLICT_THRESHOLD_MINUTES = 60;

/** Semua pasangan lamaran INTERVIEW yang selisih waktunya < 60 menit. */
export function findInterviewConflicts(apps: Application[]): InterviewConflict[] {
  const interviews = apps
    .filter((app) => app.status === "INTERVIEW" && Boolean(app.interviewDateTime))
    .map((app) => ({
      app,
      timeMs: Date.parse(app.interviewDateTime ?? ""),
    }))
    .filter((item) => !Number.isNaN(item.timeMs));

  const conflicts: InterviewConflict[] = [];
  for (let i = 0; i < interviews.length; i += 1) {
    for (let j = i + 1; j < interviews.length; j += 1) {
      const diffMinutes = Math.abs(interviews[i].timeMs - interviews[j].timeMs) / 60_000;
      if (diffMinutes < CONFLICT_THRESHOLD_MINUTES) {
        conflicts.push({
          a: interviews[i].app,
          b: interviews[j].app,
          diffMinutes: Math.round(diffMinutes),
        });
      }
    }
  }
  return conflicts;
}
