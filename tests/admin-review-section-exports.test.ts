import assert from "node:assert/strict";
import {
  ArticlesSection,
  AuditSection,
  ComplianceSection,
  LocalizationSection,
  QualitySection
} from "../apps/web/app/admin/[section]/ReviewSections";
import { ArticlesSection as DirectArticlesSection } from "../apps/web/app/admin/[section]/ArticlesSection";
import { AuditSection as DirectAuditSection } from "../apps/web/app/admin/[section]/AuditSection";
import { ComplianceSection as DirectComplianceSection } from "../apps/web/app/admin/[section]/ComplianceSection";
import { LocalizationSection as DirectLocalizationSection } from "../apps/web/app/admin/[section]/LocalizationSection";
import { QualitySection as DirectQualitySection } from "../apps/web/app/admin/[section]/QualitySection";

assert.equal(ArticlesSection, DirectArticlesSection);
assert.equal(AuditSection, DirectAuditSection);
assert.equal(ComplianceSection, DirectComplianceSection);
assert.equal(LocalizationSection, DirectLocalizationSection);
assert.equal(QualitySection, DirectQualitySection);

for (const section of [ArticlesSection, AuditSection, ComplianceSection, LocalizationSection, QualitySection]) {
  assert.equal(typeof section, "function");
}

console.log("Admin review section module export tests passed");
