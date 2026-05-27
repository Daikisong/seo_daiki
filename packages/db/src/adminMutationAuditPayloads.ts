import type { ValidationIssue } from "@global-import-lab/validators";
import {
  archiveSummary,
  deleteSummary,
  toJson,
  type AdminEntityType,
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

export function adminRecordArchiveAuditData(input: {
  entityType: AdminEntityType;
  entityId: string;
  actor?: string;
  before: unknown;
  after: unknown;
}) {
  return {
    entityType: input.entityType,
    entityId: input.entityId,
    action: "archive",
    actor: input.actor,
    summary: archiveSummary(input.entityType),
    beforeJson: toJson(input.before),
    afterJson: toJson(input.after)
  };
}

export function adminRecordDeleteAuditData(input: {
  entityType: AdminEntityType;
  entityId: string;
  actor?: string;
  before: unknown;
}) {
  return {
    entityType: input.entityType,
    entityId: input.entityId,
    action: "delete",
    actor: input.actor,
    summary: deleteSummary(input.entityType),
    beforeJson: toJson(input.before)
  };
}

export function adminRecordAuditLogData(input: {
  entityType: AdminEntityType;
  entityId: string;
  action: string;
  actor?: string;
  summary?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
}) {
  return {
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    actor: input.actor,
    summary: input.summary,
    beforeJson: input.beforeJson === undefined ? undefined : toJson(input.beforeJson),
    afterJson: input.afterJson === undefined ? undefined : toJson(input.afterJson)
  };
}
