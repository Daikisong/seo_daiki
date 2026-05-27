import assert from "node:assert/strict";
import {
  dosageAdviceIssue,
  forbiddenHealthClaimIssues,
  genericBestSupplementTitleIssue,
  healthDisclaimerIssue,
  healthSensitiveWarningIssue,
  highSensitivityApprovalIssue
} from "../packages/validators/src/healthClaimRules";
import {
  articleHealthClaimText,
  articleLooksHealthRelated,
  hasQualifiedHealthEvidence,
  hasSupplementOffer,
  healthDisclaimerPresent
} from "../packages/validators/src/healthClaimText";

assert.equal(typeof forbiddenHealthClaimIssues, "function");
assert.equal(typeof dosageAdviceIssue, "function");
assert.equal(typeof healthDisclaimerIssue, "function");
assert.equal(typeof healthSensitiveWarningIssue, "function");
assert.equal(typeof highSensitivityApprovalIssue, "function");
assert.equal(typeof genericBestSupplementTitleIssue, "function");

assert.equal(typeof articleHealthClaimText, "function");
assert.equal(typeof articleLooksHealthRelated, "function");
assert.equal(typeof healthDisclaimerPresent, "function");
assert.equal(typeof hasQualifiedHealthEvidence, "function");
assert.equal(typeof hasSupplementOffer, "function");

console.log("Health claim guard module tests passed");
