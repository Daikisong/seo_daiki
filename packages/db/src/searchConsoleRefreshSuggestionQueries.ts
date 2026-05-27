import { prisma } from "./client";
import type { RefreshSuggestionStatus } from "./searchConsoleTypes";

export async function listRefreshSuggestions(input: { status?: RefreshSuggestionStatus; limit?: number } = {}) {
  return prisma.pageRefreshSuggestion.findMany({
    where: input.status ? { status: input.status } : undefined,
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    take: Math.min(Math.max(input.limit ?? 100, 1), 500)
  });
}
