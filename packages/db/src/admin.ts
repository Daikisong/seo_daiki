import { prisma } from "./client";
import {
  importRefreshSuggestions,
  importSearchConsoleSnapshot,
  importWorkerEvidence
} from "./importWorkerOutputs";
import { listLabEvidenceAssets } from "./labEvidence";
import {
  archiveAdminRecord,
  deleteAdminRecord,
  getAuditLogs,
  isAdminEntityType
} from "./adminMutations";
import {
  isRefreshSuggestionStatus,
  listRefreshSuggestions,
  refreshSuggestionStatuses,
  updateRefreshSuggestionStatus
} from "./searchConsole";

const rawArgs = process.argv.slice(2);
const [command, ...args] = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;

async function main() {
  if (command === "list-articles") {
    const rows = await prisma.article.findMany({
      select: { id: true, locale: true, type: true, slug: true, indexStatus: true, qualityScore: true },
      orderBy: [{ locale: "asc" }, { type: "asc" }, { slug: "asc" }]
    });
    console.table(rows);
    return;
  }

  if (command === "set-index-status") {
    const [id, indexStatus] = args;
    if (!id || !indexStatus) {
      throw new Error("Usage: pnpm db:admin -- set-index-status <articleId> <index|noindex|pending|refresh_needed|merge_candidate>");
    }

    await prisma.article.update({
      where: { id },
      data: { indexStatus }
    });
    console.log(`Updated ${id} to ${indexStatus}`);
    return;
  }

  if (command === "quality-summary") {
    const rows = await prisma.article.groupBy({
      by: ["indexStatus"],
      _count: { id: true }
    });
    console.table(rows.map((row) => ({ indexStatus: row.indexStatus, count: row._count.id })));
    return;
  }

  if (command === "list-lab-evidence") {
    const rows = await listLabEvidenceAssets();
    console.table(
      rows.map((row) => ({
        id: row.id,
        productId: row.productId,
        measurementType: row.measurementType,
        fileName: row.fileName,
        sizeBytes: row.sizeBytes,
        uploadedAt: row.uploadedAt
      }))
    );
    return;
  }

  if (command === "list-audit-logs") {
    const rows = await getAuditLogs(Number(args[0] ?? 50));
    console.table(
      rows.map((row) => ({
        id: row.id,
        entityType: row.entityType,
        entityId: row.entityId,
        action: row.action,
        actor: row.actor,
        createdAt: row.createdAt,
        summary: row.summary
      }))
    );
    return;
  }

  if (command === "list-refresh-suggestions") {
    const [statusArg, limitArg] = args;
    if (statusArg && !isRefreshSuggestionStatus(statusArg) && Number.isNaN(Number(statusArg))) {
      throw new Error(
        `Usage: pnpm db:admin -- list-refresh-suggestions [${refreshSuggestionStatuses.join("|")}] [limit]`
      );
    }
    const status = statusArg && isRefreshSuggestionStatus(statusArg) ? statusArg : undefined;
    const limit = status ? Number(limitArg ?? 100) : Number(statusArg ?? 100);
    const rows = await listRefreshSuggestions({ status, limit: Number.isFinite(limit) ? limit : 100 });
    console.table(
      rows.map((row) => ({
        id: row.id,
        status: row.status,
        page: row.page,
        query: row.query,
        reason: row.reason,
        updatedAt: row.updatedAt
      }))
    );
    return;
  }

  if (command === "archive-record" || command === "delete-record") {
    const [entityType, entityId] = args;
    if (!entityType || !entityId || !isAdminEntityType(entityType)) {
      throw new Error(
        `Usage: pnpm db:admin -- ${command} <product|variant|seller-claim|verified-claim|market-risk|evidence-pack|article> <id>`
      );
    }
    if (command === "archive-record") {
      await archiveAdminRecord({ entityType, entityId, actor: "db-admin-cli" });
      console.log(`Archived ${entityType} ${entityId}`);
    } else {
      await deleteAdminRecord({ entityType, entityId, actor: "db-admin-cli" });
      console.log(`Deleted ${entityType} ${entityId}`);
    }
    return;
  }

  if (command === "import-worker-outputs") {
    const summary = await importWorkerEvidence();
    console.table([summary]);
    return;
  }

  if (command === "import-search-console") {
    const [file] = args;
    const summary = await importSearchConsoleSnapshot(file);
    console.table([summary]);
    return;
  }

  if (command === "import-refresh-suggestions") {
    const [file] = args;
    const summary = await importRefreshSuggestions(file);
    console.table([summary]);
    return;
  }

  if (command === "set-refresh-suggestion-status") {
    const [id, status] = args;
    if (!id || !status || !isRefreshSuggestionStatus(status)) {
      throw new Error(
        `Usage: pnpm db:admin -- set-refresh-suggestion-status <suggestionId> <${refreshSuggestionStatuses.join("|")}>`
      );
    }

    await updateRefreshSuggestionStatus({ id, status, actor: "db-admin-cli" });
    console.log(`Updated refresh suggestion ${id} to ${status}`);
    return;
  }

  console.log(`Available commands:
  list-articles
  list-lab-evidence
  list-audit-logs [limit]
  list-refresh-suggestions [status] [limit]
  quality-summary
  set-index-status <articleId> <index|noindex|pending|refresh_needed|merge_candidate>
  set-refresh-suggestion-status <suggestionId> <open|planned|applied|dismissed>
  archive-record <entityType> <id>
  delete-record <entityType> <id>
  import-worker-outputs
  import-search-console [file]
  import-refresh-suggestions [file]`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
