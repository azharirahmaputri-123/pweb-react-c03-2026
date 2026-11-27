// [ORANG 3] Offer Comparator
import type { Application } from "../types";

export interface OfferComparatorProps {
  applications: Application[];
  kaptenSkills: string[];
}

export default function OfferComparator(_props: OfferComparatorProps) {
  // TODO: filter status OFFER; jika <2 tampilkan pesan kosong; 2 select Offer A/B; hitung calcOfferScore; badge Rekomendasi Terbaik
  return <div data-component="OfferComparator">TODO: OfferComparator</div>;
}
