// [ORANG 3 bikin kerangka CRUD inti; ORANG 2 mengisi action detail (transisi/checklist/log)]
// Semua update WAJIB immutable (map/filter/spread, DILARANG push() / mutasi langsung).
import { useCallback } from "react";
import type {
  ActivityLog,
  Application,
  ApplicationStatus,
  ChecklistItem,
  TransitionPayload,
  TransitionResult,
  WorkMode,
} from "../types";
import { useLocalStorage } from "./useLocalStorage";
import { validateTransition } from "../utils/stateMachine";
import { shiftBackDays } from "../utils/ghosting";
import { formatDateTime, formatRupiah } from "../utils/format";

export interface NewApplicationInput {
  company: string;
  role: string;
  workMode: WorkMode;
  status: "WISHLIST" | "APPLIED";
  requiredSkills: string[];
  cvVersion?: string;
  appliedDate?: string;
}

export interface UseApplicationsResult {
  applications: Application[];
  addApplication: (input: NewApplicationInput) => Application;
  restoreApplication: (app: Application) => void;
  removeApplication: (id: string) => void;
  replaceApplications: (apps: Application[]) => void;
  changeStatus: (id: string, to: ApplicationStatus, payload: TransitionPayload) => TransitionResult;
  simulateDays: (id: string, days: number) => void;
  addChecklist: (appId: string, text: string) => void;
  toggleChecklist: (appId: string, itemId: string) => void;
  removeChecklist: (appId: string, itemId: string) => void;
  addNote: (appId: string, message: string) => void;
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeLog(message: string, timestamp: string = new Date().toISOString()): ActivityLog {
  return { id: createId(), timestamp, message };
}

function buildTransitionLog(
  from: ApplicationStatus,
  to: ApplicationStatus,
  payload: TransitionPayload
): string {
  switch (to) {
    case "APPLIED":
      return `Lamaran dikirim (CV: ${payload.cvVersion?.trim() ?? "-"}, tanggal ${payload.appliedDate ?? "-"})`;
    case "SCREENING":
      return from === "GHOSTED"
        ? "Kembali aktif ke tahap Screening dari Ghosted"
        : "Masuk tahap Screening";
    case "INTERVIEW":
      return `Pindah ke Interview (jadwal: ${formatDateTime(payload.interviewDateTime ?? "")})`;
    case "OFFER":
      return `Menerima Offer (${formatRupiah(payload.salaryOffer ?? 0)}, ${payload.workMode ?? "-"})`;
    case "REJECTED":
      return "Status diperbarui ke Rejected";
    case "GHOSTED":
      return "Ditandai sebagai Ghosted";
    default:
      return `Status berubah ke ${to}`;
  }
}

export function useApplications(): UseApplicationsResult {
  const [applications, setApplications] = useLocalStorage<Application[]>("applications", []);

  const addApplication = useCallback(
    (input: NewApplicationInput): Application => {
      const now = new Date().toISOString();
      const logMsg =
        input.status === "APPLIED"
          ? `Lamaran dikirim (CV: ${input.cvVersion?.trim() ?? "-"}, tanggal ${input.appliedDate ?? "-"})`
          : "Disimpan ke Wishlist";

      const newApp: Application = {
        id: createId(),
        company: input.company.trim(),
        role: input.role.trim(),
        workMode: input.workMode,
        status: input.status,
        requiredSkills: [...input.requiredSkills],
        ...(input.status === "APPLIED"
          ? {
              cvVersion: input.cvVersion?.trim(),
              appliedDate: input.appliedDate,
            }
          : {}),
        lastUpdatedAt: now,
        checklist: [],
        activityLogs: [makeLog(logMsg, now)],
      };

      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    },
    [setApplications]
  );

  const restoreApplication = useCallback(
    (app: Application) => {
      setApplications((prev) => {
        if (prev.some((item) => item.id === app.id)) return prev;
        return [app, ...prev];
      });
    },
    [setApplications]
  );

  const removeApplication = useCallback(
    (id: string) => {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [setApplications]
  );

  const replaceApplications = useCallback(
    (apps: Application[]) => {
      setApplications(apps);
    },
    [setApplications]
  );

  const changeStatus = useCallback(
    (id: string, to: ApplicationStatus, payload: TransitionPayload): TransitionResult => {
      const target = applications.find((app) => app.id === id);
      if (!target) {
        return { ok: false, error: "Lamaran tidak ditemukan." };
      }

      const validation = validateTransition(target, to, payload);
      if (!validation.ok) {
        return validation;
      }

      const now = new Date().toISOString();
      const logEntry = makeLog(buildTransitionLog(target.status, to, payload), now);

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          return {
            ...app,
            status: to,
            ...(to === "APPLIED"
              ? {
                  cvVersion: payload.cvVersion?.trim(),
                  appliedDate: payload.appliedDate,
                }
              : {}),
            ...(to === "INTERVIEW"
              ? {
                  interviewDateTime: payload.interviewDateTime,
                }
              : {}),
            ...(to === "OFFER"
              ? {
                  salaryOffer: payload.salaryOffer,
                  workMode: payload.workMode ?? app.workMode,
                }
              : {}),
            lastUpdatedAt: now,
            activityLogs: [logEntry, ...app.activityLogs],
          };
        })
      );

      return { ok: true };
    },
    [applications, setApplications]
  );

  const simulateDays = useCallback(
    (id: string, days: number) => {
      const now = new Date().toISOString();
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          if (app.status !== "APPLIED" && app.status !== "SCREENING") return app;
          const shifted = shiftBackDays(app.lastUpdatedAt, days);
          return {
            ...app,
            lastUpdatedAt: shifted,
            activityLogs: [
              makeLog(`Simulasi +${days} hari tanpa kabar (diuji Rawan Ghosting)`, now),
              ...app.activityLogs,
            ],
          };
        })
      );
    },
    [setApplications]
  );

  const addChecklist = useCallback(
    (appId: string, text: string) => {
      const trimmed = text.trim();
      if (trimmed === "") return;
      const newItem: ChecklistItem = {
        id: createId(),
        text: trimmed,
        done: false,
      };
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, checklist: [...app.checklist, newItem] }
            : app
        )
      );
    },
    [setApplications]
  );

  const toggleChecklist = useCallback(
    (appId: string, itemId: string) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? {
                ...app,
                checklist: app.checklist.map((item) =>
                  item.id === itemId ? { ...item, done: !item.done } : item
                ),
              }
            : app
        )
      );
    },
    [setApplications]
  );

  const removeChecklist = useCallback(
    (appId: string, itemId: string) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? {
                ...app,
                checklist: app.checklist.filter((item) => item.id !== itemId),
              }
            : app
        )
      );
    },
    [setApplications]
  );

  const addNote = useCallback(
    (appId: string, message: string) => {
      const trimmed = message.trim();
      if (trimmed === "") return;
      const entry = makeLog(trimmed);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, activityLogs: [entry, ...app.activityLogs] }
            : app
        )
      );
    },
    [setApplications]
  );

  return {
    applications,
    addApplication,
    restoreApplication,
    removeApplication,
    replaceApplications,
    changeStatus,
    simulateDays,
    addChecklist,
    toggleChecklist,
    removeChecklist,
    addNote,
  };
}
