// [ORANG 2] Filter gabungan pipeline
import type { ApplicationStatus, PipelineSort } from "../types";
export interface PipelineFilterState {
  query: string;
  status: ApplicationStatus | "ALL";
  onlyGhosting: boolean;
  sort: PipelineSort;
}

export interface PipelineFiltersProps {
  value: PipelineFilterState;
  onChange: (next: PipelineFilterState) => void;
}

export default function PipelineFilters(_props: PipelineFiltersProps) {
  // TODO: input cari, select status, toggle Hanya Rawan Ghosting, select sorting
  return <div data-component="PipelineFilters">TODO: PipelineFilters</div>;
}
