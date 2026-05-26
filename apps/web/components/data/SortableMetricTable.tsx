import type { Product } from "@global-import-lab/types";

export function SortableMetricTable({ products }: { products: Product[] }) {
  const rows = [...products].sort((a, b) => b.identityConfidence - a.identityConfidence);
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Identity confidence table</h2>
      <div className="mt-3 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Identity confidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>{product.canonicalName}</td>
                <td>{product.category}</td>
                <td>{Math.round(product.identityConfidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
