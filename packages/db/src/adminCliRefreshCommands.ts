import {
  isRefreshSuggestionStatus,
  listRefreshSuggestions,
  refreshSuggestionStatuses,
  updateRefreshSuggestionStatus
} from "./searchConsole";
import {
  refreshSuggestionListUsage,
  refreshSuggestionStatusUsage
} from "./adminCliArgs";
import { adminCommandHandled, adminCommandNotHandled } from "./adminCliCommandResult";

export async function runRefreshAdminCommand(command: string | undefined, args: string[]) {
  if (command === "list-refresh-suggestions") {
    const [statusArg, limitArg] = args;
    if (statusArg && !isRefreshSuggestionStatus(statusArg) && Number.isNaN(Number(statusArg))) {
      throw new Error(refreshSuggestionListUsage(refreshSuggestionStatuses));
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
    return adminCommandHandled();
  }

  if (command === "set-refresh-suggestion-status") {
    const [id, status] = args;
    if (!id || !status || !isRefreshSuggestionStatus(status)) {
      throw new Error(refreshSuggestionStatusUsage(refreshSuggestionStatuses));
    }

    await updateRefreshSuggestionStatus({ id, status, actor: "db-admin-cli" });
    console.log(`Updated refresh suggestion ${id} to ${status}`);
    return adminCommandHandled();
  }

  return adminCommandNotHandled;
}
