import type { PriceSnapshot } from "@global-import-lab/types";

export function PriceTruthCard({ snapshots }: { snapshots: PriceSnapshot[] }) {
  const latest = snapshots.at(-1);
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Price truth</h2>
      {latest ? (
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-neutral-500">Observed price</dt>
            <dd className="font-semibold">
              {latest.currency} {latest.finalPrice ?? latest.price}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Good buy zone</dt>
            <dd className="font-semibold">under 18 USD shipped</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Wait zone</dt>
            <dd className="font-semibold">22 USD or higher</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Last checked</dt>
            <dd className="font-semibold">{latest.capturedAt}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-2 text-sm text-neutral-700">No price snapshot is attached yet.</p>
      )}
    </section>
  );
}
