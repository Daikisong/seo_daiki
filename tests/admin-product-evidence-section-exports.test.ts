import assert from "node:assert/strict";
import { EvidenceSection, ProductsSection } from "../apps/web/app/admin/[section]/ProductEvidenceSections";
import { EvidenceSection as DirectEvidenceSection } from "../apps/web/app/admin/[section]/EvidenceSection";
import { ProductsSection as DirectProductsSection } from "../apps/web/app/admin/[section]/ProductsSection";

assert.equal(ProductsSection, DirectProductsSection);
assert.equal(EvidenceSection, DirectEvidenceSection);
assert.equal(typeof ProductsSection, "function");
assert.equal(typeof EvidenceSection, "function");

console.log("Admin product evidence section module export tests passed");
