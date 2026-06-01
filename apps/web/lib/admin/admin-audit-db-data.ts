import { mapAuditLogRow } from "./admin-section-db-mappers";
import type { AuditLogRow } from "./admin-section-db-row-types";

export type AuditLogView = ReturnType<typeof mapAuditLogRow>;

export async function readAuditLogs(): Promise<AuditLogView[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { getAuditLogs } = await import("@global-import-lab/db/admin-mutations");
    const logs = (await getAuditLogs(50)) as AuditLogRow[];
    return logs.map(mapAuditLogRow);
  } catch (error) {
    console.warn("Audit logs unavailable.", error);
    return [];
  }
}
