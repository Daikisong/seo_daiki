export function BuyAvoidCard({ buy, avoid }: { buy: string; avoid: string }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-md border border-teal-200 bg-white p-4">
        <h2 className="text-base font-semibold text-teal-800">Buy zone</h2>
        <p className="mt-2 text-sm text-neutral-700">{buy}</p>
      </div>
      <div className="rounded-md border border-amber-200 bg-white p-4">
        <h2 className="text-base font-semibold text-amber-800">Avoid zone</h2>
        <p className="mt-2 text-sm text-neutral-700">{avoid}</p>
      </div>
    </section>
  );
}
