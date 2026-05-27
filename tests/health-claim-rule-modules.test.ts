import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import {
  genericBestSupplementTitleIssue,
  healthDisclaimerIssue,
  highSensitivityApprovalIssue
} from "../packages/validators/src/healthClaimArticleIssues";
import {
  forbiddenHealthClaimIssues,
  forbiddenHealthClaimRules
} from "../packages/validators/src/healthClaimForbiddenRules";
import {
  dosageAdviceIssue,
  healthSensitiveWarningIssue
} from "../packages/validators/src/healthClaimTextIssues";
import {
  dosageAdviceIssue as exportedDosageAdviceIssue,
  forbiddenHealthClaimIssues as exportedForbiddenHealthClaimIssues,
  forbiddenHealthClaimRules as exportedForbiddenHealthClaimRules,
  genericBestSupplementTitleIssue as exportedGenericBestSupplementTitleIssue,
  healthDisclaimerIssue as exportedHealthDisclaimerIssue,
  healthSensitiveWarningIssue as exportedHealthSensitiveWarningIssue,
  highSensitivityApprovalIssue as exportedHighSensitivityApprovalIssue
} from "../packages/validators/src/healthClaimRules";

assert.equal(exportedDosageAdviceIssue, dosageAdviceIssue);
assert.equal(exportedForbiddenHealthClaimIssues, forbiddenHealthClaimIssues);
assert.equal(exportedForbiddenHealthClaimRules, forbiddenHealthClaimRules);
assert.equal(exportedGenericBestSupplementTitleIssue, genericBestSupplementTitleIssue);
assert.equal(exportedHealthDisclaimerIssue, healthDisclaimerIssue);
assert.equal(exportedHealthSensitiveWarningIssue, healthSensitiveWarningIssue);
assert.equal(exportedHighSensitivityApprovalIssue, highSensitivityApprovalIssue);

assert.equal(forbiddenHealthClaimIssues("This can cure insomnia.", false)[0]?.code, "health_claim_disease_language");
assert.equal(dosageAdviceIssue("Take 200 mg per day.", false)?.code, "health_dosage_without_source");
assert.equal(healthSensitiveWarningIssue("Gut health during pregnancy matters.")?.code, "health_sensitive_warning_missing");
assert.equal(healthDisclaimerIssue(articleFixture({ healthSensitivity: "medium" }), false, false)?.code, "health_disclaimer_missing");
assert.equal(highSensitivityApprovalIssue(articleFixture({ healthSensitivity: "high", indexStatus: "index" }))?.code, "health_high_sensitivity_manual_approval_required");
assert.equal(genericBestSupplementTitleIssue(articleFixture({ title: "Best Magnesium Supplement for Sleep" }))?.code, "health_generic_best_supplement_title");

console.log("Health claim rule module tests passed");

function articleFixture(overrides: Partial<Article> = {}): Article {
  return {
    id: "article-health",
    locale: "en",
    slug: "magnesium-sleep",
    type: "ingredient_guide",
    title: "Magnesium Sleep Evidence Guide",
    h1: "Magnesium Sleep Evidence Guide",
    metaDescription: "Evidence-based magnesium sleep guide.",
    summary: "A conservative guide for magnesium and sleep evidence.",
    contentMdx: "This page explains magnesium and sleep evidence.",
    sections: [],
    jsonLd: {},
    qualityScore: 90,
    indexStatus: "index",
    publishStatus: "published",
    hreflangMap: {},
    internalLinks: [],
    affiliateLinks: [],
    evidenceIds: [],
    lastUpdated: "2026-05-27",
    ...overrides
  };
}
