import type { Variant } from "@global-import-lab/types";

export function VariantTrapMap({ variants }: { variants: Variant[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Variant trap map</h2>
      <div className="mt-3 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th>Watts</th>
              <th>Plug</th>
              <th>Cable</th>
              <th>Risk flags</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id}>
                <td>{variant.optionName}</td>
                <td>{variant.wattageClaim ? `${variant.wattageClaim}W` : "unknown"}</td>
                <td>{variant.plugType ?? "n/a"}</td>
                <td>{variant.cableIncluded ? "included" : "not included"}</td>
                <td>{variant.riskFlags?.join("; ") ?? "none recorded"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
