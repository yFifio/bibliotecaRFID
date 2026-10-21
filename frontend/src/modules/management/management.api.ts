import { api } from "../../core/api/client";

export function fetchDashboard(libraryId: string) {
  return api<{
    kpis: { openLoans: number; theftAttempts: number; savedWorkHours: number };
    heatmap: { sections: Array<{ code: string; intensity: number }> };
    topBooks: Array<{ title: string; loansCount: number }>;
    alerts: Array<{ id: string; title: string; severity: string; createdAt: string }>;
  }>(`/analytics/dashboard?libraryId=${libraryId}`);
}
