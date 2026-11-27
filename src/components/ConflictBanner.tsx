// [ORANG 2] Banner bentrok jadwal interview
import { AlertTriangle } from "lucide-react";
import type { InterviewConflict } from "../types";
import { formatDateTime } from "../utils/format";

export interface ConflictBannerProps {
  conflicts: InterviewConflict[];
}

export default function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="conflict-banner" role="alert">
      <div className="conflict-banner-header">
        <AlertTriangle size={18} aria-hidden="true" />
        <strong>Peringatan Jadwal Interview Bentrok ({conflicts.length})</strong>
      </div>
      <ul className="conflict-banner-list">
        {conflicts.map((conflict) => (
          <li key={`${conflict.a.id}-${conflict.b.id}`}>
            <strong>{conflict.a.company}</strong> ({formatDateTime(conflict.a.interviewDateTime ?? "")})
            {" dan "}
            <strong>{conflict.b.company}</strong> ({formatDateTime(conflict.b.interviewDateTime ?? "")})
            {" "}berselisih <strong>{conflict.diffMinutes} menit</strong> (kurang dari 60 menit).
          </li>
        ))}
      </ul>
    </div>
  );
}
