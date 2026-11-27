// [ORANG 2] Checklist persiapan (nested)
import type { ChecklistItem } from "../types";

export interface ChecklistPanelProps {
  items: ChecklistItem[];
  onAdd: (text: string) => void;
  onToggle: (itemId: string) => void;
  onRemove: (itemId: string) => void;
}

export default function ChecklistPanel(_props: ChecklistPanelProps) {
  // TODO: list item, checkbox, hapus, input tambah, progress bar X/Y
  return <div data-component="ChecklistPanel">TODO: ChecklistPanel</div>;
}
