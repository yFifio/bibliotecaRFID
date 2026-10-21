import { prisma } from "../../lib/prisma";

export async function getManagementDashboard(tenantId: string, libraryId: string) {
  const [topBooks, alerts, openLoans, todayStats] = await Promise.all([
    prisma.analyticsBookDaily.findMany({
      where: { institutionId: tenantId },
      orderBy: { loansCount: "desc" },
      take: 10,
      include: { bookTitle: true }
    }),
    prisma.securityAlert.findMany({
      where: { institutionId: tenantId, libraryId },
      orderBy: { createdAt: "desc" },
      take: 20
    }),
    prisma.loan.count({ where: { institutionId: tenantId, libraryId, status: { in: ["OPEN", "OVERDUE"] } } }),
    prisma.analyticsDaily.findFirst({
      where: {
        institutionId: tenantId,
        libraryId,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    })
  ]);

  return {
    kpis: {
      openLoans,
      theftAttempts: todayStats?.theftAttempts ?? alerts.filter((a) => a.type === "UNAUTHORIZED_EXIT").length,
      savedWorkHours: Math.round((todayStats?.savedWorkMinutes ?? 0) / 60)
    },
    heatmap: todayStats?.sectionHeatmapJson ?? {
      sections: [
        { code: "A", intensity: 0.82 },
        { code: "B", intensity: 0.55 },
        { code: "C", intensity: 0.31 }
      ]
    },
    topBooks: topBooks.map((item) => ({
      title: item.bookTitle.title,
      loansCount: item.loansCount
    })),
    alerts
  };
}
