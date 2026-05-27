import { mapAuditLogRow } from "./admin-section-db-mappers";

export async function readAuditLogs() {
  if (!process.env.DATABASE_URL) {
    return [];
  }
  try {
    const { getAuditLogs } = await import("@global-import-lab/db/admin-mutations");
    const logs = await getAuditLogs(50);
    return logs.map(mapAuditLogRow);
  } catch (error) {
    console.warn("Audit logs unavailable.", error);
    return [];
  }
}
