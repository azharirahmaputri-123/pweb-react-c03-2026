// [ORANG 2] Rawan Ghosting = derived state (JANGAN disimpan di useState).
import type { Application } from "../types";

export const GHOSTING_THRESHOLD_DAYS = 14;

/** APPLIED / SCREENING dan lastUpdatedAt > 14 hari lalu. */
export function isGhostingRisk(_app: Application, _now?: Date): boolean {
  // TODO
  throw new Error("TODO: isGhostingRisk");
}

/** Untuk tombol "Simulasi +15 Hari": mundurkan lastUpdatedAt 15 hari (return ISO baru). */
export function shiftBackDays(_iso: string, _days: number): string {
  // TODO
  throw new Error("TODO: shiftBackDays");
}
