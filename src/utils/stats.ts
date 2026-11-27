// [ORANG 3] Statistik dashboard. Semua derived state -> dipanggil langsung saat render / useMemo.
import type { Application, DashboardStats } from "../types";
import { isGhostingRisk } from "./ghosting";

export function calcDashboardStats(apps: Application[]): DashboardStats {
  const totalLamaran = apps.length;

  if (totalLamaran === 0) {
    return {
      totalLamaran: 0,
      responseRate: 0,
      interviewRate: 0,
      rawanGhosting: 0,
      totalOffer: 0,
    };
  }

  // Response: lamaran yang sudah bukan WISHLIST lagi (sudah diproses/respon)
  const respondedApps = apps.filter((a) => a.status !== "WISHLIST");
  const responseRate = Math.round((respondedApps.length / totalLamaran) * 100);

  // Interview: lamaran yang masuk interview atau sudah offer
  const interviewApps = apps.filter(
    (a) => a.status === "INTERVIEW" || a.status === "OFFER"
  );
  const interviewRate = Math.round((interviewApps.length / totalLamaran) * 100);

  // Rawan Ghosting: status APPLIED / SCREENING > 14 hari
  const rawanGhosting = apps.filter((a) => isGhostingRisk(a)).length;

  // Total Offer
  const totalOffer = apps.filter((a) => a.status === "OFFER").length;

  return {
    totalLamaran,
    responseRate,
    interviewRate,
    rawanGhosting,
    totalOffer,
  };
}
