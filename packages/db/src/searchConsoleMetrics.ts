import { prisma } from "./client";
import type { SearchConsoleMetricInput } from "./searchConsoleTypes";

export async function importSearchConsoleMetrics(rows: SearchConsoleMetricInput[]) {
  await prisma.searchConsoleMetric.createMany({
    data: rows.map((row) => ({
      page: row.page,
      query: row.query,
      country: row.country,
      device: row.device,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      startDate: row.startDate ? new Date(row.startDate) : undefined,
      endDate: row.endDate ? new Date(row.endDate) : undefined
    }))
  });
}
