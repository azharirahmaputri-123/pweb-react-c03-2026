// [ORANG 2] Deteksi bentrok jadwal interview. Input = SELURUH data (bukan hasil filter).
import type { Application, InterviewConflict } from "../types";

export const CONFLICT_THRESHOLD_MINUTES = 60;

/** Semua pasangan lamaran INTERVIEW yang selisih waktunya < 60 menit. */
export function findInterviewConflicts(apps: Application[]): InterviewConflict[] {
  const interviewApps = apps.filter(
    (app) => app.status === "INTERVIEW" && Boolean(app.interviewDateTime)
  );

  const conflicts: InterviewConflict[] = [];

  for (let i = 0; i < interviewApps.length; i++) {
    for (let j = i + 1; j < interviewApps.length; j++) {
      const appA = interviewApps[i];
      const appB = interviewApps[j];

      const timeA = new Date(appA.interviewDateTime!).getTime();
      const timeB = new Date(appB.interviewDateTime!).getTime();

      if (isNaN(timeA) || isNaN(timeB)) continue;

      const diffMs = Math.abs(timeA - timeB);
      const diffMinutes = Math.round(diffMs / (1000 * 60));

      if (diffMinutes < CONFLICT_THRESHOLD_MINUTES) {
        conflicts.push({
          a: appA,
          b: appB,
          diffMinutes,
        });
      }
    }
  }

  return conflicts;
}
