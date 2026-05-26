import type { Product } from "@global-import-lab/types";

export function BenchmarkTable({ products }: { products: Product[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Benchmark table</h2>
      <div className="mt-3 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Claim</th>
              <th>Verified result</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.canonicalName}</td>
                <td>{product.sellerClaims[0]?.claimValue ?? "unknown"}</td>
                <td>
                  {product.verifiedClaims[0]
                    ? `${product.verifiedClaims[0].resultValue} ${product.verifiedClaims[0].unit ?? ""}`
                    : "not verified"}
                </td>
                <td>{product.verifiedClaims[0]?.method ?? "pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
