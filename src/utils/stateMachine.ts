// [ORANG 2] State machine status lamaran (fungsi murni).
import type { Application, ApplicationStatus, TransitionPayload, TransitionResult } from "../types";

// Alur state machine:
// WISHLIST -> APPLIED
// APPLIED -> SCREENING | REJECTED | GHOSTED
// SCREENING -> INTERVIEW | REJECTED | GHOSTED
// INTERVIEW -> OFFER | REJECTED | GHOSTED
// GHOSTED -> SCREENING
// OFFER & REJECTED final.
export const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: ["APPLIED"],
  APPLIED: ["SCREENING", "REJECTED", "GHOSTED"],
  SCREENING: ["INTERVIEW", "REJECTED", "GHOSTED"],
  INTERVIEW: ["OFFER", "REJECTED", "GHOSTED"],
  OFFER: [],
  REJECTED: [],
  GHOSTED: ["SCREENING"],
};

/** Daftar status tujuan yang sah dari status sekarang. */
export function getNextStatuses(from: ApplicationStatus): ApplicationStatus[] {
  return TRANSITIONS[from] || [];
}

/** Cek apakah transisi from -> to diizinkan. */
export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return getNextStatuses(from).includes(to);
}

/**
 * Validasi syarat pindah status:
 * APPLIED -> cvVersion & appliedDate wajib.
 * INTERVIEW -> interviewDateTime wajib.
 * OFFER -> salaryOffer > 0 & workMode wajib.
 */
export function validateTransition(
  app: Application,
  to: ApplicationStatus,
  payload: TransitionPayload
): TransitionResult {
  if (!canTransition(app.status, to)) {
    return {
      ok: false,
      error: `Transisi status tidak valid dari ${app.status} ke ${to}.`,
    };
  }

  if (to === "APPLIED") {
    const cvVersion = payload.cvVersion?.trim() || app.cvVersion?.trim();
    const appliedDate = payload.appliedDate?.trim() || app.appliedDate?.trim();
    if (!cvVersion || !appliedDate) {
      return {
        ok: false,
        error: "cvVersion dan appliedDate wajib diisi saat pindah ke status APPLIED.",
      };
    }
  }

  if (to === "INTERVIEW") {
    const interviewDateTime = payload.interviewDateTime?.trim() || app.interviewDateTime?.trim();
    if (!interviewDateTime) {
      return {
        ok: false,
        error: "interviewDateTime wajib diisi saat pindah ke status INTERVIEW.",
      };
    }
  }

  if (to === "OFFER") {
    const salaryOffer = payload.salaryOffer ?? app.salaryOffer;
    const workMode = payload.workMode || app.workMode;
    if (salaryOffer === undefined || salaryOffer === null || salaryOffer <= 0) {
      return {
        ok: false,
        error: "salaryOffer wajib diisi dan harus bernilai > 0 saat pindah ke status OFFER.",
      };
    }
    if (!workMode) {
      return {
        ok: false,
        error: "workMode wajib diisi saat pindah ke status OFFER.",
      };
    }
  }

  return { ok: true };
}
