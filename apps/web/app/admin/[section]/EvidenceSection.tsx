import type { EvidencePack, Product } from "@global-import-lab/types";
import { readLabEvidenceAssets } from "@/lib/admin/admin-section-data";
import {
  ExistingMarketRisksTable,
  ExistingSellerClaimsTable,
  ExistingVerifiedClaimsTable
} from "./EvidenceClaimTables";
import { EvidenceCreatePanels } from "./EvidenceCreatePanels";
import { EvidencePackTable } from "./EvidencePackTable";
import { LabEvidenceSection } from "./LabEvidenceSection";

export async function EvidenceSection({
  evidencePacks,
  products
}: {
  evidencePacks: EvidencePack[];
  products: Product[];
}) {
  const labEvidenceAssets = await readLabEvidenceAssets();

  return (
    <div className="space-y-6">
      <EvidenceCreatePanels labEvidenceAssets={labEvidenceAssets} products={products} />
      <LabEvidenceSection labEvidenceAssets={labEvidenceAssets} products={products} />
      <EvidencePackTable evidencePacks={evidencePacks} products={products} />
      <ExistingSellerClaimsTable products={products} />
      <ExistingVerifiedClaimsTable labEvidenceAssets={labEvidenceAssets} products={products} />
      <ExistingMarketRisksTable products={products} />
    </div>
  );
}
