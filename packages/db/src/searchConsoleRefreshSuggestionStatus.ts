import { prisma } from "./client";
import { toRefreshSuggestionJson } from "./searchConsoleRefreshSuggestionJson";
import {
  isRefreshSuggestionStatus,
  type RefreshSuggestionStatus
} from "./searchConsoleTypes";

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
        beforeJson: toRefreshSuggestionJson(before),
        afterJson: toRefreshSuggestionJson(after)
      }
    });

    return after;
  });
}
