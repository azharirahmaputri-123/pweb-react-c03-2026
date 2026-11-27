// [ORANG 2] Kartu lamaran di pipeline
import type { Application } from "../types";

export interface ApplicationCardProps {
  app: Application;
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onSimulate: (id: string) => void; // tombol Simulasi +15 Hari (hanya APPLIED/SCREENING)
  onDelete: (app: Application) => void;
}

export default function ApplicationCard(_props: ApplicationCardProps) {
  // TODO: status, versi CV, progress checklist (3/4), Skill Match %, badge Rawan Ghosting (isGhostingRisk)
  return <div data-component="ApplicationCard">TODO: ApplicationCard</div>;
}
