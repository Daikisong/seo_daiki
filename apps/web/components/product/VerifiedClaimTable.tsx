import type { VerifiedClaim } from "@global-import-lab/types";

export function VerifiedClaimTable({ claims }: { claims: VerifiedClaim[] }) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Verified facts</h2>
      <div className="mt-3 overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Test</th>
              <th>Result</th>
              <th>Method</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.testType}</td>
                <td>
                  {claim.resultValue}
                  {claim.unit ? ` ${claim.unit}` : ""}
                </td>
                <td>{claim.method}</td>
                <td>{Math.round(claim.confidence * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
