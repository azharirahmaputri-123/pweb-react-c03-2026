// [ORANG 2] Rawan Ghosting = derived state (JANGAN disimpan di useState).
import type { Application } from "../types";

export const GHOSTING_THRESHOLD_DAYS = 14;
const MS_PER_DAY = 86_400_000;

/** APPLIED / SCREENING dan lastUpdatedAt > 14 hari lalu. */
export function isGhostingRisk(app: Application, now: Date = new Date()): boolean {
  if (app.status !== "APPLIED" && app.status !== "SCREENING") return false;
  const updatedMs = Date.parse(app.lastUpdatedAt);
  if (Number.isNaN(updatedMs)) return false;
  const diffDays = (now.getTime() - updatedMs) / MS_PER_DAY;
  return diffDays > GHOSTING_THRESHOLD_DAYS;
}

/** Untuk tombol "Simulasi +15 Hari": mundurkan lastUpdatedAt 15 hari (return ISO baru). */
export function shiftBackDays(iso: string, days: number): string {
  const parsed = Date.parse(iso);
  const baseMs = Number.isNaN(parsed) ? Date.now() : parsed;
  return new Date(baseMs - days * MS_PER_DAY).toISOString();
}
