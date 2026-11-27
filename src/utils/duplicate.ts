// [ORANG 1] Anti-duplikat company + role (case-insensitive, trim).
import type { Application } from "../types";

const norm = (s: string): string => s.trim().toLowerCase();

export function isDuplicateApplication(apps: Application[], company: string, role: string): boolean {
  const c = norm(company);
  const r = norm(role);
  return apps.some((a) => norm(a.company) === c && norm(a.role) === r);
}
