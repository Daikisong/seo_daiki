import assert from "node:assert/strict";
import {
  healthFixtureFailures,
  qualityGateIndexFailures,
  sampleQualityFailures
} from "../packages/validators/src/validateSampleQuality";
import { healthFixtureFailures as directHealthFixtureFailures } from "../packages/validators/src/sampleHealthFixtureFailures";
import { qualityGateIndexFailures as directQualityGateIndexFailures } from "../packages/validators/src/sampleQualityGateFailures";
import {
  countryRiskRouteFailures,
  localizedGuideRouteFailures,
  localizedReviewRouteFailures,
  localizedSectionRouteFailures,
  samplePlanFailures,
  sampleRouteFailures
} from "../packages/validators/src/validateSampleRoutes";

assert.equal(typeof sampleQualityFailures, "function");
assert.equal(typeof healthFixtureFailures, "function");
assert.equal(typeof qualityGateIndexFailures, "function");
assert.equal(healthFixtureFailures, directHealthFixtureFailures);
assert.equal(qualityGateIndexFailures, directQualityGateIndexFailures);

assert.equal(typeof sampleRouteFailures, "function");
assert.equal(typeof samplePlanFailures, "function");
assert.equal(typeof localizedReviewRouteFailures, "function");
assert.equal(typeof localizedGuideRouteFailures, "function");
assert.equal(typeof localizedSectionRouteFailures, "function");
assert.equal(typeof countryRiskRouteFailures, "function");

console.log("Validator sample module export tests passed");
