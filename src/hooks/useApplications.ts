// [ORANG 3 bikin kerangka CRUD inti; ORANG 2 mengisi action detail (transisi/checklist/log)]
// Semua update WAJIB immutable (map/filter/spread, DILARANG push() / mutasi langsung).
import type {
  Application, ApplicationStatus, TransitionPayload, TransitionResult, WorkMode,
} from "../types";

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

export function useApplications(): UseApplicationsResult {
  // TODO: useLocalStorage<Application[]>("applications", []) + semua action di atas
  throw new Error("TODO: useApplications");
}
