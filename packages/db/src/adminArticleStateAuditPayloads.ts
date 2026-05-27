import type { ValidationIssue } from "@global-import-lab/validators";
import {
  toJson,
  type ArticleStateInput
} from "./adminMutationRules";

export function articleStateGateBlockedAuditData(input: {
  effective: ArticleStateInput;
  requested: unknown;
  before: unknown;
  gateStatus: string;
  gateScore: number;
  issues: ValidationIssue[];
}) {
  return {
    entityType: "article",
    entityId: input.effective.id,
    action: "publish_gate_blocked",
    actor: "admin",
    summary: "Blocked article index/publish state update because the publishing gate failed.",
    beforeJson: toJson(input.before),
    afterJson: toJson({
      requested: input.requested,
      effective: input.effective,
      gateStatus: input.gateStatus,
      gateScore: input.gateScore,
      issues: input.issues
    })
  };
}

export function articleStateUpdatedAuditData(input: {
  row: { id: string };
  before: unknown;
  after: unknown;
}) {
  return {
    entityType: "article",
    entityId: input.row.id,
    action: "update",
    actor: "admin",
    summary: "Updated article index/publish state after publishing gate validation.",
    beforeJson: input.before ? toJson(input.before) : undefined,
    afterJson: toJson(input.after)
  };
}
