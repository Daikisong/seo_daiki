import assert from "node:assert/strict";
import {
  ExistingMarketRisksTable,
  ExistingSellerClaimsTable,
  ExistingVerifiedClaimsTable
} from "../apps/web/app/admin/[section]/EvidenceClaimTables";
import { ExistingMarketRisksTable as DirectMarketRisksTable } from "../apps/web/app/admin/[section]/MarketRisksTable";
import { ExistingSellerClaimsTable as DirectSellerClaimsTable } from "../apps/web/app/admin/[section]/SellerClaimsTable";
import { ExistingVerifiedClaimsTable as DirectVerifiedClaimsTable } from "../apps/web/app/admin/[section]/VerifiedClaimsTable";
import { EvidenceCreatePanels } from "../apps/web/app/admin/[section]/EvidenceCreatePanels";
import { EvidencePackTable } from "../apps/web/app/admin/[section]/EvidencePackTable";
import { LabEvidenceSection } from "../apps/web/app/admin/[section]/LabEvidenceSection";

assert.equal(typeof EvidenceCreatePanels, "function");
assert.equal(typeof LabEvidenceSection, "function");
assert.equal(typeof EvidencePackTable, "function");
assert.equal(typeof ExistingSellerClaimsTable, "function");
assert.equal(typeof ExistingVerifiedClaimsTable, "function");
assert.equal(typeof ExistingMarketRisksTable, "function");
assert.equal(ExistingSellerClaimsTable, DirectSellerClaimsTable);
assert.equal(ExistingVerifiedClaimsTable, DirectVerifiedClaimsTable);
assert.equal(ExistingMarketRisksTable, DirectMarketRisksTable);

console.log("Admin evidence section module export tests passed");
