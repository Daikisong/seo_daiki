import type { EvidencePack, Product } from "@global-import-lab/types";
import { RecordActionForm } from "./AdminForms";
import { EvidencePackForm } from "./EvidenceRecordForms";

export function EvidencePackTable({
  evidencePacks,
  products
}: {
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Pack</th>
          <th>Locale</th>
          <th>Allowed claims</th>
          <th>Forbidden claims</th>
          <th>Edit JSON</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {evidencePacks.map((pack) => (
          <tr key={pack.id}>
            <td>{pack.id}</td>
            <td>{pack.locale}</td>
            <td>{pack.packJson.allowedClaims.length}</td>
            <td>{pack.packJson.forbiddenClaims.length}</td>
            <td>
              <EvidencePackForm pack={pack} products={products} />
            </td>
            <td>
              <RecordActionForm entityId={pack.id} entityType="evidence-pack" returnTo="/admin/evidence/" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
