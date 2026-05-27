import type { Product } from "@global-import-lab/types";
import type { LabEvidenceRows } from "./EvidenceRecordFormTypes";
import { LabEvidenceAssetTable } from "./LabEvidenceAssetTable";
import { LabEvidenceUploadForm } from "./LabEvidenceUploadForm";

export function LabEvidenceSection({
  labEvidenceAssets,
  products
}: {
  labEvidenceAssets: LabEvidenceRows;
  products: Product[];
}) {
  return (
    <>
      <LabEvidenceUploadForm products={products} />
      <LabEvidenceAssetTable labEvidenceAssets={labEvidenceAssets} />
    </>
  );
}

export { LabEvidenceAssetTable } from "./LabEvidenceAssetTable";
export { LabEvidenceUploadForm } from "./LabEvidenceUploadForm";
