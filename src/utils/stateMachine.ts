// [ORANG 2] State machine status lamaran (fungsi murni).
import type {
  Application,
  ApplicationStatus,
  TransitionPayload,
  TransitionResult,
  WorkMode,
} from "../types";

// OFFER & REJECTED final. GHOSTED boleh kembali ke SCREENING.
export const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  WISHLIST: ["APPLIED"],
  APPLIED: ["SCREENING", "REJECTED", "GHOSTED"],
  SCREENING: ["INTERVIEW", "REJECTED", "GHOSTED"],
  INTERVIEW: ["OFFER", "REJECTED", "GHOSTED"],
  OFFER: [],
  REJECTED: [],
  GHOSTED: ["SCREENING"],
};

const VALID_WORK_MODES: ReadonlySet<WorkMode> = new Set(["Remote", "Hybrid", "Onsite"]);

/** Daftar status tujuan yang sah dari status sekarang. */
export function getNextStatuses(from: ApplicationStatus): ApplicationStatus[] {
  return [...TRANSITIONS[from]];
}

/** Cek apakah transisi from -> to diizinkan. */
export function canTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/**
 * Validasi syarat pindah status:
 * APPLIED -> cvVersion & appliedDate wajib. INTERVIEW -> interviewDateTime wajib.
 * OFFER -> salaryOffer > 0 & workMode wajib.
 */
export function validateTransition(
  app: Application,
  to: ApplicationStatus,
  payload: TransitionPayload
): TransitionResult {
  if (!canTransition(app.status, to)) {
    return { ok: false, error: `Transisi dari ${app.status} ke ${to} tidak diizinkan.` };
  }

  if (to === "APPLIED") {
    if (!payload.cvVersion || payload.cvVersion.trim() === "") {
      return { ok: false, error: "Versi CV wajib diisi saat pindah ke APPLIED." };
    }
    if (!payload.appliedDate || payload.appliedDate.trim() === "") {
      return { ok: false, error: "Tanggal melamar wajib diisi saat pindah ke APPLIED." };
    }
  }

  if (to === "INTERVIEW") {
    if (!payload.interviewDateTime || payload.interviewDateTime.trim() === "") {
      return { ok: false, error: "Jadwal interview wajib diisi saat pindah ke INTERVIEW." };
    }
    if (Number.isNaN(Date.parse(payload.interviewDateTime))) {
      return { ok: false, error: "Format jadwal interview tidak valid." };
    }
  }

  if (to === "OFFER") {
    if (
      typeof payload.salaryOffer !== "number" ||
      !Number.isFinite(payload.salaryOffer) ||
      payload.salaryOffer <= 0
    ) {
      return { ok: false, error: "Nominal offer harus lebih dari 0." };
    }
    if (!payload.workMode || !VALID_WORK_MODES.has(payload.workMode)) {
      return { ok: false, error: "Mode kerja wajib dipilih saat pindah ke OFFER." };
    }
  }

  return { ok: true };
}
