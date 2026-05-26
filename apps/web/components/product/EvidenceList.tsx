export function EvidenceList({ evidenceIds }: { evidenceIds: string[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Evidence</h2>
      <ul className="mt-3 grid gap-2 text-sm text-neutral-700 md:grid-cols-2">
        {evidenceIds.map((id) => (
          <li className="rounded-md border border-neutral-200 px-3 py-2 font-mono text-xs" key={id}>
            {id}
          </li>
        ))}
      </ul>
    </section>
  );
}
