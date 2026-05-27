import type { Product } from "@global-import-lab/types";
import type { LabEvidenceRows } from "./EvidenceRecordFormTypes";
import { AdminPanel } from "./AdminForms";
import {
  EvidencePackForm,
  MarketRiskForm,
  SellerClaimForm,
  VerifiedClaimForm
} from "./EvidenceRecordForms";

export function EvidenceCreatePanels({
  labEvidenceAssets,
  products
}: {
  labEvidenceAssets: LabEvidenceRows;
  products: Product[];
}) {
  return (
    <>
      <AdminPanel title="Add seller claim">
        <SellerClaimForm products={products} />
      </AdminPanel>
      <AdminPanel title="Add verified claim">
        <VerifiedClaimForm labEvidenceAssets={labEvidenceAssets} listId="new-verified-claim-evidence-url" products={products} />
      </AdminPanel>
      <AdminPanel title="Add market risk">
        <MarketRiskForm products={products} />
      </AdminPanel>
      <AdminPanel title="Create evidence pack">
        <EvidencePackForm products={products} />
      </AdminPanel>
    </>
  );
}
