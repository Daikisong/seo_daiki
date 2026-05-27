import assert from "node:assert/strict";
import {
  allowedDomainsLabel,
  articleRouteLabel,
  booleanStatusLabel,
  candidateApprovalLabel,
  candidateArticleLabel,
  merchantEnabledLabel,
  merchantHealthLabel,
  offerLocaleLabel,
  placementDisclosureLabel
} from "../apps/web/lib/admin/admin-monetization-model";

assert.equal(booleanStatusLabel(true, "yes", "no"), "yes");
assert.equal(booleanStatusLabel(false, "yes", "no"), "no");
assert.equal(merchantHealthLabel({ healthSensitive: true }), "health-sensitive");
assert.equal(merchantHealthLabel({ healthSensitive: false }), "standard");
assert.equal(merchantEnabledLabel({ enabled: true }), "enabled");
assert.equal(merchantEnabledLabel({ enabled: false }), "disabled");
assert.equal(allowedDomainsLabel(["example.com", "go.example.com"]), "example.com, go.example.com");
assert.equal(offerLocaleLabel("en"), "en");
assert.equal(offerLocaleLabel(null), "-");
assert.equal(placementDisclosureLabel({ disclosureShown: true }), "confirmed");
assert.equal(placementDisclosureLabel({ disclosureShown: false }), "missing");
assert.equal(candidateApprovalLabel({ humanApprovalRequired: true }), "human approval required");
assert.equal(candidateApprovalLabel({ humanApprovalRequired: false }), "not required");
assert.equal(candidateArticleLabel({ articleId: "article-1", briefId: "brief-1" }), "article-1");
assert.equal(candidateArticleLabel({ briefId: "brief-1" }), "brief-1");
assert.equal(candidateArticleLabel({}), "-");
assert.equal(
  articleRouteLabel({ articleLocale: "pt-br", articleType: "review", articleSlug: "charger" }),
  "pt-br/review/charger"
);

console.log("Admin monetization model unit tests passed");
