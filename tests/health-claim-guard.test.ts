import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import { validateHealthClaimGuard } from "@global-import-lab/validators/healthClaimGuard";

const baseArticle: Article = {
  id: "article-health-1",
  locale: "en",
  slug: "magnesium-sleep",
  type: "ingredient_guide",
  title: "Magnesium Sleep Evidence Guide",
  h1: "Magnesium Sleep Evidence Guide",
  metaDescription: "Evidence-based magnesium sleep guide with conservative supplement notes and source context.",
  summary: "A conservative guide for magnesium and sleep evidence.",
  contentMdx: "This page explains magnesium and sleep evidence without medical advice.",
  sections: [{ heading: "Evidence", body: "Source notes and label direction context." }],
  jsonLd: {},
  qualityScore: 90,
  indexStatus: "index",
  publishStatus: "published",
  hreflangMap: {},
  internalLinks: [{ label: "magnesium evidence", href: "/en/ingredients/magnesium/", reason: "evidence" }],
  affiliateLinks: [],
  evidenceIds: [],
  lastUpdated: "2026-05-27"
};

assert.deepEqual(codes(validateHealthClaimGuard({ ...baseArticle, title: "USB-C charger safety guide", h1: "USB-C charger safety guide", contentMdx: "Cable wattage and plug safety." })), []);

assert.deepEqual(
  codes(
    validateHealthClaimGuard({
      ...baseArticle,
      contentMdx: "Magnesium can cure insomnia. You should take 200 mg per day."
    })
  ),
  ["health_claim_disease_language", "health_claim_medical_advice", "health_dosage_without_source"]
);

assert.deepEqual(
  codes(
    validateHealthClaimGuard({
      ...baseArticle,
      complianceStatus: "passed",
      evidenceIds: ["label-1"],
      contentMdx: "Manufacturer label direction source says 200 mg per serving. This is evidence context, not a recommendation."
    })
  ),
  []
);

assert.equal(
  validateHealthClaimGuard({
    ...baseArticle,
    affiliateLinks: [{ label: "iHerb magnesium supplement", href: "https://iherb.example/magnesium", rel: "sponsored nofollow" }]
  })[0]?.code,
  "health_disclaimer_missing"
);

assert.deepEqual(
  codes(
    validateHealthClaimGuard({
      ...baseArticle,
      healthSensitivity: "high",
      complianceStatus: "unchecked",
      contentMdx: "This is not medical advice. Consult your doctor before using supplements."
    })
  ),
  ["health_high_sensitivity_manual_approval_required"]
);

assert.equal(
  validateHealthClaimGuard({
    ...baseArticle,
    title: "Gut Health During Pregnancy",
    h1: "Gut Health During Pregnancy",
    contentMdx: "Gut health during pregnancy needs careful context."
  })[0]?.code,
  "health_sensitive_warning_missing"
);

assert.equal(
  validateHealthClaimGuard({
    ...baseArticle,
    title: "Best Magnesium Supplement for Sleep",
    h1: "Best Magnesium Supplement for Sleep"
  })[0]?.code,
  "health_generic_best_supplement_title"
);

console.log("Health claim guard unit tests passed");

function codes(issues: ReturnType<typeof validateHealthClaimGuard>) {
  return issues.map((issue) => issue.code);
}
