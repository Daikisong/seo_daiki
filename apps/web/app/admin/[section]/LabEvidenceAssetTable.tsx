import { nullableAdminText } from "@/lib/admin/admin-product-evidence-model";
import type { LabEvidenceRows } from "./EvidenceRecordFormTypes";
import { AdminPanel } from "./AdminForms";

export function LabEvidenceAssetTable({ labEvidenceAssets }: { labEvidenceAssets: LabEvidenceRows }) {
  return (
    <AdminPanel title="Existing lab evidence files">
      {labEvidenceAssets.length === 0 ? (
        <p className="text-sm text-neutral-700">No database-backed lab evidence assets are available yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Measurement</th>
              <th>Product</th>
              <th>Verified claim</th>
              <th>Size</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {labEvidenceAssets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.fileName}</td>
                <td>{asset.measurementType}</td>
                <td>{nullableAdminText(asset.productId)}</td>
                <td>{nullableAdminText(asset.verifiedClaimId)}</td>
                <td>{asset.sizeBytes}</td>
                <td>
                  <a className="text-teal-800 underline" href={asset.publicUrl}>
                    {asset.publicUrl}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminPanel>
  );
}
