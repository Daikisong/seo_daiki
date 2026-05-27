import { prisma } from "./client";
import { isIndexStatus, updateArticleState } from "./adminMutations";
import { indexStatusUsage } from "./adminCliArgs";
import { adminCommandHandled, adminCommandNotHandled } from "./adminCliCommandResult";

export async function runArticleAdminCommand(command: string | undefined, args: string[]) {
  if (command === "list-articles") {
    const rows = await prisma.article.findMany({
      select: { id: true, locale: true, type: true, slug: true, indexStatus: true, qualityScore: true },
      orderBy: [{ locale: "asc" }, { type: "asc" }, { slug: "asc" }]
    });
    console.table(rows);
    return adminCommandHandled();
  }

  if (command === "set-index-status") {
    const [id, indexStatus] = args;
    if (!id || !indexStatus || !isIndexStatus(indexStatus)) {
      throw new Error(indexStatusUsage());
    }

    await updateArticleState({ id, indexStatus });
    console.log(`Updated ${id} to ${indexStatus}`);
    return adminCommandHandled();
  }

  if (command === "quality-summary") {
    const rows = await prisma.article.groupBy({
      by: ["indexStatus"],
      _count: { id: true }
    });
    console.table(rows.map((row) => ({ indexStatus: row.indexStatus, count: row._count.id })));
    return adminCommandHandled();
  }

  return adminCommandNotHandled;
}
