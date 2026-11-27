// [ORANG 3] Statistik dashboard. Semua derived state -> dipanggil langsung saat render / useMemo.
import type { Application, DashboardStats } from "../types";
import { isGhostingRisk } from "./ghosting";

export function calcDashboardStats(apps: Application[]): DashboardStats {
  const totalLamaran = apps.length;
  const responded = apps.filter(
    (app) =>
      app.status === "SCREENING" ||
      app.status === "INTERVIEW" ||
      app.status === "OFFER" ||
      app.status === "REJECTED"
  ).length;
  const interviewed = apps.filter(
    (app) =>
      app.status === "INTERVIEW" ||
      app.status === "OFFER" ||
      Boolean(app.interviewDateTime)
  ).length;

  return {
    totalLamaran,
    responseRate: totalLamaran === 0 ? 0 : Math.round((responded / totalLamaran) * 100),
    interviewRate: totalLamaran === 0 ? 0 : Math.round((interviewed / totalLamaran) * 100),
    rawanGhosting: apps.filter((app) => isGhostingRisk(app)).length,
    totalOffer: apps.filter((app) => app.status === "OFFER").length,
  };
}
