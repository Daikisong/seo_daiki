import { auditActorLabel, auditSummaryLabel } from "@/lib/admin/admin-review-model";
import { readAuditLogs } from "@/lib/admin/admin-section-data";
import { AdminPanel } from "./AdminForms";

export async function AuditSection() {
  const logs = await readAuditLogs();
  return (
    <AdminPanel title="Audit log">
      {logs.length === 0 ? (
        <p className="text-sm text-neutral-700">No audit logs are available. Connect Postgres and run admin mutations to populate this table.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Created</th>
              <th>Entity</th>
              <th>Action</th>
              <th>Actor</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.createdAt}</td>
                <td>
                  <p>{log.entityType}</p>
                  <p className="text-xs text-neutral-500">{log.entityId}</p>
                </td>
                <td>{log.action}</td>
                <td>{auditActorLabel(log.actor)}</td>
                <td>{auditSummaryLabel(log.summary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
