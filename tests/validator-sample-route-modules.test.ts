import assert from "node:assert/strict";
import type { Article } from "@global-import-lab/types";
import {
  countryRiskRouteFailures,
  localizedGuideRouteFailures,
  localizedReviewRouteFailures,
  localizedSectionExpectations,
  localizedSectionRouteFailures,
  requiredRiskPaths,
  samplePlanFailures
} from "../packages/validators/src/validateSampleRoutes";
import {
  localizedGuideRouteFailures as directLocalizedGuideRouteFailures,
  localizedReviewRouteFailures as directLocalizedReviewRouteFailures,
  localizedSectionRouteFailures as directLocalizedSectionRouteFailures
} from "../packages/validators/src/validateSampleLocalizedRouteRules";
import {
  localizedSectionExpectations as directLocalizedSectionExpectations,
  requiredRiskPaths as directRequiredRiskPaths
} from "../packages/validators/src/validateSampleRouteExpectations";
import { countryRiskRouteFailures as directCountryRiskRouteFailures } from "../packages/validators/src/validateSampleRiskRouteRules";
import { samplePlanFailures as directSamplePlanFailures } from "../packages/validators/src/validateSamplePlanRules";

assert.equal(samplePlanFailures, directSamplePlanFailures);
assert.equal(localizedReviewRouteFailures, directLocalizedReviewRouteFailures);
assert.equal(localizedGuideRouteFailures, directLocalizedGuideRouteFailures);
assert.equal(localizedSectionRouteFailures, directLocalizedSectionRouteFailures);
assert.equal(countryRiskRouteFailures, directCountryRiskRouteFailures);
assert.equal(localizedSectionExpectations, directLocalizedSectionExpectations);
assert.equal(requiredRiskPaths, directRequiredRiskPaths);

assert.deepEqual(samplePlanFailures(109, 39), [
  "Initial URL plan should generate 110 URLs, but generated 109.",
  "Initial index selection should stay between 40 and 80 pages after trend-route expansion, but found 39."
]);

const baseArticle: Article = {
  id: "article-1",
  locale: "es",
  slug: "review-one",
  type: "review",
  title: "Review",
  h1: "Review",
  metaDescription: "Review",
  summary: "Summary",
  contentMdx: "Body",
  sections: [],
  qualityScore: 90,
  indexStatus: "noindex",
  publishStatus: "draft",
  hreflangMap: {},
  internalLinks: [],
  affiliateLinks: [],
  evidenceIds: [],
  lastUpdated: "2026-05-28"
};

assert.deepEqual(localizedReviewRouteFailures([baseArticle]), []);
assert.ok(localizedSectionRouteFailures([]).some((failure) => failure.includes("en/trend")));
assert.ok(countryRiskRouteFailures([]).some((failure) => failure.includes("/en-us/guides/aliexpress-chargers-us-buyers/")));

console.log("Validator sample route module tests passed");
