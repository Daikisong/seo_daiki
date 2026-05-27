import assert from "node:assert/strict";
import {
  ExistingMarketRisksTable,
  ExistingSellerClaimsTable,
  ExistingVerifiedClaimsTable
} from "../apps/web/app/admin/[section]/EvidenceClaimTables";
import { EvidenceCreatePanels } from "../apps/web/app/admin/[section]/EvidenceCreatePanels";
import { EvidencePackTable } from "../apps/web/app/admin/[section]/EvidencePackTable";
import { LabEvidenceSection } from "../apps/web/app/admin/[section]/LabEvidenceSection";

assert.equal(typeof EvidenceCreatePanels, "function");
assert.equal(typeof LabEvidenceSection, "function");
assert.equal(typeof EvidencePackTable, "function");
assert.equal(typeof ExistingSellerClaimsTable, "function");
assert.equal(typeof ExistingVerifiedClaimsTable, "function");
assert.equal(typeof ExistingMarketRisksTable, "function");

console.log("Admin evidence section module export tests passed");
