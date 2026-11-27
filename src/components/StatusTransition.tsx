// [ORANG 2] Pindah status sesuai state machine
import type { Application, ApplicationStatus, TransitionPayload, TransitionResult } from "../types";

export interface StatusTransitionProps {
  app: Application;
  onChange: (to: ApplicationStatus, payload: TransitionPayload) => TransitionResult;
}

export default function StatusTransition(_props: StatusTransitionProps) {
  // TODO: tampilkan hanya getNextStatuses(app.status); input kondisional (CV+tanggal / jadwal / gaji+mode); tampil error validasi
  return <div data-component="StatusTransition">TODO: StatusTransition</div>;
}
