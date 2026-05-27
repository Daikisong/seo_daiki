import { prisma } from "./client";
import type { Prisma } from "./generated/prisma/client";
import {
  isRefreshSuggestionStatus,
  type RefreshSuggestionStatus
} from "./searchConsoleTypes";

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

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
