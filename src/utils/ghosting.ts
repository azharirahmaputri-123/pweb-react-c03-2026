// [ORANG 2] Rawan Ghosting = derived state (JANGAN disimpan di useState).
import type { Application } from "../types";

export const GHOSTING_THRESHOLD_DAYS = 14;

/** APPLIED / SCREENING dan lastUpdatedAt > 14 hari lalu. */
export function isGhostingRisk(app: Application, now: Date = new Date()): boolean {
  if (app.status !== "APPLIED" && app.status !== "SCREENING") {
    return false;
  }

  const lastUpdated = new Date(app.lastUpdatedAt).getTime();
  if (isNaN(lastUpdated)) return false;

  const diffMs = now.getTime() - lastUpdated;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays > GHOSTING_THRESHOLD_DAYS;
}

/** Untuk tombol "Simulasi +15 Hari": mundurkan lastUpdatedAt 15 hari (return ISO baru). */
export function shiftBackDays(iso: string, days: number): string {
  const date = new Date(iso);
  const baseTime = isNaN(date.getTime()) ? Date.now() : date.getTime();
  const shiftedMs = baseTime - days * 24 * 60 * 60 * 1000;
  return new Date(shiftedMs).toISOString();
}
