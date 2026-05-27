import { getAuditLogs } from "./adminMutations";
import { listLabEvidenceAssets } from "./labEvidence";
import { adminCommandHandled, adminCommandNotHandled } from "./adminCliCommandResult";

export async function runEvidenceAdminCommand(command: string | undefined, args: string[]) {
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
    return adminCommandHandled();
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
    return adminCommandHandled();
  }

  return adminCommandNotHandled;
}
