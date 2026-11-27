// [ORANG 2] Banner bentrok jadwal interview
import type { InterviewConflict } from "../types";
import "./pipeline.css";

export interface ConflictBannerProps {
  conflicts: InterviewConflict[];
}

export default function ConflictBanner({ conflicts }: ConflictBannerProps) {
  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  return (
    <div className="wr-conflict-banner">
      <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
        <span>⚠️ Perhatian: Jadwal Interview Bentrok</span>
      </div>
      <p style={{ margin: "4px 0 8px", fontSize: "13px" }}>
        Terdapat wawancara kerja yang berselisih kurang dari 60 menit:
      </p>
      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px" }}>
        {conflicts.map((c, idx) => (
          <li key={`${c.a.id}-${c.b.id}-${idx}`} style={{ marginBottom: "4px" }}>
            <strong>{c.a.company}</strong> ({c.a.interviewDateTime?.replace("T", " ")}) &amp;{" "}
            <strong>{c.b.company}</strong> ({c.b.interviewDateTime?.replace("T", " ")}) berselisih{" "}
            <strong>{c.diffMinutes} menit</strong>.
          </li>
        ))}
      </ul>
    </div>
  );
}
