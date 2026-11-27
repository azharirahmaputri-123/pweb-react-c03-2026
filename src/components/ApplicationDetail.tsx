// [ORANG 2] Modal/panel detail lamaran
import type { Application } from "../types";
import type { UseApplicationsResult } from "../hooks/useApplications";

export interface ApplicationDetailProps {
  app: Application;
  kaptenSkills: string[];
  actions: Pick<UseApplicationsResult, "changeStatus" | "simulateDays" | "addChecklist" | "toggleChecklist" | "removeChecklist" | "addNote">;
  onDelete: (app: Application) => void;
  onClose: () => void;
}

export default function ApplicationDetail(_props: ApplicationDetailProps) {
  // TODO: susun StatusTransition + ChecklistPanel + ActivityLogPanel + <InterviewPrep /> (milik Orang 3)
  return <div data-component="ApplicationDetail">TODO: ApplicationDetail</div>;
}
