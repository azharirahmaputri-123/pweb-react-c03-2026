// [SHARED - semua orang pakai file ini. Disepakati bareng di awal, jangan diubah sepihak.]

export type WorkMode = "Remote" | "Hybrid" | "Onsite";

export type ApplicationStatus =
  | "WISHLIST"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "GHOSTED";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO
  message: string;
}

export interface Application {
  id: string;
  company: string;
  role: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  requiredSkills: string[];
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string; // YYYY-MM-DDTHH:mm
  salaryOffer?: number;
  lastUpdatedAt: string; // ISO
  checklist: ChecklistItem[];
  activityLogs: ActivityLog[];
}

// Bentuk data dari Remotive API / magang-fallback.json
export interface JobListing {
  id: number;
  title: string;
  company_name: string;
  category: string;
  candidate_required_location: string;
  salary: string;
  tags: string[];
}

export interface RemotiveResponse {
  jobs: JobListing[];
}

// Data tambahan yang dibutuhkan saat pindah status
export interface TransitionPayload {
  cvVersion?: string;
  appliedDate?: string;
  interviewDateTime?: string;
  salaryOffer?: number;
  workMode?: WorkMode;
}

export interface TransitionResult {
  ok: boolean;
  error?: string;
}

export type DataSource = "live" | "local";
export type FetchState = "idle" | "loading" | "success" | "error";
export type PipelineSort = "terbaru" | "interview-terdekat" | "offer-tertinggi";
export type ExploreSort = "match-tertinggi" | "default";

export interface InterviewConflict {
  a: Application;
  b: Application;
  diffMinutes: number;
}

export interface DashboardStats {
  totalLamaran: number;
  responseRate: number; // %
  interviewRate: number; // %
  rawanGhosting: number;
  totalOffer: number;
}

export interface OfferScoreBreakdown {
  salaryScore: number; // maks 50
  modeScore: number; // maks 25
  skillScore: number; // maks 25
  total: number;
}
