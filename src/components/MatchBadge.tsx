// [ORANG 1] Badge Match Score
import { getMatchColor } from "../utils/skillMatch";

export interface MatchBadgeProps {
  score: number;
}

export default function MatchBadge({ score }: MatchBadgeProps) {
  return <span className={`badge badge-${getMatchColor(score)}`}>{score}% Match</span>;
}
