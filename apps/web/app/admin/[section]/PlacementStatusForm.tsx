export function PlacementStatusForm({ placementId, returnTo }: { placementId: string; returnTo: string }) {
  return (
    <form action="/api/admin/affiliate-placement-status" className="grid min-w-56 gap-2" method="post">
      <input name="id" type="hidden" value={placementId} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="disclosureShown" type="hidden" value="true" />
      <input
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
        name="adminToken"
        placeholder="Admin token"
        type="password"
      />
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-md bg-teal-800 px-3 py-2 text-sm font-semibold text-white" name="status" type="submit" value="approved">
          Approve
        </button>
        <button className="rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white" name="status" type="submit" value="rejected">
          Reject
        </button>
      </div>
    </form>
  );
}
