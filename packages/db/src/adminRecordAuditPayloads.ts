import {
  archiveSummary,
  deleteSummary,
  toJson,
  type AdminEntityType
} from "./adminMutationRules";

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
