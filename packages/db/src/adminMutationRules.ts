import type { ValidationIssue } from "@global-import-lab/validators";
import type { Prisma } from "./generated/prisma/client";

export const indexStatuses = ["index", "noindex", "pending", "refresh_needed", "merge_candidate"] as const;
export const publishStatuses = ["draft", "pending", "published"] as const;
export const adminEntityTypes = [
  "product",
  "variant",
  "seller-claim",
  "verified-claim",
  "market-risk",
  "evidence-pack",
  "article"
] as const;
export const adminRecordActions = ["archive", "delete"] as const;

export type IndexStatusInput = (typeof indexStatuses)[number];
export type PublishStatusInput = (typeof publishStatuses)[number];
export type AdminEntityType = (typeof adminEntityTypes)[number];
export type AdminRecordAction = (typeof adminRecordActions)[number];

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

export function isIndexStatus(value: string): value is IndexStatusInput {
  return indexStatuses.includes(value as IndexStatusInput);
}

export function isPublishStatus(value: string): value is PublishStatusInput {
  return publishStatuses.includes(value as PublishStatusInput);
}

export function isAdminEntityType(value: string): value is AdminEntityType {
  return adminEntityTypes.includes(value as AdminEntityType);
}

export function isAdminRecordAction(value: string): value is AdminRecordAction {
  return adminRecordActions.includes(value as AdminRecordAction);
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

export function archiveSummary(entityType: AdminEntityType) {
  if (entityType === "product") {
    return "Archived product and marked related articles noindex/draft.";
  }
  if (entityType === "article") {
    return "Archived article and marked it noindex/draft.";
  }
  return `Archived ${entityType}.`;
}

export function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
