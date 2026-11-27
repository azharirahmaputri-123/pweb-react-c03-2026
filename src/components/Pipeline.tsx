// [ORANG 2] Halaman War Room Pipeline
import type { Application } from "../types";

export interface PipelineProps {
  applications: Application[];
  kaptenSkills: string[];
  onOpen: (id: string) => void;
  onSimulate: (id: string) => void;
  onDelete: (app: Application) => void;
}

export default function Pipeline(_props: PipelineProps) {
  // TODO: state filter (useState), terapkan filter+sort (useMemo), render PipelineFilters + list ApplicationCard + empty state
  return <div data-component="Pipeline">TODO: Pipeline</div>;
}
