import assert from "node:assert/strict";
import {
  LabEvidenceAssetTable,
  LabEvidenceSection,
  LabEvidenceUploadForm
} from "../apps/web/app/admin/[section]/LabEvidenceSection";
import { LabEvidenceAssetTable as DirectLabEvidenceAssetTable } from "../apps/web/app/admin/[section]/LabEvidenceAssetTable";
import { LabEvidenceUploadForm as DirectLabEvidenceUploadForm } from "../apps/web/app/admin/[section]/LabEvidenceUploadForm";

assert.equal(LabEvidenceAssetTable, DirectLabEvidenceAssetTable);
assert.equal(LabEvidenceUploadForm, DirectLabEvidenceUploadForm);

for (const component of [LabEvidenceAssetTable, LabEvidenceSection, LabEvidenceUploadForm]) {
  assert.equal(typeof component, "function");
}

console.log("Lab evidence section component module tests passed");
