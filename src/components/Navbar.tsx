// [ORANG 3] Navigasi antar halaman
export type TabKey = "explore" | "pipeline" | "offers";

export interface NavbarProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  pipelineCount: number;
  offerCount: number;
  onAddClick: () => void;
}

export default function Navbar(_props: NavbarProps) {
  // TODO: render logo + 3 tab + tombol "+ Catat Lamaran"
  return <div data-component="Navbar">TODO: Navbar</div>;
}
