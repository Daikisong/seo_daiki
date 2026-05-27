import {
  refreshSuggestionStatuses
} from "@/lib/admin/admin-section-config";
import type { readPersistedRefreshSuggestions } from "@/lib/admin/admin-section-data";

export type AdminRecordEntityType =
  | "product"
  | "variant"
  | "seller-claim"
  | "verified-claim"
  | "market-risk"
  | "evidence-pack"
  | "article";

export function RecordActionForm({
  entityId,
  entityType,
  returnTo
}: {
  entityId: string;
  entityType: AdminRecordEntityType;
  returnTo: string;
}) {
  return (
    <form action="/api/admin/record-action" className="grid min-w-52 gap-2" method="post">
      <input name="entityType" type="hidden" value={entityType} />
      <input name="entityId" type="hidden" value={entityId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md bg-neutral-700 px-3 py-2 text-sm font-semibold text-white" name="action" type="submit" value="archive">
          Archive
        </button>
        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" name="action" type="submit" value="delete">
          Delete
        </button>
      </div>
    </form>
  );
}

export function RefreshSuggestionStatusForm({
  suggestion
}: {
  suggestion: Awaited<ReturnType<typeof readPersistedRefreshSuggestions>>[number];
}) {
  return (
    <form action="/api/admin/refresh-suggestion-status" className="grid min-w-56 gap-2" method="post">
      <input name="id" type="hidden" value={suggestion.id} />
      <input name="returnTo" type="hidden" value="/admin/search-console/" />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <select
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        defaultValue={suggestion.status}
        name="status"
      >
        {refreshSuggestionStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" type="submit">
        Save status
      </button>
    </form>
  );
}
