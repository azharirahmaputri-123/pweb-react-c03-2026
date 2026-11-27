// [ORANG 2] State machine status lamaran (fungsi murni).
import type { Application, ApplicationStatus, TransitionPayload, TransitionResult } from "../types";

// TODO: isi peta transisi sesuai Diagram State Machine di soal.
// OFFER & REJECTED final. GHOSTED boleh kembali ke SCREENING.
export const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: [], // TODO
  APPLIED: [], // TODO
  SCREENING: [], // TODO
  INTERVIEW: [], // TODO
  OFFER: [],
  REJECTED: [],
  GHOSTED: [], // TODO
};

/** Daftar status tujuan yang sah dari status sekarang. */
export function getNextStatuses(_from: ApplicationStatus): ApplicationStatus[] {
  // TODO
  throw new Error("TODO: getNextStatuses");
}

/** Cek apakah transisi from -> to diizinkan. */
export function canTransition(_from: ApplicationStatus, _to: ApplicationStatus): boolean {
  // TODO
  throw new Error("TODO: canTransition");
}

/**
 * Validasi syarat pindah status:
 * APPLIED -> cvVersion & appliedDate wajib. INTERVIEW -> interviewDateTime wajib.
 * OFFER -> salaryOffer > 0 & workMode wajib.
 */
export function validateTransition(
  _app: Application,
  _to: ApplicationStatus,
  _payload: TransitionPayload
): TransitionResult {
  // TODO
  throw new Error("TODO: validateTransition");
}
