// [ORANG 3 bikin kerangka CRUD inti; ORANG 2 mengisi action detail (transisi/checklist/log)]
// Semua update WAJIB immutable (map/filter/spread, DILARANG push() / mutasi langsung).
import { useState, useEffect } from "react";
import type {
  Application,
  ApplicationStatus,
  ChecklistItem,
  ActivityLog,
  TransitionPayload,
  TransitionResult,
  WorkMode,
} from "../types";
import { validateTransition } from "../utils/stateMachine";
import { shiftBackDays } from "../utils/ghosting";

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
  changeStatus: (id: string, to: ApplicationStatus, payload: TransitionPayload) => TransitionResult;
  simulateDays: (id: string, days: number) => void;
  addChecklist: (appId: string, text: string) => void;
  toggleChecklist: (appId: string, itemId: string) => void;
  removeChecklist: (appId: string, itemId: string) => void;
  addNote: (appId: string, message: string) => void;
}

const STORAGE_KEY = "applications";

export function useApplications(): UseApplicationsResult {
  // Membaca local storage dengan fallback aman
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Application[]) : [];
    } catch {
      return [];
    }
  });

  // Sinkronisasi ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  // [ORANG 3 / CRUD Inti]
  const addApplication = (input: NewApplicationInput): Application => {
    const now = new Date().toISOString();
    const newApp: Application = {
      id: crypto.randomUUID(),
      company: input.company.trim(),
      role: input.role.trim(),
      workMode: input.workMode,
      status: input.status,
      requiredSkills: input.requiredSkills,
      cvVersion: input.cvVersion?.trim(),
      appliedDate: input.appliedDate?.trim(),
      lastUpdatedAt: now,
      checklist: [],
      activityLogs: [
        {
          id: crypto.randomUUID(),
          timestamp: now,
          message: `Lamaran dibuat dengan status ${input.status}`,
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const restoreApplication = (app: Application) => {
    setApplications((prev) => [app, ...prev]);
  };

  const removeApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // [ORANG 2: changeStatus]
  const changeStatus = (
    id: string,
    to: ApplicationStatus,
    payload: TransitionPayload
  ): TransitionResult => {
    const app = applications.find((a) => a.id === id);
    if (!app) {
      return { ok: false, error: "Lamaran tidak ditemukan." };
    }

    const validation = validateTransition(app, to, payload);
    if (!validation.ok) {
      return validation;
    }

    const now = new Date().toISOString();
    const logMessage = `Status diubah dari ${app.status} ke ${to}`;

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      timestamp: now,
      message: logMessage,
    };

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          status: to,
          lastUpdatedAt: now,
          cvVersion: payload.cvVersion !== undefined ? payload.cvVersion : item.cvVersion,
          appliedDate: payload.appliedDate !== undefined ? payload.appliedDate : item.appliedDate,
          interviewDateTime:
            payload.interviewDateTime !== undefined
              ? payload.interviewDateTime
              : item.interviewDateTime,
          salaryOffer:
            payload.salaryOffer !== undefined ? payload.salaryOffer : item.salaryOffer,
          workMode: payload.workMode !== undefined ? payload.workMode : item.workMode,
          activityLogs: [newLog, ...item.activityLogs],
        };
      })
    );

    return { ok: true };
  };

  // [ORANG 2: simulateDays]
  const simulateDays = (id: string, days: number) => {
    setApplications((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          lastUpdatedAt: shiftBackDays(item.lastUpdatedAt, days),
        };
      })
    );
  };

  // [ORANG 2: addChecklist]
  const addChecklist = (appId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: trimmed,
      done: false,
    };

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id !== appId) return item;
        return {
          ...item,
          checklist: [...item.checklist, newItem],
        };
      })
    );
  };

  // [ORANG 2: toggleChecklist]
  const toggleChecklist = (appId: string, itemId: string) => {
    setApplications((prev) =>
      prev.map((item) => {
        if (item.id !== appId) return item;
        return {
          ...item,
          checklist: item.checklist.map((c) =>
            c.id === itemId ? { ...c, done: !c.done } : c
          ),
        };
      })
    );
  };

  // [ORANG 2: removeChecklist]
  const removeChecklist = (appId: string, itemId: string) => {
    setApplications((prev) =>
      prev.map((item) => {
        if (item.id !== appId) return item;
        return {
          ...item,
          checklist: item.checklist.filter((c) => c.id !== itemId),
        };
      })
    );
  };

  // [ORANG 2: addNote]
  const addNote = (appId: string, message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message: trimmed,
    };

    setApplications((prev) =>
      prev.map((item) => {
        if (item.id !== appId) return item;
        return {
          ...item,
          activityLogs: [newLog, ...item.activityLogs],
        };
      })
    );
  };

  return {
    applications,
    addApplication,
    restoreApplication,
    removeApplication,
    changeStatus,
    simulateDays,
    addChecklist,
    toggleChecklist,
    removeChecklist,
    addNote,
  };
}
