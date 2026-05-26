import { prisma } from "./client";
import type { Prisma } from "./generated/prisma/client";

export const refreshSuggestionStatuses = ["open", "planned", "applied", "dismissed"] as const;

export type RefreshSuggestionStatus = (typeof refreshSuggestionStatuses)[number];

export interface SearchConsoleMetricInput {
  page: string;
  query: string;
  country?: string;
  device?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  startDate?: string;
  endDate?: string;
}

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

export async function createRefreshSuggestion(input: {
  page: string;
  query?: string;
  reason: string;
  actions: unknown;
}) {
  const existing = await prisma.pageRefreshSuggestion.findFirst({
    where: {
      page: input.page,
      query: input.query ?? null,
      reason: input.reason,
      status: { in: ["open", "planned"] }
    },
    orderBy: { updatedAt: "desc" }
  });

  if (existing) {
    return prisma.pageRefreshSuggestion.update({
      where: { id: existing.id },
      data: {
        actions: toJson(input.actions),
        status: existing.status === "planned" ? "planned" : "open"
      }
    });
  }

  return prisma.pageRefreshSuggestion.create({
    data: {
      page: input.page,
      query: input.query,
      reason: input.reason,
      actions: toJson(input.actions)
    }
  });
}

export async function listRefreshSuggestions(input: { status?: RefreshSuggestionStatus; limit?: number } = {}) {
  return prisma.pageRefreshSuggestion.findMany({
    where: input.status ? { status: input.status } : undefined,
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    take: Math.min(Math.max(input.limit ?? 100, 1), 500)
  });
}

export async function updateRefreshSuggestionStatus(input: {
  id: string;
  status: RefreshSuggestionStatus;
  actor?: string;
}) {
  if (!isRefreshSuggestionStatus(input.status)) {
    throw new Error(`Invalid refresh suggestion status: ${input.status}`);
  }

  return prisma.$transaction(async (tx) => {
    const before = await tx.pageRefreshSuggestion.findUnique({ where: { id: input.id } });
    if (!before) {
      throw new Error(`PageRefreshSuggestion ${input.id} was not found.`);
    }

    const after = await tx.pageRefreshSuggestion.update({
      where: { id: input.id },
      data: { status: input.status }
    });

    await tx.auditLog.create({
      data: {
        entityType: "page-refresh-suggestion",
        entityId: input.id,
        action: "status_update",
        actor: input.actor,
        summary: `Marked refresh suggestion as ${input.status}.`,
        beforeJson: toJson(before),
        afterJson: toJson(after)
      }
    });

    return after;
  });
}

export function isRefreshSuggestionStatus(value: string): value is RefreshSuggestionStatus {
  return refreshSuggestionStatuses.includes(value as RefreshSuggestionStatus);
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
