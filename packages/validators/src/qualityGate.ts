import { indexStatusForQualityGate } from "./qualityGateIndexStatus";
import {
  collectQualityGateIssues,
  flattenQualityGateIssues
} from "./qualityGateIssueCollectors";
import {
  qualityGateScoreBreakdown,
  sumQualityGateScore
} from "./qualityGateScore";
import type { QualityGateInput, QualityGateResult } from "./types";

export function runQualityGate(input: QualityGateInput): QualityGateResult {
  const issueGroups = collectQualityGateIssues(input);
  const issues = flattenQualityGateIssues(issueGroups);
  const breakdown = qualityGateScoreBreakdown(input, issueGroups);
  const score = sumQualityGateScore(breakdown);
  const indexStatus = indexStatusForQualityGate(score, issues);

  return { score, indexStatus, issues, breakdown };
}
