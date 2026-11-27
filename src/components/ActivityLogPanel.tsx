// [ORANG 2] Riwayat aktivitas
import type { ActivityLog } from "../types";

export interface ActivityLogPanelProps {
  logs: ActivityLog[];
  onAddNote: (message: string) => void;
}

export default function ActivityLogPanel(_props: ActivityLogPanelProps) {
  // TODO: timeline log (terbaru di atas) + input catatan manual
  return <div data-component="ActivityLogPanel">TODO: ActivityLogPanel</div>;
}
