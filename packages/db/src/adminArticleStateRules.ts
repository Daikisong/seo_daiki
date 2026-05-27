import type { ValidationIssue } from "@global-import-lab/validators";
import type { IndexStatusInput, PublishStatusInput } from "./adminMutationValues";

export interface ArticleStateInput {
  id: string;
  indexStatus?: IndexStatusInput;
  publishStatus?: PublishStatusInput;
  qualityScore?: number;
}

export interface ArticleStateCandidate {
  indexStatus: string;
  publishStatus: string;
  qualityScore: number;
}

export interface QualityGateSummary {
  indexStatus: string;
  issues: ValidationIssue[];
}

export function normalizeArticleStateInput(input: ArticleStateInput): ArticleStateInput {
  if (input.publishStatus && input.publishStatus !== "published" && input.indexStatus === "index") {
    return { ...input, indexStatus: "noindex" };
  }

  return input;
}

export function collectArticleStateGateBlockers(candidate: ArticleStateCandidate, result: QualityGateSummary) {
  const issues: ValidationIssue[] = [...result.issues];

  if (candidate.publishStatus !== "published") {
    issues.push({
      code: "publish_state_not_published",
      message: "Indexable articles must be published before indexStatus can be set to index.",
      severity: "blocker"
    });
  }

  if (candidate.qualityScore < 80) {
    issues.push({
      code: "quality_score_below_index_threshold",
      message: `Indexable articles need stored qualityScore >= 80; found ${candidate.qualityScore}.`,
      severity: "blocker"
    });
  }

  if (result.indexStatus !== "index") {
    issues.push({
      code: "quality_gate_not_index",
      message: `Quality gate returned ${result.indexStatus}; indexStatus=index requires gate status index.`,
      severity: "blocker"
    });
  }

  return issues.filter((issue) => issue.severity === "blocker");
}
