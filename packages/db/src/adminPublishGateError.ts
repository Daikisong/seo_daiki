import type { ValidationIssue } from "@global-import-lab/validators";

export class AdminPublishGateError extends Error {
  readonly articleId: string;
  readonly issues: ValidationIssue[];
  readonly gateStatus: string;
  readonly gateScore: number;

  constructor(input: { articleId: string; issues: ValidationIssue[]; gateStatus: string; gateScore: number }) {
    super("Article cannot be marked indexable because the publishing gate failed.");
    this.name = "AdminPublishGateError";
    this.articleId = input.articleId;
    this.issues = input.issues;
    this.gateStatus = input.gateStatus;
    this.gateScore = input.gateScore;
  }
}
