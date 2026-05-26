export function UseCaseRecommendation({ recommendation }: { recommendation: string }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Use-case recommendation</h2>
      <p className="mt-2 text-sm text-neutral-700">{recommendation}</p>
    </section>
  );
}
