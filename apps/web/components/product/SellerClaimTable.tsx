import type { SellerClaim } from "@global-import-lab/types";

export function SellerClaimTable({ claims }: { claims: SellerClaim[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Seller claims</h2>
      <div className="mt-3 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Claim</th>
              <th>Value</th>
              <th>Confidence</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.claimType}</td>
                <td>{claim.claimValue}</td>
                <td>{Math.round(claim.confidence * 100)}%</td>
                <td>{claim.sourceUrl ? "seller listing" : "captured note"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
