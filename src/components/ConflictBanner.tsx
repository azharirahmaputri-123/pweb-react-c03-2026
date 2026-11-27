// [ORANG 2] Banner bentrok jadwal interview
import type { InterviewConflict } from "../types";

export interface ConflictBannerProps {
  conflicts: InterviewConflict[];
}

export default function ConflictBanner(_props: ConflictBannerProps) {
  // TODO: tampilkan peringatan jika conflicts.length > 0 (tampil di atas semua tab, tidak terpengaruh filter)
  return <div data-component="ConflictBanner">TODO: ConflictBanner</div>;
}
