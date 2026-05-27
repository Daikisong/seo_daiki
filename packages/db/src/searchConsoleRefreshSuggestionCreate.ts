import { prisma } from "./client";
import { toRefreshSuggestionJson } from "./searchConsoleRefreshSuggestionJson";

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
        actions: toRefreshSuggestionJson(input.actions),
        status: existing.status === "planned" ? "planned" : "open"
      }
    });
  }

  return prisma.pageRefreshSuggestion.create({
    data: {
      page: input.page,
      query: input.query,
      reason: input.reason,
      actions: toRefreshSuggestionJson(input.actions)
    }
  });
}
