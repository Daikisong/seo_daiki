import {
  archiveAdminRecord,
  deleteAdminRecord,
  isAdminEntityType
} from "./adminMutations";
import { recordActionUsage } from "./adminCliArgs";
import { adminCommandHandled, adminCommandNotHandled } from "./adminCliCommandResult";

export async function runRecordAdminCommand(command: string | undefined, args: string[]) {
  if (command === "archive-record" || command === "delete-record") {
    const [entityType, entityId] = args;
    if (!entityType || !entityId || !isAdminEntityType(entityType)) {
      throw new Error(recordActionUsage(command));
    }
    if (command === "archive-record") {
      await archiveAdminRecord({ entityType, entityId, actor: "db-admin-cli" });
      console.log(`Archived ${entityType} ${entityId}`);
    } else {
      await deleteAdminRecord({ entityType, entityId, actor: "db-admin-cli" });
      console.log(`Deleted ${entityType} ${entityId}`);
    }
    return adminCommandHandled();
  }

  return adminCommandNotHandled;
}
