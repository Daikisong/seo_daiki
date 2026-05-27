import assert from "node:assert/strict";
import {
  articleLocaleTypeLabel,
  articlePathLabel,
  articleStoredStatusLabel,
  auditActorLabel,
  auditSummaryLabel,
  duplicateCandidateLabel,
  healthComplianceLabel,
  issueListLabel,
  localizationDepthLabel,
  localizationPrimaryLocale,
  localizationVariantStatusLabel
} from "../apps/web/lib/admin/admin-review-model";

assert.equal(issueListLabel(["unsafe_redirect", "health_claim"]), "unsafe_redirect, health_claim");
assert.equal(issueListLabel([]), "-");
assert.equal(duplicateCandidateLabel(0), "-");
assert.equal(duplicateCandidateLabel(3), 3);

assert.equal(articleLocaleTypeLabel({ locale: "en", type: "review" }), "en / review");
assert.equal(
  articlePathLabel({ locale: "pt-br", type: "risk", slug: "carregadores-aliexpress-brasil" }),
  "pt-br/risk/carregadores-aliexpress-brasil"
);
assert.equal(articleStoredStatusLabel({ publishStatus: "published", indexStatus: "index" }), "published/index");
assert.equal(healthComplianceLabel({ healthSensitivity: "high", complianceStatus: "manual_required" }), "high/manual_required");

assert.equal(auditActorLabel("admin"), "admin");
assert.equal(auditActorLabel(null), "-");
assert.equal(auditActorLabel(undefined), "-");
assert.equal(auditSummaryLabel("Updated article."), "Updated article.");
assert.equal(auditSummaryLabel(null), "-");

const variants = [
  { locale: "en", status: "published", localizationDepthScore: 0.92 },
  { locale: "es", status: "draft", localizationDepthScore: 0.71 }
];

assert.equal(localizationVariantStatusLabel(variants), "en:published, es:draft");
assert.equal(localizationVariantStatusLabel([]), "-");
assert.equal(localizationDepthLabel(variants), "en 0.92, es 0.71");
assert.equal(localizationDepthLabel([]), "-");
assert.equal(localizationPrimaryLocale(variants), "en");
assert.equal(localizationPrimaryLocale([]), "en");

console.log("Admin review model unit tests passed");
